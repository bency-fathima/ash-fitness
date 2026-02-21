import React, { useEffect, useMemo, useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { getCoachRatingGraph } from "@/redux/features/coach/coach.thunk";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpertCenterSide = ({ expert }) => {
  const dispatch = useDispatch();
  const [ratingDuration, setRatingDuration] = useState("6");
  const [ratingGraphData, setRatingGraphData] = useState(null);
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const ratingData = useMemo(() => {
    if (!ratingGraphData?.ratingData?.length) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "#F4DBC7",
            borderRadius: 6,
            barThickness: 50,
          },
        ],
      };
    }

    return {
      labels: ratingGraphData.ratingData.map((item) => item.month),
      datasets: [
        {
          data: ratingGraphData.ratingData.map((item) => item.rating),
          backgroundColor: (context) => {
            const index = context.dataIndex;
            if (index === hoveredBarIndex) return "#9e5608";
            return "#F4DBC7";
          },
          borderRadius: 6,
          barThickness: 50,
        },
      ],
    };
  }, [ratingGraphData, hoveredBarIndex]);

  const ratingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (_, elements) => {
      if (elements?.length) {
        setHoveredBarIndex(elements[0].index);
      } else {
        setHoveredBarIndex(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#9e5608",
        bodyColor: "#9e5608",
        borderColor: "#eee",
        borderWidth: 1,
        displayColors: false,
        padding: 10,
        callbacks: {
          label: (context) => `★ ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1, color: "#66706D", font: { size: 10 } },
        grid: { color: "#F0F0F0", drawBorder: false },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#66706D", font: { size: 10 } },
      },
    },
  };

  const feedback = (expert?.feedback || [])
    .slice()
    .reverse()
    .map((item) => ({
      name: item?.userId?.name || "Anonymous",
      rating: item?.rating || 0,
      text: item?.feedback || "-",
    }));

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLimitOpen, setIsLimitOpen] = useState(false);

  const totalResults = expert?.assignedUsers?.length || 0;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (expert?.assignedUsers || []).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
    setIsLimitOpen(false);
  };

  useEffect(() => {
    if (!expert?._id) return;
    dispatch(
      getCoachRatingGraph({ id: expert?._id, duration: ratingDuration }),
    ).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setRatingGraphData(res.payload?.data ?? res.payload);
      }
    });
  }, [dispatch, expert?._id, ratingDuration]);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6  pb-4 sm:pb-6 px-0 sm:px-1">
      {/* Rating Score Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#9e5608]">
              Rating Score
            </h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#9e5608]">
              <Star size={14} className="text-[#9e5608]" />
              {(expert?.avgRating || 0).toFixed(1)}
            </div>
          </div>
          <div className="relative w-fit">
            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-xs font-medium text-[#66706D]"
              onClick={() => setShowRatingMenu((prev) => !prev)}
            >
              Last {ratingDuration} Months <ChevronDown size={14} />
            </button>
            {showRatingMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-md z-10">
                {["3", "6", "12"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setRatingDuration(option);
                      setShowRatingMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F8F9FA] ${
                      ratingDuration === option
                        ? "text-[#9e5608]"
                        : "text-[#66706D]"
                    }`}
                  >
                    Last {option} Months
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-40 sm:h-48 relative">
          <Bar data={ratingData} options={ratingOptions} />
          {/* Threshold line */}
          <div className="absolute top-[18%] left-6 sm:left-10 right-0 border-t border-dashed border-[#45C4A2] opacity-50 pointer-events-none"></div>
        </div>

        {/* Client Feedback Section */}
        <div className="mt-6 sm:mt-8">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer group"
            onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
          >
            <h3 className="text-sm font-bold text-[#9e5608]">
              Client Feedback
            </h3>
            <ChevronDown
              size={18}
              className={`text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${
                isFeedbackOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isFeedbackOpen && (
            <div className="space-y-4 sm:space-y-6">
              {feedback.length === 0 && (
                <p className="text-xs text-[#66706D]">
                  No feedback yet.
                </p>
              )}
              {feedback.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 pb-4 sm:pb-6 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#66706D]">
                      {item.name}
                    </span>
                    <div className="flex text-[#FFD7A8]">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={10}
                          fill={idx < item.rating ? "currentColor" : "none"}
                          stroke={idx < item.rating ? "none" : "currentColor"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#011412] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Programs & Chat Monitoring Row */}

      <div className="gap-4 sm:gap-6">
        {/* Programs */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#9e5608]">Programs</h3>
            <MoreHorizontal size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {expert?.assignedPrograms?.map((prog, i) => (
              <span
                key={i}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-medium text-[#011412]"
              >
                {prog.title}
              </span>
            )) ||
              ["PCOD", "Weight Loss", "Thyroid"].map((tag, i) => (
                <span
                  key={i}
                  className="px-4 sm:px-5 py-2 bg-[#F8F9FA] rounded-lg text-xs font-medium text-[#011412]"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Assigned Clients Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm flex flex-col">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <h3 className="text-sm sm:text-base font-bold text-[#9e5608]">
              Assigned Clients
            </h3>
            <span className="text-xs text-[#66706D] font-medium">
              {totalResults} <span className="mx-1 text-gray-300">|</span> Max{" "}
              {expert?.maxClient}
            </span>
          </div>
          <MoreHorizontal size={20} className="text-gray-400 hidden sm:block" />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-[#66706D] tracking-wider">
                <th className="px-4 lg:px-6 py-4">Client Name</th>
                <th className="px-4 lg:px-6 py-4">Program</th>
                <th className="px-4 lg:px-6 py-4">Compliance</th>
                <th className="px-4 lg:px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((client, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 text-xs font-medium text-[#011412]">
                    {client.name}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-xs text-[#011412]">
                    {client.programType?.title || "N/A"}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-xs font-bold text-[#011412]">
                    {client.compliance ?? "N/A"}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        client.status === "Active"
                          ? "bg-[#E7F9F4] text-[#00A389]"
                          : "bg-[#66706D] text-white"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-50">
          {currentItems.map((client, i) => (
            <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#011412] mb-1">
                    {client.name}
                  </h4>
                  <p className="text-xs text-[#66706D]">
                    {client.programType?.title || "N/A"}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold shrink-0 ${
                    client.status === "Active"
                      ? "bg-[#E7F9F4] text-[#00A389]"
                      : "bg-[#66706D] text-white"
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#66706D] font-medium">
                  Compliance:
                </span>
                <span className="text-xs font-bold text-[#011412]">
                  {client.compliance ?? "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 sm:p-6 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-[#66706D]">Show</span>
            <div className="relative">
              <div
                className="flex items-center gap-2 px-2 py-1 bg-[#F8F9FA] border border-gray-100 rounded text-xs font-medium text-[#66706D] cursor-pointer"
                onClick={() => setIsLimitOpen(!isLimitOpen)}
              >
                {itemsPerPage} <ChevronDown size={12} />
              </div>
              {isLimitOpen && (
                <div className="absolute bottom-full mb-2 bg-white border border-gray-100 rounded shadow-lg z-10 w-full overflow-hidden">
                  {[5, 10, 20, 50].map((limit) => (
                    <div
                      key={limit}
                      className="px-2 py-1.5 text-xs text-[#66706D] hover:bg-[#F8F9FA] cursor-pointer"
                      onClick={() => handleLimitChange(limit)}
                    >
                      {limit}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-[#66706D] whitespace-nowrap">
              of {totalResults} results
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className={`p-1.5 transition-colors ${
                currentPage === 1
                  ? "text-gray-300 pointer-events-none"
                  : "text-gray-400 hover:text-[#9e5608]"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1 max-w-[200px] overflow-x-auto">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-xs font-bold transition-colors shrink-0 ${
                    currentPage === i + 1
                      ? "bg-[#9e5608] text-white"
                      : "text-[#66706D] hover:bg-gray-50"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className={`p-1.5 transition-colors ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-300 pointer-events-none"
                  : "text-[#9e5608] hover:text-[#083a35]"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCenterSide;
