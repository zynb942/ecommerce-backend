
/**
 * @description Helper function to handle sorting logic
 * @param { String } sort sort type from query parameters
 * @returns { Object } Mongoose sort object
 */
const getSortQuery = (sort) => {
  const sortOptions = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { averageRating: -1 },
    popular: { numReviews: -1 },
    oldest: { createdAt: 1 },
  }

  return sortOptions[sort] || { createdAt: -1 };
}

/**
 * @description Calculate pagination values 
 * @param { String | Number } page Current page number 
 * @param { String | Number } limit Number of items per page
 * @returns {{currentPage: number, limitPerPage: number, skip: number}}
 */
const getPagination = (page = 1, limit = 10) => {
  const currentPage = Math.max(1, parseInt(page, 10));
  const limitPerPage = Math.max(1, parseInt(limit, 10));

  return {
    currentPage,
    limitPerPage,
    skip: (currentPage - 1) * limitPerPage,
  }
}

/**
 * @description Add a case-insensitive regex filter to a MongoDB query object
 * @param { Object } filter MongoDB filter object
 * @param { String } field Field name to filter
 * @param { String } value Search value
 * @returns { void }
 */
const addRegexFilter = (filter, field, value) => {
  if (!value) return;

  filter[field] = {
    $regex: value,
    $options: "i",
  }
}

/**
 * @description Add a tags filter using the MongoDB $in operator
 * @param { Object } filter MongoDB filter object
 * @param { String } tags Comma-separated list of tags
 * @returns { void }
 */
const addTagsFilter = (filter, tags) => {
  if (!tags) return;

  filter.tags = {
    $in: tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean),
  }
}

/**
 * @description Add a minimum & maximum price filter
 * @param { Object } filter MongoDB filter object
 * @param { String|Number } minPrice Minimum product price
 * @param { String|Number } maxPrice Maximum product price
 * @returns { void }
 */
const addPriceFilter = (filter, minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return

  filter.price = {}
  if (minPrice) {
    filter.price.$gte = Number(minPrice)
  }
  if (maxPrice) {
    filter.price.$lte = Number(maxPrice)
  }
}

//#region Cart helper
/**
 * Find the index of a product in the cart.
 * @param { Object } cart
 * @param { string } productId
 * @returns { number }
 */
const findCartItemIndex = (cart, productId) => {
  return cart.items.findIndex(
    (it) => it.product.toString() === productId
  )
}
//#endregion

//#region Stock helper
const updateProductStock = (product, oldQuantity, newQuantity) => {
  const difference = newQuantity - oldQuantity;
  if (difference > 0) {
    if (product.stock < difference) {
      throw new ApiError(400, 'Not enough stock available.');
    }
    product.stock -= difference;
  } else if (difference < 0) {
    product.stock += Math.abs(difference);
  }
}
//#endregion



module.exports = {
  getSortQuery,
  getPagination,
  addRegexFilter,
  addTagsFilter,
  addPriceFilter,
  findCartItemIndex,
  updateProductStock
}