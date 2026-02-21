import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const BroadcastMenu = ({ data }) => {
  const [activeRowId, setActiveRowId] = useState(null);

  const isOpen = activeRowId === data._id;
  const navigate = useNavigate();

  const handelEdit = (id) => {
    setActiveRowId(false);
      navigate(`/founder/broadcasts/edit/${id}`);
  };

  const handelDelete = (id) => {
    setActiveRowId(false);
    navigate(`/founder/broadcasts/delete/${id}`);
  };

  return (
    <div className="relative h-3" onClick={(e) => e.stopPropagation()}>
      <button
        className="w-full  text-gray-400 hover:text-gray-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setActiveRowId(isOpen ? null : data?._id);
        }}
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setActiveRowId(null)}
            className="fixed  inset-0 z-30 bg-black/1.5 w-full h-screen"
          ></div>
          <div
            className="absolute -right-1 top-2 z-40 rounded-lg   shadow-[0_10px_30px_rgba(0,0,0,0.25)] w-30 h-fit p-2 bg-white flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => setActiveRowId(false)}
              className="w-full flex items-center justify-end px-1"
            >
              <IoMdClose />
            </div>
            <button
              onClick={() => handelEdit(data?._id)}
              className="w-full bg-[#EBF3F2] hover:bg-[#9e5608] hover:text-white p-2 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => handelDelete(data?._id)}
              className=" w-full bg-[#EBF3F2] hover:bg-red-600 hover:text-white p-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BroadcastMenu