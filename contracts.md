# API Contracts & Integration Plan

## Overview
This document outlines the API contracts between frontend and backend, mock data replacement strategy, and implementation roadmap for the Expense Management application.

## Current State
- ✅ **Frontend**: Complete React application with all pages and functionality
- ✅ **Mock Data**: All features work with mock data from `/src/data/mockData.js`
- 🔄 **Backend**: Ready for implementation using these contracts

## API Contracts

### Authentication Endpoints

#### POST /api/auth/login
```json
Request: { "email": "string", "password": "string" }
Response: {
  "token": "string",
  "refreshToken": "string", 
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ADMIN|MANAGER|EMPLOYEE",
    "companyId": "string",
    "isManagerApprover": "boolean"
  }
}
```

#### POST /api/auth/signup
```json
Request: {
  "name": "string",
  "email": "string", 
  "password": "string",
  "companyName": "string",
  "country": "string"
}
Response: Same as login
```

#### POST /api/auth/refresh
```json
Request: { "refreshToken": "string" }
Response: { "token": "string", "refreshToken": "string" }
```

### Expense Endpoints

#### GET /api/expenses
```json
Query: ?userId=string&page=number&status=string&category=string&search=string
Response: {
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "date": "ISO_DATE",
      "category": "string",
      "originalAmount": "number",
      "originalCurrency": "string", 
      "convertedAmount": "number",
      "exchangeRate": "number",
      "status": "DRAFT|PENDING|APPROVED|REJECTED",
      "userId": "string",
      "currentApprover": "string|null",
      "attachments": "array",
      "lines": "array"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### POST /api/expenses
```json
Request: {
  "title": "string",
  "description": "string",
  "date": "ISO_DATE",
  "category": "string",
  "currency": "string",
  "lines": [
    { "description": "string", "amount": "number" }
  ],
  "attachments": ["string"]
}
Response: Created expense object
```

#### GET /api/expenses/:id
```json
Response: Full expense object with approval timeline
```

#### PUT /api/expenses/:id
```json
Request: Updated expense fields
Response: Updated expense object
```

#### POST /api/expenses/:id/submit
```json
Response: { "status": "PENDING", "approvals": [...] }
```

### Approval Endpoints

#### GET /api/approvals/pending
```json
Query: ?approverId=string
Response: { "data": [...pending approvals...] }
```

#### POST /api/approvals/:id/decision
```json
Request: { 
  "decision": "APPROVED|REJECTED", 
  "comment": "string"
}
Response: Updated approval status
```

### User Management Endpoints

#### GET /api/users
```json
Response: { "data": [...users...], "total": number }
```

#### POST /api/users  
```json
Request: User creation data
Response: Created user object
```

#### PUT /api/users/:id
```json
Request: Updated user fields
Response: Updated user object
```

#### DELETE /api/users/:id
```json
Response: { "success": true }
```

### File Upload Endpoints

#### POST /api/uploads
```json
Response: { "uploadUrl": "string", "attachmentId": "string" }
```

#### POST /api/ocr
```json
Request: { "attachmentId": "string" }
Response: { 
  "jobId": "string",
  "status": "PENDING"
}
```

#### GET /api/ocr/:jobId/status
```json
Response: {
  "status": "PENDING|DONE|FAILED",
  "result": {
    "amount": number,
    "date": "ISO_DATE", 
    "merchant": "string",
    "items": [{"description": "string", "amount": number}]
  }
}
```

## Mock Data Replacement Strategy

### Current Mock Files
- `/src/data/mockData.js` - All mock data definitions
- Mock authentication in `/src/contexts/AuthContext.jsx`
- Mock API calls throughout components

### Backend Integration Steps

1. **Replace AuthContext mock authentication**:
   - Update login/signup functions to use real API calls
   - Implement proper token refresh logic
   - Update error handling

2. **Replace mock data with API calls**:
   - Create service functions in `/src/services/`
   - Update React Query hooks to use real endpoints
   - Remove mock data imports

3. **File upload integration**:
   - Implement real file upload to `/api/uploads`
   - Connect OCR functionality to backend service
   - Handle upload progress and errors

4. **Real-time features** (future):
   - WebSocket for approval notifications
   - Live expense status updates
   - Real-time collaboration

## Implementation Priority

### Phase 1: Core Backend (High Priority)
- Authentication system with JWT
- User management CRUD
- Expense CRUD operations
- Basic approval workflow

### Phase 2: Advanced Features (Medium Priority)  
- File upload and storage
- OCR integration
- Email notifications
- Approval rules engine

### Phase 3: Enhanced Features (Low Priority)
- Real-time notifications
- Advanced reporting
- Bulk operations
- Third-party integrations

## Frontend Changes Required

### Service Layer Updates
```javascript
// Replace mock calls in:
- /src/services/apiClient.js (add real endpoints)
- /src/contexts/AuthContext.jsx (remove mock logic)
- All page components (remove mock imports)
```

### Environment Variables
```env
REACT_APP_BACKEND_URL=https://api.yourcompany.com
REACT_APP_UPLOAD_URL=https://uploads.yourcompany.com
```

### Error Handling
- Update error boundary for API errors
- Add proper loading states
- Implement retry mechanisms

## Testing Strategy

### Current Frontend Testing
- All pages load and render correctly
- Navigation works between routes  
- Forms validate and submit
- Mock authentication flows work
- Responsive design verified

### Backend Integration Testing
- API endpoint connectivity
- Authentication flow end-to-end
- CRUD operations for all entities
- File upload functionality
- Error scenarios and edge cases

## Notes
- Frontend is production-ready with mock data
- All UI/UX patterns follow modern design principles
- Responsive design works on all screen sizes
- Animation and micro-interactions enhance user experience
- Ready for immediate backend integration using these contracts