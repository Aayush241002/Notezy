const mongoose = require('mongoose');
const { Schema } = mongoose;

const Userschema = new Schema({
  name: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true

  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  theme:
  {
    type: String, default: "default"

  }

});
module.exports = mongoose.model('user', Userschema)