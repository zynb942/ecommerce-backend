const stripe = require('../config/stripe.js')
const Order = require('../models/order.model.js')
const asyncHandler = require('../utils/asyncHandler.js')
const _config = require('../config/env.js')
const sendResponse = require('../utils/sendResponse.js')


/**
 * @description Handle Stripe Webhook events
 * @route POST /api/payments/webhook
 * @access Public (Called by Stripe servers)
 */
const stripeWebhook = asyncHandler(async(request, response, next)=>{
  const signature = request.headers['stripe-signature']
  let event 
  try {
    event = stripe.webhooks.constructEvent(request.body, signature, _config.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return response.status(400).send('Invalid Stripe webhook signature')
  }
  const paymentIntent = event.data.object
  if(event.type === 'payment_intent.succeeded'){
    const order = await Order.findOne({ transactionId: paymentIntent.id })
    if(order && order.paymentStatus !== 'paid'){
      order.paymentStatus = 'paid'
      order.paidAt = new Date()
      await order.save()
    }
  }

  else if(event.type === 'payment_intent.payment_failed'){
    const order = await Order.findOne({ transactionId: paymentIntent.id })
    if(order && order.paymentStatus !== 'paid'){
      order.paymentStatus = 'failed'
      await order.save()
    }
  }

  return response.status(200).json({ received: true })
})



module.exports = {
  stripeWebhook,
}