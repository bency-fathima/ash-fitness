// const expertColors = {
//   Dietitian: "bg-[#FFF5ED] text-black",
//   Therapist: "bg-[#E7F9F4] text-black",
//   Trainer: "bg-[#EBF2FE] text-black",
// };

import ActionMenu from "@/components/actionMenu/ActionMenu";

const statusColors = {
  Published: "bg-[#45C4A2] text-white",
  Draft: "bg-[#66706D] text-white",
};

export const ProgramListColumns = [
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
  { accessorKey: "programTitle", header: "Program Name" },
  { accessorKey: "categoryName", header: "category" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "userCount", header: "Clients" },
  {
    accessorKey: "programStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.programStatus;
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
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/founder/programs/edit/"
        deleteActionPath="/founder/programs/delete/"
      />
    ),
  },
];
