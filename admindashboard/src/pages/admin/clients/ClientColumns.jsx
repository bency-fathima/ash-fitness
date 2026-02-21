// const expertColors={
//   Dietitian:"bg-[#FFF5ED] text-black",
//   Therapist:"bg-[#E7F9F4] text-black",
//   Trainer:"bg-[#EBF2FE] text-black"
// }

import ActionMenu from "@/components/actionMenu/ActionMenu";
import React from "react";
import StatusCell from "./StatusCell";

export const getClientColumns = (onRefresh) => [
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
    cell: ({ row }) => <StatusCell row={row} onRefresh={onRefresh} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/admin/clients/edit/"
        deleteActionPath="/admin/clients/delete/"
      />
    ),
  },
];
