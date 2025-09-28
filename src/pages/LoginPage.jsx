import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import { LogIn, Users, Shield, BarChart3, Mail, Lock, Waves } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginLoading, setLoginLoading] = useState(false);

  const demoAccounts = [
    {
      type: 'Citizen',
      email: 'citizen@tarang.com',
      role: 'citizen',
      description: 'Report hazards and receive alerts',
      icon: Users,
      password: 'demo123',
      color: 'bg-primary'
    },
    {
      type: 'Official',
      email: 'official@tarang.com',
      role: 'official',
      description: 'Manage responses and coordinate teams',
      icon: Shield,
      password: 'demo123',
      color: 'bg-success'
    },
    {
      type: 'Analyst',
      email: 'analyst@tarang.com',
      role: 'analyst',
      description: 'Analyze data and monitor trends',
      icon: BarChart3,
      password: 'demo123',
      color: 'bg-violet-500'
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
      navigate('/role-selection');
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDemoLogin = async (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });

    setLoginLoading(true);
    try {
      await login(account.email, account.password);
      // Set role in context if needed, but assuming login handles it
      navigate(`/${account.role}/dashboard`);
      toast.success(`Logged in as ${account.type}`);
    } catch (error) {
      toast.error(error.message || 'Demo login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
      style={{ background: 'var(--gradient-role)' }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center">
            <Waves className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Ocean Hazards Monitoring System
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input pl-10 w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input pl-10 w-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                Forgot your password?
              </Link>
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                Sign up
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginLoading || loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>{loginLoading || loading ? 'Signing In...' : 'Sign In'}</span>
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Demo Accounts Card */}
        <div className="card p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Demo Accounts</h3>
            <p className="mt-1 text-sm text-text-secondary">Click to login instantly with demo credentials</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.type}
                onClick={() => handleDemoLogin(account)}
                disabled={loginLoading || loading}
                className="card p-4 hover:shadow-md transition-all duration-200 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`p-2 rounded-full ${account.color} text-white flex-shrink-0`}>
                  <account.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{account.type}</div>
                  <div className="text-xs text-text-secondary truncate">{account.description}</div>
                </div>
                <div className="text-xs text-text-secondary font-mono bg-secondary/50 px-2 py-1 rounded">
                  {account.email}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
