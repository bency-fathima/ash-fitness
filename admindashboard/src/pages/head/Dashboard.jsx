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
import { Doughnut } from "react-chartjs-2";
import { getDashboardData } from "@/redux/features/head/head.thunk";
import { useDispatch } from "react-redux";
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
  const [dashboardData, setDashboardData] = useState({});
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [showFilter, setShowFilter] = useState(false);
  const [adminDuration, setAdminDuration] = useState("3");
  const [expertDuration, setExpertDuration] = useState("3");
  const [showAdminDuration, setShowAdminDuration] = useState(false);
  const [showExpertDuration, setShowExpertDuration] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  useEffect(() => {
    // Initial fetch
    dispatch(getDashboardData({ headId: user?._id, duration: "3" })).then(
      (res) => {
        setDashboardData(res.payload);
      },
    );
  }, []);

  
  useEffect(() => {
    

    dispatch(
      getDashboardData({ headId: user?._id, duration: adminDuration }),
    ).then((res) => {
      // Using adminDuration as primary for now
      setDashboardData(res.payload);
    });
  }, [adminDuration, dispatch, user?._id]);

 
  const timeframeOptions = [
    { label: "Last 3 Months", value: "3" },
    { label: "Last 6 Months", value: "6" },
    { label: "Last 12 Months", value: "12" },
  ];

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
          ? ["#9e5608", "#45C4A2", "#FFD7A8"]
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

  const adminPerf = {
    programs: dashboardData?.adminPerformance?.programs || 0,
    experts: dashboardData?.adminPerformance?.experts || 0,
    clients: dashboardData?.adminPerformance?.clients || 0,
  };
  const expertPerf = {
    taskCompletion: dashboardData?.expertPerformance?.taskCompletion || 0,
    rating: dashboardData?.expertPerformance?.rating || 0,
    clientsAssigned: dashboardData?.expertPerformance?.clientsAssigned || 0,
    totalClientsAssigned: dashboardData?.expertPerformance?.totalClientsAssigned, // Optional
    totalCapacity: dashboardData?.expertPerformance?.totalCapacity, // Optional
  };

  const hasAdminData =
    adminPerf.programs > 0 || adminPerf.experts > 0 || adminPerf.clients > 0;
  const subAdminPerformanceData = {
    labels: hasAdminData ? ["Programs", "Experts", "Clients"] : ["No Data"],
    datasets: [
      {
        data: hasAdminData
          ? [adminPerf.programs, adminPerf.experts, adminPerf.clients]
          : [1],
        backgroundColor: hasAdminData
          ? ["#9e5608", "#45C4A2", "#FFD7A8"]
          : ["#E5E7EB"],
        borderWidth: 0,
        cutout: "75%",
        hoverOffset: hasAdminData ? 15 : 0,
        spacing: hasAdminData ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };

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

  const hasExpertPerfData =
    expertPerf.taskCompletion > 0 ||
    expertPerf.rating > 0 ||
    expertPerf.clientsAssigned > 0;
  const expertPerformanceChartData = {
    labels: hasExpertPerfData
      ? ["Task Completion", "Rating", "Clients Assigned"]
      : ["No Data"],
    datasets: [
      {
        data: hasExpertPerfData
          ? [
              expertPerf.taskCompletion,
              (expertPerf.rating / 5) * 100,
              expertPerf.clientsAssigned,
            ]
          : [1],
        backgroundColor: hasExpertPerfData
          ? ["#9e5608", "#45C4A2", "#FFD7A8"]
          : ["#E5E7EB"],
        borderWidth: 0,
        cutout: "75%",
        hoverOffset: hasExpertPerfData ? 15 : 0,
        spacing: hasExpertPerfData ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };

  const progressReportsRaw =
    dashboardData?.latestReports?.map((report) => ({
      ...report,
      time: calculateTimeAgo(report.time),
    })) || [];

  const progressReports =
    filterCategory === "All Categories"
      ? progressReportsRaw
      : progressReportsRaw.filter((report) => report.type === filterCategory);

  return (
    <div className="flex flex-col gap-6 p-1 bg-[#F8F9FA]">
      <div className="flex gap-6 lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ... summary cards ... */}
            {[
              {
                label: "Total Clients",
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
                label: "Admins",
                value: dashboardData?.totalAdmins || 0,
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
            {/* Admin Performance Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-[#9e5608]">
                  Admin Performance
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowAdminDuration(!showAdminDuration)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-[10px] font-semibold text-[#66706D] uppercase tracking-wider"
                  >
                    Last {adminDuration} Months <ChevronDown size={14} />
                  </button>
                  {showAdminDuration && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                      {timeframeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setAdminDuration(opt.value);
                            setExpertDuration(opt.value); // Syncing for now as per "Global" API limitation hypothesis, or clearer UX.
                            setShowAdminDuration(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-[#66706D]"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-48 relative flex items-center justify-center">
                <Doughnut
                  data={subAdminPerformanceData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    cutout: "75%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <LegendItem
                  color="#9e5608"
                  label="Programs"
                  value={adminPerf.programs}
                />
                <LegendItem
                  color="#45C4A2"
                  label="Experts"
                  value={adminPerf.experts}
                />
                <LegendItem
                  color="#FFD7A8"
                  label="Clients"
                  value={adminPerf.clients}
                />
              </div>
            </div>

            {/* Expert Performance Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-[#9e5608]">
                  Expert Performance
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowExpertDuration(!showExpertDuration)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-[10px] font-semibold text-[#66706D] uppercase tracking-wider"
                  >
                    Last {expertDuration} Months <ChevronDown size={14} />
                  </button>
                  {showExpertDuration && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                      {timeframeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setExpertDuration(opt.value);
                            setAdminDuration(opt.value); // Syncing
                            setShowExpertDuration(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-[#66706D]"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-48 relative flex items-center justify-center">
                <Doughnut
                  data={expertPerformanceChartData}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            if (context.label === "No Data") return " No Data Available";
                            let label = context.label || "";
                            if (label) {
                              label += ": ";
                            }
                            if (context.parsed !== null) {
                              if (context.label === "Rating") {
                                label += expertPerf.rating + "/5";
                              } else if (context.label === "Clients Assigned" && expertPerf.totalClientsAssigned !== undefined) {
                                label += `${expertPerf.totalClientsAssigned} / ${expertPerf.totalCapacity || 0} (${expertPerf.clientsAssigned}%)`;
                              } else {
                                label += Math.round(context.parsed) + "%";
                              }
                            }
                            return label;
                          },
                        },
                      },
                    },
                    maintainAspectRatio: false,
                    cutout: "75%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <LegendItem
                  color="#9e5608"
                  label="Task Completion"
                  value={`${expertPerf.taskCompletion}%`}
                />
                <LegendItem
                  color="#45C4A2"
                  label="Rating"
                  value={`${expertPerf.rating}/5`}
                />
                <LegendItem
                  color="#FFD7A8"
                  label="Clients Assigned"
                  value={
                    expertPerf.totalClientsAssigned !== undefined
                      ? `${expertPerf.totalClientsAssigned} / ${expertPerf.totalCapacity || 0} (${expertPerf.clientsAssigned}%)`
                      : `${expertPerf.clientsAssigned}%`
                  }
                />
              </div>
            </div>
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
                    <th className="px-6 py-4">Task Type</th>
                    <th className="px-6 py-4">Expert</th>
                    <th className="px-6 py-4">Submitted By</th>
                    <th className="px-6 py-4">Date & Time</th>
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
        <div className="lg:w-80 flex flex-col gap-6">
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
                      className={`w-2.5 h-2.5 rounded-[2px] ${item.color}`}
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

const DashboardCard = ({ title, subTitle, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-base font-bold text-[#9e5608]">{title}</h3>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-[10px] font-semibold text-[#66706D] uppercase tracking-wider">
        {subTitle} <ChevronDown size={14} />
      </button>
    </div>
    {children}
  </div>
);

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2.5 h-2.5 rounded-[2px]"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[11px] text-[#66706D] font-medium whitespace-nowrap">
      {label} <strong className="text-[#9e5608]">{value}</strong>
    </span>
  </div>
);
