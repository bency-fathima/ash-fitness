import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import mongoose from "mongoose";
import HabitModel from "../habit/habit.model.js";

export const getAllClient = async (page, limit) => {
  const skip = (page - 1) * limit;
  const totalCount = await User.countDocuments({ role: "user" });
  const clients = await User.find({ role: "user" })
    .skip(skip)
    .limit(limit)
    .select("-password");
  return { clients, totalCount };
};

export const getSingleClient = async (id) => {
  const client = await User.findById(id)
    .select("-password")
    .populate({ path: "programType", populate: { path: "plan" } })
    .populate("therapyType")
    .populate("trainer")
    .populate("dietition")
    .populate("therapist")
    .populate("therapyType");
  return client;
};

export const updateOneClient = async (userData, id) => {
  const client = await User.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true },
  ).select("-password");
  return client;
};

export const deleteOneClient = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const getClientsBasedOnCoach = async (coachIds, page, limit) => {
  const skip = (page - 1) * limit;

  // Ensure coachIds is an array
  const ids = Array.isArray(coachIds) ? coachIds : [coachIds];

  const query = {
    $or: [
      { trainer: { $in: ids } },
      { dietition: { $in: ids } },
      { therapist: { $in: ids } },
    ],
    role: "user",
  };

  const totalCount = await User.countDocuments(query);
  const clients = await User.find(query)
    .skip(skip)
    .limit(limit)
    .select("-password")
    .populate("trainer")
    .populate("dietition")
    .populate("therapist");

  return { clients, totalCount };
};

export const updateWeightService = async (userId, currentWeight) => {
  if (!currentWeight) {
    throw new Error("Current weight is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.weightHistory || user.weightHistory.length === 0) {
    user.weightHistory = [
      {
        weight: currentWeight,
        date: new Date(),
        isInitial: true,
      },
    ];
  } else {
    // Push subsequent weights
    user.weightHistory.push({
      weight: currentWeight,
      date: new Date(),
      isInitial: false,
    });
  }

  // Update current weight
  user.currentWeight = currentWeight;

  await user.save();

  return user;
};

export const assignDietPlanService = async (userId, dietPlanData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        dietPlanPdf: dietPlanData.dietPlanPdf,
        dietPlanMealCount: dietPlanData.dietPlanMealCount,
      },
    },
    { new: true },
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateMeasurementsService = async (
  userId,
  { chest, waist, hip },
) => {
  const updateFields = {};
  const historyEntry = {};

  if (chest !== undefined) {
    updateFields["measurements.chest"] = chest;
    historyEntry.chest = chest;
  }

  if (waist !== undefined) {
    updateFields["measurements.waist"] = waist;
    historyEntry.waist = waist;
  }

  if (hip !== undefined) {
    updateFields["measurements.hip"] = hip;
    historyEntry.hip = hip;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No measurements provided");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateFields,
      $push: {
        measurementHistory: {
          ...historyEntry,
          date: new Date(),
        },
      },
    },
    { new: true },
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllFeedbacksService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { "feedback.userId": new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$feedback" },
    { $match: { "feedback.userId": new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        feedbacks: [
          { $sort: { "feedback.createdAt": -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              role: 1,
              feedback: ["$feedback"],
            },
          },
        ],
      },
    },
  ];

  const result = await CoachModel.aggregate(pipeline);

  const feedbacks = result[0].feedbacks;
  const totalCount = result[0].totalCount[0]?.count || 0;

  return { feedbacks, totalCount };
};

export const fetchWeightHistoryService = async (userId) => {
  const user = await User.findById(userId).select(
    "weightHistory currentWeight",
  );

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const sortedHistory = user.weightHistory
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: item.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      weight: item.weight,
    }));

  return {
    currentWeight: user.currentWeight,
    weightHistory: sortedHistory,
  };
};

export const fetchMeasurementHistory = async (userId) => {
  const user = await User.findById(userId).select("measurementHistory");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const sortedHistory = user.measurementHistory
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: item.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      chest: item.chest,
      waist: item.waist,
      hip: item.hip,
    }));

  return {
    measurementHistory: sortedHistory,
  };
};

export const founderClientList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await User.countDocuments();

    const data = await User.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Program =====
      {
        $lookup: {
          from: "programslists",
          localField: "programType",
          foreignField: "_id",
          as: "program",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          userName: "$name",
          status: "$status",

          programName: {
            $arrayElemAt: ["$program.title", 0],
          },

          durationTaken: "$duration",
          programStartDate: "$programStartDate",
          programEndDate: "$programEndDate",

          // ✅ Coach roles only
          coachRoles: {
            $filter: {
              input: [
                { $cond: [{ $ifNull: ["$trainer", false] }, "Trainer", null] },

                {
                  $cond: [
                    { $ifNull: ["$dietition", false] },
                    "Dietitian",
                    null,
                  ],
                },
                {
                  $cond: [
                    { $ifNull: ["$therapist", false] },
                    "Therapist",
                    null,
                  ],
                },
              ],
              as: "role",
              cond: { $ne: ["$$role", null] },
            },
          },
        },
      },
    ]);

    return {
      data,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
};


export const fetchClientsWithHabitPlan = async () => {
   const clients = await User.find({ role: "user" });

   const clientsWithHabit = await Promise.all(
    clients.map(async (client) => {
      const habit = await HabitModel.findOne({ clientId: client._id });

      return {
        ...client.toObject(),
        hasHabitPlan: Boolean(habit),
        habitId: habit ? habit._id : null,
      };
    })
  );

  return clientsWithHabit;
};