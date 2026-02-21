import React, { useEffect, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { getAllBroadcast } from "@/redux/features/broadcast/broadcast.thunk";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { selectAllBroadcast, selectBroadcastError, selectBroadcastStatus, selectTotalBroadcast } from "@/redux/features/broadcast/broadcast.selector";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import BroadcastMenu from "./BroadcastMenu";

const Templates = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = [
    "All",
    "Welcome",
    "Motivation",
    "Progress",
    "Tips",
    "Promotional",
  ];

  useEffect(() => {
    dispatch(getAllBroadcast({ page, limit, type: activeFilter }));
  }, [dispatch, page, limit, activeFilter]);

  const data = useAppSelector(selectAllBroadcast);
  const totalCount = useAppSelector(selectTotalBroadcast);
  const status = useAppSelector(selectBroadcastStatus);
  const error = useAppSelector(selectBroadcastError);

  const [broadcast, setBroadcast] = useState([]);

  useEffect(() => {
    setBroadcast(data);
  }, [data]);

  const totalPages = Math.ceil(totalCount / limit);

  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPaginationRange = () => {
    const totalPageCount = totalPages;
    const siblingCount = 1;

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, "...", totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount,
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  };

  const paginationRange = getPaginationRange() || [];

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setBroadcast(data);
      return;
    }

    const filtered = data.filter((broadcast) =>
      broadcast.title?.toLowerCase().includes(value),
    );

    setBroadcast(filtered);
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}!</p>;

  return (
    <div className="flex-1 flex flex-col gap-5  overflow-y-auto no-scrollbar h-[calc(100vh-130px)]">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 pr-1 pt-1">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-[#9e5608]">Templates</h1>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 ${
                  activeFilter === filter
                    ? "bg-[#9e5608] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Templates"
            onChange={(e) => searchInputHandler(e)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm w-72 focus:outline-none  focus:ring-[#9e5608]"
          />
        </div>
      </div>

      <div className="overflow-auto no-scrollbar">
        {/* Templates Grid */}
        <div className="flex-1 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {broadcast?.map((template, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 flex flex-col gap-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] relative"
              >
                <div className="absolute top-6 right-6">
                  <BroadcastMenu data={template} />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#9e5608]">
                    {template?.title}
                  </h3>
                  <span className="text-xs text-[#66706D] font-medium">
                    {template?.type}
                  </span>
                </div>

                <div
                  onClick={() =>
                    navigate(`/founder/broadcasts/summary/${template?._id}`)
                  }
                  className="bg-[#F8F9FA] rounded-xl p-5 flex flex-col gap-2"
                >
                  <p className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-2 wrap-break-word whitespace-pre-wrap">
                    {template?.message}
                  </p>
                </div>

                <div className="flex justify-end mt-1">
                  <button
                    onClick={() =>
                      navigate(`/founder/broadcasts/summary/${template?._id}`)
                    }
                    className="bg-[#9e5608] text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-[#073a35] transition-colors shadow-sm"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {broadcast.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-start items-center justify-between gap-4 pt-4 mt-auto border-t border-gray-100">
            {/* Results Per Page */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#66706D] font-medium">
              <span className="whitespace-nowrap">Show</span>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="appearance-none pl-2 sm:pl-3 pr-7 sm:pr-8 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-transparent"
                >
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <MdOutlineKeyboardArrowDown className="w-3 h-3 sm:w-4 sm:h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
              <span className="whitespace-nowrap">of {totalCount} results</span>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto justify-center sm:justify-end">
              {/* Previous Button */}
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shrink-0 ${
                  page === 1
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                }`}
                aria-label="Previous page"
              >
                <MdOutlineKeyboardArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 sm:gap-2">
                {paginationRange.map((pageNumber, idx) => {
                  if (pageNumber === "...") {
                    return (
                      <span
                        key={idx}
                        className="px-1 text-gray-400 font-bold text-xs sm:text-sm"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setPage(pageNumber)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold transition-colors shrink-0 ${
                        page === pageNumber
                          ? "bg-[#9e5608] text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={page === pageNumber ? "page" : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shrink-0 ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                }`}
                aria-label="Next page"
              >
                <MdOutlineKeyboardArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;