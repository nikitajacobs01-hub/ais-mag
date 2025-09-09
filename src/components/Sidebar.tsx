"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  UserIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Users", icon: UsersIcon, path: "/dashboard/users" },
  {
    name: "Clients",
    icon: UsersIcon,
    path: "/dashboard/clients",
    submenu: [
      { name: "Create Client", path: "/dashboard/clients/create" },
      { name: "View All Clients", path: "/dashboard/clients/list" },
    ],
  },
  {
    name: "Accidents",
    icon: LinkIcon,
    path: "/dashboard/accident",
    submenu: [
      { name: "View All", path: "/dashboard/accident" },
      { name: "Create / Send Link", path: "/dashboard/accident/create" },
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [accidentsOpen, setAccidentsOpen] = useState(false);

  useEffect(() => {
    setClientsOpen(pathname.startsWith("/dashboard/clients"));
    setAccidentsOpen(pathname.startsWith("/dashboard/accident"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#021024] text-white transition-all duration-300 z-50
        ${sidebarOpen ? "w-80" : "w-20"} overflow-hidden`}
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-white/20">
          <span
            className={`font-bold text-lg ${sidebarOpen ? "block" : "hidden"}`}
          >
            Advanced Intelligence
          </span>
          {!sidebarOpen && <span className="text-lg">AIS</span>}
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
            const isActive = pathname.startsWith(item.path);

            if (item.name === "Logout") {
              return (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-2 w-full rounded hover:bg-white/10 transition"
                >
                  <Icon className="h-6 w-6" />
                  {sidebarOpen && <span>{item.name}</span>}
                </button>
              );
            }

            if (item.submenu) {
              const openState =
                item.name === "Clients" ? clientsOpen : accidentsOpen;
              const setOpenState =
                item.name === "Clients" ? setClientsOpen : setAccidentsOpen;

              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenState(!openState)}
                    className={`flex items-center gap-3 p-2 w-full rounded hover:bg-white/10 transition
                      ${isActive ? "bg-white/20" : ""}`}
                  >
                    <Icon className="h-6 w-6" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </button>
                  {openState && sidebarOpen && (
                    <div className="ml-8 flex flex-col space-y-1 mt-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className={`p-2 rounded hover:bg-white/20 transition
                            ${pathname === sub.path ? "bg-white/20" : ""}`}
                        >
                          {sub.name}
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
              >
                <Icon className="h-6 w-6" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
