import { useNavigate } from "react-router-dom";

export const therapyColumns = [
  { accessorKey: "name", header: "Therapy Name" },
  { accessorKey: "clients", header: "No of Clients" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }) => {
  const navigate = useNavigate(); 
  const { _id, name } = row.original;

  const handleNavigation = () => {
    navigate(`/admin/therapy/plan/${_id}`, {
      state: { title: name }, 
    });
  };

  return (
    <button
      onClick={handleNavigation}
      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg
        bg-[#9e5608] text-white transition-colors"
    >
      View Plan
    </button>
  );
};
