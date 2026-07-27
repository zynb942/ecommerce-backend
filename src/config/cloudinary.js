const _config = require("./env")
const { v2: cloudinary } =  require("cloudinary")
cloudinary.config({
  cloud_name: _config.CLOUDINARY_CLOUD_NAME,
  api_secret: _config.CLOUDINARY_API_SECRET,
  api_key: _config.CLOUDINARY_API_KEY,
})

module.exports = cloudinary