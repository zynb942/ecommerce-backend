const Wishlist = require("../models/wishlist.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");
const { getPagination } = require("./helpers");

const getAllWishlists = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

  const [totalWishlists, wishlists] = await Promise.all([
    Wishlist.countDocuments(),
    Wishlist.find().populate("products").skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalWishlists / limit);

  return sendResponse(res, 200, "Wishlists retrieved successfully", {
    totalWishlists,
    currentPage: page,
    totalPages,
    wishlists,
  });
});

const getMyWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products");

  if (!wishlist) {
    return sendResponse(res, 200, "Wishlist is empty", {
      totalProducts: 0,
      wishlist: null,
    });
  }

  await wishlist.populate("products");
  
  return sendResponse(res, 200, "Wishlist retrieved successfully", {
    totalProducts: wishlist.products.length,
    wishlist,
  });
});


/**
 * @desc Remove a product from the logged-in user's wishlist
 * @route DELETE /api/wishlists/remove/:productId
 * @access Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  
  const productIndex = wishlist.products.findIndex(
    (product) => product._id.toString() === productId
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in wishlist");
  }

  wishlist.products.splice(productIndex, 1);
  await wishlist.save();
  await wishlist.populate("products");
  return sendResponse(
    res,
    200,
    "Product removed from wishlist successfully",
    {
      wishlist,
    }
  );
});


//#region GET WISHLIST STATISTICS 
/**
 * @description Get wishlist statistics (total wishlists, total products, top 10 products)
 * @route GET /api/wishlists/admin/stats
 * @access PRIVATE (admin only)
 * @returns { Object } JSON response with statistics data
 */
const getWishlistStats = asyncHandler(async(request, response, next)=> {
  // Run all Queries in the same time to get best performance
  const [totals, topProducts] = await Promis.all([
    
    // calculate total wishlists & total products
    Wishlist.aggregate([
      {
        $group: { 
          _id: null, 
          totalWishlists: { $sum: 1 }, 
          totalWishlistProducts: { $sum: {$size: { $ifNull: ['$products',[]]}}} 
        }
      }
    ]),
    
    // get top 10 most wishlisted products
    Wishlist.aggregate([
      { $unwind: '$products' },{ $group: {_id: '$products', count: { $sum: 1 }}},
      { $sort: { count: -1 }},
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productData'}},
      { $unwind: '$productData' },
      { $project: { _id: 1, productId: '$_id', count: 1, name: 'productData.name', image: { $arrayElemAt: ['$productData.images.url', 0]}}}
    ])
  ])

  // set default values if the db is empty
  const stats = totals[0] || { totalWishlists: 0, totalWishlistProducts: 0 }

  return sendResponse(response, 200, 'Wishlist statistics retrieved successfully..', {
    success: true,
    statistics: {
      totalWishlists: stats.totalWishlists,
      totalWishlistProducts: stats.totalWishlistProducts,
      topProducts: topProducts
    }
  })
})
//#endregion


module.exports = {  getMyWishlist, removeFromWishlist, getAllWishlists, getWishlistStats };
