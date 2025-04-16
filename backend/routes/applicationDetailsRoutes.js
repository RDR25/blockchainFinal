const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const applicationDetailsController = require('../controllers/applicationDetailsController');

// Existing storage for user uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/useruploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// NEW: Storage for survey reports
const storageSurveyReports = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/surveyreports/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const uploadSurveyReport = multer({ storage: storageSurveyReports });

const storageCertificates = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/certificates/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const uploadCertificate = multer({ storage: storageCertificates });

// Existing routes
router.post('/applicationdetails/generate', upload.single('document'), applicationDetailsController.generateApplication);
router.get('/applicationdetails/created', applicationDetailsController.getCreatedApplications);
router.get('/applicationdetails/sent', applicationDetailsController.getSentApplications);
router.put('/applicationdetails/updateStatus', applicationDetailsController.updateApplicationStatus);
router.put('/applicationdetails/updateApplicationAll/:id', upload.single('document'), applicationDetailsController.updateApplicationAll);
router.put('/applicationdetails/updateApplication/:id', upload.single('document'), applicationDetailsController.updateApplication);

// NEW: Route for uploading survey report and updating application status
router.put('/applicationdetails/uploadSurveyReport/:id', uploadSurveyReport.single('report'), applicationDetailsController.uploadSurveyReport);
router.put('/applicationdetails/uploadCertificate/:id', uploadCertificate.single('certificate'), applicationDetailsController.uploadCertificate);
module.exports = router;
