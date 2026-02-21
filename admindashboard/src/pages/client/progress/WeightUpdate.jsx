import { selectUser } from "@/redux/features/auth/auth.selectores";
import { updateWeightOfClient } from "@/redux/features/client/client.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function WeightUpdate({ onClose }) {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const [weight, setWeight] = useState("");


  const handleSubmit = async () => {
    if (!weight) {
      toast.info("Please enter weight");
      return;
    }

    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    try {
      await dispatch(
        updateWeightOfClient({
          id: user?._id,
          currentWeight: Number(weight),
        })
      ).unwrap();
      toast.success("Weight updated successfully");
      if (onClose) onClose();
    } catch (err) {
      toast.error("Failed to update weight");
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="space-y-2">
        <label className="text-[14px] font-medium text-gray-700">
          Current Weight
        </label>
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          type="number"
          placeholder="Add weight (kg)"
          className="w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20 p-3"
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
