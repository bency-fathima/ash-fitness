import React from "react";
import { ChevronDown } from "lucide-react";

const CreateBroadcast = ({ onCancel }) => {
  return (
    <div className="flex-1 flex flex-col gap-6 h-full">
      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#9e5608]">Create Broadcast</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Broadcast Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Broadcast Title
            </label>
            <input
              type="text"
              placeholder="Enter broadcast title"
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608] focus:border-[#9e5608] transition-all"
            />
          </div>

          {/* Broadcast Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Broadcast Type
            </label>
            <div className="relative">
              <select className="appearance-none w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608] focus:border-[#9e5608] transition-all cursor-pointer">
                <option>Promotional</option>
                <option>Welcome</option>
                <option>Motivation</option>
                <option>Progress</option>
                <option>Tips</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Message Body
          </label>
          <textarea
            placeholder="Write your message here..."
            rows={6}
            className="px-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608] focus:border-[#9e5608] transition-all resize-none"
          ></textarea>
        </div>

        {/* Attachments */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Attachments
          </label>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button className="px-6 py-3 bg-[#F0F0F0] text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors border-r border-gray-200">
              Upload File
            </button>
            <span className="px-4 text-sm text-gray-400 italic">
              Upload Image (jpg/png) or PDF
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions Area */}
      <div className="flex flex-col gap-6">
        <div className="h-[1px] bg-gray-200 w-full mt-2"></div>

        <div className="flex items-center justify-between">
          <button className="text-[#9e5608] font-bold text-sm hover:underline transition-all">
            Save as Draft
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#EBF3F2] text-[#9e5608] hover:bg-green-100 transition-colors"
            >
              Cancel
            </button>
            <button className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#9e5608] text-white hover:bg-[#073a35] transition-colors shadow-sm">
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBroadcast;
