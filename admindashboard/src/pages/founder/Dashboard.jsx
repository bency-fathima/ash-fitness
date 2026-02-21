import React, { useEffect, useState, useMemo } from "react";
import { SyncLoader } from "react-spinners";

import {
  Users,
  UserCheck,
  FileText,
  Layout,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { founderDashboardData } from "@/redux/features/founder/founder.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectFounderDashBoard,
  selectFounderStatus,
} from "@/redux/features/founder/founder.selector";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import RecentNotificationsCard from "@/components/notifications/RecentNotificationsCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  useEffect(() => {
    dispatch(founderDashboardData());
  }, [dispatch]);

  const data = useAppSelector(selectFounderDashBoard);
  const status = useAppSelector(selectFounderStatus);

  const [founder, setFounder] = useState();
  const [growthDuration, setGrowthDuration] = useState(6);
  const [complianceDuration, setComplianceDuration] = useState(12);
  const [adminPerformanceDuration, setAdminPerformanceDuration] = useState(12);
  const [expertPerformanceDuration, setExpertPerformanceDuration] =
    useState(12);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    dispatch(
      founderDashboardData({
        adminDuration: `${adminPerformanceDuration}m`,
        expertDuration: `${expertPerformanceDuration}m`,
      }),
    );
  }, [dispatch, adminPerformanceDuration, expertPerformanceDuration]);

  useEffect(() => {
    setFounder(data);
  }, [data]);

  const getSlicedData = (array, duration) => {
    if (!array || !Array.isArray(array)) return [];
    const start = Math.max(0, array.length - duration);
    return array.slice(start);
  };

  const toggleDuration = (current, setter) => {
    if (current === 3) setter(6);
    else if (current === 6) setter(12);
    else setter(3);
  };

  const getDatasetByLabel = (datasets, label) => {
    const ds = datasets?.find(
      (d) => d.label?.toLowerCase() === label.toLowerCase(),
    );
    return ds?.data || [];
  };
  const growthDataRaw = founder?.data?.graphData?.growth;
  const complianceDataRaw = founder?.data?.graphData?.compliance;

  const growthData = {
    labels: getSlicedData(growthDataRaw?.labels, growthDuration),
    datasets: [
      {
        label: "Active",
        data: getSlicedData(
          getDatasetByLabel(growthDataRaw?.datasets, "Active"),
          growthDuration,
        ),
        backgroundColor: "#F4DBC7",
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: "Inactive",
        data: getSlicedData(
          getDatasetByLabel(growthDataRaw?.datasets, "Inactive"),
          growthDuration,
        ),
        backgroundColor: "#EBF3F2",
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: "New",
        data: getSlicedData(
          getDatasetByLabel(growthDataRaw?.datasets, "New"),
          growthDuration,
        ),
        backgroundColor: "#9e5608",
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  const complianceData = {
    labels: getSlicedData(complianceDataRaw?.labels, complianceDuration),
    datasets: ["Workout", "Therapy", "Diet"].map((label) => {
      const dataset = (complianceDataRaw?.datasets || []).find(
        (ds) => ds.label === label,
      ) || {
        data: [],
      };
      const color =
        label === "Workout"
          ? "#F4DBC7"
          : label === "Therapy"
            ? "#9e5608"
            : "#EBF3F2";
      return {
        ...dataset,
        label,
        data: getSlicedData(dataset.data || [], complianceDuration).map(
          (v) => v / 3,
        ),
        backgroundColor: color,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      };
    }),
  };
  const expertPerformanceData = useMemo(() => {
    const perf = founder?.data?.expertPerformance || {
      taskCompletion: 0,
      rating: 0,
      clientsAssigned: 0,
    };
    return {
      labels: ["Task Completion", "Rating", "Clients Assigned"],
      datasets: [
        {
          data: [
            perf.taskCompletion,
            (perf.rating / 5) * 100,
            perf.clientsAssigned,
          ],
          backgroundColor: ["#9e5608", "#EBF3F2", "#F4DBC7"],
          borderWidth: 0,
          cutout: "75%",
          hoverOffset: 1,
          spacing: 3,
          borderRadius: 8,
        },
      ],
      raw: {
        taskCompletion: perf.taskCompletion,
        rating: perf.rating,
        clientsAssigned: perf.clientsAssigned,
      },
      isZero:
        perf.taskCompletion === 0 &&
        perf.rating === 0 &&
        perf.clientsAssigned === 0,
    };
  }, [founder]);

  const subAdminPerformanceData = useMemo(() => {
    const perf = founder?.data?.adminPerformance || {
      programs: 0,
      experts: 0,
      clients: 0,
    };
    const total =
      (perf.programs || 0) + (perf.experts || 0) + (perf.clients || 0);
    const toPct = (val) => (total > 0 ? Math.round((val / total) * 100) : 0);

    return {
      labels: ["Programs", "Experts", "Clients"],
      datasets: [
        {
          data: [
            toPct(perf.programs),
            toPct(perf.experts),
            toPct(perf.clients),
          ],
          backgroundColor: ["#9e5608", "#EBF3F2", "#F4DBC7"],
          borderWidth: 0,
          cutout: "75%",
          hoverOffset: 1,
          spacing: 3,
          borderRadius: 8,
        },
      ],
      raw: {
        programs: toPct(perf.programs),
        experts: toPct(perf.experts),
        clients: toPct(perf.clients),
      },
      isZero: total === 0,
    };
  }, [founder]);

  const calculateTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
      if (diffInHours === 0) {
        if (diffInMinutes < 5) return "Just now";
        return `${diffInMinutes} mins ago`;
      }
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return `${diffInDays} Days Ago`;
    }
  };

  const progressReportsRaw =
    founder?.data?.latestReports?.map((report) => ({
      ...report,
      time: calculateTimeAgo(report.time),
    })) || [];

  const progressReports =
    filterCategory === "All Categories"
      ? progressReportsRaw
      : progressReportsRaw.filter((report) => report.type === filterCategory);

  const trainers = founder?.data?.Trainers || 0;
  const dietitians = founder?.data?.Dietitians || 0;
  const therapists = founder?.data?.Therapists || 0;
  const hasExperts = trainers > 0 || dietitians > 0 || therapists > 0;
  const expertsSummaryData = {
    labels: hasExperts ? ["Trainers", "Dietitians", "Therapists"] : ["No Data"],
    datasets: [
      {
        data: hasExperts ? [trainers, dietitians, therapists] : [1],
        backgroundColor: hasExperts
          ? ["#9e5608", "#EBF3F2", "#F4DBC7"]
          : ["#E5E7EB"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
        hoverOffset: hasExperts ? 1 : 0,
        spacing: hasExperts ? 3 : 0,
        borderRadius: 6,
      },
    ],
  };

  const growthMaxValue = Math.max(
    0,
    ...growthData.datasets.flatMap((ds) => ds.data || []),
  );
  const growthYAxisMax =
    growthMaxValue === 0
      ? 10
      : growthMaxValue % 10 === 0
        ? growthMaxValue + 10
        : Math.ceil(growthMaxValue / 10) * 10;

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#666",
        borderColor: "#eee",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#66706D",
        },
      },
      y: {
        beginAtZero: true,
        max: growthYAxisMax,
        ticks: {
          font: {
            size: 11,
          },
          color: "#66706D",
        },
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  const stackedOptions = {
    ...growthOptions,
    layout: { padding: { top: 8 } },
    plugins: {
      ...growthOptions.plugins,
      tooltip: {
        ...growthOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null) {
              label += Math.round(context.raw * 3) + "%";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ...growthOptions.scales.x,
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#94A3B8" },
        categoryPercentage: 0.55,
        barPercentage: 0.8,
      },
      y: {
        ...growthOptions.scales.y,
        stacked: true,
        max: 100,
        ticks: {
          stepSize: 25,
          font: { size: 11 },
          color: "#94A3B8",
          callback: (value) => value + "%",
        },
        grid: { color: "#E9EEF5" },
      },
    },
  };

  const performanceOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            if (label === "Rating") {
              const actualRating = ((value / 100) * 5).toFixed(1);
              return `${label}: ${actualRating}/5`;
            }
            return `${label}: ${Math.round(value)}%`;
          },
        },
      },
    },
  };

  if (status === "loading" && !founder)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 p-1 bg-[#F8F9FA] h-[calc(100vh-120px)] overflow-auto  no-scrollbar">
      {/* Summary Cards */}

      <div className="flex gap-6 lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Clients",
                value: founder?.data?.totalClient || 0,
                icon: <Users size={20} className="text-[#9e5608]" />,
                bg: "bg-[#EBF3F2]",
              },
              {
                label: "Headers",
                value: founder?.data?.totalHeads || 0,
                icon: <UserCheck size={20} className="text-[#DAA520]" />,
                bg: "bg-[#FAF3E0]",
              },
              {
                label: "Admins",
                value: founder?.data?.totalAdmins || 0,
                icon: <FileText size={20} className="text-[#9e5608]" />,
                bg: "bg-[#EBF3F2]",
              },
              {
                label: "Total Programs",
                value: founder?.data?.totalPrograms || 0,
                icon: <Layout size={20} className="text-[#DAA520]" />,
                bg: "bg-[#FAF3E0]",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#66706D] font-medium">
                    {card.label}
                  </span>
                  <span className="text-2xl font-bold text-[#9e5608]">
                    {card.value}
                  </span>
                </div>
                <div className={`${card.bg} p-3 rounded-full`}>{card.icon}</div>
              </div>
            ))}
          </div>
          {/* Row 2: Client Growth & Client Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Client Growth"
              subTitle={`Last ${growthDuration} Months`}
              onToggle={() => toggleDuration(growthDuration, setGrowthDuration)}
            >
              <div className="flex items-center gap-4 mb-4">
                <LegendItem color="#F4DBC7" label="Active" />
                <LegendItem color="#DBDEDD" label="Inactive" />
                <LegendItem color="#9e5608" label="New" />
              </div>
              <div className="h-64 relative">
                {growthData?.labels?.length > 0 ? (
                  <Bar data={growthData} options={growthOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No data available
                  </div>
                )}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Client Compliance"
              subTitle={`Last ${complianceDuration} Months`}
              onToggle={() =>
                toggleDuration(complianceDuration, setComplianceDuration)
              }
            >
              <div className="flex items-center gap-4 mb-4">
                <LegendItem color="#EBF3F2" label="Diet" />
                <LegendItem color="#F4DBC7" label="Workout" />
                <LegendItem color="#9e5608" label="Therapy" />
              </div>
              <div className="h-64">
                {complianceData?.labels?.length > 0 ? (
                  <Bar data={complianceData} options={stackedOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No data available
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>

          {/* Row 3: New Clients Joined & Expert Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Admin Performance"
              subTitle={
                adminPerformanceDuration === 12
                  ? "Last Year"
                  : `Last ${adminPerformanceDuration} Months`
              }
              onToggle={() =>
                toggleDuration(
                  adminPerformanceDuration,
                  setAdminPerformanceDuration,
                )
              }
            >
              <div className="h-64 relative flex items-center justify-center">
                {!subAdminPerformanceData.isZero ? (
                  <Doughnut
                    data={subAdminPerformanceData}
                    options={performanceOptions}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No data available
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#9e5608]"></div>
                  <span className="text-[11px] text-[#66706D]">
                    Programs{" "}
                    <strong className="text-[#9e5608] text-[12px]">
                      {subAdminPerformanceData.raw.programs}%
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#EBF3F2]"></div>
                  <span className="text-[11px] text-[#66706D]">
                    Experts{" "}
                    <strong className="text-[#9e5608] text-[12px]">
                      {subAdminPerformanceData.raw.experts}%
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#F4DBC7]"></div>
                  <span className="text-[11px] text-[#66706D]">
                    Clients{" "}
                    <strong className="text-[#9e5608] text-[12px]">
                      {subAdminPerformanceData.raw.clients}%
                    </strong>
                  </span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Expert Performance"
              subTitle={
                expertPerformanceDuration === 12
                  ? "Last Year"
                  : `Last ${expertPerformanceDuration} Months`
              }
              onToggle={() =>
                toggleDuration(
                  expertPerformanceDuration,
                  setExpertPerformanceDuration,
                )
              }
            >
              <div className="h-64 relative flex items-center justify-center">
                {!expertPerformanceData.isZero ? (
                  <Doughnut
                    data={expertPerformanceData}
                    options={performanceOptions}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No data available
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#9e5608]"></div>
                  <span className="text-[12px] text-[#66706D]">
                    Task Completion{" "}
                    <strong className="text-[#9e5608] text-[12px]">
                      {expertPerformanceData?.raw?.taskCompletion}%
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#EBF3F2]"></div>
                  <span className="text-[12px] text-[#66706D]">
                    Rating{" "}
                    <strong className="text-[#9e5608] text-[12px]">
                      {expertPerformanceData?.raw?.rating}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#F4DBC7]"></div>
                  <span className="text-[12px] text-[#66706D]">
                    Clients Assigned{" "}
                    <strong className="text-[#9e5608] text-[12px]">
                      {expertPerformanceData?.raw?.clientsAssigned}%
                    </strong>
                  </span>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Row 4: Latest Progress Reports */}
          <div className="bg-white rounded-2xl shadow-sm flex flex-col min-h-[400px]">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#9e5608]">
                Latest Progress Reports
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-xs font-medium text-[#66706D]"
                >
                  {filterCategory} <ChevronDown size={14} />
                </button>
                {showFilter && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                    {["All Categories", "Diet", "Workout", "Therapy"].map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setFilterCategory(cat);
                            setShowFilter(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-[#66706D]"
                        >
                          {cat}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8F9FA] text-[11px] uppercase tracking-wider text-[#66706D] font-bold">
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Report Type</th>
                    <th className="px-6 py-4">Expert</th>
                    <th className="px-6 py-4">Submitted To</th>
                    <th className="px-6 py-4">Date & Time</th>
                    {/* <th className="px-6 py-4">Action</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {progressReports.length > 0 ? (
                    progressReports.map((report, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#9e5608]">
                          {report.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#011412]">
                          {report.type}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                              report.expert === "Dietitian"
                                ? "bg-[#FAF3E0] text-[#DAA520]"
                                : report.expert === "Trainer"
                                  ? "bg-[#EBF3F2] text-[#9e5608]"
                                  : "bg-[#F0FDF4] text-[#15803D]"
                            }`}
                          >
                            {report.expert}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#011412]">
                          {report.submittedBy}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#66706D]">
                          {report.time}
                        </td>
                        {/* <td className="px-6 py-4 text-sm text-[#66706D]">
                        <MoreHorizontal
                          size={18}
                          className="cursor-pointer hover:text-gray-900"
                        />
                      </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-[#66706D]"
                      >
                        No progress reports found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 flex flex-col gap-6">
          {/* Experts Gauge Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#9e5608]">Experts</h3>
              <MoreHorizontal size={20} className="text-gray-400" />
            </div>
            <div className="h-48 relative flex items-center justify-center">
              <Doughnut
                data={expertsSummaryData}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  cutout: "80%",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] flex flex-col items-center">
                <span className="text-[10px] text-[#66706D] font-medium">
                  Total Experts
                </span>
                <span className="text-3xl font-bold text-[#9e5608]">
                  {founder?.data?.totalExperts || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {[
                {
                  label: "Trainers",
                  count: founder?.data?.Trainers || 0,
                  color: "bg-[#9e5608]",
                },
                {
                  label: "Dietitians",
                  count: founder?.data?.Dietitians || 0,
                  color: "bg-[#EBF3F2]",
                },
                {
                  label: "Therapists",
                  count: founder?.data?.Therapists || 0,
                  color: "bg-[#FFD7A8]",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-sm ${item.color}`}></div>
                    <span className="text-xs text-[#66706D] font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#9e5608]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <RecentNotificationsCard
            notifications={notifications}
            loading={notificationsLoading}
            className="min-h-0"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, subTitle, children, onToggle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-base font-bold text-[#9e5608]">{title}</h3>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-[10px] font-semibold text-[#66706D] uppercase tracking-wider"
      >
        {subTitle} <ChevronDown size={14} />
      </button>
    </div>
    {children}
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2.5 h-2.5 rounded-sm"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-xs text-[#66706D] font-medium">{label}</span>
  </div>
);

export default Dashboard;
