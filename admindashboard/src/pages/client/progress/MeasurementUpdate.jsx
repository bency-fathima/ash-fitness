import { useDispatch } from "react-redux";
import { updateMeasurementOfClient } from "../../../redux/features/client/client.thunk";
import { useState } from "react";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { toast } from "react-toastify";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";

export default function MeasurementUpdate({ onClose }) {
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const user = useAppSelector(selectUser);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    if (!chest || !waist || !hip) {
      toast.info("Please fill all fields");
      return;
    }

    try {
      await dispatch(
        updateMeasurementOfClient({
          id: user?._id,
          chest: Number(chest),
          waist: Number(waist),
          hip: Number(hip),
        })
      ).unwrap();

      toast.success("Measurements updated successfully");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update measurements");
    }finally{
      dispatch(refreshProfile({id: user?._id, role: user.role})) 
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="space-y-2">
        <label className="text-[14px] font-medium text-gray-700">Chest</label>
        <input
          placeholder="Add chest (cm)"
          className="w-full border focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20 border-gray-200 p-3 rounded-xl"
          value={chest}
          onChange={(e) => setChest(e.target.value)}
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-medium text-gray-700">Waist</label>
        <input
          placeholder="Add waist (cm)"
          className="w-full border focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20 border-gray-200 p-3 rounded-xl"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-medium text-gray-700">Hips</label>
        <input
          placeholder="Add hips (cm)"
          className="w-full border focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20 border-gray-200 p-3 rounded-xl"
          value={hip}
          onChange={(e) => setHip(e.target.value)}
          type="number"
        />
      </div>

      <div className="space-y-3 mt-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#9e5608] text-white py-3 rounded-xl font-medium hover:bg-[#083d38] transition-colors"
        >
          Save & Update
        </button>
      </div>
    </div>
  );
}
