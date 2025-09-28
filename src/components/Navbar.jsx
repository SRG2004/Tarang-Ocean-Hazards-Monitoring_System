import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, Layout, FileText, Map, Bell, LogOut, Users, Shield, BarChart3 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <nav className="bg-blue-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌊 Tarang</span>
            </NavLink>
            <div className="flex space-x-4">
              <NavLink to="/donations" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                Donate
              </NavLink>
              <NavLink to="/login" className="bg-white text-blue-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                Login
              </NavLink>
              <NavLink to="/register" className="bg-transparent border border-white text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-blue-500">
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = [
    { icon: MessageCircle, label: 'Social Media', path: '/social-media' },
    { icon: Layout, label: 'Dashboard', path: `/${user.role}/dashboard` },
    { icon: FileText, label: 'Reports', path: `/${user.role}/reports` },
    { icon: Map, label: 'Map View', path: '/map' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
  ];

  const getRoleIcon = () => {
    switch (user.role) {
      case 'citizen':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'official':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'analyst':
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to={`/${user.role}/dashboard`} className="flex items-center space-x-2 text-xl font-bold text-blue-500">
            <span>🌊 Tarang</span>
            <div className="flex items-center space-x-1">
              {getRoleIcon()}
              <span className="text-sm text-gray-500 capitalize">{user.role}</span>
            </div>
          </NavLink>
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
