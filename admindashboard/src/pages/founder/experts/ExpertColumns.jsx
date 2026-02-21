const expertColors = {
  Dietician: "bg-[#FFF5ED] text-black",
  Therapist: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
};

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const ExpertColumns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <input
  //       type="checkbox"
  //       checked={table.getIsAllRowsSelected()}
  //       onChange={table.getToggleAllRowsSelectedHandler()}
  //       className="w-3 h-3 cursor-pointer"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <input
  //       type="checkbox"
  //       checked={row.getIsSelected()}
  //       onChange={row.getToggleSelectedHandler()}
  //       className="w-3 h-3 cursor-pointer"
  //     />
  //   ),
  // },
  { accessorKey: "coachName", header: "Expert Name" },
  { accessorKey: "headName", header: "Head Name" },
  { accessorKey: "adminName", header: "Admin Name" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-md ${expertColor}`}>
          {role}
        </span>
      );
    },
  },
  { accessorKey: "clientCount", header: "Clients" },

  // { accessorKey: "clients", header: "Clients" },
  { accessorKey: "maxClientLimit", header: "Maximum Limit" },
  { accessorKey: "avgRating", header: "Rating" },

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
  // { id: "actions", header: "Action", cell: () => "⋯" },
];
