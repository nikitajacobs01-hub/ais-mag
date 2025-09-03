"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  UserIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Users", icon: UsersIcon, path: "/dashboard/users" },
  { name: "Clients", icon: UserIcon, path: "/dashboard/clients" },
  { name: "Profile", icon: UserIcon, path: "/dashboard/profile" },
  { name: "Settings", icon: Cog6ToothIcon, path: "/dashboard/settings" },
  {
    name: "Logout",
    icon: ArrowRightOnRectangleIcon,
    path: "/dashboard/logout",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-[#021024]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#021024] text-white transition-all duration-300 z-50
        ${sidebarOpen ? "w-64" : "w-16"} overflow-hidden`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-white/20">
            <span
              className={`font-bold text-lg ${
                sidebarOpen ? "block" : "hidden"
              }`}
            >
              MyCompany
            </span>
            {!sidebarOpen && <span className="text-lg">MC</span>}
          </div>

          {/* User info */}
          <div className="flex items-center gap-2 p-4 border-b border-white/20">
            {sidebarOpen && (
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-xs text-white/70">Admin</p>
              </div>
            )}
            {!sidebarOpen && <UserIcon className="h-6 w-6" />}
          </div>

          {/* Menu */}
          <nav className="flex-1 p-2 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 p-2 rounded hover:bg-white/10 transition
                  ${isActive ? "bg-white/20" : ""}`}
                >
                  <Icon className="h-6 w-6" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ml-16 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } p-6`}
      >
        {children}
      </main>
    </div>
  );
}
