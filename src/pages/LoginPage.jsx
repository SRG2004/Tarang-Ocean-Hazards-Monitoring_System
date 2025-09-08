import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import './LoginPage.css';

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
      const result = await login(formData.email, formData.password);
      
      // Redirect based on user role (4-role system)
      if (result.user.role === 'admin') {
        navigate('/analyst'); // Admin gets access to all dashboards
      } else if (result.user.role === 'analyst') {
        navigate('/analyst'); // Analyst can access citizen and analyst dashboard
      } else if (result.user.role === 'official') {
        navigate('/donations'); // Official can access official and citizen dashboard
      } else {
        navigate('/citizen'); // Citizens can only access citizen dashboard
      }
      
      toast.success(`Welcome back, ${result.user.fullName}!`);
    } catch (error) {
      toast.error(error.message);
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
    
    // Automatically login with demo account
    setLoginLoading(true);
    try {
      const result = await login(account.email, account.password);
      
      // Redirect based on user role
      if (result.user.role === 'admin' || result.user.role === 'analyst') {
        navigate('/analyst');
      } else if (result.user.role === 'official') {
        navigate('/donations');
      } else if (result.user.role === 'volunteer') {
        navigate('/volunteer-registration');
      } else {
        navigate('/citizen');
      }
      
      toast.success(`Logged in as ${account.type}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your ocean safety dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="signin-button"
              disabled={loginLoading || loading}
            >
              {loginLoading || loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>Don't have an account?</span>
          </div>

          <div className="account-options">
            <button 
              className="create-account-button"
              onClick={() => navigate('/volunteer-registration')}
            >
              Create General Account
            </button>
            <button 
              className="volunteer-register-button"
              onClick={() => navigate('/volunteer-registration')}
            >
              Register as Volunteer
            </button>
          </div>

          <div className="demo-section">
            <h3 className="demo-title">Demo Accounts</h3>
            <p className="demo-subtitle">Use these credentials for testing if configured in your SugaDesk</p>
            <div className="demo-accounts">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index} 
                  className="demo-account"
                  onClick={() => handleDemoLogin(account)}
                >
                  <div className="demo-icon">{account.icon}</div>
                  <div className="demo-info">
                    <div className="demo-type">{account.type}</div>
                    <div className="demo-email">{account.email}</div>
                    <div className="demo-description">{account.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;