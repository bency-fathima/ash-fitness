import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";
import { X } from "lucide-react";


const menuItems = [
  {
    label: "Dashboard",
    icon: assets.dashboard,
    path: "/head",
  },
  { label: "Programs", icon: assets.programs, path: "/head/programs" },
  { label: "Therapy", icon: assets.therapy, path: "/head/therapy" },
  { label: "Admins", icon: assets.admin, path: "/head/admins" },
  { label: "Experts", icon: assets.experts, path: "/head/experts" },
  { label: "Clients", icon: assets.clients, path: "/head/clients" },
  { label: "Finance", icon: assets.finance, path: "/head/finance" },

];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        <div className="flex items-center justify-between lg:justify-center mb-8 px-2">
          <h1 className="text-2xl">
            <img src={assets.logo} className="text-[#66706D] h-[60px] cursor-pointer" alt="Logo" onClick={()=>navigate("/head")}/>
          </h1>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.label}
              end={item.path === "/head"}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center text-[#66706D] gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition
      ${
        isActive ? "bg-[#9e5608] text-white" : "text-gray-600 hover:bg-gray-100"
      }
    `
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icon}
                    className={`w-5 h-5 object-contain transition-all ${
                      isActive ? "brightness-0 invert" : "grayscale opacity-70"
                    }`}
                    alt={item.label}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mt-auto font-medium text-[#66706D] px-4 py-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
        >
          <img src={assets.signout} className="w-5 h-5" alt="Logout" />
          <h1 className="">Logout</h1>
        </button>
      </aside>
    </>
  );
}
