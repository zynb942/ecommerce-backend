const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Populate automatically
wishlistSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products",
  });

  next();
});

module.exports = mongoose.model("Wishlist", wishlistSchema);