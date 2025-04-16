const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sendOtp, registerOfficial, checkOfficialIdExists} = require('../controllers/officialController');




// Multer Config for Profile Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profilephotos/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only .png or .jpg images are allowed'));
    }
  }
});

router.post('/send-otp', sendOtp);
router.post('/register', upload.single('photo'), registerOfficial);
router.post('/check-officialid', checkOfficialIdExists);

module.exports = router;
