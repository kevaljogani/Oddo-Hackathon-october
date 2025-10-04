import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password, selectedRole = null) => {
    try {
      setLoading(true);
      
      // Mock login - find user by email, password, and optionally role
      let foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      // If no user found by email/password, try to find by role for demo purposes
      if (!foundUser && selectedRole) {
        foundUser = mockUsers.find(u => u.role === selectedRole);
      }
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Mock JWT token
      const token = `mock-jwt-${Date.now()}`;
      const refreshToken = `mock-refresh-${Date.now()}`;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      
      toast.success('Login successful!');
      
      return { 
        token, 
        refreshToken, 
        user: userWithoutPassword 
      };
      
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Mock signup - create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'EMPLOYEE',
        companyId: userData.companyId || `company-${Date.now()}`,
        isManagerApprover: ['ADMIN', 'MANAGER'].includes(userData.role || 'EMPLOYEE'),
        managerId: null
      };
      
      // Mock JWT token
      const token = `mock-jwt-${Date.now()}`;
      const refreshToken = `mock-refresh-${Date.now()}`;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      
      toast.success('Account created successfully!');
      
      return { 
        token, 
        refreshToken, 
        user: newUser 
      };
      
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Mock refresh - generate new tokens
      const newToken = `mock-jwt-${Date.now()}`;
      const newRefreshToken = `mock-refresh-${Date.now()}`;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return { token: newToken, refreshToken: newRefreshToken };
      
    } catch (error) {
      logout();
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Role hierarchy: ADMIN > MANAGER > EMPLOYEE
    const roleHierarchy = {
      ADMIN: 3,
      MANAGER: 2,
      EMPLOYEE: 1
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshToken,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};