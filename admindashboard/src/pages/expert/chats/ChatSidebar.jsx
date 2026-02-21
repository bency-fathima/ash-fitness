import { MessageCircle, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { LuSend } from "react-icons/lu";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export default function ChatSidebar({
  clients,
  handleSideTabs,
  sideTab,
})  {
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const handleBroadcastToggle = () => {
    handleSideTabs("Broadcast");
    setIsBroadcastOpen(!isBroadcastOpen);
  };

  return (
    <div className="w-60 bg-white  flex flex-col rounded-lg ">
      <div className="p-4 ">
        <h2 className="text-gray-500 text-xs font-medium mb-4 px-2">
          Category
        </h2>

        {/* Sidebar Items */}
        <div className="space-y-1 ">
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${
              sideTab === "Chats" ? "bg-green-100/70" : ""
            }`}
            onClick={() => handleSideTabs("Chats")}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-gray-600" />
              <span className="text-gray-800 text-sm font-medium">Chats</span>
            </div>
            <span className="bg-[#2D7A6D] text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
              {clients.length}
            </span>
          </div>

          <div>
            <div
              className={`flex items-center gap-3 px-3 py-2.5 justify-between rounded-lg cursor-pointer ${
                sideTab === "Broadcast"
                  ? "bg-green-100/70"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={handleBroadcastToggle}
            >
              <div className="flex gap-3">
                <LuSend size={18} />
                <span className="text-sm font-medium">Broadcast</span>
              </div>
              <MdOutlineKeyboardArrowDown
                className={`w-4 h-4 transition-transform ${
                  isBroadcastOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isBroadcastOpen && (
              <div className="ml-9 mt-1 space-y-1">
                <div
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                    sideTab === "Templates"
                      ? "bg-green-100/70 text-[#9e5608] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSideTabs("Templates")}
                >
                  Templates
                </div>
                <div
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                    sideTab === "Create Broadcast"
                      ? "bg-green-100/70 text-[#9e5608] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSideTabs("Create Broadcast")}
                >
                  Add New
                </div>
              </div>
            )}
          </div>

          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
              sideTab === "Auto Reminders"
                ? "bg-green-100/70"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleSideTabs("Auto Reminders")}
          >
            <MessageCircle size={18} />
            <span className="text-sm font-medium">Auto Reminders</span>
          </div>

          {/* <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
              sideTab === "Delivery Logs"
                ? "bg-green-100/70"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleSideTabs("Delivery Logs")}
          >
            <MdOutlineFindInPage size={18} />
            <span className="text-sm font-medium">Delivery Logs</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

