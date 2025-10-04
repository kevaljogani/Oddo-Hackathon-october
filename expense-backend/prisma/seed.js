const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo company
  const company = await prisma.company.create({
    data: {
      name: 'Demo Company',
      settings: JSON.stringify({
        defaultCurrency: 'USD',
        taxId: '123456789',
        address: '123 Main St, New York, NY 10001'
      })
    }
  });

  console.log('Company created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'ADMIN',
      companyId: company.id
    }
  });

  // Create manager
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@demo.com',
      password: managerPassword,
      role: 'MANAGER',
      companyId: company.id,
      isManagerApprover: true
    }
  });

  // Create employee
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employee = await prisma.user.create({
    data: {
      name: 'Employee User',
      email: 'employee@demo.com',
      password: employeePassword,
      role: 'EMPLOYEE',
      companyId: company.id,
      managerId: manager.id
    }
  });

  console.log('Users created');

  // Create sample expense
  const expense = await prisma.expense.create({
    data: {
      title: 'Business Lunch',
      description: 'Lunch with client to discuss new project',
      date: new Date(),
      category: 'Meals',
      originalAmount: 75.50,
      originalCurrency: 'USD',
      convertedAmount: 75.50,
      exchangeRate: 1.0,
      status: 'DRAFT',
      userId: employee.id,
      companyId: company.id,
      lines: {
        create: [
          {
            description: 'Main course',
            amount: 45.50
          },
          {
            description: 'Beverages',
            amount: 30.00
          }
        ]
      }
    }
  });

  console.log('Sample expense created');
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });