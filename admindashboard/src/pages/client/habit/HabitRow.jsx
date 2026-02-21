import { useDispatch } from "react-redux";
import { updateHabitStatusThunk } from "@/redux/features/habit/habit.thunk";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

export default function HabitRow({ habit, clientId }) {
  const dispatch = useDispatch();

  const today = new Date().toDateString();

  const todayLog = habit.logs.find(
    (log) => new Date(log.date).toDateString() === today,
  );

  const todayStatus = todayLog?.status;

  const handleUpdate = () => {
    const newStatus = todayStatus === "done" ? "missed" : "done";

    dispatch(
      updateHabitStatusThunk({
        clientId,
        habitId: habit._id,
        status: newStatus,
      }),
    );
  };

  return (
    <tr className="border-t border-gray-200">
      <td className="p-2 capitalize text-sm font-medium">{habit.name}</td>

      <td className="p-2 text-center">
        <button
          onClick={handleUpdate}
          className={`w-8 h-8 rounded-full text-3xl font-bold
    ${todayStatus === "done" ? "text-green-600" : "text-red-600"}`}
        >
          {todayStatus === "done" ? <TiTick /> : <IoClose />}
        </button>
      </td>
    </tr>
  );
}
