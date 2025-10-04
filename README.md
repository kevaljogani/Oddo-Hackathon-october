# Here are your Instructions
# ExpenseFlow - Frontend

A modern, responsive expense management frontend built with React, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication** - Admin, Manager, Employee roles with different permissions
- **Expense Management** - Create, edit, submit expenses with multi-line items
- **Approval Workflows** - Sequential and parallel approval processes
- **File Upload & OCR** - Receipt scanning with automatic data extraction
- **Real-time Notifications** - Toast notifications and badge counters
- **Responsive Design** - Mobile-first design that works on all devices

### User Roles & Capabilities

#### Employee
- Create and submit expenses
- Upload receipts with OCR scanning
- Track approval status
- View expense history

#### Manager  
- All employee capabilities
- Approve/reject team expenses
- View team expense analytics
- Bulk approval actions

#### Admin
- All manager capabilities
- User management (CRUD)
- Approval rules configuration
- Company settings management
- System administration

## 🛠️ Tech Stack

- **React 19** - Latest React with functional components and hooks
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management and caching
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon set
- **Sonner** - Toast notifications
- **React Hook Form** - Form management and validation

## 🎨 Design Features

### Visual Design
- **Modern Dark Theme** - Elegant dark color scheme with blue/emerald accents
- **Smooth Animations** - Reactbits.dev animation patterns throughout
- **Glass Morphism** - Subtle backdrop blur effects
- **Micro-interactions** - Hover states, button animations, loading states
- **Gradient Accents** - Tasteful use of gradients for CTAs and highlights

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Install Dependencies
```bash
cd frontend
yarn install
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure backend URL
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Development Server
```bash
yarn start
```
App will be available at `http://localhost:3000`

### Build for Production
```bash
yarn build
```

## 🧪 Demo Credentials

The app includes demo users for testing all roles:

**Admin User**
- Email: `admin@company.com`
- Password: `admin123`

**Manager User**  
- Email: `manager@company.com`
- Password: `manager123`

**Employee User**
- Email: `employee@company.com`  
- Password: `employee123`

## 📱 Key Pages

- **Landing** (`/`) - Marketing homepage with animated hero
- **Authentication** (`/login`, `/signup`) - Secure login and multi-step signup
- **Dashboard** (`/dashboard`) - Role-specific overview with statistics
- **Expenses** (`/expenses/*`) - Full expense management workflow
- **Approvals** (`/manager/approvals`) - Manager approval queue
- **Admin** (`/admin/*`) - User management, rules, and settings

## 🔌 Backend Integration

### Current State
- ✅ **Frontend**: Complete and production-ready
- ✅ **Mock Data**: Fully functional with realistic data
- 🔄 **Backend**: Ready for integration

See `/app/contracts.md` for detailed API contracts and integration plan.

## 🚀 Deployment

### Build for Production
```bash
yarn build
```

### Environment Variables
```env
NODE_ENV=production
REACT_APP_BACKEND_URL=https://api.yourcompany.com
```

---

**Note**: This frontend is production-ready with mock data and ready for backend API integration.
