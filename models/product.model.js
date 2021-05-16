const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  unit: Number,
  description: String,
  price: Number,
  image: String,
  category: String,
  slug: String,
  salePrice: Number,
  discountInPercent: Number,
  type: String,
  galley: Array,



});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
