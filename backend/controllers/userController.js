const bcrypt = require('bcrypt');
const UserProfile = require('../models/UserProfile');

exports.registerUser = async (req, res) => {
  try {
    const {
      username, password, firstname, middlename, lastname,
      gender, dateofbirth, phonenumber, email,
      residentialaddress, aadharnumber
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo = req.file ? req.file.filename : null;

    const user = new UserProfile({
      username,
      password: hashedPassword,
      firstname,
      middlename,
      lastname,
      gender,
      dateofbirth,
      phonenumber,
      email,
      residentialaddress,
      aadharnumber,
      photo
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while registering user.' });
  }
};
