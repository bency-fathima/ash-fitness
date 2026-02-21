const expertColors = {
  Dietitian: "bg-[#FFF5ED] text-black",
  Therapist: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
};

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const ExpertColumns = [
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
  { accessorKey: "name", header: "Expert Name" },
   { accessorKey: "role", header: "Role",
    cell:({row})=>{
        const role=row.original.role
        const expertColor=expertColors[role] || "bg-gray-200 text-gray-700"

        return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${expertColor}`}>
          {role}
        </span>
      );

    }
   },
     { accessorKey: "specialization", header: "Specialisation" },

  { accessorKey: "clients", header: "Clients" ,
    cell:({row})=>{
      const clients=row.original.assignedUsers.length
      return clients
    }
  },
  { accessorKey: "maxClient", header: "Maximum Limit" },
  {
    accessorKey: "feedback",
    header: "Rating",
    cell: ({ row }) => {
      const feedback = row.original.feedback;
      return feedback && feedback.length > 0
        ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
        : 0;
    },
  },
  { accessorKey: "responseTime", header: "Response Time" },

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
