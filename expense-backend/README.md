# Expense Management Backend

This is the backend API for the Expense Management application, built with Node.js, Express, and Prisma ORM.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd expense-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your database credentials and other settings

### Database Setup

1. Create a MySQL database for the application
2. Update the `DATABASE_URL` in your `.env` file
3. Run Prisma migrations to create the database schema:
   ```
   npx prisma migrate dev --name init
   ```
4. Seed the database with sample data:
   ```
   npm run seed
   ```

### Running the Application

#### Development Mode

```
npm run dev
```

This will start the server with nodemon for automatic reloading.

#### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Expenses

- `GET /api/expenses` - Get all expenses (filtered by user)
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/:id/submit` - Submit expense for approval

### Approvals

- `GET /api/approvals/pending` - Get pending approvals for manager
- `POST /api/approvals/:id/decision` - Make approval decision

### File Uploads

- `POST /api/upload/file` - Upload file attachment
- `POST /api/upload/ocr` - Process receipt with OCR

## Default Users

After seeding, the following users are available:

- Admin: admin@example.com / admin123
- Manager: manager@example.com / manager123
- Employee: john@example.com / employee123
- Employee: jane@example.com / employee123

## License

MIT