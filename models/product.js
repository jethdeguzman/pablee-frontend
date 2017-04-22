const mongoose = require('mongoose')
const uuidV4 = require('uuid/v4')

var productSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      index: { unique: true }
    },
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

productSchema.pre('save', function(next) {
  if (!this.uuid) {
    this.uuid = uuidV4()
  }

  next()
})

module.exports = mongoose.model('Product', productSchema);
