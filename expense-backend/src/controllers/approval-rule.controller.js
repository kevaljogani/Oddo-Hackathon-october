const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { toCamelCase } = require('../utils/formatter');

/**
 * Get all approval rules for the company
 */
const getAllRules = async (req, res) => {
  try {
    const { companyId } = req.user;
    
    const rules = await prisma.approvalRule.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
    
    // Transform to camelCase
    const formattedRules = rules.map(rule => {
      const ruleData = toCamelCase(rule);
      
      // Parse JSON fields
      ruleData.approvers = JSON.parse(JSON.stringify(rule.approvers));
      ruleData.conditions = JSON.parse(JSON.stringify(rule.conditions));
      
      return ruleData;
    });
    
    return res.json({ 
      data: formattedRules,
      total: formattedRules.length
    });
  } catch (error) {
    console.error('Error getting approval rules:', error);
    return res.status(500).json({ error: 'Failed to get approval rules' });
  }
};

/**
 * Create a new approval rule
 */
const createRule = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { 
      name, 
      isSequential, 
      minApprovalPercent, 
      categoryFilter, 
      specificApproverIds, 
      approverList 
    } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!approverList || !Array.isArray(approverList) || approverList.length === 0) {
      return res.status(400).json({ error: 'Approver list is required and must be an array' });
    }
    
    // Create conditions object
    const conditions = {
      isSequential: isSequential || false,
      minApprovalPercent: minApprovalPercent || 100,
      categoryFilter: categoryFilter || null,
      specificApproverIds: specificApproverIds || []
    };
    
    // Create approvers object with sequence information
    const approvers = approverList.map((approverId, index) => ({
      id: approverId,
      order: index + 1
    }));
    
    const rule = await prisma.approvalRule.create({
      data: {
        name,
        conditions,
        approvers,
        companyId
      }
    });
    
    // Transform to camelCase
    const formattedRule = toCamelCase(rule);
    formattedRule.approvers = JSON.parse(JSON.stringify(rule.approvers));
    formattedRule.conditions = JSON.parse(JSON.stringify(rule.conditions));
    
    return res.status(201).json(formattedRule);
  } catch (error) {
    console.error('Error creating approval rule:', error);
    return res.status(500).json({ error: 'Failed to create approval rule' });
  }
};

/**
 * Update an existing approval rule
 */
const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const { 
      name, 
      isSequential, 
      minApprovalPercent, 
      categoryFilter, 
      specificApproverIds, 
      approverList 
    } = req.body;
    
    // Check if rule exists and belongs to the company
    const existingRule = await prisma.approvalRule.findFirst({
      where: {
        id,
        companyId
      }
    });
    
    if (!existingRule) {
      return res.status(404).json({ error: 'Approval rule not found' });
    }
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!approverList || !Array.isArray(approverList) || approverList.length === 0) {
      return res.status(400).json({ error: 'Approver list is required and must be an array' });
    }
    
    // Create conditions object
    const conditions = {
      isSequential: isSequential ?? existingRule.conditions.isSequential,
      minApprovalPercent: minApprovalPercent ?? existingRule.conditions.minApprovalPercent,
      categoryFilter: categoryFilter ?? existingRule.conditions.categoryFilter,
      specificApproverIds: specificApproverIds ?? existingRule.conditions.specificApproverIds
    };
    
    // Create approvers object with sequence information
    const approvers = approverList.map((approverId, index) => ({
      id: approverId,
      order: index + 1
    }));
    
    const updatedRule = await prisma.approvalRule.update({
      where: { id },
      data: {
        name,
        conditions,
        approvers,
        updatedAt: new Date()
      }
    });
    
    // Transform to camelCase
    const formattedRule = toCamelCase(updatedRule);
    formattedRule.approvers = JSON.parse(JSON.stringify(updatedRule.approvers));
    formattedRule.conditions = JSON.parse(JSON.stringify(updatedRule.conditions));
    
    return res.json(formattedRule);
  } catch (error) {
    console.error('Error updating approval rule:', error);
    return res.status(500).json({ error: 'Failed to update approval rule' });
  }
};

/**
 * Delete an approval rule
 */
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Check if rule exists and belongs to the company
    const existingRule = await prisma.approvalRule.findFirst({
      where: {
        id,
        companyId
      }
    });
    
    if (!existingRule) {
      return res.status(404).json({ error: 'Approval rule not found' });
    }
    
    await prisma.approvalRule.delete({
      where: { id }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting approval rule:', error);
    return res.status(500).json({ error: 'Failed to delete approval rule' });
  }
};

module.exports = {
  getAllRules,
  createRule,
  updateRule,
  deleteRule
};