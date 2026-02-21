import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  // getPaginationRowModel,
} from "@tanstack/react-table";
import { assets } from "../../assets/asset";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { BiPlus } from "react-icons/bi";

import { useState, useMemo } from "react";
import { BsDatabaseAdd } from "react-icons/bs";

export default function BaseTable({
  columns,
  data,
  actionLabel,
  profilePath,
  actionPath,
  pageLabel,
  onSearchInputChange,
  handlePageChange,
  handleLimitChange,
  page,
  limit,
  totalCount,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openStatus, setOpenStatus] = useState(false);

  const navigate = useNavigate();

  const availableStatuses = useMemo(() => {
    if (!data) return [];
    const statuses = new Set();
    data.forEach((item) => {
      // Check for common status fields or use specific ones based on component usage
      if (item.status) statuses.add(item.status);
    });
    // Ensure we handle the specific status values requested
    // If data doesn't contain them (e.g. empty page), they won't appear, which is correct behavior for dynamic filtering
    return Array.from(statuses);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (statusFilter === "All Status") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getRowId: (row) => row?._id,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  const totalPages = Math.ceil(totalCount / limit);

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
        totalPageCount
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  };

  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = getPaginationRange() || [];

  return (
    <div
      className="bg-white p-3 sm:p-4 md:p-6 rounded-xl flex flex-col   relative"
      style={data?.length > 0 ? { height: "fit-content" } : { height: "100%" }}
    >
      {/* Header Section - Responsive */}
      <div className="mb-4 sm:mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h2 className="text-[#9e5608] font-bold text-[18px] sm:text-[20px] md:text-[22px]">
          {pageLabel}
        </h2>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search Bar - Full width on mobile */}
          <div className="flex items-center bg-[#F8F8F8] px-3 rounded-lg flex-1 sm:flex-initial min-w-0">
            <img
              src={assets.search}
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
              alt="search"
            />
            <input
              type="text"
              placeholder="Search anything"
              className="w-full sm:w-40 md:w-56 lg:w-72 px-2.5 py-2 sm:py-3 border-none rounded-xl focus:outline-none bg-transparent text-sm"
              onChange={(e) => onSearchInputChange(e)}
            />
            <img
              src={assets.filter}
              className="w-4 h-4 shrink-0"
              alt="filter"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {availableStatuses.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setOpenStatus(!openStatus)}
                  className="bg-[#EBF3F2] rounded-md text-[11px] sm:text-[12px] font-semibold px-2 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  {statusFilter}
                  <MdOutlineKeyboardArrowDown className="w-4 h-4 shrink-0" />
                </button>
                {openStatus && (
                  <div className="absolute top-full text-left left-0 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                    <button
                      onClick={() => {
                        setStatusFilter("All Status");
                        setOpenStatus(false);
                      }}
                      className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 text-left"
                    >
                      All Status
                    </button>
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setOpenStatus(false);
                        }}
                        className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 text-left"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* <button className="bg-[#EBF3F2] rounded-md text-[11px] sm:text-[12px] font-semibold px-2 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
              Bulk Actions
              <MdOutlineKeyboardArrowDown className="w-4 h-4 shrink-0" />
            </button> */}
            {actionPath ? (
              <button
                onClick={() => navigate(actionPath)}
                className="bg-[#9e5608] text-white rounded-md text-[11px] sm:text-[12px] font-semibold px-2 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <BiPlus className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                {actionLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {data?.length > 0 ? (
        <div className=" overflow-y-visible flex-1 h-fit -mx-3 sm:-mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle px-3 sm:px-4 md:px-0">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-[#F8F8F8] hidden md:table-header-group">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left py-3 px-2 lg:px-4 font-semibold text-black text-xs lg:text-sm whitespace-nowrap"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-[#DBDEDD]">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#DBDEDD] hover:bg-gray-50 transition cursor-pointer md:table-row flex flex-col md:flex-row py-3 md:py-0"
                    onClick={() => {
                      if (profilePath) {
                        profilePath(row.original?._id);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        className="py-2 md:py-5 px-2 lg:px-4 text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-black flex md:table-cell"
                        data-label={
                          table.getHeaderGroups()[0]?.headers[index]?.column
                            ?.columnDef?.header
                        }
                      >
                        {/* Mobile Label */}
                        <span className="md:hidden font-semibold text-gray-600 mr-2 min-w-[120px]">
                          {flexRender(
                            table.getHeaderGroups()[0]?.headers[index]?.column
                              ?.columnDef?.header,
                            table
                              .getHeaderGroups()[0]
                              ?.headers[index]?.getContext(),
                          )}
                          :
                        </span>
                        {/* Cell Content */}
                        <span className="flex-1">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full flex-col gap-2 py-12">
          <BsDatabaseAdd
            onClick={() => navigate(actionPath)}
            className="text-gray-400"
            size={50}
          />
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Please add some data
          </p>
        </div>
      )}

      {/* Pagination - Responsive */}
      {data?.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-start items-center justify-between gap-4 py-4 mt-auto border-t border-gray-100">
          {/* Results Per Page */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#66706D] font-medium">
            <span className="whitespace-nowrap">Show</span>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => {
                  handleLimitChange(Number(e.target.value));
                  handlePageChange(1);
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
              onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                    onClick={() => handlePageChange(pageNumber)}
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
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
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
  );
}
