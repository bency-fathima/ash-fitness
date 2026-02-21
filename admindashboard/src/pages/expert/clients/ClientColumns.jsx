import HabitStartButton from "../habit/HabitStartButton";

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const getClientColumns = (role, navigate) => {
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="w-3 h-3 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-3 h-3 cursor-pointer"
        />
      ),
    },
    { accessorKey: "name", header: "Client Name" },
    { accessorKey: "duration", header: "Duration" },
    { accessorKey: "programStartDate", header: "Start Date" },
    { accessorKey: "programEndDate", header: "End Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass = statusColors[status] || "bg-gray-200 text-gray-700";

        return (
          <span className={`px-2 py-1 text-[11px] rounded-xl ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
  ];

  if (role === "therapist") {
    columns.push({
      accessorKey: "habitTracker",
      header: "Habit Plan",
      cell: ({ row }) => {
        const client = row.original;
        const habitId=client.habitId

        const hasPlan =
          !!client.hasHabitPlan ||
          (Array.isArray(client.habits) && client.habits.length > 0);

        if (hasPlan) {
          return (
            <button
              onClick={(e) =>{e.stopPropagation();  navigate(`/expert/clients/habit/${habitId}`)}}
              className="px-3 py-1 text-white rounded-full bg-[#9e5608] text-blue-700"
            >
              View Plan
            </button>
          );
        }

        return <HabitStartButton clientId={client?._id} />;
      },
    });
  }

  columns.push({
    id: "actions",
    header: "Action",
    cell: () => "⋯",
  });

  return columns;
};
