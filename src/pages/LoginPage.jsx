import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import '../styles/globals.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loginLoading, setLoginLoading] = useState(false);

  const demoAccounts = [
    {
      type: 'Admin',
      email: 'admin@oceanhazard.com',
      description: 'Full system access & management',
      icon: '👨‍💼',
      password: 'demo123'
    },
    {
      type: 'Data Analyst',
      email: 'analyst@oceanhazard.com',
      description: 'Analytics, reports & social media monitoring',
      icon: '📊',
      password: 'demo123'
    },
    {
      type: 'Official',
      email: 'official@oceanhazard.com',
      description: 'Emergency response & coordination',
      icon: '🛡️',
      password: 'demo123'
    },
    {
      type: 'Citizen',
      email: 'citizen@oceanhazard.com',
      description: 'Report hazards & receive alerts',
      icon: '👥',
      password: 'demo123'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoginLoading(true);
    try {
      await login(formData.email, formData.password);
      
      navigate('/');
      
      toast.success(`Login successful!`);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDemoLogin = async (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: false
    });
    
    setLoginLoading(true);
    try {
      await login(account.email, account.password);
      
      navigate('/');
      
      toast.success(`Logged in as ${account.type}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="page-container centered">
      <div className="main-card w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <p className="text-muted-foreground text-center mt-2">Sign in to access your ocean safety dashboard</p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password" required />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="rememberMe" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleInputChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loginLoading || loading}>
              {loginLoading || loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="divider my-6">Don't have an account?</div>

          <div className="space-y-4">
            <button className="btn-secondary w-full" onClick={() => navigate('/register')}>
              Create General Account
            </button>
            <button className="btn-success w-full" onClick={() => navigate('/volunteer-registration')}>
              Register as Volunteer
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border-t">
          <h3 className="text-lg font-semibold text-center">Demo Accounts</h3>
          <p className="text-muted-foreground text-center mt-2">Use these credentials for testing</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {demoAccounts.map((account) => (
              <div key={account.type} className="card-clickable" onClick={() => handleDemoLogin(account)}>
                <div className="text-2xl mb-2">{account.icon}</div>
                <div className="font-semibold">{account.type}</div>
                <div className="text-xs text-muted-foreground">{account.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
