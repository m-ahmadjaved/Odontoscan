const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { addForensicData } = require('../controllers/forensicController'); // Import the forensic controller
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // File naming convention
  }
});

const upload = multer({ storage: storage });

// Route to upload forensic data (Only admin can access)
router.post('/upload-data', authenticate, authorize('admin'), upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'radiograph', maxCount: 1 }
]), addForensicData);  // Calling the forensic controller method

module.exports = router;
