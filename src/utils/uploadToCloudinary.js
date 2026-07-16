const cloudinary = require("../config/cloudinary");
const ApiError = require("./apiError");

const uploadToCloudinary = (file, folder = "ecommerce") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new ApiError(400, "No file provided"));
    }

    // cloudinary uploader options
    const options = {
      folder,
      resource_type: "image",
    };

    // cloud storage case
    if (file.buffer) {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error(error);
            return reject(new ApiError(500, "Failed to upload image"));
          }
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        },
      );

      uploadStream.end(file.buffer);
    }

    // local storage case
    else if (file.path) {
      cloudinary.uploader.upload(file.path, options, (error, result) => {
        if (error) {
          console.error(error);
          return reject(new ApiError(500, "Failed to upload image"));
        }
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      });
    }
    // invalid file structure
    return reject(new ApiError(400, "Invalid file structure"));
  });
};

module.exports = uploadToCloudinary;
