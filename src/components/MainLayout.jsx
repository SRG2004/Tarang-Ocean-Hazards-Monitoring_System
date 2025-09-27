import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

export default function MainLayout({ user }) {
  return (
    <div className="flex min-h-screen bg-gradient-muted">
      <SideNav userRole={user?.role} user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
