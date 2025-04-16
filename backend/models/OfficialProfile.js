const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
  officialid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  dateofbirth: { type: String, required: true },
  phonenumber: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String }
});

module.exports = mongoose.model('OfficialProfile', officialSchema);
