// routes/showSingleRecordRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const showSingleRecordController = require('../controllers/showSingleRecordController');

// Show Single Record Route
router.get(
  '/:id', // ':id' is the record ID parameter
  authenticate, // Ensure the user is authenticated
  showSingleRecordController
);

module.exports = router;
