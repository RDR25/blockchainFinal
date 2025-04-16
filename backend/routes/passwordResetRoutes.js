const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// User password reset routes
router.post('/user/forgotpassword/request', passwordResetController.userForgotPasswordRequest);
router.post('/user/forgotpassword/verify', passwordResetController.userForgotPasswordVerify);
router.post('/user/forgotpassword/reset', passwordResetController.userResetPassword);

// Official password reset routes
router.post('/official/forgotpassword/request', passwordResetController.officialForgotPasswordRequest);
router.post('/official/forgotpassword/verify', passwordResetController.officialForgotPasswordVerify);
router.post('/official/forgotpassword/reset', passwordResetController.officialResetPassword);

module.exports = router;
