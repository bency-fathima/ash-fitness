import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

export default function ExtendPlan({ onClose }) {
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const durations = [
    "1 Week",
    "2 Weeks",
    "1 Month",
    "2 Months",
    "3 Months",
  ];

  const handleSubmit = () => {
    if (!duration) {
      toast.info("Please select a duration");
      return;
    }
    toast.success("Plan extended successfully");
    onClose();
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="space-y-2">
        <label className="text-[14px] font-medium text-gray-700">Duration</label>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full border border-gray-200 rounded-xl p-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20 text-left"
          >
            <span className={duration ? "text-gray-900" : "text-gray-400"}>
              {duration || "Select duration"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDuration(d);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-[14px] text-gray-700 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <label className="text-[14px] font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes"
          className="w-full h-48 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20 resize-none"
        />
      </div>

      <div className="space-y-3 mt-auto">
        <button
          onClick={() => onClose()}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full bg-[#9e5608] text-white py-3 rounded-xl font-medium hover:bg-[#083d38] transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}