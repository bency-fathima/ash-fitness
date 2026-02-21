import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientHabitsThunk } from "@/redux/features/habit/habit.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import HabitRow from "./HabitRow";
import { IoClose } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

export default function HabitTracker() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const clientId = user?._id;

  const { habits, loading } = useSelector((state) => state.habit);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientHabitsThunk(clientId));
    }
  }, [clientId, dispatch]);

  if (loading) return <p>Loading habits...</p>;
  if (!habits || !habits.habits?.length)
    return <p>No habits assigned</p>;

  // ✅ Calculate today's status
  const today = new Date().toDateString();

  const doneCount = habits.habits.filter((habit) => {
    const todayLog = habit.logs.find(
      (log) => new Date(log.date).toDateString() === today
    );
    return todayLog?.status === "done";
  }).length;

  const missedCount = habits.habits.length - doneCount;

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-[#9e5608]">
        Daily Habit Tracker
      </h2>

      <table className="w-full border-gray-200 border rounded-xl">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 text-[#9e5608]">
              Habit
            </th>
            <th className="text-center p-2">
              Today
            </th>
          </tr>
        </thead>

        <tbody>
          {habits.habits.map((habit) => (
            <HabitRow
              key={habit._id}    
              habit={habit}
              clientId={clientId}
            />
          ))}
        </tbody>
      </table>

       <div className="mt-4 flex justify-between bg-gray-100 p-3 rounded">
        <p className="text-green-600 font-semibold flex">
        <TiTick  className="text-2xl"/> Done: {doneCount}
        </p>

        <p className="text-red-500 font-semibold flex ">
         <IoClose className="text-2xl"/> Missed: {missedCount}
        </p>
      </div>
    </div>
  );
}
