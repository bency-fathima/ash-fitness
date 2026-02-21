import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import DailyTaskDrawer from "./DailyTaskDrawer";
import MobileBottomNav from "../components/MobileBottomNav";
import { useDispatch } from "react-redux";
import { getUserTaskStatus, uploadTask } from "@/redux/features/tasks/task.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { getClient } from "@/redux/features/client/client.thunk";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { assets } from "@/assets/asset";
import { toast } from "react-toastify";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyPlan() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // Current month (0-based)
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [program, setProgram] = useState(null);
  const [therapyPlan, setTherapyPlan] = useState(null);
  const [calendarData, setCalendarData] = useState({});

  // Fetch program, therapy plan and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getClient({ id: user?._id }));

        if (user?.programType) {
          const programId =
            typeof user.programType === "object"
              ? user.programType?._id
              : user.programType;
          const programData = await dispatch(
            getProgramById(programId),
          ).unwrap();
          setProgram(programData.data);
        }

        await dispatch(getUserTaskStatus()).unwrap();
      } catch (error) {
        console.error("Error fetching daily plan data:", error);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [dispatch, user?._id, user?.programType]);

  // Set therapy plan when clientUser is populated
  useEffect(() => {
    if (clientUser?.therapyType && typeof clientUser.therapyType === 'object') {
       if (clientUser.therapyType.weeks) {
         setTherapyPlan(clientUser.therapyType);
       }
    }
  }, [clientUser]);

  const isProgramStarted = React.useMemo(() => {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    if (!startDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    return today >= start;
  }, [user?.programStartDate, clientUser?.programStartDate]);

  // Calculate calendar data based on tasks and program
  useEffect(() => {
    if (!program || !tasks) return;

    const newCalendarData = {};
    const programStartDateStr =
      clientUser?.programStartDate || user?.programStartDate;

    if (!programStartDateStr) return; // Don't generate calendar if no start date

    // Normalize start date to midnight
    let iteratorDate = new Date(programStartDateStr);
    iteratorDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDateKey = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;

    // Flatten and sort program days
    const sortedDays =
      program?.plan?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex: weekIndex + 1,
          dayIndex: dayIndex + 1,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ).sort((a, b) => a.globalIndex - b.globalIndex) || [];

    // Flatten therapy days if available
    const sortedTherapyDays =
      therapyPlan?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex: weekIndex + 1,
          dayIndex: dayIndex + 1,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ) || [];

    let programIndex = 0;
    const MAX_DAYS = 1000;
    let loopCount = 0;

    // Iterate through calendar days mapping program days to them
    while (programIndex < sortedDays.length && loopCount < MAX_DAYS) {
      loopCount++;
      const currentPDay = sortedDays[programIndex];
      const currentTherapyDay = sortedTherapyDays.find(d => d.globalIndex === currentPDay.globalIndex);
      
      const dateKey = getDateKey(iteratorDate);
      const isBeforeToday = iteratorDate < today;

      // Get all submissions for this specific program day
      const dayTasks = tasks.filter(
        (t) => t.globalDayIndex === currentPDay.globalIndex,
      );

      // Check if user has ANY activity for this Program Day on this Calendar Date

      const hasActivityOnDate = dayTasks.some((t) => {
        if (t.status === "todo") return false;
        const tDate = new Date(t.updatedAt);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === iteratorDate.getTime();
      });

      let mapDayToDate = false;

      if (isBeforeToday) {
        // In the past, we only map the program day if the user actually did it then.
        if (hasActivityOnDate) {
          mapDayToDate = true;
        } else {

          mapDayToDate = false;
        }
      } else {
        mapDayToDate = true;
      }

      if (mapDayToDate) {
        // Build the task list for this day
        const taskList = [];
        const isWeightLoss = program?.title?.toLowerCase().includes("weight loss");
        const defaultMealCount = isWeightLoss ? 5 : 6;
        const mealCount = clientUser?.dietPlanMealCount || user?.dietPlanMealCount || defaultMealCount;

        const workoutCount = currentPDay.exercises?.length || 0;
        const therapyCount = currentTherapyDay?.therapies?.length || 0;
        const totalExpected = workoutCount + mealCount + therapyCount;

        // Helper to process individual task items
        const processItem = (idx, type, name, meta = {}) => {
          const submission = dayTasks.find(
            (t) =>
              t.exerciseIndex === idx &&
              t.taskType === type,
          );
          
          let status = submission ? submission.status : "todo";
          
    
          
          taskList.push({
            name: name,
            status: status,
            type: type,
            globalDayIndex: currentPDay.globalIndex,
            weekIndex: currentPDay.weekIndex,
            dayIndex: currentPDay.dayIndex,
            exerciseIndex: idx,
            programId: program?._id,
            ...meta
          });
        };

        currentPDay.exercises?.forEach((ex, idx) => {
          processItem(idx, "Workout", ex.name || `Exercise ${idx + 1}`);
        });

        for (let i = 0; i < mealCount; i++) {
          processItem(100 + i, "Meal", `Meal ${i + 1}`);
        }
        
        // Process Therapy Tasks
        if (currentTherapyDay && currentTherapyDay.therapies) {
           currentTherapyDay.therapies.forEach((therapy, idx) => {
              processItem(idx, "Therapy", therapy.type || "Therapy Task", {
                  notes: therapy.notes,
                  mediaUrl: therapy.url
              });
           });
        }

        // Calculate stats
        const verified = taskList.filter((t) => t.status === "verified").length;
        const pending = taskList.filter((t) => t.status === "pending").length;
        const rejected = taskList.filter((t) => t.status === "rejected").length;
        const skipped = taskList.filter((t) => t.status === "skipped").length;
        const missed = taskList.filter((t) => t.status === "missed").length;
        const todo = taskList.filter((t) => t.status === "todo").length;

        const summary = [];
        if (rejected > 0) summary.push({ type: "rejected", count: rejected });
        if (pending > 0) summary.push({ type: "pending", count: pending });
        if (skipped > 0) summary.push({ type: "skipped", count: skipped });
        if (missed > 0) summary.push({ type: "missed", count: missed });
        if (todo > 0) summary.push({ type: "todo", count: todo });
        if (verified > 0) summary.push({ type: "verified", count: verified });

        newCalendarData[dateKey] = {
          summary,
          tasks: taskList,
          verified,
          pending,
          rejected,
          skipped,
          missed,
          todo,
          totalExpected,
          allMissed: false,
        };
        // Advance to next Program Day
        programIndex++;
      } else {
        // This calendar date was missed/skipped
        newCalendarData[dateKey] = {
          summary: [{ type: "not_logged_in", count: 1 }],
          tasks: [],
          verified: 0,
          pending: 0,
          rejected: 0,
          skipped: 0,
          missed: 0,
          todo: 0,
          totalExpected: 0,
          allMissed: true,
        };
        // Do NOT advance programIndex (try again next date)
      }

      // Always advance calendar date
      iteratorDate.setDate(iteratorDate.getDate() + 1);
    }
    
    setCalendarData(newCalendarData);
  }, [program, therapyPlan, tasks, user?.programStartDate, clientUser?.programStartDate]);

  if (!isProgramStarted) {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    return (
      <>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
          <h1 className="text-[18px] font-bold text-[#181E27]">Daily Plan</h1>
        </div>

        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <div className="bg-[#E6EEED] p-4 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-[#9e5608] opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-[#9e5608] mb-2">
            Program Hasn't Started Yet
          </h2>
          <p className="text-gray-500 max-w-md">
            Your program is scheduled to start on{" "}
            <b>{new Date(startDate).toLocaleDateString("en-US", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</b>.
            Your daily plan will be available then.
          </p>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  const handleSkipTask = async (task) => {
    if (task.type !== "Meal") return;

    // Optimistic update locally could be done here, but let's rely on re-fetch or socket for now.
    // Or dispatch returns the new submission.

    const formData = new FormData();
    formData.append("programId", task.programId);
    formData.append("weekIndex", task.weekIndex);
    formData.append("dayIndex", task.dayIndex);
    formData.append("globalDayIndex", task.globalDayIndex);
    formData.append("exerciseIndex", task.exerciseIndex);
    formData.append("taskType", "Meal");
    formData.append("status", "skipped");
    formData.append("notes", "Skipped by user");

    try {
      await dispatch(uploadTask(formData)).unwrap();
      // Refresh tasks
      await dispatch(getUserTaskStatus());
    } catch (error) {
      console.error("Failed to skip task:", error);
      toast.error("Failed to skip task: " + error);
    }
  };

  const today = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Build calendar grid including previous month's trailing days
  const dates = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({ day: i, isCurrentMonth: true });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const filterTasks = (summary) => {
    if (selectedStatus === "All Status") return summary;
    return summary?.filter(
      (task) => task.type.toLowerCase() === selectedStatus.toLowerCase(),
    );
  };

  const handleDateClick = (fullDate) => {
    if (fullDate) {
      setSelectedDate(fullDate);
    }
  };

  return (
    <div className="bg-white lg:rounded-2xl lg:p-8 p-4 lg:shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-8">
        <h2 className="font-bold text-[18px] lg:text-[20px] text-[#9e5608]">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <div className="flex gap-3 lg:gap-4 items-center">
          <div className="relative flex-1 lg:flex-initial">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 lg:px-4 py-2 pr-10 text-[12px] lg:text-[13px] font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9e5608]/20"
            >
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Rejected</option>
              <option>Skipped</option>
              <option>Missed</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-3 lg:mb-4">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] lg:text-[13px] font-medium text-gray-500 py-2 lg:py-3"
          >
            <span className="hidden lg:inline">{d}</span>
            <span className="lg:hidden">{d.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-gray-200">
        {dates.map((dateObj, index) => {
          const { day, isCurrentMonth } = dateObj;
          const fullDate = isCurrentMonth
            ? `${currentYear}-${String(currentMonth + 1).padStart(
                2,
                "0",
              )}-${String(day).padStart(2, "0")}`
            : null;

          const tasksForDay = fullDate ? calendarData[fullDate] : null;
          const filteredTasks = tasksForDay?.summary
            ? filterTasks(tasksForDay.summary)
            : null;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(fullDate)}
              className={`min-h-[80px] lg:min-h-[120px] border-r border-b border-gray-200 p-2 lg:p-3 relative cursor-pointer hover:bg-gray-50/50 transition-colors ${
                !isCurrentMonth ? "bg-gray-50/30" : ""
              }`}
            >
              {isCurrentMonth && (
                <>
                  <span
                    className={`text-[11px] lg:text-[13px] font-medium ${
                      !isCurrentMonth ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>

                  {/* TODAY Badge */}
                  {fullDate === today && (
                    <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 right-2 lg:right-3 bg-[#9e5608] text-white text-[9px] lg:text-[11px] font-bold py-1 lg:py-1.5 rounded-lg text-center">
                      Today
                    </div>
                  )}

                  {/* TASKS */}
                  <div className="mt-1.5 lg:mt-2 space-y-1">
                    {filteredTasks?.map((task, i) => {
                      let badgeClasses = "";
                      if (task.type === "verified") {
                        badgeClasses =
                          "bg-green-50 border-green-200 text-green-700";
                      } else if (task.type === "pending") {
                        badgeClasses =
                          "bg-yellow-50 border-yellow-200 text-yellow-700";
                      } else if (task.type === "rejected") {
                        badgeClasses = "bg-red-50 border-red-200 text-red-700";
                      } else if (task.type === "missed") {
                        badgeClasses =
                          "bg-gray-100 border-gray-300 text-gray-700";
                      } else if (task.type === "skipped") {
                        badgeClasses =
                          "bg-orange-50 border-orange-200 text-orange-700";
                      } else if (task.type === "not_logged_in") {
                         badgeClasses =
                          "bg-red-50 border-red-200 text-red-700";
                      } else if (task.type === "todo") {
                        badgeClasses =
                           "bg-blue-50 border-blue-200 text-blue-700";
                      }

                      return (
                        <div
                          key={i}
                          className={`text-[9px] lg:text-[11px] font-medium px-1.5 lg:px-2 py-0.5 lg:py-1 rounded border truncate ${badgeClasses}`}
                        >
                          <span className="hidden lg:inline">
                            {task.type === "not_logged_in" ? "You were not logged in" : `${task.count} Task - ${task.type.charAt(0).toUpperCase() + task.type.slice(1)}`}
                          </span>
                          <span className="lg:hidden">
                             {task.type === "not_logged_in" ? "Not Logged In" : `${task.type.charAt(0).toUpperCase() + task.type.slice(1).substring(0, 5)}...`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <DailyTaskDrawer
        selectedDate={selectedDate}
        tasks={selectedDate ? calendarData[selectedDate]?.tasks : null}
        allMissed={selectedDate ? calendarData[selectedDate]?.allMissed : false}
        onClose={() => setSelectedDate(null)}
        onSkip={handleSkipTask}
      />
      <MobileBottomNav />
    </div>
  );
}
