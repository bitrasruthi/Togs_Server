const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    unique: true,
  },
  category: String,
  subCategory: String,
  image: String,
});

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    unique: true,
  },
  productName: String,
  productTitle: String,
  ratings: Number,
  noOfRatings: Number,
  originalPrice: Number,
  offerPrice: Number,
  discount: Number,
  productDetails: String,
  availableSizes: Array,
  Reviews: Array,
  specifications: Object,
  otherDetails: String,
  categoryId: {
    type: Number,
    ref: "Categories",
  },
  imageUrl: String,
  images: Array,
});

const Categories = mongoose.model("Categories", categoriesSchema);
const Products = mongoose.model("Products", productSchema);

module.exports = { Categories, Products };
