import { deleteProgram } from '@/redux/features/program/program.thunk';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProgramDeletePopUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProgram({ id })).unwrap();
      toast.success("program deleted successfully");
      navigate("/founder/programs");
    } catch (error) {
      setErrorMessage(error.message)
      toast.error(error.message);
    }
  };
  return (
    <>
      {/* Modal */}
      <div className="relative flex items-center justify-center w-full h-[calc(100vh-120px)]">
        {/* Overlay */}
        <div
          className="fixed inset-0 z-30 bg-black/5 w-full h-screen"
          onClick={() => navigate(-1)}
        ></div>
        <div className="absolute z-40 bg-white rounded-lg w-80 p-5 shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Delete program?</h3>

          <p className="text-sm text-gray-600 mb-4">
            {errorMessage ? errorMessage : "This action cannot be undone."}
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded bg-[#EBF3F2]"
            >
              Cancel
            </button>

            {!errorMessage && (
              <button
                onClick={() => handleDelete()}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProgramDeletePopUp