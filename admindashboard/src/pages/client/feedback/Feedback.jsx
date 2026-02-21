import React, { useEffect, useState } from "react";
import ExpertCard from "./ExpertCard";
import FeedbackList from "./FeedbackList";
import MobileBottomNav from "../components/MobileBottomNav";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getAllFeedbacks } from "@/redux/features/client/client.thunk";

export default function Feedback() {
  const user = useAppSelector(selectUser);
  const [feedbackData, setFeedbackData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const dispatch = useDispatch();

  const fetchFeedbackData = async () => {
    const response = await dispatch(
      getAllFeedbacks({ id: user?._id, page, limit }),
    );
    const result = await response.payload;
    const data = result?.data;

    // Flatten the nested feedback data structure
    const flattenedData =
      data?.flatMap((coach) =>
        coach.feedback.map((fb) => ({
          coachId: coach?._id,
          name: coach.name
            ? coach.name.charAt(0).toUpperCase() + coach.name.slice(1)
            : "N/A",
          role: coach.role || "N/A",
          rating: fb.rating,
          review: fb.feedback,
          date: new Date(fb.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          _id: fb?._id,
        })),
      ) || [];

    setFeedbackData(flattenedData);
    setTotalCount(result?.total || 0);
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <ExpertCard
        fetchFeedbackData={fetchFeedbackData}
        ratedExpertIds={feedbackData.map((fb) => fb.coachId)}
      />
      <FeedbackList
        feedbackData={feedbackData}
        page={page}
        limit={limit}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
      <MobileBottomNav />
    </div>
  );
}
