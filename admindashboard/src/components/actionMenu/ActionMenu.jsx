import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const ActionMenu = ({ row, editActionPath, deleteActionPath }) => {
  const [activeRowId, setActiveRowId] = useState(null);
  
  const isOpen = activeRowId === row.id;
  const navigate = useNavigate();
  

  const handelEdit = (id) => {
    setActiveRowId(false);
    if (editActionPath) {
      navigate(`${editActionPath}${id}`);
    }
  };

  const handelDelete = (id) => {
    setActiveRowId(false);
    if (deleteActionPath) {
      navigate(`${deleteActionPath}${id}`);
    }
  };



  return (
    <div className="relative h-3" onClick={(e) => e.stopPropagation()}>
      <button
        className="w-full  text-start pl-2"
        onClick={(e) => {
          e.stopPropagation();
          setActiveRowId(isOpen ? null : row.id);
        }}
      >
        ...
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setActiveRowId(null)}
            className="fixed  inset-0 z-30 bg-black/1.5 w-full h-screen"
          ></div>
          <div
            className="absolute z-40 rounded-lg   shadow-[0_10px_30px_rgba(0,0,0,0.25)] w-30 h-fit p-2 bg-white flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => setActiveRowId(false)}
              className="w-full flex items-center justify-end px-1"
            >
              <IoMdClose />
            </div>
            <button
              onClick={() => handelEdit(row.id)}
              className="w-full bg-[#EBF3F2] hover:bg-[#9e5608] hover:text-white p-2 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => handelDelete(row.id)}
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

export default ActionMenu;
