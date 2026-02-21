import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateClientStatus } from "@/redux/features/client/client.thunk";
import { IoIosArrowDown } from "react-icons/io";

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
  Completed: "bg-blue-500 text-white",
};

const StatusCell = ({ row, onRefresh }) => {
  const dispatch = useDispatch();
  const currentStatus = row.original.status;
  const clientId = row.original._id;
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      await dispatch(
        updateClientStatus({ id: clientId, status: newStatus }),
      ).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const colorClass = statusColors[currentStatus] || "bg-gray-200 text-gray-700";

  return (
    <div className="relative inline-block w-[50%]"> 
    <IoIosArrowDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white"/>
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className={`appearance-none w-full px-2 py-1 text-[11px] rounded-xl outline-none cursor-pointer text-center font-medium ${colorClass} border-none focus:ring-0 disabled:opacity-50`}
        style={{ textAlignLast: "center" }}
      >
        <option value="Active" className="bg-white text-black">
          Active
        </option>
        <option value="Inactive" className="bg-white text-black">
          Inactive
        </option>
      </select>
    </div>
  );
};

export default StatusCell;
