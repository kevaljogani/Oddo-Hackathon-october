const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all expenses with filtering
 * Filters: userId, status, category, date range, pagination
 */
const getAllExpenses = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      startDate, 
      endDate, 
      search,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const userId = req.query.userId || req.user.id;
    const skip = (page - 1) * parseInt(limit);
    
    // Build filter conditions
    const where = { userId };
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    // Get expenses with pagination
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          currentApprover: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          lines: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.expense.count({ where })
    ]);
    
    // Return data in camelCase format
    return res.json({ 
      data: expenses, 
      total
    });
  } catch (error) {
    console.error('Error getting expenses:', error);
    return res.status(500).json({ message: 'Failed to get expenses' });
  }
};

/**
 * Get expense by ID
 * Include: basic info, createdBy, attachments, approvals timeline
 */
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        currentApprover: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lines: true,
        attachments: true,
        approvalHistory: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Check if user has access to this expense
    if (expense.userId !== userId && req.user.role !== 'ADMIN' && 
        (req.user.role !== 'MANAGER' || expense.currentApproverId !== userId)) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }
    
    return res.json(expense);
  } catch (error) {
    console.error('Error getting expense:', error);
    return res.status(500).json({ message: 'Failed to get expense' });
  }
};

/**
 * Create new expense with DRAFT status
 */
const createExpense = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      category, 
      originalAmount, 
      originalCurrency,
      lines = [] 
    } = req.body;
    
    const userId = req.user.id;
    const companyId = req.user.companyId;
    
    // Calculate converted amount (simplified - in real app would use exchange rate API)
    const exchangeRate = originalCurrency === 'USD' ? 1.0 : 1.1; // Simplified
    const convertedAmount = parseFloat(originalAmount) * exchangeRate;
    
    // Create expense with transaction to handle lines
    const expense = await prisma.$transaction(async (tx) => {
      // Create the expense
      const newExpense = await tx.expense.create({
        data: {
          title,
          description,
          date: new Date(date),
          category,
          originalAmount: parseFloat(originalAmount),
          originalCurrency,
          convertedAmount,
          exchangeRate,
          status: 'DRAFT',
          userId,
          companyId
        }
      });
      
      // Create expense lines if provided
      if (lines && lines.length > 0) {
        await Promise.all(
          lines.map(line => 
            tx.expenseLine.create({
              data: {
                description: line.description,
                amount: parseFloat(line.amount),
                expenseId: newExpense.id
              }
            })
          )
        );
      }
      
      // Return the created expense with lines
      return tx.expense.findUnique({
        where: { id: newExpense.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          lines: true
        }
      });
    });
    
    return res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ message: 'Failed to create expense' });
  }
};

/**
 * Update expense
 * Allow updating Draft or Rejected expenses only
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const { 
      title, 
      description, 
      date, 
      category, 
      originalAmount, 
      originalCurrency,
      lines = [] 
    } = req.body;
    
    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findUnique({
      where: { id }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    if (expense.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }
    
    // Check if expense is in DRAFT or REJECTED status
    if (expense.status !== 'DRAFT' && expense.status !== 'REJECTED') {
      return res.status(400).json({ 
        message: 'Only expenses in DRAFT or REJECTED status can be updated' 
      });
    }
    
    // Calculate converted amount
    const exchangeRate = originalCurrency === 'USD' ? 1.0 : 1.1; // Simplified
    const convertedAmount = parseFloat(originalAmount) * exchangeRate;
    
    // Update expense with transaction to handle lines
    const updatedExpense = await prisma.$transaction(async (tx) => {
      // Update the expense
      const updated = await tx.expense.update({
        where: { id },
        data: {
          title,
          description,
          date: new Date(date),
          category,
          originalAmount: parseFloat(originalAmount),
          originalCurrency,
          convertedAmount,
          exchangeRate,
          status: 'DRAFT' // Reset to DRAFT if it was REJECTED
        }
      });
      
      // Delete existing lines
      await tx.expenseLine.deleteMany({
        where: { expenseId: id }
      });
      
      // Create new lines
      if (lines && lines.length > 0) {
        await Promise.all(
          lines.map(line => 
            tx.expenseLine.create({
              data: {
                description: line.description,
                amount: parseFloat(line.amount),
                expenseId: id
              }
            })
          )
        );
      }
      
      // Return the updated expense with lines
      return tx.expense.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          lines: true,
          attachments: true
        }
      });
    });
    
    return res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ message: 'Failed to update expense' });
  }
};

/**
 * Delete expense
 * Only DRAFT expenses can be deleted
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findUnique({
      where: { id }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    if (expense.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }
    
    // Check if expense is in DRAFT status
    if (expense.status !== 'DRAFT') {
      return res.status(400).json({ message: 'Only expenses in DRAFT status can be deleted' });
    }
    
    // Delete expense (cascade will handle lines and attachments)
    await prisma.expense.delete({
      where: { id }
    });
    
    return res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ message: 'Failed to delete expense' });
  }
};

/**
 * Submit expense for approval
 * Mark expense as SUBMITTED
 * Assign approvers based on approval rules
 */
const submitExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            manager: true
          }
        }
      }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    if (expense.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to submit this expense' });
    }
    
    // Check if expense is in DRAFT or REJECTED status
    if (expense.status !== 'DRAFT' && expense.status !== 'REJECTED') {
      return res.status(400).json({ 
        message: 'Only expenses in DRAFT or REJECTED status can be submitted' 
      });
    }
    
    // Get the manager to assign as approver
    if (!expense.user.manager) {
      return res.status(400).json({ message: 'No manager assigned to approve this expense' });
    }
    
    const managerId = expense.user.manager.id;
    
    // Update expense status to PENDING and assign approver
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        status: 'PENDING',
        currentApproverId: managerId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        currentApprover: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lines: true,
        attachments: true
      }
    });
    
    return res.json(updatedExpense);
  } catch (error) {
    console.error('Error submitting expense:', error);
    return res.status(500).json({ message: 'Failed to submit expense' });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  submitExpense
};