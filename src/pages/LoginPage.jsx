import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const demoAccounts = [
    {
      type: 'Admin',
      email: 'admin@oceanhazard.com',
      description: 'Full system access',
      icon: '👨‍💼'
    },
    {
      type: 'Analyst',
      email: 'analyst@oceanhazard.com',
      description: 'Data analysis & reports',
      icon: '📊'
    },
    {
      type: 'Officer',
      email: 'officer@oceanhazard.com',
      description: 'Emergency response',
      icon: '🛡️'
    },
    {
      type: 'Volunteer',
      email: 'volunteer@oceanhazard.com',
      description: 'Community support',
      icon: '🤝'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // In a real app, this would authenticate with your backend
    // For demo purposes, redirect based on email
    if (formData.email.includes('admin') || formData.email.includes('analyst')) {
      navigate('/analyst');
    } else {
      navigate('/citizen');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDemoLogin = (account) => {
    setFormData({
      email: account.email,
      password: 'demo123',
      rememberMe: false
    });
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

            <button type="submit" className="signin-button">
              Sign In
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