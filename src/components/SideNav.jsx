import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Settings, Waves, Home, Map, Briefcase, DollarSign, BarChart, Users, AlertCircle, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { buttonVariants } from './ui/button';
import { cn } from '../lib/utils'; // Assuming you have a utility for class names

const navItems = {
  citizen: [
    { path: '/dashboard', name: 'Home', icon: Home },
    { path: '/reports', name: 'Reports', icon: Map },
    { path: '/community', name: 'Community', icon: Users },
  ],
  official: [
    { path: '/dashboard', name: 'Home', icon: Home },
    { path: '/operations', name: 'Operations', icon: Briefcase },
    { path: '/finance', name: 'Finance', icon: DollarSign },
  ],
  analyst: [
    { path: '/dashboard', name: 'Home', icon: Home },
    { path: '/analytics', name: 'Analytics', icon: BarChart },
    { path: '/reports', name: 'Reports', icon: Map },
  ],
  admin: [
    { path: '/dashboard', name: 'Home', icon: Home },
    { path: '/users', name: 'Users', icon: Users },
    { path: '/settings', name: 'Settings', icon: Settings },
  ],
};

const SideNav = ({ userRole, user }) => {
  const roleKey = ['citizen', 'official', 'analyst', 'admin'].includes(userRole || user?.role)
    ? (userRole || user?.role)
    : 'citizen';
  const items = navItems[roleKey] ?? [];

  return (
    <aside className="w-64 flex flex-col min-h-screen bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name ?? 'User'} />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-foreground">{user?.name ?? 'User'}</div>
            <div className="text-xs text-muted-foreground capitalize">{roleKey}</div>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex items-center gap-2">
        <Waves className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg text-primary">Tarang</span>
      </div>

      <nav className="flex-1 px-4 py-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
                'w-full justify-start gap-3 my-1'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t mt-auto">
        <Link
          to="/settings"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'w-full justify-start gap-3'
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
