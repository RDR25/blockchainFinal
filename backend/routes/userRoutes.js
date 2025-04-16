const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser } = require('../controllers/userController');

// Store profile photos in /uploads/profilephotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profilephotos/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

router.post('/register', upload.single('photo'), registerUser);

router.post('/check-username', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ available: false, message: 'Username is required' });
  
    const user = await require('../models/UserProfile').findOne({ username });
    if (user) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  });
  

module.exports = router;
