
const formatINR = (amount) =>
  `₹${amount.toLocaleString("en-IN")}`;


export const FinanceColumns = [
  { accessorKey: "monthYear", header: "Month" },
  {
    accessorKey: "baseSalary",
    header: "Base Salary",
    cell: ({ row }) => formatINR(row.original.baseSalary),
  },
  
  {
    accessorKey: "incentive",
    header: "Incentives ",
    cell: () => "N/A",
  },
  {
    accessorKey: "netSalary",
    header: "Net Salary ",
    cell: ({ row }) => formatINR(row.original.netSalary),
  },
];
