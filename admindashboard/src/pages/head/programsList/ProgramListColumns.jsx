// const expertColors = {
//   Dietitian: "bg-[#FFF5ED] text-black",
//   Therapist: "bg-[#E7F9F4] text-black",
//   Trainer: "bg-[#EBF2FE] text-black",
// };

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const ProgramListColumns = [
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
  { accessorKey: "title", header: "Program Name" },
  { accessorKey: "duration", header: "Duration" },
  { header: "category",
    cell:({row})=>(
      <span className=" capitalize">
      {row.original.category?.name || "—"}
    </span>
   )
},

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
  { id: "actions", header: "Action", cell: () => "⋯" },
];
