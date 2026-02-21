import React, { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Templates = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = [
    "All",
    "Welcome",
    "Motivation",
    "Progress",
    "Tips",
    "Promotional",
  ];

  const templates = [
    {
      id: 1,
      title: "Upgrade Your Plan",
      category: "Promotional",
      content: "Upgrade from **30 Days → 60 Days** and get...",
    },
    {
      id: 2,
      title: "Upgrade Your Plan",
      category: "Promotional",
      content: "Upgrade from **30 Days → 60 Days** and get...",
    },
    {
      id: 3,
      title: "Upgrade Your Plan",
      category: "Promotional",
      content: "Upgrade from **30 Days → 60 Days** and get...",
    },
    {
      id: 4,
      title: "Upgrade Your Plan",
      category: "Promotional",
      content: "Upgrade from **30 Days → 60 Days** and get...",
    },
    {
      id: 5,
      title: "Upgrade Your Plan",
      category: "Promotional",
      content: "Upgrade from **30 Days → 60 Days** and get...",
    },
    {
      id: 6,
      title: "Upgrade Your Plan",
      category: "Promotional",
      content: "Upgrade from **30 Days → 60 Days** and get...",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden h-full">
      {/* Header & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-[#9e5608]">Templates</h1>
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-[#9e5608] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Templates"
            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm w-72 focus:outline-none focus:ring-1 focus:ring-[#9e5608]"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl p-6 flex flex-col gap-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] relative"
            >
              <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-[#9e5608]">
                  {template.title}
                </h3>
                <span className="text-xs text-[#66706D] font-medium">
                  {template.category}
                </span>
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-semibold text-gray-800">
                    Level Up Your Health Journey!
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {template.content
                    .split("**")
                    .map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                </p>
              </div>

              <div className="flex justify-end mt-1">
                <button className="bg-[#9e5608] text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-[#073a35] transition-colors shadow-sm">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 mt-auto">
        <div className="flex items-center gap-3 text-sm text-[#66706D] font-medium">
          <span>Show</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg cursor-pointer">
            <span>8</span>
            <ChevronLeft className="w-3.5 h-3.5 rotate-270" />
          </div>
          <span>of 82 results</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#9e5608] text-white text-sm font-bold">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors">
            3
          </button>
          <span className="px-1 text-gray-400 font-bold">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors">
            11
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Templates;
