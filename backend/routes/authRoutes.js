const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user login
router.post('/user/login', authController.userLogin);

// Route for official login
router.post('/official/login', authController.officialLogin);

module.exports = router;
