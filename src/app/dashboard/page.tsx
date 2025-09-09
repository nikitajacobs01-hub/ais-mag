"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  UserIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

import type { SVGProps } from "react";

interface MenuItem {
  name: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>; // proper typing
  path: string;
  children?: { name: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { name: "Users", icon: UsersIcon, path: "/dashboard/users" },
  { name: "Clients", icon: UserIcon, path: "/dashboard/clients" },
  {
    name: "Accidents",
    icon: LinkIcon,
    path: "/dashboard/accident",
    children: [
      { name: "Create Accident", path: "/dashboard/accident/create" },
      { name: "View Accidents", path: "/dashboard/accident" },
    ],
  },
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
  const [accidentOpen, setAccidentOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-[#021024]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#021024] text-white z-50 transition-all duration-300
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

          {/* User Info */}
          <div className="flex items-center gap-2 p-4 border-b border-white/20">
            {sidebarOpen ? (
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-xs text-white/70">Admin</p>
              </div>
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 p-2 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                pathname.startsWith(item.path + "/") ||
                (item.children &&
                  item.children.some((c) => pathname.startsWith(c.path)));

              if (item.children) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => setAccidentOpen(!accidentOpen)}
                      className={`flex items-center gap-3 p-2 rounded w-full text-left hover:bg-white/10 transition
                        ${isActive ? "bg-white/20" : ""}`}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <Icon className="h-6 w-6" />
                      {sidebarOpen && <span>{item.name}</span>}
                      {sidebarOpen && (
                        <span className="ml-auto">
                          {accidentOpen ? "▾" : "▸"}
                        </span>
                      )}
                    </button>
                    {accidentOpen && sidebarOpen && (
                      <div className="ml-8 flex flex-col space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.path}
                            className={`flex items-center gap-2 p-2 rounded hover:bg-white/10 transition
                              ${
                                pathname === child.path
                                  ? "bg-white/30 font-semibold"
                                  : ""
                              }`}
                          >
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 p-2 rounded hover:bg-white/10 transition
                    ${isActive ? "bg-white/20" : ""}`}
                  title={!sidebarOpen ? item.name : undefined}
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
        className={`flex-1 transition-all duration-300 p-6 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
