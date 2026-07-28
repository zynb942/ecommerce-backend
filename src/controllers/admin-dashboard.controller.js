const Order = require('../models/order.model.js')
const User = require('../models/user.model.js')
const asyncHandler = require('../utils/asyncHandler.js')
const sendResponse = require('../utils/sendResponse.js')
const { getOrdersByStatusPipeline, getRevenueStatsPipeline, getTopProductsPipeline, getDailyRevenuePipeline } = require('./helpers.js')


/**
 * @description Get Admin Dashboard Analytics & Statistics
 * @route GET /api/orders/admin/dashboard
 * @access PRIVATE (Admin only)
 * @returns { Object } JSON response containing complete admin dashboard statistics and analytics
 */
const getAdminDashboard = asyncHandler(async(request, response)=>{
  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() -1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const [  totalOrdersCount, ordersByStatusRaw, revenueStatsRaw, recentOrders, 
    topProducts, dailyRevenue, totalCustomers] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate(
      getOrdersByStatusPipeline()
    ),
    Order.aggregate(
      getRevenueStatsPipeline(
        startOfThisMonth,
        startOfLastMonth,
        endOfLastMonth
      )
    ),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5),
    Order.aggregate(
      getTopProductsPipeline()
    ),
    Order.aggregate(
      getDailyRevenuePipeline(sevenDaysAgo)
    ),
    User.countDocuments({ role: "customer" })
  ])

  // Format order statistics
  const orderStats = {
    total: totalOrdersCount,
    pending: 0,
    processing: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  }

  ordersByStatusRaw.forEach((item) => {
    if (orderStats.hasOwnProperty(item._id)) {
      orderStats[item._id] = item.count
    }
  })

  // Revenue statistics
  const { totalRevenue = 0, thisMonthRevenue = 0, lastMonthRevenue = 0 } = revenueStatsRaw[0] || {}

  let growthPercent = 0
  if (lastMonthRevenue > 0) {
    growthPercent =
      ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
  } else if (thisMonthRevenue > 0) {
    growthPercent = 100
  }

  return sendResponse(
    response, 200, "Dashboard statistics retrieved successfully",
    {
      dashboard: {
        orders: orderStats,
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growthPercent: Number(growthPercent.toFixed(2))
        },
        recentOrders,
        topProducts,
        ordersByStatus: ordersByStatusRaw,
        dailyRevenue,
        totalCustomers
      }
    }
  )
})

module.exports = {
  getAdminDashboard
}