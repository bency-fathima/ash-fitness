import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  GraduationCap,
  BookOpen,
  UserCircle,
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
import { getDashboardData } from "@/redux/features/admins/admin.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
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
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [growthDuration, setGrowthDuration] = useState(6);
  const [complianceDuration, setComplianceDuration] = useState(12);
  const [reportCategory, setReportCategory] = useState("All Categories");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  const getDashboardDatas = async () => {
    const data = await dispatch(
      getDashboardData({ adminId: user?._id, duration: "12m" }),
    );
    setDashboardData(data.payload);
  };

  useEffect(() => {
    getDashboardDatas();
  }, [user?._id]); // Add dependency

  const getSlicedData = (array, duration) => {
    if (!array || !Array.isArray(array)) return [];
    const start = Math.max(0, array.length - duration);
    return array.slice(start);
  };

  // Helper to toggle duration
  const toggleDuration = (current, setter) => {
    if (current === 3) setter(6);
    else if (current === 6) setter(12);
    else setter(3);
  };

  // Helper to safely get dataset by label
  const getDatasetByLabel = (datasets, label) => {
    const ds = datasets?.find(
      (d) => d.label?.toLowerCase() === label.toLowerCase(),
    );
    return ds?.data || [];
  };

  const hasGraphData = (data) => {
    return (
      data &&
      data.labels &&
      data.labels.length > 0 &&
      data.datasets?.some((ds) => ds.data?.some((val) => val > 0))
    );
  };

  // --- Expert Performance Data Calculation ---
  const totalPrograms = dashboardData?.totalPrograms || 0;
  const totalExp = dashboardData?.totalExperts || 0;
  const totalCli = dashboardData?.totalClients || 0;

  const totalEntities = totalPrograms + totalExp + totalCli; // Total for percentage calculation

  const getPercent = (val) => {
    if (totalEntities === 0) return 0;
    return Math.round((val / totalEntities) * 100);
  };

  const progPct = getPercent(totalPrograms);
  const expPct = getPercent(totalExp);
  const cliPct = getPercent(totalCli);

  const hasPerformanceData = totalEntities > 0;
  const performanceData = {
    labels: hasPerformanceData
      ? ["Programs", "Experts", "Clients"]
      : ["No Data"],
    datasets: [
      {
        data: hasPerformanceData ? [totalPrograms, totalExp, totalCli] : [1],
        backgroundColor: hasPerformanceData
          ? ["#9e5608", "#E6EFEE", "#FFD7A8"]
          : ["#E5E7EB"],
        borderWidth: 0,
        rotation: 270,
        cutout: "80%",
        hoverOffset: hasPerformanceData ? 15 : 0,
        spacing: hasPerformanceData ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };

  const complianceData = {
    labels: getSlicedData(
      dashboardData?.graphData?.compliance?.labels,
      complianceDuration,
    ),
    datasets: [
      {
        label: "Workout",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.compliance?.datasets,
            "Workout",
          ),
          complianceDuration,
        ).map((v) => v / 3),
        backgroundColor: "#F4DBC7",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
      {
        label: "Therapy",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.compliance?.datasets,
            "Therapy",
          ),
          complianceDuration,
        ).map((v) => v / 3),
        backgroundColor: "#9e5608",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
      {
        label: "Diet",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.compliance?.datasets,
            "Diet",
          ),
          complianceDuration,
        ).map((v) => v / 3),
        backgroundColor: "#EBF3F2",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
     
      
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#9e5608",
        titleFont: { size: 14, weight: "bold" },
        bodyColor: "#66706D",
        bodyFont: { size: 12 },
        borderColor: "rgba(0,0,0,0.05)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 8,
        usePointStyle: true,
        cornerRadius: 12,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + "%";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#66706D" },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          font: { size: 11 },
          color: "#66706D",
          callback: (value) => value + "%",
        },
        grid: { color: "#F0F0F0", drawBorder: false },
      },
    },
  };
  const growthData = {
    labels: getSlicedData(
      dashboardData?.graphData?.growth?.labels,
      growthDuration,
    ),
    datasets: [
      {
        label: "Active",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.growth?.datasets,
            "Active",
          ),
          growthDuration,
        ),
        backgroundColor: "#F4DBC7",
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: "Inactive",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.growth?.datasets,
            "Inactive",
          ),
          growthDuration,
        ),
        backgroundColor: "#EBF3F2",
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: "New",
        data: getSlicedData(
          getDatasetByLabel(dashboardData?.graphData?.growth?.datasets, "New"),
          growthDuration,
        ),
        backgroundColor: "#9e5608",
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };
  const trainers = dashboardData?.totalTrainers || 0;
  const dietitians = dashboardData?.totalDietitians || 0;
  const therapists = dashboardData?.totalTherapists || 0;
  const hasExperts = trainers > 0 || dietitians > 0 || therapists > 0;

  const expertsSummaryData = {
    labels: hasExperts ? ["Trainers", "Dietitians", "Therapists"] : ["No Data"],
    datasets: [
      {
        data: hasExperts ? [trainers, dietitians, therapists] : [1],
        backgroundColor: hasExperts
          ? ["#9e5608", "#EBF3F2", "#FAF3E0"]
          : ["#E5E7EB"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
        hoverOffset: hasExperts ? 15 : 0,
        spacing: hasExperts ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };
  const stackedOptions = {
    ...chartOptions,
    layout: { padding: { top: 8 } },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
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
        ...chartOptions.scales.x,
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#94A3B8" },
        categoryPercentage: 0.55,
        barPercentage: 0.8,
      },
      y: {
        ...chartOptions.scales.y,
        stacked: true,
        ticks: {
          stepSize: 25,
          font: { size: 11 },
          color: "#94A3B8",
          callback: (value) => value + "%",
        },
        grid: { color: "#E9EEF5", drawBorder: false },
      },
    },
  };

  const formatReportTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const diffDays = Math.floor(
      (startOfToday - startOfDate) / (1000 * 60 * 60 * 24),
    );
    const timeString = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    if (diffDays === 0) return `Today, ${timeString}`;
    if (diffDays === 1) return `Yesterday, ${timeString}`;
    if (diffDays > 1) return `${diffDays} Days Ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const progressReports = (dashboardData?.latestReports || [])
    .slice(0, 10)
    .map((report) => ({
      ...report,
      time: formatReportTime(report.createdAt),
    }));

  const filteredProgressReports =
    reportCategory === "All Categories"
      ? progressReports
      : progressReports.filter((report) => report.expert === reportCategory);

  return (
    <div className="flex flex-col gap-6 p-1 bg-[#F8F9FA] overflow-x-hidden">
      <div className="flex gap-6 lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Clients",
                value: dashboardData?.totalClients || 0,
                icon: <GraduationCap size={22} className="text-white" />,
                bg: "bg-[#9e5608]",
              },
              {
                label: "Total Programs",
                value: dashboardData?.totalPrograms || 0,
                icon: <BookOpen size={22} className="text-[#9e5608]" />,
                bg: "bg-[#FAF3E0]",
              },
              {
                label: "Experts",
                value: dashboardData?.totalExperts || 0,
                icon: <UserCircle size={22} className="text-white" />,
                bg: "bg-[#9e5608]",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 h-[100px]"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#66706D] font-medium">
                    {card.label}
                  </span>
                  <span className="text-2xl font-bold text-[#9e5608]">
                    {card.value}
                  </span>
                </div>
                <div className={`${card.bg} p-2.5 rounded-full`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
          {/* Row 2: Sub Admin & Expert Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Client Growth"
              subTitle={`Last ${growthDuration} Months`}
              onToggle={() => toggleDuration(growthDuration, setGrowthDuration)}
            >
              <div className="flex gap-4 mb-4">
                <LegendItem color="#F4DBC7" label="Active" />
                <LegendItem color="#EBF3F2" label="Inactive" />
                <LegendItem color="#9e5608" label="New" />
              </div>
              <div className="h-64 relative">
                {hasGraphData(growthData) ? (
                  <Bar data={growthData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <span className="text-sm text-gray-400">
                      No data for this period
                    </span>
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
              <div className="flex gap-4 mb-4">
                <LegendItem color="#EBF3F2" label="Diet" />
                <LegendItem color="#F4DBC7" label="Workout" />
                <LegendItem color="#9e5608" label="Therapy" />
              </div>
              <div className="h-64 relative">
                {hasGraphData(complianceData) ? (
                  <Bar data={complianceData} options={stackedOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <span className="text-sm text-gray-400">
                      No data for this period
                    </span>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>

          {/* Row 4: Latest Progress Reports */}
          <div className="bg-white rounded-2xl shadow-sm flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#9e5608]">
                Latest Progress Reports
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-xs font-medium text-[#66706D]"
                >
                  {reportCategory} <ChevronDown size={14} />
                </button>
                {showCategoryMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-md z-10">
                    {[
                      "All Categories",
                      "Trainer",
                      "Dietitian",
                      "Therapist",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setReportCategory(option);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F8F9FA] ${
                          reportCategory === option
                            ? "text-[#9e5608]"
                            : "text-[#66706D]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-[#F8F9FA] text-[11px] uppercase tracking-wider text-[#66706D] font-bold">
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Task Type</th>
                    <th className="px-6 py-4">Expert</th>
                    <th className="px-6 py-4">Submitted By</th>
                    <th className="px-6 py-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProgressReports.length > 0 ? (
                    filteredProgressReports.map((report, i) => (
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-sm text-[#66706D]"
                      >
                        No progress reports found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 lg:max-w-[320px] flex flex-col gap-6">
          {/* Experts Gauge Card at the top of Sidebar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col h-[400px] border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#9e5608]">Experts</h3>
              <MoreHorizontal size={20} className="text-gray-400" />
            </div>
            <div className="flex-1 relative flex items-center justify-center -mt-12">
              <div className="w-full h-48">
                <Doughnut
                  data={expertsSummaryData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    cutout: "80%",
                  }}
                />
              </div>
              <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-[10px] text-[#66706D] font-medium">
                  Total Experts
                </span>
                <span className="text-3xl font-bold text-[#9e5608]">
                  {dashboardData?.totalExperts || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {[
                {
                  label: "Trainers",
                  count: dashboardData?.totalTrainers || 0,
                  color: "bg-[#9e5608]",
                },
                {
                  label: "Dietitians",
                  count: dashboardData?.totalDietitians || 0,
                  color: "bg-[#EBF3F2]",
                },
                {
                  label: "Therapists",
                  count: dashboardData?.totalTherapists || 0,
                  color: "bg-[#FAF3E0]",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-xs ${item.color}`}
                    ></div>
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
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-[#9e5608] mb-6">
              Expert Performance
            </h3>
            <div className="h-44 mb-6">
              <Doughnut
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            <div className="space-y-4">
              <PerformanceRow
                color="bg-[#9e5608]"
                label="Programs"
                value={`${progPct}%`}
              />
              <PerformanceRow
                color="bg-[#E6EFEE]"
                label="Experts"
                value={`${expPct}%`}
              />
              <PerformanceRow
                color="bg-[#FFD7A8]"
                label="Clients"
                value={`${cliPct}%`}
              />
            </div>
          </div>
          {/* Recent Notifications */}
          <RecentNotificationsCard
            notifications={notifications}
            loading={notificationsLoading}
          />
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, subTitle, onToggle, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-base font-bold text-[#9e5608]">{title}</h3>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-[10px] font-semibold text-[#66706D] uppercase tracking-wider cursor-pointer hover:bg-gray-100 active:scale-95 transition-all"
      >
        {subTitle} <ChevronDown size={14} />
      </button>
    </div>
    {children}
  </div>
);

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[13px] text-[#66706D] font-medium whitespace-nowrap">
      {label} <strong className="text-[#9e5608]">{value}</strong>
    </span>
  </div>
);

const PerformanceRow = ({ color, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-sm ${color}`}></div>
      <span className="text-xs font-medium text-[#66706D]">{label}</span>
    </div>
    <span className="text-xs font-bold text-[#9e5608]">{value}</span>
  </div>
);
