const cloudinary = require('../config/cloudinary.js')
require('dotenv').config()
const pc = require('picocolors')

async function testCloudinaryConnection() {
  console.log(pc.italic(pc.magenta('connection to Cloudinary...')))
  try {
    const response = await cloudinary.api.ping()
    console.log(pc.green('connection successful...'))
    console.log(pc.cyan(`Connection details: `), response)
  } catch (error) {
    console.error('connection failed.. ')
    console.error("Error details:", error)
  }
}

testCloudinaryConnection()