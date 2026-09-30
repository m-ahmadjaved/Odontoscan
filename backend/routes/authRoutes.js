const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

// Ensure the route is a POST request
router.post('/login', login);

module.exports = router;
