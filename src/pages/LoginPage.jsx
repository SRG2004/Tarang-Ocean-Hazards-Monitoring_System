import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import { LogIn, User, Shield, BarChart3, Users, Eye } from 'lucide-react';

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
      icon: User,
      password: 'demo123',
      color: 'bg-purple-500'
    },
    {
      type: 'Data Analyst',
      email: 'analyst@oceanhazard.com',
      description: 'Analytics, reports & social media monitoring',
      icon: BarChart3,
      password: 'demo123',
      color: 'bg-blue-500'
    },
    {
      type: 'Official',
      email: 'official@oceanhazard.com',
      description: 'Emergency response & coordination',
      icon: Shield,
      password: 'demo123',
      color: 'bg-red-500'
    },
    {
      type: 'Citizen',
      email: 'citizen@oceanhazard.com',
      description: 'Report hazards & receive alerts',
      icon: Users,
      password: 'demo123',
      color: 'bg-green-500'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌊</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Tarang
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ocean Hazards Monitoring System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginLoading || loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                </span>
                {loginLoading || loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => navigate('/register')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Create General Account
              </button>
              <button
                onClick={() => navigate('/volunteer-registration')}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700"
              >
                Register as Volunteer
              </button>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Demo Accounts</h3>
            <p className="mt-2 text-sm text-gray-600">Click any account to login instantly</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {demoAccounts.map((account) => (
              <button
                key={account.type}
                onClick={() => handleDemoLogin(account)}
                disabled={loginLoading || loading}
                className="group relative bg-white p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-2 rounded-full ${account.color} text-white`}>
                    <account.icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{account.type}</div>
                    <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                  </div>
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
