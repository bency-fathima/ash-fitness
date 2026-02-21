import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWeeklyHabitSummaryThunk } from "@/redux/features/habit/habit.thunk";

export default function WeeklyHabit() {
  const dispatch = useDispatch();

  const { weeklySummary, loading } = useSelector(
    (state) => state.habit
  );

  useEffect(() => {
    dispatch(getWeeklyHabitSummaryThunk());
  }, [dispatch]);

  if (loading) return <p>Loading weekly summary...</p>;
  if(!weeklySummary || weeklySummary.length === 0){
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 text-center">  
        <h2 className="text-md font-bold mb-2 text-[#9e5608]">
            Weekly Habit Summary
        </h2>
        <p className="text-gray-400 text-md italic">
            No habit progress available for this week.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">
        Weekly Habit Compliance
      </h2>

      {weeklySummary.map((client) => (
        <div
          key={client.clientId}
          className="mb-4 p-4 border-gray-200 border rounded-lg"
        >
          <p className="font-semibold">
            {client.clientName}
          </p>

          <p className="text-sm text-gray-600">
            {client.done} / {client.total} completed
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className={`h-3 rounded-full ${
                client.percentage >= 70
                  ? "bg-green-500"
                  : client.percentage >= 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${client.percentage}%`,
              }}
            ></div>
          </div>

          <p className="text-xs mt-1">
            {client.percentage}%
          </p>
        </div>
      ))}
    </div>
  );
}
