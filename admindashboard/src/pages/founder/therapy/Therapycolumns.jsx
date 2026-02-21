import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteTherapyPlan } from "@/redux/features/therapy/therapy.thunk";
import { toast } from "react-toastify";

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
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const { _id, name, clients } = row.original;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    navigate(`/founder/therapy/edit/${_id}`);
  };

  const handleView = () => {
    setIsOpen(false);
    navigate(`/founder/therapy/plan/${_id}`, {
      state: { title: name },
    });
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    if (clients > 0) {
      toast.error("Cannot delete therapy plan with assigned clients.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteTherapyPlan(_id)).unwrap();
      toast.success("Therapy plan deleted successfully");
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error(error || "Failed to delete therapy plan");
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
            <button
              onClick={handleView}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye size={14} />
              View Plan
            </button>

            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>

            {clients === 0 && (
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl transform transition-all scale-100">
            <h3 className="text-lg font-bold text-[#9e5608] mb-2">
              Delete Therapy Plan?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-bold">{name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
