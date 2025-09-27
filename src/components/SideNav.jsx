import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Settings, Waves, Home, Map, Briefcase, DollarSign, BarChart, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const navItems = {
  citizen: [
    { path: "/dashboard", name: "Home", icon: Home },
    { path: "/reports", name: "Reports", icon: Map },
    { path: "/community", name: "Community", icon: Users },
  ],
  official: [
    { path: "/dashboard", name: "Home", icon: Home },
    { path: "/operations", name: "Operations", icon: Briefcase },
    { path: "/finance", name: "Finance", icon: DollarSign },
  ],
  analyst: [
    { path: "/dashboard", name: "Home", icon: Home },
    { path: "/analytics", name: "Analytics", icon: BarChart },
    { path: "/reports", name: "Reports", icon: Map },
  ],
  admin: [
    { path: "/dashboard", name: "Home", icon: Home },
    { path: "/users", name: "Users", icon: Users },
    { path: "/settings", name: "Settings", icon: Settings },
  ],
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SideNav = ({ userRole, user }) => {
  const roleKey = ["citizen", "official", "analyst", "admin"].includes(userRole || user?.role)
    ? (userRole || user?.role)
    : "citizen";
  const items = navItems[roleKey] ?? [];

  return (
    <aside className={cn("w-64 p-4 sm:p-5 md:p-6 nav-surface text-slate-100 flex flex-col min-h-screen", `nav-surface--${roleKey}`)}>
      <div className="mb-6 flex items-center gap-3 profile-card">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatarUrl} alt={user?.name ?? "User"} />
          <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{user?.name ?? "User"}</div>
          <div className="text-xs text-slate-300 capitalize flex items-center gap-2">
            <span>{roleKey}</span>
            <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] tracking-wide">{roleKey}</span>
          </div>
        </div>
      </div>
      <div className="mb-8 flex items-center gap-2">
        <Waves className="h-6 w-6 text-blue-300" />
        <span className="font-bold text-lg tracking-tight">Tarang</span>
      </div>
      <nav className="flex-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg nav-item-transition nav-hover-effect",
                isActive && "nav-active-state"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="pt-4 border-t border-white/10 mt-auto">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-2 py-2 nav-item-transition nav-hover-effect"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
      {/* Nearby Alerts Banner */}
      {nearbyAlerts.length > 0 && (
        <div className="gradient-card mb-8 px-6 py-4 rounded-xl shadow bg-gradient-stat-alert">
          <AlertCircle className="w-6 h-6 text-white mr-2 inline" />
          <span className="text-white font-semibold">Nearby Alerts:</span>
          <span className="text-white/80 ml-2">{nearbyAlerts.map(a => a.title).join(", ")}</span>
        </div>
      )}
      {/* Recent Activity & Emergency Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gradient-card p-6 rounded-xl shadow bg-gradient-citizen">
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 rounded-lg card-hover-lift smooth-hover" style={{ background: "rgba(255,255,255,0.08)" }}>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-slate-700">{activity.description}</span>
                <span className="ml-auto text-xs text-slate-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="gradient-card p-6 rounded-xl shadow bg-gradient-stat-contact">
          <h2 className="font-semibold text-lg text-white mb-4">Emergency Contacts</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-3 rounded-lg card-hover-lift smooth-hover" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-white">Coast Guard: 1554</span>
              <span className="ml-auto text-xs text-white/80">24/7</span>
            </li>
            <li className="flex items-center gap-3 p-3 rounded-lg card-hover-lift smooth-hover" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-white">Disaster Helpline: 108</span>
              <span className="ml-auto text-xs text-white/80">24/7</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Map Preview */}
      <div className="gradient-card mt-8 p-6 rounded-xl shadow bg-gradient-action-map">
        <h2 className="font-semibold text-lg text-white mb-4">Hazard Map Preview</h2>
        <MinimalHazardMap />
      </div>
    </aside>
  );
};

export default SideNav;
