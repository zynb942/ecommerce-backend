const express = require("express")
const { getAdminDashboard } = require('../controllers/admin-dashboard.controller.js')
const { protect, allowTo } = require('../middlewares/auth.middleware.js')


const router = express.Router()

// GET /api/orders/admin/dashboard
router.get("/dashboard", protect, allowTo("admin"), getAdminDashboard)


module.exports = router