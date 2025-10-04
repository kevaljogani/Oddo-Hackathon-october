// Mock data for development - this will be replaced with real API calls later

export const mockUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'ADMIN',
    companyId: 'company-1',
    isManagerApprover: true,
    managerId: null
  },
  {
    id: 'manager-1',
    name: 'John Manager',
    email: 'manager@company.com',
    password: 'manager123',
    role: 'MANAGER',
    companyId: 'company-1',
    isManagerApprover: true,
    managerId: 'admin-1'
  },
  {
    id: 'employee-1',
    name: 'Jane Employee',
    email: 'employee@company.com',
    password: 'employee123',
    role: 'EMPLOYEE',
    companyId: 'company-1',
    isManagerApprover: false,
    managerId: 'manager-1'
  }
];

export const mockExpenses = [
  {
    id: 'exp-1',
    title: 'Business Lunch Meeting',
    description: 'Client meeting at The Business Center',
    date: '2024-01-15',
    category: 'Meals',
    originalAmount: 150.00,
    originalCurrency: 'USD',
    convertedAmount: 150.00,
    exchangeRate: 1.0,
    status: 'PENDING',
    userId: 'employee-1',
    currentApprover: 'manager-1',
    attachments: [
      {
        id: 'att-1',
        filename: 'receipt.pdf',
        url: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Receipt+PDF'
      }
    ],
    lines: [
      { description: 'Main course x2', amount: 80.00 },
      { description: 'Beverages', amount: 40.00 },
      { description: 'Tax & Service', amount: 30.00 }
    ]
  },
  {
    id: 'exp-2',
    title: 'Office Supplies Purchase',
    description: 'Stationery and printer paper for Q1',
    date: '2024-01-10',
    category: 'Office Supplies',
    originalAmount: 85.50,
    originalCurrency: 'USD',
    convertedAmount: 85.50,
    exchangeRate: 1.0,
    status: 'APPROVED',
    userId: 'employee-1',
    currentApprover: null,
    attachments: [],
    lines: [
      { description: 'Printer paper (5 reams)', amount: 45.00 },
      { description: 'Pens and notebooks', amount: 40.50 }
    ]
  },
  {
    id: 'exp-3',
    title: 'Travel Expenses - Client Visit',
    description: 'Flight and hotel for client presentation',
    date: '2024-01-08',
    category: 'Travel',
    originalAmount: 850.00,
    originalCurrency: 'USD',
    convertedAmount: 850.00,
    exchangeRate: 1.0,
    status: 'REJECTED',
    userId: 'employee-1',
    currentApprover: null,
    attachments: [],
    lines: [
      { description: 'Flight tickets', amount: 650.00 },
      { description: 'Hotel (2 nights)', amount: 200.00 }
    ]
  }
];

export const mockApprovals = [
  {
    id: 'app-1',
    expenseId: 'exp-1',
    approverId: 'manager-1',
    approverName: 'John Manager',
    decision: null,
    comment: null,
    decidedAt: null,
    order: 1
  }
];

export const mockApprovalRules = [
  {
    id: 'rule-1',
    name: 'Travel Expenses',
    category: 'Travel',
    sequential: true,
    minApprovalPercentage: 100,
    approvers: [
      { id: 'manager-1', name: 'John Manager', order: 1 },
      { id: 'admin-1', name: 'Admin User', order: 2 }
    ]
  },
  {
    id: 'rule-2',
    name: 'Small Expenses (Under $100)',
    category: 'ALL',
    sequential: false,
    minApprovalPercentage: 50,
    approvers: [
      { id: 'manager-1', name: 'John Manager', order: 1 }
    ]
  }
];

export const mockCategories = [
  'Meals',
  'Travel',
  'Office Supplies',
  'Software',
  'Marketing',
  'Training',
  'Equipment',
  'Miscellaneous'
];

export const mockCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'expense_approved',
    title: 'Expense Approved',
    message: 'Your office supplies expense has been approved',
    expenseId: 'exp-2',
    read: false,
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 'notif-2',
    type: 'expense_rejected',
    title: 'Expense Rejected',
    message: 'Your travel expense requires additional documentation',
    expenseId: 'exp-3',
    read: false,
    createdAt: '2024-01-09T09:15:00Z'
  }
];

export const mockCompanySettings = {
  id: 'company-1',
  name: 'Demo Company',
  defaultCurrency: 'USD',
  timezone: 'America/New_York',
  lastExchangeRateUpdate: '2024-01-15T10:00:00Z'
};