import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect, useState } from "react";


export default function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    useEffect(() => {
    document.title = "Expert Dashboard ";
  }, []);
  return (
   <div className="flex h-screen overflow-hidden bg-gray-50 relative">
         {/* Sidebar - Handles its own mobile/desktop logic with isOpen */}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
   
         <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden min-w-0">
           <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
   
           <div className="mt-6 flex-1 overflow-auto no-scrollbar">
             <Outlet />
           </div>
         </div>
       </div>
  );
}
