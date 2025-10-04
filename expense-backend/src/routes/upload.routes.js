const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth.middleware');
const { uploadFile } = require('../controllers/upload.controller');

// Apply authentication to all upload routes
router.use(authenticateJWT);

// File upload endpoint - POST /api/uploads
router.post('/', uploadFile);

module.exports = router;