import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import { calculateRatingIncentive } from "../incentive/incentive.service.js";
import { CoachModel } from "./coach.model.js";
import User from "../auth/auth.model.js";
import mongoose from "mongoose";
import { getUserComplianceStats } from "../../utils/complianceCalculator.js";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { sendEmail } from "../../utils/email.js";

export const createCoach = async (coach) => {
  // Parse JSON stringified fields from FormData
  const fieldsToParseAsJSON = [
    "workingHours",
    "breakSlots",
    "workingdays",
    "specialization",
    "chooseProgram",
    "chooseTherapy",
    "languages",
  ];
  const booleanFields = [
    // "ratingIncentive",
    // "responseTimeIncentive",
    // "complianceIncentive",
    "autoSendWelcome",
    "autoSendGuide",
    "automatedReminder",
  ];

  // Parse JSON strings
  fieldsToParseAsJSON.forEach((field) => {
    if (coach[field] && typeof coach[field] === "string") {
      try {
        coach[field] = JSON.parse(coach[field]);
      } catch (e) {
        console.error(`Failed to parse ${field}:`, e);
      }
    }
  });

  // Convert boolean strings to actual booleans
  booleanFields.forEach((field) => {
    if (coach[field] !== undefined) {
      coach[field] = coach[field] === "true" || coach[field] === true;
    }
  });

  let plainPassword;
  if (coach.password) {
    plainPassword = coach.password;
  } else {
    plainPassword = generatePassword();
    console.log("Generated Password for Coach:", plainPassword);
  }

  const hashedPassword = await hashPassword(plainPassword);

  const coachCreated = await CoachModel.create({
    name: capitalizeFirst(coach.fullname),
    dob: coach.dob,
    gender: coach.gender,
    password: hashedPassword,
    // ratingIncentive: coach.ratingIncentive,
    // responseTimeIncentive: coach.responseTimeIncentive,
    // complianceIncentive: coach.complianceIncentive,
    autoSendWelcome: coach.autoSendWelcome,
    autoSendGuide: coach.autoSendGuide,
    automatedReminder: coach.automatedReminder,
    email: coach.email,
    phone: coach.phone,
    address: coach.address,
    role: coach.role,
    adminId: coach.adminId,
    specialization: coach.specialization,
    experience: coach.experience,
    qualification: coach.qualification,
    certifications: coach.certifications,
    languages: coach.languages,
    assignedPrograms: coach.chooseProgram ?? null,
    assignedTherapy: coach.chooseTherapy ?? null,
    maxClient: coach.clientLimit,
    workingDays: coach.workingdays,
    workingHours: coach.workingHours,
    breakSlots: coach.breakSlots,
    maxDailyConsults: coach.dailyConsults,
    responseTime: coach.responseTime,
    salary: coach.baseSalary,
    status: "Active",
  });

  await AdminModel.findByIdAndUpdate(
    coach.adminId,
    { $addToSet: { experts: coachCreated._id } },
    { new: true },
  );

  await sendEmail({
    to: coach.email,
    subject: "Welcome to fitness - Your Login Credentials",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9e5608; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials-box { background-color: white; border-left: 5px solid #9e5608; padding: 20px; margin: 20px 0; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to fitness!</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${coach.fullname}</strong>,</p>
            <p>Your Expert account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials-box">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${coach.email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${plainPassword}</p>
            </div>
            
            <p>Please log in and change your password immediately for security purposes.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/login" style="background-color: #9e5608; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} fitness. All rights reserved.</p>
            <p>This email was sent to ${coach.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return coachCreated;
};

export const getAllCoach = async (page, limit) => {
  const skip = (page - 1) * limit;

  return await CoachModel.find().skip(skip).limit(limit);
};

export const getCoachById = async (coachId) => {
  const coach = await CoachModel.findById(coachId)
    .select("-password")
    .populate({
      path: "assignedUsers",
      select: "-password",
      populate: [
        {
          path: "programType",
          populate: { path: "plan" },
        },
        {
          path: "therapyType",
        },
      ],
    })
    .populate("assignedPrograms")
    .populate({
      path: "feedback.userId",
      select: "name",
    });

  if (!coach) return coach;

  const coachObj = coach.toObject();
  const assignedUsers = coachObj.assignedUsers || [];

  const usersWithCompliance = await Promise.all(
    assignedUsers.map(async (user) => {
      const stats = await getUserComplianceStats(
        user._id,
        user?.programType?.plan,
        user?.therapyType,
        user?.programType?.title,
      );
      return {
        ...user,
        compliance: stats?.overall ?? 0,
      };
    }),
  );

  coachObj.assignedUsers = usersWithCompliance;
  return coachObj;
};

export const updateCoachById = async (coachId, updatedData) => {
  const fieldsToParseAsJSON = [
    "workingHours",
    "breakSlots",
    "workingDays", 
    "specialization",
    "chooseProgram",
    "chooseTherapy",
    "languages",
  ];

  const booleanFields = [
    "autoSendWelcome",
    "autoSendGuide",
    "automatedReminder",
  ];

  // Parse JSON strings if present in updatedData
  fieldsToParseAsJSON.forEach((field) => {
    if (updatedData[field] && typeof updatedData[field] === "string") {
      try {
        updatedData[field] = JSON.parse(updatedData[field]);
      } catch (e) {
        console.error(`Failed to parse ${field}:`, e);
      }
    }
  });

  // Convert boolean strings to actual booleans if present
  booleanFields.forEach((field) => {
    if (updatedData[field] !== undefined) {
      updatedData[field] = updatedData[field] === "true" || updatedData[field] === true;
    }
  });
  
  // Transform fields to match schema
  if (updatedData.chooseProgram) {
    updatedData.assignedPrograms = updatedData.chooseProgram;
    delete updatedData.chooseProgram;
  }
  if (updatedData.chooseTherapy) {
    updatedData.assignedTherapy = updatedData.chooseTherapy;
    delete updatedData.chooseTherapy;
  }


  return await CoachModel.updateOne({ _id: coachId }, { $set: updatedData });
};

export const deleteCoachById = async (coachId) => {
  return await CoachModel.findByIdAndDelete(coachId);
};

export const AssignCoachToUser = async (coachId, userId) => {
  return await CoachModel.findByIdAndUpdate(
    coachId,
    { $addToSet: { assignedUsers: userId } },
    { new: true },
  );
};

export const getUsersAssignedToACoach = async (coachId, page, limit) => {
  const skip = (page - 1) * limit;

  const coach = await CoachModel.findById(coachId).select("assignedUsers");

  if (!coach) {
    return { users: [], total: 0 };
  }

  const total = coach.assignedUsers.length;

  const paginatedCoach = await CoachModel.findById(coachId)
    .select("assignedUsers")
    .populate({
      path: "assignedUsers",
      select: "-password",
      options: {
        skip: skip,
        limit: limit,
      },
    });

  return {
    users: paginatedCoach.assignedUsers,
    total: total,
  };
};

export const getCoachesByAdmin = async ({ adminIds }) => {
  let coaches = adminIds.map((adminId) =>
    CoachModel.findOne({ _id: adminId })
      .select("-password")
      .populate("assignedPrograms"),
  );
  return await Promise.all(coaches);
};

const calculateAvgRating = (feedback = []) => {
  if (!feedback.length) return 0;
  const total = feedback.reduce((sum, f) => sum + f.rating, 0);
  return Number((total / feedback.length).toFixed(1));
};

export const createFeedback = async (expertId, userId, rating, feedback) => {
  const exists = await CoachModel.findOne({
    _id: expertId,
    "feedback.userId": userId,
  });

  if (exists) {
    throw new Error("You have already submitted a review for this coach");
  }
  // Push feedback
  const coach = await CoachModel.findByIdAndUpdate(
    expertId,
    { $push: { feedback: { userId, rating, feedback } } },
    { new: true },
  );

  if (!coach) throw new Error("Coach not found");

  const avgRating = calculateAvgRating(coach.feedback);

  const avgrating = await CoachModel.findByIdAndUpdate(
    expertId,
    { avgRating },
    { new: true },
  );

  await calculateRatingIncentive(expertId);

  return avgrating;
};

export const getCoachDashboardStats = async (coachId) => {
  const coach = await CoachModel.findById(coachId).select(
    "avgRating adminId assignedPrograms role assignedTherapy maxClient assignedUsers",
  );
  if (!coach) {
    throw new Error("Coach not found");
  }

  const coachObjectId = new mongoose.Types.ObjectId(coachId);

  // Dynamically count assigned clients from User model
  const totalClients = await User.find({
    $or: [
      { trainer: coachObjectId },
      { dietition: coachObjectId },
      { therapist: coachObjectId },
    ],
  })
    .populate({ path: "programType", populate: { path: "plan" } })
    .populate("therapyType");

  // Count programs: Start with what is assigned directly to the coach
  let totalPrograms = coach.assignedPrograms?.length || 0;

  let therapyCount = coach.assignedTherapy?.length || 0;

  // If direct assignments are 0, fallback to checking their associated admin's program list
  if (totalPrograms === 0 && coach.adminId) {
    const admin = await AdminModel.findById(coach.adminId).select("program");
    totalPrograms = admin?.program?.length || 0;
  }
  const roleMap = {
    trainer: "workout",
    dietician: "diet",
    therapist: "therapy",
  };

  const totalClientComplience = await Promise.all(
    totalClients.map((user) => {
      return getUserComplianceStats(
        user._id,
        user?.programType.plan,
        user?.therapyType,
        user?.programType?.title,
      );
    }),
  ).then((compliances) => {
    const totalCompliance = compliances.reduce(
      (sum, comp) => sum + comp[roleMap[coach.role.toLowerCase()]],
      0,
    );
    return totalClients.length
      ? (totalCompliance / totalClients.length).toFixed(2)
      : 0;
  });

  const avarageRating = coach.avgRating || 0;

  const clientLoad =
    (coach.assignedUsers.length / (coach.maxClient || 1)) * 100;
  return {
    totalCompliance: totalClientComplience,
    totalClients: totalClients.length,
    totalPrograms:
      coach.role.toLowerCase() === "therapist" ? therapyCount : totalPrograms,
    avarageRating,
    clientLoad: clientLoad.toFixed(2),
  };
};

export const founderCoachList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await CoachModel.countDocuments();

    const data = await CoachModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Admin =====
      {
        $lookup: {
          from: "admins",
          localField: "adminId",
          foreignField: "_id",
          as: "admin",
        },
      },

      // ===== Head =====
      {
        $lookup: {
          from: "heads",
          localField: "admin.headId",
          foreignField: "_id",
          as: "head",
        },
      },

      // ===== Category =====
      {
        $lookup: {
          from: "categories",
          localField: "head.programCategory",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          coachName: "$name",
          role: "$role",
          status: "$status",

          adminName: {
            $arrayElemAt: ["$admin.name", 0],
          },

          headName: {
            $arrayElemAt: ["$head.name", 0],
          },

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          clientCount: {
            $size: { $ifNull: ["$assignedUsers", []] },
          },

          maxClientLimit: "$maxClient",
          avgRating: "$avgRating",
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

export const getClientComplianceGraphData = async (coachId, duration) => {
  const coach = await CoachModel.findById(coachId).select("assignedUsers role");
  if (!coach) {
    throw new Error("Coach not found");
  }
  const coachObjectId = new mongoose.Types.ObjectId(coachId);

  // Dynamically get assigned clients from User model
  const totalClients = await User.find({
    $or: [
      { trainer: coachObjectId },
      { dietition: coachObjectId },
      { therapist: coachObjectId },
    ],
  })
    .populate({ path: "programType", populate: { path: "plan" } })
    .populate("therapyType");

  const complianceData = await Promise.all(
    totalClients.map((user) => {
      // duration is only for Monthwise data generation inside the function
      return getUserComplianceStats(
        user._id,
        user?.programType.plan,
        user?.therapyType,
        user?.programType?.title,
        duration,
      );
    }),
  );

  const monthsInput = Number(duration) || 12;
  const monthMap = {};

  // Pre-fill month map with ordered months for the duration
  // Logic: "Last X months" ending now.
  const orderedMonths = [];
  for (let i = monthsInput - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString("default", { month: "short" });
    orderedMonths.push(monthKey);

    monthMap[monthKey] = {
      High: 0,
      Medium: 0,
      Low: 0,
      total: 0
    };
  }

  complianceData.forEach((comp) => {
    // const roleKey = coach.role.toLowerCase(); // Unused?

    comp.monthwiseData.forEach((m) => {
      const month = m.month;

      // Only process if this month is within our desired range
      if (monthMap[month]) {
        const complianceValue = m.compliance;

        if (complianceValue >= 80) {
          monthMap[month].High++;
        } else if (complianceValue >= 50) {
          monthMap[month].Medium++;
        } else {
          monthMap[month].Low++;
        }
        monthMap[month].total++;
      }
    });
  });

  // Map result using the ordered list to ensure order
  const monthwiseComplianceGraph = orderedMonths.map(month => {
    const data = monthMap[month];
    const total = data.total || 1; // Avoid division by zero, though if total is 0, numerators are 0.
    return {
      month,
      High: data.total ? Math.round((data.High / data.total) * 100) : 0,
      Medium: data.total ? Math.round((data.Medium / data.total) * 100) : 0,
      Low: data.total ? Math.round((data.Low / data.total) * 100) : 0
    };
  });

  return {
    duration,
    totalClients: totalClients.length,
    monthwiseCompliance: monthwiseComplianceGraph,
  };
};

export const getMonthWiseAverageRating = async (coachId, duration) => {
  const coach = await CoachModel.findById(coachId).select("feedback");
  if (!coach) {
    throw new Error("Coach not found");
  }

  const months = Number(duration) || 12;
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - months);

  // Initialize map for all months in range
  const monthMap = {};
  for (let i = 0; i < months; i++) {
    const d = new Date(startDate);
    d.setMonth(startDate.getMonth() + i + 1); // Start from next month to include current month at end? Or aligned with duration?
    // Let's use a standard "Last X Months" approach ending at current month
    const dateCalc = new Date();
    dateCalc.setMonth(dateCalc.getMonth() - i);
    const monthKey = dateCalc.toLocaleString("default", { month: "short" });
    monthMap[monthKey] = { totalRating: 0, count: 0 };
  }

  // Filter and aggregate feedback
  coach.feedback.forEach((f) => {
    const feedbackDate = new Date(f.createdAt);
    if (feedbackDate >= startDate && feedbackDate <= now) {
      const monthKey = feedbackDate.toLocaleString("default", { month: "short" });
      if (monthMap[monthKey]) {
        monthMap[monthKey].totalRating += f.rating;
        monthMap[monthKey].count += 1;
      } else {
        // Handle edge case if map generation didn't cover strict dates or sorting
        // But for "Last X months" graph, we usually just want the keys we generated
      }
    }
  });

  // Convert to array and ensure chronological order (naive approach: assume API consumer handles sorting or we return in order)
  // Re-generating keys in chronological order for result
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString("default", { month: "short" });

    const data = monthMap[monthKey];
    result.push({
      month: monthKey,
      rating: data && data.count > 0 ? Number((data.totalRating / data.count).toFixed(1)) : 0
    });
  }

  return {
    duration,
    ratingData: result
  };
};
