const mongoose = require('mongoose')
const uuidV4 = require('uuid/v4')

var userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      index: { unique: true }
    },
    name: String,
    type: { 
      type: String,
      enum: ['CUSTOMER', 'MERCHANT']
    },
    facebook: {
      id: String,
      accessToken: String,
      profilePicture: String  
    },
    shopify: {
      id: String,
      accessToken: String,
      shop: {
        name: String,
        country: String
      }
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function(next) {
  if (!this.uuid) {
    this.uuid = uuidV4()
  }

  next()
})

module.exports = mongoose.model('User', userSchema);
