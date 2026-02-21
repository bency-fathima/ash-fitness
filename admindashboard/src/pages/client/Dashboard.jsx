/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";
import HeroCard from "./components/HeroCard";
import ComplianceChart from "@/components/chart/ComplianceChart";
import ProgressChart from "./components/ProgressChart";
import TaskList from "./components/TaskList";
import DietPlanCard from "./components/DietPlanCard";
import ExpertsList from "./components/ExpertsList";
import Measeurement from "./components/Measeurement";
import NotificationsList from "./components/NotificationsList";
import MobileBottomNav from "./components/MobileBottomNav";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import {
  fetchClientComplianceStats,
  getClient,
} from "@/redux/features/client/client.thunk";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";

export default function Dashboard() {
  const [program, setProgram] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [complianceData, setComplianceData] = useState(null);
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getClient({ id: user?._id }));
    }
  }, [user?._id, dispatch]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const programId =
        typeof user?.programType === "object"
          ? user?.programType?._id
          : user?.programType;
      const program = await dispatch(getProgramById(programId)).unwrap();
      const coaches = await dispatch(
        getAllCoachesByAdmin([user?.trainer, user?.therapist, user?.dietition]),
      ).unwrap();
      const compliance = await dispatch(fetchClientComplianceStats()).unwrap();
      setProgram(program.data);
      setCoaches(coaches);
      setComplianceData(compliance);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user?._id && user?.programType) {
      fetchDashboardData();
    }
  }, [user?._id, user?.programType]);

  const isProgramStarted = useMemo(() => {
    // Check both user (auth) and clientUser (fetched) for the start date
    // The field name in DB is programStartDate
    const startDate = clientUser?.programStartDate || user?.programStartDate;

    if (!startDate) return true; // Fallback if no date found (should ideally be false, but keeping existing behavior for undefined)

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return today >= start;
  }, [user?.programStartDate, clientUser?.programStartDate]);

  const clientStatus = clientUser?.status || user?.status;

  if (clientStatus === "Inactive") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Inactive</h1>
        <p className="text-gray-600 text-lg">
          You are currently inactive. Please contact the admin to reactivate your account and resume your program.
        </p>
      </div>
    );
  }

  if (clientStatus === "Completed") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-[#9e5608] mb-4">Program Completed!</h1>
        <p className="text-gray-600 text-lg">
          Congratulations! You have successfully completed your program.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full grid lg:grid-cols-[1fr_350px] grid-cols-1 gap-8 lg:p-2 p-4 lg:pb-2 pb-24">
        {/* Main Content Area */}
        <div className="flex flex-col space-y-8">
          {/* Top Section: Hero and KPI Cards */}
          <div className="grid lg:grid-cols-[1.5fr_1fr] grid-cols-1 gap-6">
            <HeroCard program={program} />
            <div className="grid grid-cols-2 gap-4 ">
              <KpiCard
                title="Program Days"
                value={
                  !isProgramStarted
                    ? "Not Started"
                    : `${clientUser?.currentGlobalDay || user?.currentGlobalDay || 1}/ ${
                        program?.plan?.duration || 0
                      }`
                }
                icon={assets.website}
                bg="#9e5608"
                iconColor="white"
                cardBg="white"
              />
              <KpiCard
                title="Overall Compliance"
                value={`${complianceData?.overall || 0}%`}
                icon={assets.website}
                bg="#9e5608"
                iconColor="white"
                cardBg="white"
              />
              <KpiCard
                title="Weight Progress"
                value={user?.currentWeight || 0}
                icon={assets.website}
                bg="#F4DBC7"
                cardBg="white"
              />
              <KpiCard
                title="Active Streak"
                value={`${complianceData?.streaks?.activeStreak || 0} Days`}
                icon={assets.website}
                bg="#F4DBC7"
                cardBg="white"
              />
            </div>
          </div>

          {/* Mobile Only: Diet Plan Card */}
          <div className="lg:hidden">
            <DietPlanCard
              isProgramStarted={isProgramStarted}
              startDate={clientUser?.programStartDate || user?.programStartDate}
              dietPlanPdf={clientUser?.dietPlanPdf || user?.dietPlanPdf}
            />
          </div>

          {/* Middle Section: Charts */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 lg:order-2 order-3">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-[#9e5608] font-bold text-sm mb-4">
                Last Week Compliance
              </h2>
              {complianceData?.weeklyData ? (
                <ComplianceChart data={complianceData.weeklyData} />
              ) : (
                <div className="h-[220px] flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    Loading compliance data...
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-[#9e5608] font-bold text-sm mb-4">
                Weight Progress
              </h2>
              <ProgressChart />
            </div>
          </div>

          {/* Bottom Section: My Tasks */}
          <div className="lg:order-3 order-2">
            <h2 className="text-[#9e5608] font-bold text-lg">My Tasks</h2>
            <TaskList
              plans={program?.plan}
              therapyPlan={clientUser?.therapyType}
              programTitle={program?.title}
              isProgramStarted={isProgramStarted}
              mealCount={
                clientUser?.dietPlanMealCount || user?.dietPlanMealCount
              }
            />
          </div>

          {/* Mobile Only: Measurements */}
          <div className="lg:hidden order-4">
            <Measeurement />
          </div>
        </div>

        {/* Right Sidebar Area - Desktop Only */}
        <div className="space-y-4 hidden lg:block">
          <DietPlanCard
            isProgramStarted={isProgramStarted}
            startDate={clientUser?.programStartDate || user?.programStartDate}
            dietPlanPdf={clientUser?.dietPlanPdf || user?.dietPlanPdf}
          />
          <ExpertsList expert={coaches} />
          <Measeurement />
          <NotificationsList />
          
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  );
}
