const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  type: { type: String, required: true },
  username: { type: String, required: true },
  notes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
