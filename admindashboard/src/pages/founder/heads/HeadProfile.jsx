import HeadCenterSide from "@/components/head/HeadCenterSide";
import HeadLeftSide from "@/components/head/HeadLeftSide";
import HeadRightSide from "@/components/head/HeadRightSide";
import {
  selectHead,
  selectHeadDashboardData,
  selectHeadError,
  selectHeadStatus,
} from "@/redux/features/head/head.selectors";
import { getHead, getDashboardData } from "@/redux/features/head/head.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const HeadProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const head = useSelector(selectHead);
  const dashboardData = useSelector(selectHeadDashboardData);
  const status = useSelector(selectHeadStatus);
  const error = useSelector(selectHeadError);

  useEffect(() => {
    if (id) {
      dispatch(getHead(id));
      dispatch(getDashboardData(id));
    }
  }, [id, dispatch]);

  if (status === "loading" && !head)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-130px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#9e5608]">Profile Details</h1>
        <button
          onClick={() => navigate(`/founder/heads/edit/${id}`)}
          className="px-5 py-2 bg-[#9e5608] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#073a35] transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 justify-between w-full gap-4 h-[calc(100vh-110px)] overflow-auto no-scrollbar pb-6">
        {/* left */}
        <div className="w-full lg:w-[38%]">
          <HeadLeftSide Head={head} />
        </div>
        {/* center */}
        <div className="w-full lg:w-[38%]">
          <HeadCenterSide Head={head} />
        </div>
        {/* right */}
        <div className="w-full lg:w-[24%]">
          <HeadRightSide Head={head} dashboardData={dashboardData} />
        </div>
      </div>
    </div>
  );
};

export default HeadProfile;
