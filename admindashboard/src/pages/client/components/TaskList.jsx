import React, { useState } from "react";
import TaskModal from "./TaskModal";
import WorkoutTasksModal from "./WorkoutTasksModal";
import TherapyTasksModal from "./TherapyTasksModal";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { selectToken, selectUser } from "@/redux/features/auth/auth.selectores";
import {
  getUserTaskStatus,
  uploadTask,
} from "@/redux/features/tasks/task.thunk";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { assets } from "@/assets/asset";
import { toast } from "react-toastify";

export default function TaskList({
  plans,
  therapyPlan,
  programTitle,
  isProgramStarted = true,
  mealCount,
}) {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workoutTasks, setWorkoutTasks] = useState([]);
  const [isTherapyModalOpen, setIsTherapyModalOpen] = useState(false);
  const [therapyModalTasks, setTherapyModalTasks] = useState([]);
  const [skipConfirmation, setSkipConfirmation] = useState({
    isOpen: false,
    task: null,
  });

  const clientUser = useAppSelector(selectSelectedClient);

  const currentGlobalDay =
    clientUser?.currentGlobalDay || user?.currentGlobalDay || 1;

  useEffect(() => {
    dispatch(getUserTaskStatus());

    if (user?._id && token) {
      // Socket.IO Setup
      socket.auth = { userId: user?._id, token: token };
      socket.connect();

      socket.on("connect", () => {
        console.log("Client task socket connected");
      });

      socket.on("task_status_updated", () => {
        dispatch(getUserTaskStatus()); // Refresh task list
      });

      socket.on("day_advanced", () => {
        // Refresh user profile to get updated currentGlobalDay and task list
        dispatch(refreshProfile({ id: user?._id, role: user.role }));
        dispatch(getUserTaskStatus());
      });

      return () => {
        socket.off("connect");
        socket.off("task_status_updated");
        socket.off("day_advanced");
        socket.disconnect();
      };
    }
  }, [dispatch, user?._id, token, user?.role]);

  const days =
    plans?.weeks?.flatMap((week, weekIndex) =>
      week.days.map((day, dayIndex) => ({
        ...day,
        weekIndex: weekIndex + 1,
        dayIndex: dayIndex + 1,
        globalIndex: weekIndex * 7 + dayIndex + 1,
        exercises: day.exercises,
      })),
    ) || [];

  const currentDayData = days[currentGlobalDay - 1];
  const workoutExercises =
    currentDayData?.exercises?.map((ex, index) => {
      const submission = tasks?.find(
        (t) =>
          t.globalDayIndex === currentGlobalDay &&
          t.exerciseIndex === index &&
          t.taskType === "Workout",
      );
      return {
        ...ex,
        type: "Workout",
        programId: plans.program,
        weekIndex: currentDayData.weekIndex,
        dayIndex: currentDayData.dayIndex,
        globalDayIndex: currentGlobalDay,
        exerciseIndex: index,
        status: submission?.status || "todo",
        submission,
      };
    }) || [];

  const isWeightLoss = programTitle?.toLowerCase().includes("weight loss");
  const defaultMealCount = isWeightLoss ? 5 : 6;
  const numberOfMeals = mealCount || defaultMealCount;
  const mealNames = Array.from(
    { length: numberOfMeals },
    (_, i) => `Meal ${i + 1}`,
  );

  const mealTasks = mealNames.map((mealName, index) => {
    const mealIndex = 100 + index; // Use a high index range for static meals to avoid collisions
    const submission = tasks?.find(
      (t) =>
        t.globalDayIndex === currentGlobalDay &&
        t.exerciseIndex === mealIndex &&
        t.taskType === "Meal",
    );
    return {
      name: mealName,
      type: "Meal",
      notes: "Log your meal photo/video for review.",
      programId: plans?.program,
      weekIndex: currentDayData?.weekIndex || 1,
      dayIndex: currentDayData?.dayIndex || 1,
      globalDayIndex: currentGlobalDay,
      exerciseIndex: mealIndex,
      status: submission?.status || "todo",
      submission,
    };
  });

  const therapyDays =
    therapyPlan?.weeks?.flatMap((week, weekIndex) =>
      week.days.map((day, dayIndex) => ({
        ...day,
        weekIndex: weekIndex + 1,
        dayIndex: dayIndex + 1,
        globalIndex: weekIndex * 7 + dayIndex + 1,
      })),
    ) || [];

  const todayTherapy = therapyDays.find(
    (day) => day.globalIndex === currentGlobalDay,
  );

  const therapyTasks =
    todayTherapy?.therapies?.map((therapy, index) => {
      const submission = tasks?.find(
        (t) =>
          t.globalDayIndex === currentGlobalDay &&
          t.exerciseIndex === index &&
          t.taskType === "Therapy",
      );

      return {
        name: therapy.type || "Therapy Task",
        type: "Therapy",
        notes: therapy.notes,
        mediaUrl: therapy.url,
        mediaName: therapy.mediaName,
        programId: plans?.program,
        weekIndex: todayTherapy.weekIndex,
        dayIndex: todayTherapy.dayIndex,
        globalDayIndex: currentGlobalDay,
        exerciseIndex: index,
        status: submission?.status || "todo",
        submission,
      };
    }) || [];

  // Group workout tasks into a single item
  const groupedTasks = [];

  if (workoutExercises.length > 0) {
    // Get overall status for all workout tasks
    const getWorkoutOverallStatus = () => {
      const allVerified = workoutExercises.every(
        (ex) => ex.status === "verified",
      );
      const anyPending = workoutExercises.some((ex) => ex.status === "pending");
      const anyRejected = workoutExercises.some(
        (ex) => ex.status === "rejected",
      );

      if (allVerified) return "verified";
      if (anyPending) return "pending";
      if (anyRejected) return "rejected";
      return "todo";
    };

    const workoutOverallStatus = getWorkoutOverallStatus();
    const workoutSubmission = workoutExercises.find((ex) => ex.submission);

    groupedTasks.push({
      name: "Workout",
      type: "WorkoutGroup",
      notes: `${workoutExercises.length} exercises`,
      status: workoutOverallStatus,
      submission: workoutSubmission?.submission,
      workoutTasks: workoutExercises,
      programId: workoutExercises[0].programId,
      weekIndex: workoutExercises[0].weekIndex,
      dayIndex: workoutExercises[0].dayIndex,
      globalDayIndex: workoutExercises[0].globalDayIndex,
    });
  }

  // Group therapy tasks into a single item
  if (therapyTasks.length > 0) {
    const getTherapyOverallStatus = () => {
      const allVerified = therapyTasks.every((t) => t.status === "verified");
      const anyPending = therapyTasks.some((t) => t.status === "pending");
      const anyRejected = therapyTasks.some((t) => t.status === "rejected");

      if (allVerified) return "verified";
      if (anyPending) return "pending";
      if (anyRejected) return "rejected";
      return "todo";
    };

    const therapyOverallStatus = getTherapyOverallStatus();
    const therapySubmission = therapyTasks.find((t) => t.submission);

    groupedTasks.push({
      name: "Therapy",
      type: "TherapyGroup",
      notes: `${therapyTasks.length} tasks`,
      status: therapyOverallStatus,
      submission: therapySubmission?.submission,
      therapyTasks: therapyTasks,
      weekIndex: therapyTasks[0].weekIndex,
      dayIndex: therapyTasks[0].dayIndex,
      globalDayIndex: therapyTasks[0].globalDayIndex,
    });
  }

  // Add meal tasks individually
  groupedTasks.push(...mealTasks);

  const handleSkipTask = (task) => {
    setSkipConfirmation({ isOpen: true, task });
  };

  const confirmSkip = async () => {
    const task = skipConfirmation.task;
    if (!task) return;

    const formData = new FormData();
    formData.append("programId", task.programId); // Ensure programId is available in task object
    formData.append("weekIndex", task.weekIndex);
    formData.append("dayIndex", task.dayIndex);
    formData.append("globalDayIndex", task.globalDayIndex);
    formData.append("exerciseIndex", task.exerciseIndex);
    formData.append("taskType", "Meal");
    formData.append("status", "skipped");
    formData.append("notes", "Skipped by user");

    try {
      await dispatch(uploadTask(formData)).unwrap();
      // Refresh tasks handled by socket or manual refresh
      dispatch(getUserTaskStatus());
      setSkipConfirmation({ isOpen: false, task: null });
    } catch (error) {
      console.error("Failed to skip task:", error);
      toast.error("Failed to skip task: " + error);
    }
  };

  if (!isProgramStarted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-dashed border-[#9e5608]/30 mt-4">
        <h3 className="text-[#9e5608] font-bold text-lg mb-2">
          Your Plan Hasn't Started Yet
        </h3>
        <p className="text-gray-500 text-sm">
          Your tasks will appear here once your program begins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {groupedTasks?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img
              src={
                item.type === "WorkoutGroup"
                  ? assets.Workout
                  : item.type === "TherapyGroup"
                    ? assets.wl
                    : item.type === "Meal"
                      ? item.name?.toLowerCase().includes("breakfast")
                        ? assets.breakfast
                        : assets.MealPlaceholder
                      : assets.Workout
              }
              alt={item.type}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#9e5608] text-[15px]">
              {item.name || "Workout"}
            </h3>
            <p className="text-[12px] text-gray-500 font-medium truncate">
              {item.notes}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {item.submission && (
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  item.submission.status === "verified"
                    ? "bg-green-100 text-green-700"
                    : item.submission.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.submission.status.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {item.type === "Meal" &&
              (!item.submission || item.submission.status === "todo") && (
                <button
                  onClick={() => handleSkipTask(item)}
                  className="bg-gray-50 px-6 py-2 rounded-lg text-[13px] font-bold text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  Skip
                </button>
              )}
            <button
              onClick={() => {
                if (item.type === "WorkoutGroup") {
                  setWorkoutTasks(item.workoutTasks);
                  setIsWorkoutModalOpen(true);
                } else if (item.type === "TherapyGroup") {
                  setTherapyModalTasks(item.therapyTasks);
                  setIsTherapyModalOpen(true);
                } else {
                  setSelectedTask(item);
                  setIsOpen(true);
                }
              }}
              className="bg-[#9e5608] text-[13px] font-bold px-6 py-2 text-white rounded-lg hover:bg-[#083d38] transition-colors"
            >
              View
            </button>
          </div>
        </div>
      ))}

      {isOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsOpen(!isOpen)}
          onSuccess={() => dispatch(getUserTaskStatus())}
        />
      )}

      {isWorkoutModalOpen && (
        <WorkoutTasksModal
          workoutTasks={workoutTasks}
          onClose={() => setIsWorkoutModalOpen(false)}
          onSuccess={() => dispatch(getUserTaskStatus())}
        />
      )}

      {isTherapyModalOpen && (
        <TherapyTasksModal
          therapyTasks={therapyModalTasks}
          onClose={() => setIsTherapyModalOpen(false)}
          onSuccess={() => dispatch(getUserTaskStatus())}
        />
      )}

      {/* Skip Confirmation Modal */}
      {skipConfirmation.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl transform transition-all scale-100">
            <h3 className="text-lg font-bold text-[#9e5608] mb-2">
              Skip this meal?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to skip this meal? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setSkipConfirmation({ isOpen: false, task: null })
                }
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSkip}
                className="flex-1 px-4 py-2 rounded-lg bg-[#9e5608] text-white font-medium hover:bg-[#083d38] transition-colors"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
