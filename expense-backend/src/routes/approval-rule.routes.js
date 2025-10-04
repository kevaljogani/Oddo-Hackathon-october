const express = require('express');
const router = express.Router();
const { authenticateJWT, authorize } = require('../middleware/auth.middleware');
const approvalRuleController = require('../controllers/approval-rule.controller');

// Apply authentication to all approval rule routes
router.use(authenticateJWT);

// Only admins can access approval rule routes
router.use(authorize(['ADMIN']));

// Get all approval rules
router.get('/', approvalRuleController.getAllRules);

// Create a new approval rule
router.post('/', approvalRuleController.createRule);

// Update an existing approval rule
router.put('/:id', approvalRuleController.updateRule);

// Delete an approval rule
router.delete('/:id', approvalRuleController.deleteRule);

module.exports = router;