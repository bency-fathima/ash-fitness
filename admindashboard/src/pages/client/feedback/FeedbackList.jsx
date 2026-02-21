import BaseTable from "@/components/table/BaseTable";
import React from "react";
import { feedbackColumns } from "./Feedbackolumns";

export default function FeedbackList({
  feedbackData,
  page,
  limit,
  totalCount,
  onPageChange,
  onLimitChange,
}) {
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={feedbackColumns}
        data={feedbackData}
        pageLabel="Feedbacks"
        onPageChange={onPageChange}
        handleLimitChange={onLimitChange}
        onSearchInputChange={() => {}}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
}
