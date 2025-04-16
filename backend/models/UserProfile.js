const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  dateofbirth: { type: Date, required: true },
  phonenumber: { type: String, required: true },
  email: { type: String, required: true },
  residentialaddress: { type: String, required: true },
  aadharnumber: { type: String, required: true },
  photo: { type: String } // store filename only
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
