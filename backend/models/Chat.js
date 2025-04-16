const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  appId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationDetails', required: true },
  receiptid: { type: String, required: true },
  from: { type: String, required: true }, // e.g. "clerk"
  to: { type: String, required: true },   // e.g. "super_intendent", "project_officer", etc.
  message: { type: String, required: true },
  creationTimeStamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
