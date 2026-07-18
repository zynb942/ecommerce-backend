const { v2: cloudinary } = require("cloudinary");
const _config = require("./env");

cloudinary.config({
  cloud_name: _config.CLOUDINARY_CLOUD_NAME,
  api_key: _config.CLOUDINARY_API_KEY,
  api_secret: _config.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
