import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Home, FileText, Bell, User, Settings, LogOut, Users, Shield, BarChart3, AlertTriangle, Megaphone, Users2, TrendingUp, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <Home className="text-white" size={20} />
              </div>
              <span className="text-xl font-semibold text-gray-800">Tarang</span>
            </NavLink>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <NavLink to="/login">Login</NavLink>
              </Button>
              <Button asChild>
                <NavLink to="/register">Register</NavLink>
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const getNavItems = () => {
    // Role-specific nav items
  };

  const navItems = getNavItems();

  const getRoleIconAndStyle = () => {
    switch (user.role) {
      case 'citizen':
        return { icon: <Users size={20} />, style: 'text-blue-600 bg-blue-100' };
      case 'official':
        return { icon: <Shield size={20} />, style: 'text-green-600 bg-green-100' };
      case 'analyst':
        return { icon: <BarChart3 size={20} />, style: 'text-purple-600 bg-purple-100' };
      default:
        return { icon: <User size={20} />, style: 'text-gray-600 bg-gray-100' };
    }
  };

  const { icon: roleIcon, style: roleStyle } = getRoleIconAndStyle();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <span className="text-xl font-semibold text-gray-800">Tarang</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${roleStyle}`}>
                    {roleIcon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 capitalize">{user.name || user.role}</p>
                    <p className="text-xs text-gray-500">Community Member</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to={`/${user.role}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={`/${user.role}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <nav className="flex space-x-8 border-t pt-2">
            <NavLink 
              to={`/${user.role}/dashboard`}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-3 text-sm font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
              }>
              <Home size={20} />
              <span>Home</span>
            </NavLink>
            {/* Add other nav items based on role */}
          </nav>
      </div>
    </header>
  );
};

export default Navbar; 
