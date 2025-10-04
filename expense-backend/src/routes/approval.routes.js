const express = require('express');
const router = express.Router();
const { authenticateJWT, authorize } = require('../middleware/auth.middleware');
const approvalController = require('../controllers/approval.controller');

// Apply authentication to all approval routes
router.use(authenticateJWT);

// Only managers and admins can access approval routes
router.use(authorize(['MANAGER', 'ADMIN']));

// Get pending approvals for manager
router.get('/pending', approvalController.getPendingApprovals);

// Make approval decision
router.post('/:id/decision', approvalController.makeDecision);

module.exports = router;