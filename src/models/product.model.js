const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'اسم المنتج مطلوب'],
      trim: true,
      minlength: [3, 'اسم المنتج قصير جداً'],
      maxlength: [100, 'اسم المنتج طويل جداً']
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'وصف المنتج مطلوب'],
      minlength: [20, 'وصف المنتج يجب أن يكون أكثر من 20 حرف']
    },
    quantity: {
        type: Number,
        required: [true, 'كمية المنتج مطلوبة'],
        min: [0, 'الكمية لا يمكن أن تكون أقل من صفر']
    },
    sold: {
        type: Number,
        default: 0,
        min: [0, 'عدد المنتجات المباعة لا يمكن أن يكون أقل من صفر']
    },
    price: {
      type: Number,
      required: [true, 'سعر المنتج مطلوب'],
      max: [200000, 'السعر مبالغ فيه']
    },
    priceAfterDiscount: {
      type: Number,
      validate: {
            validator: function (value) {
            return value == null || value <= this.price;
         },
    message: 'Price after discount must be less than or equal to the original price',
  },
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'الصورة الأساسية للمنتج مطلوبة']
    },
    images: [String],
    
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'المنتج يجب أن ينتمي لقسم رئيسي']
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand'
    },

    reviews: [reviewSchema],

    
    ratingsAverage: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },

    
    specifications: {
      weight: String,
      dimensions: String,
      material: String
    }
  },
  { 
    timestamps: true,
    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


productSchema.pre('save', function (next) {
  
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {  lower: true });
  }
  this.calculateRatings();
  next();
});

  productSchema.methods.calculateRatings = function () {
  this.ratingsQuantity = this.reviews.length;

  if (this.reviews.length === 0) {
    this.ratingsAverage = 0;
    return;
  }

  const total = this.reviews.reduce((sum, review) => {
    return sum + review.rating;
  }, 0);

  this.ratingsAverage =
  Math.round((total / this.reviews.length) * 100) / 100;
};

productSchema.index({ price: 1, ratingsAverage: -1 }); 

productSchema.index({ slug: 1 });

productSchema.index({ title: 'text', description: 'text' });

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });

module.exports = mongoose.model('Product', productSchema);