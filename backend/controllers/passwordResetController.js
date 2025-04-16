const bcrypt = require('bcrypt');
const UserProfile = require('../models/UserProfile');
const OfficialProfile = require('../models/OfficialProfile');
const sendOtpEmail = require('../config/gmail'); // reusing your email config

// In-memory OTP store (for demonstration only; use a persistent store in production)
const otpStore = {};

// Helper function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * USER PASSWORD RESET FLOW
 */

// Request OTP for a user (lookup by username)
exports.userForgotPasswordRequest = async (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: 'Username is required' });

  try {
    const user = await UserProfile.findOne({ username });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    otpStore[username] = otp;

    // Send OTP to the user's registered email
    await sendOtpEmail(user.email, otp);
    return res
      .status(200)
      .json({ message: 'OTP sent to registered email' });
  } catch (err) {
    console.error('Error in userForgotPasswordRequest:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// Verify the OTP provided by the user
exports.userForgotPasswordVerify = async (req, res) => {
  const { username, otp } = req.body;
  if (!username || !otp)
    return res
      .status(400)
      .json({ message: 'Username and OTP are required' });

  try {
    if (otpStore[username] !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    // OTP verified successfully (optionally remove or mark OTP as verified)
    return res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    console.error('Error in userForgotPasswordVerify:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// Reset the user’s password after OTP verification
exports.userResetPassword = async (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword)
    return res
      .status(400)
      .json({ message: 'Username and new password are required' });

  try {
    const user = await UserProfile.findOne({ username });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP from store after successful password reset
    delete otpStore[username];
    return res
      .status(200)
      .json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in userResetPassword:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

/**
 * OFFICIAL PASSWORD RESET FLOW
 */

// Request OTP for an official (lookup by officialId)
exports.officialForgotPasswordRequest = async (req, res) => {
  const { officialId } = req.body;
  if (!officialId)
    return res
      .status(400)
      .json({ message: 'Official ID is required' });

  try {
    const official = await OfficialProfile.findOne({ officialid: officialId });
    if (!official)
      return res.status(404).json({ message: 'Official not found' });

    const otp = generateOTP();
    otpStore[officialId] = otp;

    // Send OTP to the official's registered email
    await sendOtpEmail(official.email, otp);
    return res
      .status(200)
      .json({ message: 'OTP sent to registered email' });
  } catch (err) {
    console.error('Error in officialForgotPasswordRequest:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// Verify the OTP provided by the official
exports.officialForgotPasswordVerify = async (req, res) => {
  const { officialId, otp } = req.body;
  if (!officialId || !otp)
    return res
      .status(400)
      .json({ message: 'Official ID and OTP are required' });

  try {
    if (otpStore[officialId] !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    return res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    console.error('Error in officialForgotPasswordVerify:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// Reset the official’s password after OTP verification
exports.officialResetPassword = async (req, res) => {
  const { officialId, newPassword } = req.body;
  if (!officialId || !newPassword)
    return res
      .status(400)
      .json({ message: 'Official ID and new password are required' });

  try {
    const official = await OfficialProfile.findOne({ officialid: officialId });
    if (!official)
      return res.status(404).json({ message: 'Official not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    official.password = hashedPassword;
    await official.save();

    delete otpStore[officialId];
    return res
      .status(200)
      .json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in officialResetPassword:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};
