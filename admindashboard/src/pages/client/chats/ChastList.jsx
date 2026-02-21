import { Bell, Menu, Search, Settings } from "lucide-react";
import React, { useState } from "react";

const ChastList = ({
  clients,
  chatClient,
  client,
  onlineUsers = [],
  unreadCounts = {},
}) => {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

 
  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-[#9e5608] text-xl font-semibold">fitness</h1>
        <div className="flex items-center gap-2">
          <button className="p-2">
            <Bell size={20} className="text-gray-700" />
          </button>
          <button className="p-2">
            <Menu size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto">
        {filteredClients.map((chat, idx) => {
          const unreadCount = unreadCounts[chat?._id] || 0;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition rounded-lg ${
                client?._id === chat?._id ? "bg-gray-200" : ""
              }`}
              onClick={() => chatClient(chat)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {chat?.name?.split(" ")?.[0]?.[0]}
                  {chat?.name?.split(" ")?.[1]?.[0]}
                </div>
                {onlineUsers.includes(chat?._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[#9e5608] font-medium text-sm truncate">
                  {chat.name}
                </h3>
                <p className="text-xs capitalize">{chat?.role}</p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="bg-[#2D7A6D] text-white text-[10px] font-semibold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChastList;
