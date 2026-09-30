const express = require('express');
const router = express.Router();
const showAllRecordsController = require('../controllers/showAllRecordsController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Route to show all records (accessible only for authenticated admins)
router.get('/showAllRecords', authMiddleware.authenticate, authMiddleware.authorize('admin'), showAllRecordsController.showAllRecords);

module.exports = router;
