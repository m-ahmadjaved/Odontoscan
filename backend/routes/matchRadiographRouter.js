const express = require('express');
const multer = require('multer');
const { matchRadiographController } = require('../controllers/matchRadiographController');
const { authenticate, authorize } = require('../middleware/authMiddleware'); // Import the middleware

const router = express.Router();

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Define the route with authentication and authorization
router.post('/match', authenticate, authorize(['admin', 'forensic']), upload.single('radiograph'), matchRadiographController);

module.exports = router;
