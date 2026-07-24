const express = require('express')
const router = express.Router()
const { stripeWebhook } = require('../controllers/webhook.controller.js')


// POST /api/payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)


module.exports = router