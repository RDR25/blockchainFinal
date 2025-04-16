const express = require('express');
const router = express.Router();
const { getNotices } = require('../controllers/noticeControllers');

// GET /api/notices - returns a list of notice documents
router.get('/', getNotices);

module.exports = router;
