import {
  selectBroadcast,
  selectBroadcastError,
  selectBroadcastStatus,
} from "@/redux/features/broadcast/broadcast.selector";
import { getBroadcast } from "@/redux/features/broadcast/broadcast.thunk";
import { BsFileEarmarkText } from "react-icons/bs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";


const TemplateSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const broadcast = useSelector(selectBroadcast);
  const status = useSelector(selectBroadcastStatus);
  const error = useSelector(selectBroadcastError);

  useEffect(() => {
    if (id) {
      dispatch(getBroadcast(id));
    }
  }, [id, dispatch]);

  const fileExt = broadcast?.attachment?.split(".").pop()?.toUpperCase();

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}!</p>;

  return (
    <div className="h-[calc(100vh-130px)] pb-4 overflow-auto no-scrollbar">
      <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-between gap-7 w-full lg:w-[50%] mb-5">
        {/* header */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[16px] text-[#9e5608] font-bold">
            Broadcast Summary
          </h1>
        </div>
        {/* content */}
        <div className="w-full flex flex-col items-center justify-between gap-6">
          <div className="w-full flex flex-col items-start gap-2 pb-6 border-b border-b-[#DBDEDD]">
            <p className="text-[#66706D] text-[12px]">Broadcast Title</p>
            <p className="text-[#000000] text-[12px]">{broadcast?.title}</p>
          </div>
          <div className="w-full flex flex-col items-start gap-2 pb-6 border-b border-b-[#DBDEDD]">
            <p className="text-[#66706D] text-[12px]">Broadcast Type</p>
            <p className="text-[#000000] text-[12px]">{broadcast?.type}</p>
          </div>
          <div className="w-full flex flex-col items-start gap-2 pb-6 border-b border-b-[#DBDEDD]">
            <p className="text-[#66706D] text-[12px]">Broadcast Message</p>
            <div>
              <p className="text-[#000000] text-[12px] wrap-break-word whitespace-pre-wrap">
                {broadcast?.message}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-2 pb-6 ">
            <p className="text-[#66706D] text-[12px]">Attachments</p>
            <div className="flex items-center flex-wrap  gap-2 w-full">
              {broadcast?.attachment ? (
                <div className="p-4 bg-[#F8F8F8] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#F4DBC7] rounded-md">
                      <BsFileEarmarkText size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[12px] line-clamp-1">
                        {broadcast?.attachment.split("/").pop()}
                      </p>
                      <div className="flex gap-1 items-center">
                        <span className="p-0.5 bg-[#DBDEDD] rounded-full"></span>
                        <p className="text-[#66706D] text-[11px]">{fileExt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[#000000] text-[12px]">
                  Attachment not added
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="h-px bg-gray-200 w-full mt-2"></div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/founder/broadcasts")}
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#EBF3F2] text-[#9e5608]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#9e5608] text-white hover:bg-[#073a35] shadow-sm"
          >
            Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSummary;
