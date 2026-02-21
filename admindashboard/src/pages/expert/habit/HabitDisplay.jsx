import { getClientHabitByHabitId } from "@/redux/features/habit/habit.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function HabitDisplay() {
  const { habitId } = useParams();
  const dispatch = useDispatch();

  const { habitDetails, loading, error } = useSelector(
    (state) => state.habit   
  );

  useEffect(() => {
    if (habitId) {
      dispatch(getClientHabitByHabitId(habitId));
    }
  }, [habitId, dispatch]);
 
  if (loading) return <p>Loading habit plan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!habitDetails) return <p>No habit plan found</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#9e5608]">Habit Plan</h2>

      <div className="space-y-3">
        {habitDetails.habits.map((habit, index) => (
          <div
            key={habit?._id}
            className="p-3 border bg-white border-gray-200 rounded-lg flex justify-between"
          >
            <span>
              {index + 1}. {habit.name}
            </span>
            {/* <span className="text-sm text-gray-500">
              Logs: {habit.logs.length}
            </span> */}
          </div>
        ))}
      </div>
    </div>
  );
}
