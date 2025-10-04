const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth.middleware');

// Get system status
router.get('/status', async (req, res) => {
  try {
    res.json({ status: 'ok', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;