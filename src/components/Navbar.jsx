import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Waves, Home, FileText, Bell, User, Settings, LogOut, 
  Users, Shield, BarChart3, AlertTriangle, Megaphone, 
  Users2, TrendingUp, Hash 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileOpen(false);
  };

  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
              <Waves className="h-6 w-6" />
              <span>Tarang</span>
            </NavLink>
            <div className="flex space-x-4">
              <NavLink 
                to="/login" 
                className="btn-primary text-sm px-4 py-2"
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="btn-secondary text-sm px-4 py-2"
              >
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Role-specific nav items
  const getNavItems = () => {
    switch (user.role) {
      case 'citizen':
        return [
          { icon: Home, label: 'Home', path: `/${user.role}/dashboard` },
          { icon: FileText, label: 'Report', path: `/${user.role}/reports` },
          { icon: Bell, label: 'Alerts', path: `/${user.role}/alerts` },
          { icon: User, label: 'Profile', path: `/${user.role}/profile` },
        ];
      case 'official':
        return [
          { icon: AlertTriangle, label: 'Issue Alert', path: `/${user.role}/issue-alert` },
          { icon: Users, label: 'Verify', path: `/${user.role}/verify` },
          { icon: FileText, label: 'Generate Report', path: `/${user.role}/generate-report` },
          { icon: Bell, label: 'Notification', path: `/${user.role}/notifications` },
          { icon: Users2, label: 'Social', path: `/${user.role}/social` },
          { icon: User, label: 'Profile', path: `/${user.role}/profile` },
        ];
      case 'analyst':
        return [
          { icon: TrendingUp, label: 'Social Intelligence', path: `/${user.role}/social-intelligence` },
          { icon: FileText, label: 'Reports', path: `/${user.role}/reports` },
          { icon: Bell, label: 'Alerts', path: `/${user.role}/alerts` },
          { icon: Hash, label: 'Analytics', path: `/${user.role}/analytics` },
          { icon: User, label: 'Profile', path: `/${user.role}/profile` },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleIcon = () => {
    switch (user.role) {
      case 'citizen':
        return <Users className="h-4 w-4 text-primary" />;
      case 'official':
        return <Shield className="h-4 w-4 text-success" />;
      case 'analyst':
        return <BarChart3 className="h-4 w-4 text-violet-500" />;
      default:
        return null;
    }
  };

  return (
    <nav className="nav-surface bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to={`/${user.role}/dashboard`} className="flex items-center space-x-2 text-xl font-bold text-primary transition-all">
            <Waves className="h-6 w-6" />
            <span>Tarang</span>
          </NavLink>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'nav-active bg-primary text-white shadow-md'
                      : 'text-secondary hover:text-primary'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="relative flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {getRoleIcon()}
              </div>
              <span className="text-sm font-medium text-primary capitalize">{user.role}</span>
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 border border-border">
                <NavLink 
                  to={`/${user.role}/profile`} 
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary hover:bg-hover w-full"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </NavLink>
                <NavLink 
                  to={`/${user.role}/settings`} 
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary hover:bg-hover w-full"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-danger hover:bg-hover w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button - placeholder for now */}
          <div className="md:hidden">
            <button className="text-secondary hover:text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
