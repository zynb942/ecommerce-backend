const express = require('express')
const { getAllWishlists } = require('../controllers/wishlist.controller.js')
const { protect, allowTo } = require('../middlewares/auth.middleware.js')

const router = express.Router()



// GET /wishlists/admin/all
router.get('/admin/all', protect, allowTo('admin'), getAllWishlists)



module.exports = router