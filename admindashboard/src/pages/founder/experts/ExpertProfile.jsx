import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import {
  selectCoachById,
  selectCoachError,
  selectCoachStatus,
} from "@/redux/features/coach/coach.selector";
import { getSingleCoach } from "@/redux/features/coach/coach.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const ExpertProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const expert = useSelector(selectCoachById);
  const status = useSelector(selectCoachStatus);
  const error = useSelector(selectCoachError);

  useEffect(() => {
    if (id) {
      dispatch(getSingleCoach(id));
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full h-[calc(100vh-130px)] bg-[#F8F9FA] p-2 sm:p-4 lg:p-2 ">
      {/* left sidebar - Full width on mobile, fixed width on desktop */}
      <div className="w-full lg:w-[280px] xl:w-[300px] lg:overflow-auto no-scrollbar">
        <ExpertLeftSide expert={expert} />
      </div>

      {/* center content - Full width on mobile, flex-1 on desktop */}
      <div className="w-full lg:flex-1 lg:overflow-y-auto no-scrollbar">
        <ExpertCenterSide expert={expert} />
      </div>

      {/* right sidebar - Full width on mobile, fixed width on desktop */}
      <div className="w-full lg:w-[300px] xl:w-[320px] lg:overflow-y-auto no-scrollbar">
        <ExpertRightSide expert={expert} />
      </div>
    </div>
  );
};

export default ExpertProfile;
