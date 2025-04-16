const sendOtpEmail = require('../config/gmail');

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully', otp }); // NOTE: Send OTP only for testing; remove `otp` in prod
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};
