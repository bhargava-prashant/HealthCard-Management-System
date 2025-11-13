import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

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
  const [role, setRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const response = await authAPI.verifyToken();
        if (response.data.ok) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setRole(response.data.user.role);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password, userRole) => {
    try {
      let response;
      if (userRole === 'patient') {
        response = await authAPI.patientLogin({ email, password });
      } else if (userRole === 'doctor') {
        response = await authAPI.doctorLogin({ email, password });
      } else if (userRole === 'admin') {
        response = await authAPI.adminLogin({ email, password });
      }

      if (response.data.token) {
        const token = response.data.token;
        const userData = response.data.user || { id: response.data.user?.id, name: response.data.user?.name };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userRole);
        
        setUser(userData);
        setRole(userRole);
        
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (data, userRole) => {
    try {
      let response;
      if (userRole === 'patient') {
        response = await authAPI.patientSignup(data);
      } else if (userRole === 'doctor') {
        response = await authAPI.doctorSignup(data);
      }

      if (response.status === 201) {
        toast.success('Registration successful! Please wait for approval.');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      setUser(null);
      setRole(null);
      toast.info('Logged out successfully');
    }
  };

  const value = {
    user,
    role,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

