// routes/updateSingleRecordRouter.js
const express = require('express');
const multer = require('multer'); // Import multer
const path = require('path');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const updateSingleRecordController = require('../controllers/updateSingleRecordController');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to save uploaded files (ensure this folder exists)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append file extension to filename
  }
});
const upload = multer({ storage: storage });  // Define the upload middleware

const router = express.Router();

// Update Single Record Route
router.put(
  '/update/:id',  // ':id' is the record ID parameter
  authenticate,
  authorize('admin'),  // Only admin users can access this route
  upload.single('photo'),  // Use multer middleware to handle single photo upload
  updateSingleRecordController
);

module.exports = router;
