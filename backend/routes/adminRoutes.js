const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { addForensicUser } = require('../controllers/adminController');

const router = express.Router();

// Add forensic user
router.post('/add-forensic-user', authenticate, authorize('admin'), addForensicUser);

module.exports = router;
