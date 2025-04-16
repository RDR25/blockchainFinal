const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

console.log("CLIENT_ID:", CLIENT_ID);
console.log("REFRESH_TOKEN:", REFRESH_TOKEN);


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendOtpEmail(recipientEmail, otp) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `LRM Registration <${process.env.SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}`,
      html: `<h2>Your OTP is:</h2><p style="font-size: 24px; font-weight: bold;">${otp}</p>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending OTP:', error.message, error.response?.body);

    throw error;
  }
}

module.exports = sendOtpEmail;
