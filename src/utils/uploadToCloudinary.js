const cloudinary = require("../config/cloudinary"); 
const ApiError = require("./apiError"); 

const uploadToCloudinary = (file, folder = "ecommerce") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new ApiError("No file provided for upload", 400));
    }

    // cloudinary uploader options
    const options = {
      folder: folder,
      resource_type: "auto", //(image, video, raw)
    };

    // cloud storage case
    if (file.buffer) {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(new ApiError(`Cloudinary Upload Error: ${error.message}`, 500));
          }
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );

      uploadStream.end(file.buffer);
    } 

    // local storage case
    else if (file.path) {
      cloudinary.uploader.upload(file.path, options, (error, result) => {
        if (error) {
          return reject(new ApiError(`Cloudinary Upload Error: ${error.message}`, 500));
        }
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      });
    } 
// invalid file structure
    else {
      reject(new ApiError("Invalid file structure. File buffer or path not found.", 400));
    }
  });
};

module.exports = uploadToCloudinary;