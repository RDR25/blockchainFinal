const mongoose = require('mongoose');

const applicationDetailsSchema = new mongoose.Schema({
  receiptid: { type: String, required: true, unique: true },
  compno: { type: String, required: true, unique: true },
  username: { type: String, required: true }, // logged-in user's username
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  aadharnumber: { type: String, required: true },
  date: { type: Date, required: true },
  ownerName: { type: String, required: true },
  surveyNumber: { type: String, required: true },
  area: { type: Number, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  documents: { type: [String], required: true }, // [user upload, generated letter]
  status: { type: String, required: true },
  createdtimestamp: { type: Date, default: Date.now },
  lastmodifiedtimestamp: { type: Date, default: Date.now },
  currentlywith: { type: String, default: "" },
  messages: { type: [String], default: [] }
});

module.exports = mongoose.model('ApplicationDetails', applicationDetailsSchema);
