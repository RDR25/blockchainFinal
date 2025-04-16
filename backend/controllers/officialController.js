const OfficialProfile = require('../models/OfficialProfile');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');

// OTP storage
const otpStore = new Map();

// OAuth2 Setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const sendOtp = async (req, res) => {
  const {
    officialid,
    password,
    firstname,
    lastname,
    designation,
    gender,
    dateofbirth,
    phonenumber,
    email
  } = req.body;

  console.log(res.body);

  if (!officialid || !password || !firstname || !lastname || !designation || !gender || !dateofbirth || !phonenumber || !email) {
    return res.status(400).json({ message: 'Please fill all mandatory fields' });
  }

  const existingOfficial = await OfficialProfile.findOne({ officialid });
  if (existingOfficial) {
    return res.status(409).json({ message: 'Official ID is already taken' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken
      }
    });

    await transport.sendMail({
      from: `E-Land Records <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'OTP for Official Registration',
      html: `<h2>Your OTP for registration is:</h2><h1>${otp}</h1>`
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
    console.error(error);
  }
};

const registerOfficial = async (req, res) => {
  try {
    const {
      officialid,
      password,
      firstname,
      middlename,
      lastname,
      designation,
      gender,
      dateofbirth,
      phonenumber,
      email,
      otp
    } = req.body;

    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = req.file ? req.file.filename : '';

    const newOfficial = new OfficialProfile({
      officialid,
      password: hashedPassword,
      firstname,
      middlename,
      lastname,
      designation,
      gender,
      dateofbirth,
      phonenumber,
      email,
      photo
    });

    await newOfficial.save();
    otpStore.delete(email);

    res.status(201).json({ success: true, message: 'Official registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// In officialController.js
const checkOfficialIdExists = async (req, res) => {
  const { officialid } = req.body;
  try {
    const existingOfficial = await OfficialProfile.findOne({ officialid });
    res.status(200).json({ exists: !!existingOfficial });
  } catch (error) {
    res.status(500).json({ message: 'Error checking official ID', error: error.message });
  }
};

module.exports = {
  sendOtp,
  registerOfficial,
  checkOfficialIdExists
};

