const express = require('express')
const router = express.Router()

const validate = require('../middlewares/validation.middleware.js')
const { resetPasswordSchema } = require('../validation/auth.validation.js')
const { resetPassword } = require('../controllers/auth.controller.js')




// resetting password route
router.post('/forgot-password/verify-otp', validate(resetPasswordSchema), resetPassword)


module.exports = router