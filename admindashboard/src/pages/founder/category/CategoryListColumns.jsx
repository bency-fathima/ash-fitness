import ActionMenu from "@/components/actionMenu/ActionMenu";

const statusColors = {
  Published: "bg-[#45C4A2] text-white",
  Draft: "bg-[#66706D] text-white",
};

export const CategoryListColumns = () => [
  { accessorKey: "categoryName", header: "Category Name" },
  {
    accessorKey: "headNames",
    header: "Head Name",
    cell: ({ row }) => {
      const heads = row.original.headNames;

      if (!heads?.length) return "N/A";

      return heads.join(", ");
    },
  },
  { accessorKey: "adminsCount", header: "Sub Admins" },
  { accessorKey: "programsCount", header: "Programs" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "clientCount", header: "Clients" },
  {
    accessorKey: "categoryStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.categoryStatus;
      const colorClass = statusColors[status] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${colorClass}`}>
          {status}
        </span>
      );
    },
  },

  {
    id: "_id",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/founder/categories/edit/"
        deleteActionPath="/founder/categories/delete/"
      />
    ),
  },
];
