const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { toCamelCase } = require('../utils/formatter');

/**
 * Get pending approvals for manager
 */
const getPendingApprovals = async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const [approvals, total] = await Promise.all([
      prisma.expense.findMany({
        where: {
          currentApproverId: managerId,
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          attachments: true,
          lines: true
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.expense.count({
        where: {
          currentApproverId: managerId,
          status: 'PENDING'
        }
      })
    ]);

    // Format response to match required structure
    const formattedApprovals = approvals.map(expense => ({
      id: expense.id,
      expenseId: expense.id,
      employeeName: expense.user.name,
      title: expense.title,
      amount: expense.originalAmount,
      status: expense.status
    }));

    res.json({
      data: formattedApprovals,
      total
    });
  } catch (error) {
    console.error('Get approvals error:', error);
    res.status(500).json({ message: 'Failed to fetch approvals' });
  }
};

/**
 * Make approval decision (approve/reject)
 */
const makeDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, comment } = req.body;
    const approverId = req.user.id;

    // Validate decision
    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision. Must be APPROVED or REJECTED' });
    }

    // Get the expense with approval rules
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            manager: true
          }
        },
        company: {
          include: {
            approvalRules: true
          }
        },
        approvalHistory: true
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if the current user is the assigned approver
    if (expense.currentApproverId !== approverId) {
      return res.status(403).json({ message: 'You are not authorized to approve this expense' });
    }

    // Start a transaction for the approval process
    const result = await prisma.$transaction(async (tx) => {
      // Create approval history record
      await tx.approvalHistory.create({
        data: {
          expenseId: id,
          approverId: approverId,
          decision,
          comment,
          createdAt: new Date()
        }
      });

      // Handle rejection - simple case
      if (decision === 'REJECTED') {
        return tx.expense.update({
          where: { id },
          data: {
            status: 'REJECTED',
            currentApproverId: null
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            approvalHistory: {
              orderBy: { createdAt: 'asc' }
            }
          }
        });
      }

      // Handle approval - check approval rules
      const approvalRules = expense.company.approvalRules || [];
      
      // Get the rule that applies to this expense
      const applicableRule = approvalRules.find(rule => {
        if (rule.conditions.categoryFilter && rule.conditions.categoryFilter === expense.category) {
          return true;
        }
        return !rule.conditions.categoryFilter;
      }) || { approvers: [], conditions: { isSequential: false, minApprovalPercent: 100 } };

      // Handle based on rule type
      if (applicableRule.conditions.isSequential) {
        // Sequential approval flow
        const approvers = applicableRule.approvers || [];
        const currentApproverIndex = approvers.findIndex(a => a.id === approverId);
        
        if (currentApproverIndex >= 0 && currentApproverIndex < approvers.length - 1) {
          // There's a next approver in sequence
          const nextApprover = approvers[currentApproverIndex + 1];
          return tx.expense.update({
            where: { id },
            data: {
              currentApproverId: nextApprover.id
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              approvalHistory: {
                orderBy: { createdAt: 'asc' }
              }
            }
          });
        }
      } else if (applicableRule.conditions.specificApproverIds && 
                applicableRule.conditions.specificApproverIds.length > 0) {
        // Specific approver rule - if this approver is in the specific list, approve
        if (applicableRule.conditions.specificApproverIds.includes(approverId)) {
          return tx.expense.update({
            where: { id },
            data: {
              status: 'APPROVED',
              currentApproverId: null
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              approvalHistory: true
            }
          });
        }
      } else {
        // Percentage rule
        const totalApprovers = applicableRule.approvers.length || 1;
        const approvedCount = expense.approvalHistory.filter(h => h.decision === 'APPROVED').length + 1;
        const approvalPercentage = (approvedCount / totalApprovers) * 100;
        
        if (approvalPercentage >= applicableRule.conditions.minApprovalPercent) {
          return tx.expense.update({
            where: { id },
            data: {
              status: 'APPROVED',
              currentApproverId: null
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              approvalHistory: true
            }
          });
        }
      }
      
      // Default case - mark as approved if no other rules apply
      return tx.expense.update({
        where: { id },
        data: {
          status: 'APPROVED',
          currentApproverId: null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          approvalHistory: true
        }
      });
    });

    // Format response to camelCase
    const formattedResult = toCamelCase(result);
    
    res.json(formattedResult);
  } catch (error) {
    console.error('Approval decision error:', error);
    res.status(500).json({ message: 'Failed to process approval decision' });
  }
};

module.exports = {
  getPendingApprovals,
  makeDecision
};