import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Home, AlertTriangle, Users, Bell, User, LogOut } from 'lucide-react';
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
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌊 Tarang</span>
            </NavLink>
            <div className="flex space-x-4">
              <NavLink to="/donations" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                Donate
              </NavLink>
              <NavLink to="/login" className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                Login
              </NavLink>
              <NavLink to="/register" className="bg-transparent border border-white text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-blue-600">
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = [
    { icon: Home, label: 'Home', path: `/${user.role}/dashboard` },
    { icon: AlertTriangle, label: 'Reports', path: `/${user.role}/reports` },
    { icon: Users, label: 'Volunteer', path: `/${user.role}/volunteer` },
    { icon: Bell, label: 'Alerts', path: `/${user.role}/alerts` },
    { icon: User, label: 'Profile', path: `/${user.role}/profile` },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to={`/${user.role}/dashboard`} className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <span>🌊 Tarang</span>
            <span className="text-sm text-gray-500 capitalize">{user.role}</span>
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
