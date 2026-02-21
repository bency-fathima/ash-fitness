const expertColors = {
  Head: "bg-[#FFF5ED] text-black",
  Admin: "bg-[#E7F9F4] text-black",
  Expert: "bg-[#EBF2FE] text-black",
};
const formatINR = (amount) =>
  `₹ ${amount.toLocaleString("en-IN")}`;

// const statusColors = {
//   Active: "bg-[#45C4A2] text-white",
//   Inactive: "bg-[#66706D] text-white",
//   Suspended: "bg-[#FB5858] text-white",
// };

export const FinanceColumns = [
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
  { accessorKey: "name", header: "Employees Name" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-sm ${expertColor}`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "salary",
    header: "Base Salary",
    cell: ({ row }) => formatINR(row.original.salary),
  },
  {
    accessorKey: "incentives",
    header: "Incentives",
  },

  {
    accessorKey: "netSalary",
    header: "Net Salary",
    cell: ({ row }) => (
      <span className="font-semibold">{formatINR(row.original.netSalary)}</span>
    ),
  },

  {
    accessorKey: "months",
    header: "Months",
  },
  // { id: "actions", header: "Action", cell: () => "⋯" },
];
