import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";
import { useState } from "react";
import { X } from "lucide-react";
import { LuSend } from "react-icons/lu";

const menuItems = [
  {
    label: "Dashboard",
    icon: assets.dashboard,
    path: "/founder",
  },
  { label: "Heads", icon: assets.head, path: "/founder/heads" },
  { label: "Admins", icon: assets.admin, path: "/founder/admins" },
  { label: "Experts", icon: assets.experts, path: "/founder/experts" },
  { label: "Clients", icon: assets.clients, path: "/founder/clients" },
  {
    label: "Programs",
    icon: assets.programs,
    children: [
      {
        label: "Categories",
        path: "/founder/categories",
      },
      {
        label: "Programs",
        path: "/founder/programs",
      },
    ],
  },
  { label: "Therapy", icon: assets.therapy, path: "/founder/therapy" },
  { label: "Finance", icon: assets.finance, path: "/founder/finance" },
  {
    label: "Broadcast",
    icon: assets.broadCast,
    children: [
      {
        label: "Templates",
        path: "/founder/broadcasts",
      },
      {
        label: "Add New",
        path: "/founder/broadcast/add-Template",
      },
      {
        label: "Auto Reminders",
        path: "/founder/auto-remainder",
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`
    fixed lg:static inset-y-0 left-0 z-50
    w-[225px] bg-white py-6 px-5 flex flex-col h-screen
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    border-r lg:border-none
  `}
      >
        {/* Logo and Mobile Close */}
        <div className="flex items-center justify-between lg:justify-center mb-8 px-2">
          <div className="flex justify-center">
            <img src={assets.logo} alt="logo" className="h-[60px]  cursor-pointer" onClick={() => navigate("/founder")} />
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isOpen = openMenu === item.label;

            return (
              <div key={item.label}>
                {/* Parent Menu */}
                {item.children ? (
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-300 text-[#66706D] hover:bg-gray-100
                    ${isOpen && "bg-gray-100"}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.icon} className="w-5 h-5" />
                      {item.label}
                    </div>

                    <img
                      src={assets.downVector}
                      className={`w-3 transition-transform duration-300 ${
                        !isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === "/founder"}
                    onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-300 
                    ${
                      isActive
                        ? "bg-[#9e5608] text-white"
                        : "text-[#66706D] hover:bg-gray-100"
                    }`
                    }
                  >
                   {({ isActive }) => (
                    <>
                    <img src={item.icon} className={`w-5 h-5 object-contain transition-all ${
                      isActive ? "brightness-0 invert" : ""
                    }`} />
                    {item.label}
                    </>
                    )}
                  </NavLink>
                )}

                {/* Children Menu with Transition */}
                {item.children && (
                  <div
                    className={`ml-6 pl-2 border-l border-l-[#DBDEDD] overflow-hidden transition-all duration-400 ease-in-out
                    ${
                      isOpen
                        ? "max-h-40 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-col gap-2 ">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.label}
                          to={child.path}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={({ isActive }) =>
                            `px-4 py-3 rounded-lg text-sm transition-colors duration-200 text-[14px] font-semibold
                          ${
                            isActive
                              ? "bg-[#9e5608] text-white"
                              : "text-[#66706D] hover:bg-gray-100"
                          }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mt-auto px-4 py-3 text-[#66706D] font-medium hover:text-red-500 rounded-xl hover:bg-red-50 transition"
        >
          <img src={assets.signout} className="w-5 h-5" />
          Logout
        </button>
      </aside>
    </>
  );
}