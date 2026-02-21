import ActionMenu from "@/components/actionMenu/ActionMenu";

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const therapyColumns = () => [
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
  { accessorKey: "headName", header: "Head Name" },
  { accessorKey: "categoryName", header: "Assigned Category" },
  { accessorKey: "programCount", header: "Programs" },
  { accessorKey: "adminCount", header: "Sub Admins" },
  { accessorKey: "coachCount", header: "Experts" },
  { accessorKey: "userCount", header: "Clients" },
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
  {
    id: "actions",
    header: "actions",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/founder/heads/edit/"
        deleteActionPath="/founder/heads/delete/"
      />
    ),
  },
];
