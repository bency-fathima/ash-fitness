
const formatINR = (amount) => `₹ ${amount.toLocaleString("en-IN")}`;

export const FinanceColumns = [
  { accessorKey: "monthYear", header: "Month" },
  {
    accessorKey: "baseSalary",
    header: "Base Salary",
    cell: ({ row }) => formatINR(row.original.baseSalary),
  },
  {
    accessorKey: "extraClientIncentive",
    header: "Extra Client Incentive",
    cell: ({ row }) => formatINR(row.original.extraClientIncentive),
  },
  {
    accessorKey: "ratingIncentive",
    header: "Rating Incentive",
    cell: ({ row }) => formatINR(row.original.ratingIncentive),
  },
  {
    accessorKey: "incentive",
    header: "Total Incentives ",
    cell: ({ row }) => formatINR(row.original.incentive),
  },
  {
    accessorKey: "netSalary",
    header: "Net Salary ",
    cell: ({ row }) => formatINR(row.original.netSalary),
  },
];
