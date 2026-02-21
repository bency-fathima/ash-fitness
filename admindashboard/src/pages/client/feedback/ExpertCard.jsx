import { assets } from "@/assets/asset";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";

export default function ExpertCard({ fetchFeedbackData, ratedExpertIds = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const user = useAppSelector(selectUser);
  const [experts, setExperts] = useState([]);

  const dispatch = useDispatch();
  const fetchExperts = async () => {
    try {
      const coaches = await dispatch(
        getAllCoachesByAdmin([user?.trainer, user?.therapist, user?.dietition]),
      ).unwrap();

      setExperts(
        coaches.filter((coach) => coach !== null && coach !== undefined),
      );
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };
  useEffect(() => {
    fetchExperts();
  }, []);

  return (
    <>
      {/* Desktop View - Original 3 column grid */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {experts.map((expert, index) => (
          <div key={index} className="bg-white rounded-xl p-4">
            {/* Header */}
            <div className="flex gap-3 items-center">
              <img
                src={assets.profile}
                alt={expert.name}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-sm">{expert?.name}</h3>
                <div className="flex flex-row gap-2">
                  <p className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-200">
                    {expert?.role}
                  </p>
                  <p className="text-xs px-3 py-1 rounded-full bg-[#45C4A2] text-white">
                    {expert?.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-3 bg-[#F8F8F8] p-3 rounded-lg text-xs space-y-3">
              <div className="space-y-2">
                <p className="text-gray-500">Experience</p>
                <p className="font-medium text-black">{expert?.experience}</p>
              </div>
              <hr className="text-gray-300"></hr>

              <div className="space-y-2">
                <p className="text-gray-500">Certification</p>
                <p className="font-medium">{expert?.qualification}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!ratedExpertIds.includes(expert?._id)) {
                  setSelectedExpert(expert);
                  setIsOpen(!isOpen);
                }
              }}
              disabled={ratedExpertIds.includes(expert?._id)}
              className={`text-white p-3 rounded-xl mt-4 w-full transition-all ${
                ratedExpertIds.includes(expert?._id)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#9e5608] hover:bg-[#083d38]"
              }`}
            >
              {ratedExpertIds.includes(expert?._id)
                ? "Already Rated"
                : "Rate & Review"}
            </button>
          </div>
        ))}
      </div>

      {/* Mobile View - Single column list */}
      <div className="lg:hidden space-y-4 w-full">
        {experts.map((expert, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
            {/* Header */}
            <div className="flex gap-3 items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {expert?.name?.split(" ")?.[0]?.[0]}
                {expert?.name?.split(" ")?.[1]?.[0]}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-[15px] text-gray-900">
                  {expert?.name}
                </h3>
                <p className="text-xs text-gray-600 capitalize mt-0.5">
                  {expert?.role}
                </p>
                <span className="inline-block mt-1.5 text-[10px] px-2.5 py-1 rounded-full bg-[#45C4A2] text-white font-medium">
                  {expert?.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Response Time</p>
                <p className="text-[13px] font-medium text-gray-900">1h 12m</p>
              </div>

              <div>
                <p className="text-[11px] text-gray-500 mb-1">Experience</p>
                <p className="text-[13px] font-medium text-gray-900">
                  {expert?.experience || "7 Years"}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-gray-500 mb-1">Certifications</p>
                <p className="text-[13px] font-medium text-gray-900">
                  {expert?.qualification || "M.Sc. Clinical Nutrition"}
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                if (!ratedExpertIds.includes(expert?._id)) {
                  setSelectedExpert(expert);
                  setIsOpen(!isOpen);
                }
              }}
              disabled={ratedExpertIds.includes(expert?._id)}
              className={`w-full py-3 rounded-xl font-medium text-[14px] transition-colors ${
                ratedExpertIds.includes(expert?._id)
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#9e5608] text-white hover:bg-[#083d38]"
              }`}
            >
              {ratedExpertIds.includes(expert?._id)
                ? "Already Rated"
                : "Rate & Review"}
            </button>
          </div>
        ))}
      </div>

      {isOpen ? (
        <Modal
          expert={selectedExpert}
          onClose={() => setIsOpen(false)}
          fetchFeedbackData={fetchFeedbackData}
        />
      ) : (
        ""
      )}
    </>
  );
}
