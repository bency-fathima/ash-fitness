/* eslint-disable react-hooks/set-state-in-effect */
import { assets } from "@/assets/asset";
import React, { useCallback, useEffect, useState } from "react";
import ProgressChart from "../components/ProgressChart";
import WeightUpdate from "./WeightUpdate";
import MeasurementUpdate from "./MeasurementUpdate";
import HoldPlan from "./HoldPlan";
import ExtendPlan from "./ExtendPlan";
import { X } from "lucide-react";
import { Bar } from "react-chartjs-2";
import MobileBottomNav from "../components/MobileBottomNav";
import { useAppSelector } from "@/redux/store/hooks";
import { useDispatch } from "react-redux";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { fetchClientComplianceStats } from "@/redux/features/client/client.thunk";

export default function Progress() {
  const [program, setProgram] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [complianceData, setComplianceData] = useState(null);

  const user = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const fetchDashboardData = useCallback(async () => {
    try {
      const programId =
        typeof user?.programType === "object"
          ? user?.programType?._id
          : user?.programType;
      const program = await dispatch(getProgramById(programId)).unwrap();
      const compliance = await dispatch(fetchClientComplianceStats()).unwrap();
      setComplianceData(compliance);
      setProgram(program.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user?._id && user?.programType) {
      fetchDashboardData();
    }
  }, [user?._id, user?.programType]);

  const kpiData = [
    {
      title: "Program Days",
      value: `${user?.currentGlobalDay || 1}/ ${program?.plan?.duration || 0}`,
      icon: assets.website,
      bg: "#9e5608",
      iconColor: true,
    },
    {
      title: "Weight Progress",
      value: `${user?.currentWeight || 0} kg`,
      icon: assets.website,
      bg: "#F4DBC7",
      iconColor: false,
    },
    {
      title: "Overall Compliance",
      value: `${complianceData?.overall || 0}%`,
      icon: assets.website,
      bg: "#9e5608",
      iconColor: true,
    },
    {
      title: "Active Streak",
      value: `${complianceData?.streaks?.activeStreak || 0} Days`,
      icon: assets.website,
      bg: "#F4DBC7",
      iconColor: false,
    },
  ];

  const compliance = [
    {
      title: "Diet",
      missed: `Missed Diet:${complianceData?.stats?.missedCount + complianceData?.stats?.skippedCount}`,
      percentage: `${((complianceData?.stats?.missedCount + complianceData?.stats?.skippedCount) * complianceData?.stats?.expectedMeals) / 100}%`,
      color: "#9e5608",
    },
    {
      title: "Workout",
      missed: `Missed Workout: 0`,
      percentage: `0%`,
      color: "#F4DBC7",
    },
    {
      title: "Therapy",
      missed: "Missed Therapy: 0",
      percentage: "0%",
      color: "#EBF3F2",
    },
  ];

  const measurementsData = {
    labels: user?.measurementHistory?.map((_, i) => `W ${i + 1}`) || [],
    datasets: [
      {
        label: "Chest",
        data: user?.measurementHistory?.map((h) => h.chest) || [],
        backgroundColor: "#F4DBC7",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 18,
      },
      {
        label: "Waist",
        data: user?.measurementHistory?.map((h) => h.waist) || [],
        backgroundColor: "#E8F5F3",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 18,
      },
      {
        label: "Hip",
        data: user?.measurementHistory?.map((h) => h.hip) || [],
        backgroundColor: "#9e5608",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 18,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: "500" },
          color: "#66706D",
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#9e5608",
        titleFont: { size: 13, weight: "600" },
        bodyColor: "#66706D",
        bodyFont: { size: 12, weight: "500" },
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 16,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].dataset.label;
          },
          label: (context) => {
            return "";
          },
          afterBody: (tooltipItems) => {
            const current = tooltipItems[0].parsed.y;
            const start = user.measurementHistory[0][
              tooltipItems[0].dataset.label.toLowerCase()
            ];
            const change = current - start;
            return [
              `Current         ${current} cm`,
              `Start              ${start} cm`,
              `Change          ${change} cm`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        ticks: {
          font: { size: 12, weight: "500" },
          color: "#9CA3AF",
          padding: 8,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 160,
        ticks: {
          stepSize: 40,
          font: { size: 11, weight: "500" },
          color: "#9CA3AF",
          callback: (value) => value + " cm",
        },
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
      },
    },
  };
  const lastWeightUpdateDate = user?.weightHistory?.at(-1)?.date || "";
  const lastMeasurementUpdateDate = user?.measurementHistory?.at(-1)?.date || "";

  return (
    <>
      {/* Header - Desktop */}
      <div className="hidden lg:flex justify-between items-center mb-6">
        <h1 className="text-[#9e5608] font-bold text-[20px]">
          Overall Progress
        </h1>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm"
              >
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1">
                    {kpi.title}
                  </p>
                  <h2 className="text-[22px] font-bold text-[#9e5608] leading-tight">
                    {kpi.value}
                  </h2>
                </div>
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ backgroundColor: kpi.bg }}
                >
                  <img
                    src={kpi.icon}
                    alt={kpi.title}
                    className="w-5 h-5"
                    style={{
                      filter: kpi.iconColor
                        ? "brightness(0) invert(1)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Weight Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#9e5608] font-bold text-[15px]">
                  Weight Progress
                </h3>
                {!lastWeightUpdateDate ||
                (new Date() - new Date(lastWeightUpdateDate)) /
                  (1000 * 60 * 60 * 24) >=
                  7 ? (
                  <button
                    className="bg-[#9e5608] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#083d38] transition-colors"
                    onClick={() => {
                      setIsOpen(true);
                      setPanelType("weight");
                    }}
                  >
                    Update
                  </button>
                ) : null}
              </div>
              <ProgressChart />
            </div>

            {/* Measurements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#9e5608] font-bold text-[15px]">
                  Measurements
                </h3>
                {!lastMeasurementUpdateDate ||
                (new Date() - new Date(lastMeasurementUpdateDate)) /
                  (1000 * 60 * 60 * 24) >=
                  7 ? (
                  <button
                    className="bg-[#9e5608] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#083d38] transition-colors"
                    onClick={() => {
                      setIsOpen(true);
                      setPanelType("measurement");
                    }}
                  >
                    Update
                  </button>
                ) : null}
              </div>
              <div className="h-[280px] w-full">
                <Bar data={measurementsData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Streaks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#9e5608] font-bold text-[16px] mb-4">
              Streaks
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <p className="text-[13px] font-medium text-gray-700">
                  Active Streak
                </p>
                <p className="text-[#9e5608] font-bold text-[15px]">
                  {complianceData?.streaks?.activeStreak} Days
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <p className="text-[13px] font-medium text-gray-700">
                  Longest Streak
                </p>
                <p className="font-bold text-[15px] text-gray-800">
                  {complianceData?.streaks?.longestStreak} Days
                </p>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#9e5608] font-bold text-[16px]">
                Compliance
              </h3>
              <span className="text-[18px] font-bold text-gray-800">
                {complianceData?.overall}%
              </span>
            </div>
            <div className="space-y-3">
              {compliance.map((item, i) => (
                <div
                  key={i}
                  className="relative bg-gray-50 rounded-xl p-4 pl-5"
                >
                  <div
                    className={`absolute left-0 top-0  h-full rounded-l-xl`}
                    style={{ background: item.color, width: item.percentage }}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-gray-700">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {item.missed}
                      </span>
                      <span className="text-[13px] font-bold text-[#9e5608]">
                        {item.percentage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4 pb-20">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[11px] text-gray-600 font-medium leading-tight">
                  {kpi.title}
                </p>
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ backgroundColor: kpi.bg }}
                >
                  <img
                    src={kpi.icon}
                    alt={kpi.title}
                    className="w-4 h-4"
                    style={{
                      filter: kpi.iconColor
                        ? "brightness(0) invert(1)"
                        : "none",
                    }}
                  />
                </div>
              </div>
              <h2 className="text-[20px] font-bold text-[#9e5608]">
                {kpi.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Weight Progress Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#9e5608] font-semibold text-[14px]">
              Weight Progress
            </h3>
            {!lastWeightUpdateDate ||
            (new Date() - new Date(lastWeightUpdateDate)) /
              (1000 * 60 * 60 * 24) >=
              7 ? (
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPanelType("weight");
                }}
                className="bg-[#9e5608] text-white px-3 py-1.5 rounded-lg text-[12px] font-medium"
              >
                Update
              </button>
            ) : null}
          </div>
          <ProgressChart />
        </div>

        {/* Measurements Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#9e5608] font-semibold text-[14px]">
              Measurements
            </h3>
            {!lastMeasurementUpdateDate ||
            (new Date() - new Date(lastMeasurementUpdateDate)) /
              (1000 * 60 * 60 * 24) >=
              7 ? (
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPanelType("measurement");
                }}
                className="bg-[#9e5608] text-white px-3 py-1.5 rounded-lg text-[12px] font-medium"
              >
                Update
              </button>
            ) : null}
          </div>
          <div className="h-[220px] w-full">
            <Bar data={measurementsData} options={chartOptions} />
          </div>
        </div>

        {/* Streaks Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-[#9e5608] font-semibold text-[14px] mb-3">
            Streaks
          </h3>
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
              <p className="text-[12px] font-medium text-gray-700">
                Active Streak
              </p>
              <p className="text-[#9e5608] font-bold text-[14px]">
                {complianceData?.streaks?.activeStreak} Days
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
              <p className="text-[12px] font-medium text-gray-700">
                Longest Streak
              </p>
              <p className="font-bold text-[14px] text-gray-800">
                {complianceData?.streaks?.longestStreak} Days
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#9e5608] font-semibold text-[14px]">
              Compliance
            </h3>
            <span className="text-[16px] font-bold text-gray-800">
              {complianceData?.overall}%
            </span>
          </div>
          <div className="space-y-2">
            {compliance.map((item, i) => (
              <div key={i} className="relative bg-gray-50 rounded-lg p-3 pl-4">
                <div
                  className="absolute left-0 top-0 w-1 h-full rounded-l-lg "
                  style={{ background: item.color, width: item.percentage }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium text-gray-700">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.missed}
                    </span>
                    <span className="text-[12px] font-bold text-[#9e5608]">
                      {item.percentage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Drawer/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer - Full screen on mobile, sidebar on desktop */}
          <div className="relative w-full lg:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-[18px] text-[#9e5608]">
                {panelType === "weight" && "Update Weight"}
                {panelType === "measurement" && "Update Measurements"}
                {panelType === "hold" && "Hold Plan"}
                {panelType === "extend" && "Extend Plan"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {panelType === "weight" && (
                <WeightUpdate onClose={() => setIsOpen(false)} />
              )}
              {panelType === "measurement" && (
                <MeasurementUpdate onClose={() => setIsOpen(false)} />
              )}
              {panelType === "hold" && (
                <HoldPlan onClose={() => setIsOpen(false)} />
              )}
              {panelType === "extend" && (
                <ExtendPlan onClose={() => setIsOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}
      <MobileBottomNav />
    </>
  );
}
