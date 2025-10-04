const express = require('express');
const router = express.Router();
const { signup, login, refreshToken } = require('../controllers/auth.controller');

// Register a new user
router.post('/signup', signup);

// Login user
router.post('/login', login);

// Refresh token
router.post('/refresh', refreshToken);

module.exports = router;