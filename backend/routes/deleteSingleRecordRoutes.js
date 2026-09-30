// routes/deleteSingleRecordRouter.js

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const deleteSingleRecordController = require('../controllers/deleteSingleRecordController');

// Delete Single Record Route
router.delete(
  '/delete/:id',  // ':id' is the record ID parameter
  authenticate,
  authorize('admin'),  // Only admin users can access this route
  deleteSingleRecordController
);

module.exports = router;
