
const asynHandler = require('../utils/asyncHandler.js')
const Wishlist = require('../models/wishlist.model.js')
const sendResponse = require('../utils/sendResponse.js')


/**
 * @description Get all wishlists with pagination
 * @route GET /api/wishlists/admin/all
 * @access PRIVATE (admin only)
 * @returns { Object } JSON response with wishlists data and pagination details
 */
const getAllWishlists = asynHandler(async(request, response, next)=>{
  
  const page = Number(request.query.page) || 1
  const limit = Number(request.query.limit) || 10

  const skip = (page - 1) * limit
  const total = await Wishlist.countDocuments()
  const totalPages = Math.ceil(total / limit)

  const wishlists = await Wishlist.find()
    .skip(skip).limit(limit).populate('user').populate('products')

  return sendResponse(200, 'Wishlists retrieved successfully', {
    success: true,
    total,
    currentPage: page,
    totalPages,
    wishlists
  })
})




module.exports = {
  getAllWishlists,
}