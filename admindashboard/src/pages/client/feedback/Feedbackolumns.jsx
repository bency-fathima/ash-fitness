const expertColors = {
  Dietitian: "bg-[#FFF5ED] text-black",
  Therapist: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
};


export const feedbackColumns = [
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
  { accessorKey: "name", header: "Expert Name"  },
  { 
    accessorKey: "role", 
    header: "Role",
    cell: ({row}) => {
      const role = row.original.role
      const expertColor = expertColors[role] || "bg-gray-200 text-gray-700"
      
      return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${expertColor}`}>
          {role}
        </span>
      )
    }
  },
      
{
  accessorKey: "rating",
  header: "Rating",
  cell: ({row}) => {
    const rating = row.original.rating
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">{'★'.repeat(rating)}</span>
        <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
      </div>
    )
  }
},
{
  accessorKey: "review",
  header: "Review",
  cell: ({row}) => {
    const review = row.original.review
    return (
      <span className="text-[11px] line-clamp-2" title={review}>
        {review}
      </span>
    )
  }
},

//   {
//     accessorKey: "experts",
//     header: "Experts",
//     cell: ({ row }) => (
//       <div className="flex gap-2 flex-wrap">
//         {row.original.experts.map((exp) => {
//           const colorClass =
//             expertColors[exp] || "bg-gray-100 text-gray-700 border";

//           return (
//             <span
//               key={exp}
//               className={`px-2 py-1 text-[11px] rounded-sm ${colorClass}`}
//             >
//               {exp}
//             </span>
//           );
//         })}
//       </div>
//     ),
//   },
   { accessorKey: "date", header: "Date" },
  { id: "actions", header: "Action", cell: () => "⋯" },
];
