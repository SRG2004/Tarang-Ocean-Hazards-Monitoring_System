import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useApp();

  const baseNavItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/citizen', label: 'Citizen Dashboard', icon: '👥' },
    { path: '/analyst', label: 'Analytics', icon: '📊' },
    { path: '/social-media', label: 'Social Media', icon: '📱' },
    { path: '/donations', label: 'Donations', icon: '🤝' },
    { path: '/map', label: 'Map View', icon: '🗺️' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const authNavItems = isAuthenticated 
    ? [{ path: '/logout', label: 'Logout', icon: '🚪', action: 'logout' }]
    : [
        { path: '/register', label: 'Register', icon: '📝' },
        { path: '/login', label: 'Login', icon: '🔐' }
      ];

  const navItems = [...baseNavItems, ...authNavItems];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navigation">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <span className="nav-logo">🌊</span>
        <span className="nav-title">Taranga</span>
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => {
              if (item.action === 'logout') {
                logout();
                navigate('/');
              } else {
                navigate(item.path);
              }
            }}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        {isAuthenticated && user && (
          <div className="user-info-nav">
            <span className="user-welcome">Welcome, {user.name || user.email || 'User'}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;