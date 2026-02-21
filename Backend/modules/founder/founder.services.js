import { FounderModel } from "../../seeds/createAdmin.js";
import { AdminModel } from "../admin/admin.model.js";
import allProgramModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import TaskSubmission from "../taskSubmission/taskSubmission.model.js";


export const getDashboardData = async (adminDuration = "12m", expertDuration = "12m") => {
  const clients = await User.find({ role: "user" }).select(
    "_id createdAt status",
  );
  const totalClient = clients.length;
  const totalHeads = await HeadsModel.countDocuments();
  const totalAdmins = await AdminModel.countDocuments();
  const totalPrograms = await allProgramModel.countDocuments();
  const totalExperts = await CoachModel.countDocuments();
  const Trainers = await CoachModel.countDocuments({ role: "Trainer" });
  const Dietitians = await CoachModel.countDocuments({ role: "Dietician" });
  const Therapists = await CoachModel.countDocuments({ role: "Therapist" });

  const now = new Date();

  // Calculate Start Dates for each section
  let adminPerformanceStartDate = new Date();
  if (adminDuration === "3m") adminPerformanceStartDate.setMonth(now.getMonth() - 3);
  else if (adminDuration === "6m") adminPerformanceStartDate.setMonth(now.getMonth() - 6);
  else adminPerformanceStartDate.setMonth(now.getMonth() - 12);

  let expertPerformanceStartDate = new Date();
  if (expertDuration === "3m") expertPerformanceStartDate.setMonth(now.getMonth() - 3);
  else if (expertDuration === "6m") expertPerformanceStartDate.setMonth(now.getMonth() - 6);
  else expertPerformanceStartDate.setMonth(now.getMonth() - 12);

  const buildMonthLabels = (startDate) => {
    const labels = [];
    const monthsDiff =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());
    for (let i = 0; i <= monthsDiff; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      labels.push(d.toLocaleString("default", { month: "short" }));
    }
    return { labels, monthsDiff };
  };

  // --- Client Growth (last 12 months - fixed window for graph) ---
  const growthStartDate = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
  );
  const { labels: growthLabels, monthsDiff: growthMonthsDiff } =
    buildMonthLabels(growthStartDate);

  const activeData = [];
  const inactiveData = [];
  const newData = [];

  for (let i = 0; i <= growthMonthsDiff; i++) {
    const d = new Date(
      growthStartDate.getFullYear(),
      growthStartDate.getMonth() + i,
      1,
    );
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);

    const newClientsCount = clients.filter((c) => {
      const cDate = new Date(c.createdAt);
      return cDate >= d && cDate < nextMonth;
    }).length;
    newData.push(newClientsCount);

    const activeCount = clients.filter((c) => {
      const cDate = new Date(c.createdAt);
      return cDate < nextMonth && c.status === "Active";
    }).length;
    activeData.push(activeCount);

    const inactiveCount = clients.filter((c) => {
      const cDate = new Date(c.createdAt);
      return cDate < nextMonth && c.status === "Inactive";
    }).length;
    inactiveData.push(inactiveCount);
  }

  // --- Client Compliance (last 12 months - fixed window for graph) ---
  const complianceStartDate = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
  );
  const { labels: complianceLabels, monthsDiff: complianceMonthsDiff } =
    buildMonthLabels(complianceStartDate);

  const clientIds = clients.map((c) => c._id);
  let complianceStats = [];

  if (clientIds.length > 0) {
    complianceStats = await TaskSubmission.aggregate([
      { $match: { userId: { $in: clientIds } } },
      { $unwind: "$dailySubmissions" },
      { $unwind: "$dailySubmissions.exercises" },
      {
        $match: {
          "dailySubmissions.exercises.updatedAt": { $gte: complianceStartDate },
        },
      },
      {
        $project: {
          month: { $month: "$dailySubmissions.exercises.updatedAt" },
          year: { $year: "$dailySubmissions.exercises.updatedAt" },
          type: "$dailySubmissions.exercises.taskType",
          status: "$dailySubmissions.exercises.status",
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year", type: "$type" },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  }

  const complianceMap = {};
  complianceStats.forEach((stat) => {
    const key = `${stat._id.type}-${stat._id.month}-${stat._id.year}`;
    complianceMap[key] = stat;
  });

  const therapyData = [];
  const workoutData = [];
  const dietData = [];

  for (let i = 0; i <= complianceMonthsDiff; i++) {
    const d = new Date(
      complianceStartDate.getFullYear(),
      complianceStartDate.getMonth() + i,
      1,
    );
    const m = d.getMonth() + 1;
    const y = d.getFullYear();

    const getPct = (type) => {
      let dbType = type;
      if (type === "Diet") dbType = "Meal";
      const entry = complianceMap[`${dbType}-${m}-${y}`];
      if (!entry || entry.total === 0) return 0;
      return Math.round((entry.completed / entry.total) * 100);
    };

    therapyData.push(getPct("Therapy"));
    workoutData.push(getPct("Workout"));
    dietData.push(getPct("Diet"));
  }

  const graphData = {
    growth: {
      labels: growthLabels,
      datasets: [
        { label: "Active", data: activeData },
        { label: "Inactive", data: inactiveData },
        { label: "New", data: newData },
      ],
    },
    compliance: {
      labels: complianceLabels,
      datasets: [
        { label: "Diet", data: dietData },
        { label: "Workout", data: workoutData },
        { label: "Therapy", data: therapyData },
      ],
    },
  };

  // --- Latest Progress Reports ---
  const latestReports = await TaskSubmission.aggregate([
    {
      $match: {
        userId: { $in: clientIds },
        "dailySubmissions.exercises": { $exists: true, $ne: [] },
      },
    },
    { $unwind: "$dailySubmissions" },
    { $unwind: "$dailySubmissions.exercises" },
    {
      $sort: {
        "dailySubmissions.exercises.updatedAt": -1,
        "dailySubmissions.exercises.status": -1,
      },
    },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "coaches",
        localField: "user.trainer",
        foreignField: "_id",
        as: "trainer",
      },
    },
    {
      $lookup: {
        from: "coaches",
        localField: "user.dietition",
        foreignField: "_id",
        as: "dietitian",
      },
    },
    {
      $lookup: {
        from: "coaches",
        localField: "user.therapist",
        foreignField: "_id",
        as: "therapist",
      },
    },
    {
      $project: {
        clientName: "$user.name",
        taskType: "$dailySubmissions.exercises.taskType",
        status: "$dailySubmissions.exercises.status",
        updatedAt: "$dailySubmissions.exercises.updatedAt",
        trainerName: { $arrayElemAt: ["$trainer.name", 0] },
        dietitianName: { $arrayElemAt: ["$dietitian.name", 0] },
        therapistName: { $arrayElemAt: ["$therapist.name", 0] },
      },
    },
  ]);

  const formattedReports = latestReports.map((report) => {
    let expertName = "N/A";
    let expertType = "N/A";

    if (report.taskType === "Workout") {
      expertName = report.trainerName;
      expertType = "Trainer";
    } else if (report.taskType === "Meal" || report.taskType === "Diet") {
      expertName = report.dietitianName;
      expertType = "Dietitian";
    } else if (report.taskType === "Therapy") {
      expertName = report.therapistName;
      expertType = "Therapist";
    }

    return {
      name: report.clientName,
      type: report.taskType === "Meal" ? "Diet" : report.taskType,
      expert: expertType,
      submittedBy: expertName
        ? `${expertType} ${expertName.split(" ")[0]}`
        : "Client",
      time: report.updatedAt,
    };
  });

  // --- Expert Performance Metrics (Refined Calculations) ---

  // 1. Task Completion Rate (Progress vs Entire Plan - All Clients)
  // This calculates: (Total Verified Tasks) / (Total Tasks in Entire Program Plan)

  const clientProgressStats = await User.aggregate([
    { $match: { _id: { $in: clientIds } } },
    {
      $lookup: {
        from: "tasksubmissions",
        localField: "_id",
        foreignField: "userId",
        as: "submission"
      }
    },
    { $unwind: { path: "$submission", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "programslists",
        localField: "programType",
        foreignField: "_id",
        as: "program"
      }
    },
    { $unwind: { path: "$program", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "plans",
        localField: "program.plan",
        foreignField: "_id",
        as: "plan"
      }
    },
    { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        currentGlobalDay: 1,
        programTitle: "$program.title",
        planWeeks: "$plan.weeks",
        submissions: "$submission.dailySubmissions"
      }
    }
  ]);

  let totalExpectedTasks = 0;
  let totalVerifiedTasks = 0;

  clientProgressStats.forEach(client => {
    const currentDay = client.currentGlobalDay || 1;
    const isWeightLoss = (client.programTitle || "").toLowerCase().includes("weight loss");
    const mealsPerDay = isWeightLoss ? 5 : 6;

    // Calculate expected tasks up to current day
    const weeks = client.planWeeks || [];
    let dayCounter = 0;
    let expectedForClient = 0;

    for (const week of weeks) {
      for (const day of week.days || []) {
        dayCounter++;
        if (dayCounter <= currentDay) {
          const workoutTasks = (day.exercises || []).length;
          expectedForClient += workoutTasks + mealsPerDay;
        }
        if (dayCounter >= currentDay) break;
      }
      if (dayCounter >= currentDay) break;
    }

    totalExpectedTasks += expectedForClient;

    // Count ALL verified tasks (no day limit)
    const submissions = client.submissions || [];
    submissions.forEach(daySub => {
      (daySub.exercises || []).forEach(ex => {
        if (ex.status === "verified") {
          totalVerifiedTasks++;
        }
      });
    });
  });


  const taskCompletionRate = totalExpectedTasks > 0
    ? Math.round((totalVerifiedTasks / totalExpectedTasks) * 100)
    : 0;

  // 2. Average Rating (Average of all expert ratings)
  const performanceCoaches = await CoachModel.find({}).select("feedback avgRating maxClient");

  const coachesWithRating = performanceCoaches.filter(c => (c.avgRating || 0) > 0);
  const averageExpertRating = coachesWithRating.length > 0
    ? (coachesWithRating.reduce((acc, c) => acc + c.avgRating, 0) / coachesWithRating.length).toFixed(1)
    : 0;

  // 3. Clients Assigned Rate (Total Users / Sum of Max Capacities)
  const sumMaxCapacity = performanceCoaches.reduce((acc, c) => acc + (c.maxClient || 0), 0);
  const totalUsers = clients.length;

  const clientsAssignedRate = sumMaxCapacity > 0
    ? Math.round(Math.min((totalUsers / sumMaxCapacity) * 100, 100))
    : 0;

  // --- Admin Performance Metrics (Filtered by duration - new entities) ---
  const newProgramsCount = await allProgramModel.countDocuments({ createdAt: { $gte: adminPerformanceStartDate } });
  const newExpertsCount = await CoachModel.countDocuments({ createdAt: { $gte: adminPerformanceStartDate } });
  const newClientsCount = clients.filter(c => new Date(c.createdAt) >= adminPerformanceStartDate).length;

  return {
    totalClient,
    totalHeads,
    totalAdmins,
    totalPrograms,
    totalExperts,
    Trainers,
    Dietitians,
    Therapists,
    adminPerformance: {
      programs: adminDuration === "12m" ? totalPrograms : newProgramsCount,
      experts: adminDuration === "12m" ? totalExperts : newExpertsCount,
      clients: adminDuration === "12m" ? totalClient : newClientsCount
    },
    expertPerformance: {
      taskCompletion: taskCompletionRate,
      rating: averageExpertRating,
      clientsAssigned: clientsAssignedRate
    },
    graphData,
    latestReports: formattedReports,
  };
}

export const getFounderProfile = async (id) => {
  const profile = await FounderModel.findById(id).select("-password");
  return profile;
}
