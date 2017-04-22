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
    facebookId: String,
    facebookProfilePic: String
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
