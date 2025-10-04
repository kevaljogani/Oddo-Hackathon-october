import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

// Import pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import ExpenseForm from "./pages/ExpenseForm";
import ManagerApprovals from "./pages/ManagerApprovals";
import UserManagement from "./pages/UserManagement";
import ApprovalRules from "./pages/ApprovalRules";
import CompanySettings from "./pages/CompanySettings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Import components
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <Layout>
                    <Expenses />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/expenses/new" element={
                <ProtectedRoute>
                  <Layout>
                    <ExpenseForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/expenses/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <ExpenseForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/expenses/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ExpenseDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/manager/approvals" element={
                <ProtectedRoute requiredRole="MANAGER">
                  <Layout>
                    <ManagerApprovals />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/approval-rules" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Layout>
                    <ApprovalRules />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Layout>
                    <CompanySettings />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;