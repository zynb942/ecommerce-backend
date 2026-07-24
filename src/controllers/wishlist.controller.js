const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");
const Wishlist = require("../models/wishlist.model"); 
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
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });

    await wishlist.populate("products");

    return sendResponse(res, 201, "Product added to wishlist successfully", {
      wishlist,
    });
  }

  const exists = wishlist.products.some(
    (id) => id._id.toString() === productId
  );

  if (exists) {
    throw new ApiError(400, "Product already in wishlist");
  }

  wishlist.products.push(productId);

  await wishlist.save();
  await wishlist.populate("products");

  return sendResponse(res, 200, "Product added to wishlist successfully", {
    wishlist,
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

  const clearWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();
  return sendResponse(res, 200, "Wishlist cleared successfully", {
  });
});

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

const clearWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();
  return sendResponse(res, 200, "Wishlist cleared successfully",);
});


module.exports = {  addToWishlist, getMyWishlist, removeFromWishlist, getAllWishlists, clearWishlist };
