const mongoose = require('mongoose')
const uuidV4 = require('uuid/v4')

var productSchema = new mongoose.Schema(
  {
    shopifyId: String,
    title: String,
    description: String, 
    imageUrl: String,
    price: Number,
    merchant: { type: mongoose.Schema.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Product', productSchema);
