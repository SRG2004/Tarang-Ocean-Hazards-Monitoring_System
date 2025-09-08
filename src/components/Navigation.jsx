import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useApp();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Role-based navigation items
  const getRoleBasedNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Home', icon: '🏠' },
      { path: '/map', label: 'Map View', icon: '🗺️' }
    ];
    
    if (!isAuthenticated) {
      return commonItems;
    }
    
    const userRole = user?.role;
    let roleItems = [];
    
    // All authenticated users can access citizen dashboard
    roleItems.push({ path: '/citizen', label: 'Citizen Dashboard', icon: '👥' });
    
    // Role-specific access
    if (userRole === 'admin') {
      roleItems.push(
        { path: '/analyst', label: 'Analytics', icon: '📊' },
        { path: '/official', label: 'Official Dashboard', icon: '🏛️' },
        { path: '/social-media', label: 'Social Media', icon: '📱' },
        { path: '/donations', label: 'Donations', icon: '🤝' }
      );
    } else if (userRole === 'analyst') {
      roleItems.push(
        { path: '/analyst', label: 'Analytics', icon: '📊' },
        { path: '/social-media', label: 'Social Media', icon: '📱' }
      );
    } else if (userRole === 'official') {
      roleItems.push(
        { path: '/official', label: 'Official Dashboard', icon: '🏛️' },
        { path: '/donations', label: 'Donations', icon: '🤝' }
      );
    }
    
    return [...commonItems, ...roleItems];
  };

  const authNavItems = isAuthenticated 
    ? []
    : [
        { path: '/register', label: 'Register', icon: '📝' },
        { path: '/login', label: 'Login', icon: '🔐' }
      ];

  const navItems = [...getRoleBasedNavItems(), ...authNavItems];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navigation">
      {isAuthenticated && (
        <div className="profile-section">
          <button 
            className="profile-button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <span className="profile-icon">👤</span>
          </button>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <span className="profile-name">{user?.name || user?.email || 'User'}</span>
                <span className="profile-role">{user?.role || 'citizen'}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate('/settings');
                }}
              >
                ⚙️ Settings
              </button>
              <button 
                className="dropdown-item logout-item"
                onClick={() => {
                  setShowProfileDropdown(false);
                  logout();
                  navigate('/');
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="nav-brand" onClick={() => navigate('/')}>
        <span className="nav-logo">🌊</span>
        <span className="nav-title">Taranga</span>
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;