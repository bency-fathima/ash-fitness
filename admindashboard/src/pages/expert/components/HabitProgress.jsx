import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDailyHabitSummaryThunk,   } from "@/redux/features/habit/habit.thunk";

export default function HabitProgress() {
  const dispatch = useDispatch();

  const { dailySummary, loading } = useSelector(
    (state) => state.habit
  );

  useEffect(() => {
    dispatch(getDailyHabitSummaryThunk());
  }, [dispatch]);

  if (loading) return <p>Loading summary...</p>;
console.log(dailySummary)
  if (!dailySummary || dailySummary.length === 0) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
      <h2 className="text-md font-bold mb-2 text-[#9e5608]">
        Daily Habit Summary
      </h2>
      <p className="text-gray-400 text-md italic">
        No habit progress available for today.
      </p>
    </div>
  );
}
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-md font-bold mb-4 text-[#9e5608] ">
        Daily Habit Summary
      </h2>

      <table className="w-full   rounded-xl   ">
        <thead className="">
          <tr className="border-b border-gray-100 ">
            <th className="p-2 text-left text-gray-400   font-semibold">Client</th>
            <th className="p-2 text-center text-gray-400 font-semibold">Done</th>
            <th className="p-2 text-center text-gray-400 font-semibold">Missed</th>
            <th className="p-2 text-center text-gray-400 font-semibold">Progress</th>
          </tr>
        </thead>

        <tbody>
          {dailySummary.map((client) => (
            <tr key={client.clientId} className="border-gray-200 ">
              <td className="p-2">{client.clientName}</td>
              <td className="p-2 text-center text-[#9e5608] font-semibold">
                {client.done}
              </td>
              <td className="p-2 text-center text-red-800 font-semibold">
                {client.missed}
              </td>
              <td className="p-2">
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      client.percentage >= 70
                        ? "bg-[#9e5608]"
                        : client.percentage >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${client.percentage}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-center mt-1">
                  {client.percentage}%
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
