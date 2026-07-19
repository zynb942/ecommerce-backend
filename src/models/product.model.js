const mongoose = require("mongoose");
const slugify = require("slugify");


const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);


const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },

    username: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Discount price cannot exceed product price",
      },
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    images: {
      type: [imageSchema],
      required: [true, "At least one product image is required"],
      validate: {
        validator: function (images) {
          return images.length >= 1;
        },
        message: "At least one product image is required",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    reviews: [reviewSchema],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product creator is required"],
    },
  },
  {
    timestamps: true,
  }
);


productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  next();
});

productSchema.methods.calcAverageRating = function () {
  if (!this.reviews || this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }

  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  this.averageRating = Number(
    (totalRating / this.reviews.length).toFixed(1)
  );

  this.numReviews = this.reviews.length;
};


productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.index({
  category: 1,
});

productSchema.index({
  brand: 1,
});

productSchema.index({
  price: 1,
});

productSchema.index({
  averageRating: -1,
});

productSchema.index({
  createdAt: -1,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;