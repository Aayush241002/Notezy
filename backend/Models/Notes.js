const mongoose = require('mongoose');
const { Schema } = mongoose;

const Notesschema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true

  },
  description: {
    type: String,
    required: true,
    unique: true

  },
  tag: {
    type: String,
    default: 'General'
  },
  pinned: {
    type: Boolean,
    default: false
  },
  favourite: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now   
  }

});
module.exports = mongoose.model('notes', Notesschema)