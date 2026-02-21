import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { generatePassword, hashPassword } from "../../utils/password.js";
import allProgramaModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { AdminModel } from "./admin.model.js";
import TaskSubmission from "../taskSubmission/taskSubmission.model.js";
import { sendEmail } from "../../utils/email.js";

export const getAllAdmins = async (page, limit) => {
  const skip = (page - 1) * limit;
  const totalCount = await AdminModel.countDocuments();
  const admins = await AdminModel.find()
    .skip(skip)
    .limit(limit)
    .select("-password");

  const updated = admins.map((admin) => {
    const obj = admin.toObject();

    obj.experts = admin.experts ? admin.experts.length : 0;
    return obj;
  });

  return {
    updated,
    totalCount,
  };
};

export const addNewAdmin = async (adminData) => {
  let plainPassword;
  if (adminData.password) {
    plainPassword = adminData.password;
    adminData.password = await hashPassword(adminData.password);
  } else {
    plainPassword = generatePassword();
    console.log(plainPassword);
    adminData.password = await hashPassword(plainPassword);
  }

  const newAdmin = await AdminModel.create({
    name: capitalizeFirst(adminData.fullname),
    email: adminData.email,
    phone: adminData.phone,
    address: adminData.address,
    password: adminData.password,
    dob: adminData.dob,
    gender: adminData.gender,
    specialization: adminData.specialization,
    program: adminData.chooseProgram,
    salary: adminData.baseSalary,
    autoSendWelcome: adminData.autoSendWelcome,
    autoSendGuide: adminData.autoSendGuide,
    automatedReminder: adminData.automatedReminder,
    headId: adminData.headId,
    experience: adminData.experience,
    qualification: adminData.qualification,
  });

  await sendEmail({
    to: adminData.email,
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
            <p>Hello <strong>${adminData.fullname}</strong>,</p>
            <p>Your Admin account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials-box">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${adminData.email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${plainPassword}</p>
            </div>
            
            <p>Please log in and change your password immediately for security purposes.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/login" style="background-color: #9e5608; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} fitness. All rights reserved.</p>
            <p>This email was sent to ${adminData.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return newAdmin;
};

export const getAdminById = async (id) => {
  const admin = await AdminModel.findById(id).select("-password").populate("program")
  return admin;
};


export const getAllCoachesByAdmin = async ({ adminId, page, limit }) => {
  const skip = (page - 1) * limit;
  const admin = await AdminModel.findById(adminId).select("experts");
  const totalCount = admin?.experts?.length || 0;

  const populatedAdmin = await AdminModel.findById(adminId).populate({
    path: "experts",
    options: {
      skip: skip,
      limit: limit,
    },
  });

  return {
    coaches: populatedAdmin?.experts || [],
    totalCount: totalCount,
  };
};

export const getDashboardData = async (adminId, duration = "12m") => {

  const totalExperts = await AdminModel.find({ _id: adminId }).select("experts program").populate("experts program");
  const totalPrograms = totalExperts[0].program?.length;

  const expertIds = totalExperts[0]?.experts?.map(exp => exp._id) || [];

  // Calculate total capacity from all experts' maxClient values
  const totalCapacity = totalExperts[0]?.experts?.reduce((sum, expert) => {
    return sum + (expert.maxClient || 0);
  }, 0) || 0;

  const query = {
    $or: [
      { trainer: { $in: expertIds } },
      { dietition: { $in: expertIds } },
      { therapist: { $in: expertIds } },
    ],
    role: "user",
  };

  const clients = await User.find(query)

  // --- Graph Data Logic ---

  // 1. Calculate Start Date
  const now = new Date();
  let startDate = new Date();
  if (duration === "3m") startDate.setMonth(now.getMonth() - 3);
  else if (duration === "6m") startDate.setMonth(now.getMonth() - 6);
  else startDate.setMonth(now.getMonth() - 12); // Default 1y

  // 2. Client Growth Data (Active, Inactive, New) - Convert to Percentages
  const growthDataLabels = [];
  const activeData = [];
  const inactiveData = [];
  const newData = [];

  const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

  // Helper to convert count to percentage
  const toPercentage = (count) => {
    if (totalCapacity === 0) return 0;
    return Math.round((count / totalCapacity) * 100);
  };

  for (let i = 0; i <= monthsDiff; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    growthDataLabels.push(monthName);

    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);

    // New Clients: Created in this month
    const newClientsCount = clients.filter(c => {
      const cDate = new Date(c.createdAt);
      return cDate >= d && cDate < nextMonth;
    }).length;
    newData.push(toPercentage(newClientsCount));

    // Active/Inactive: Snapshot at end of month
    const activeCount = clients.filter(c => {
      const cDate = new Date(c.createdAt);
      return cDate < nextMonth && c.status === 'Active';
    }).length;
    activeData.push(toPercentage(activeCount));

    const inactiveCount = clients.filter(c => {
      const cDate = new Date(c.createdAt);
      return cDate < nextMonth && c.status === 'Inactive';
    }).length;
    inactiveData.push(toPercentage(inactiveCount));
  }

  // 3. Client Compliance Data (Therapy, Workout, Diet)
  const clientIds = clients.map(c => c._id);

  const complianceStats = await TaskSubmission.aggregate([
    { $match: { userId: { $in: clientIds } } },
    { $unwind: "$dailySubmissions" },
    { $unwind: "$dailySubmissions.exercises" },
    {
      $match: {
        "dailySubmissions.exercises.updatedAt": { $gte: startDate }
      }
    },
    {
      $project: {
        month: { $month: "$dailySubmissions.exercises.updatedAt" },
        year: { $year: "$dailySubmissions.exercises.updatedAt" },
        type: "$dailySubmissions.exercises.taskType",
        status: "$dailySubmissions.exercises.status"
      }
    },
    {
      $group: {
        _id: { month: "$month", year: "$year", type: "$type" },
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] }
        }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  // Construct Compliance Chart Data
  const therapyData = [];
  const workoutData = [];
  const dietData = [];
  // Reuse growthDataLabels or map complianceStats to them? 
  // We need to align with growthDataLabels (months).

  // Create a map for easy lookup
  const complianceMap = {};
  complianceStats.forEach(stat => {
    const key = `${stat._id.type}-${stat._id.month}-${stat._id.year}`;
    complianceMap[key] = stat;
  });

  for (let i = 0; i <= monthsDiff; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const m = d.getMonth() + 1; // 1-12
    const y = d.getFullYear();

    // Helper to get %
    const getPct = (type) => {
      // TaskType: 'Therapy', 'Workout', 'Meal' -> 'Diet'
      let dbType = type;
      if (type === 'Diet') dbType = 'Meal';
      const entry = complianceMap[`${dbType}-${m}-${y}`];
      if (!entry || entry.total === 0) return 0;
      return Math.round((entry.completed / entry.total) * 100);
    }

    therapyData.push(getPct('Therapy'));
    workoutData.push(getPct('Workout'));
    dietData.push(getPct('Diet'));
  }

  const graphData = {
    growth: {
      labels: growthDataLabels,
      datasets: [
        { label: "Active", data: activeData },
        { label: "Inactive", data: inactiveData },
        { label: "New", data: newData }
      ]
    },
    compliance: {
      labels: growthDataLabels,
      datasets: [
        { label: "Therapy", data: therapyData },
        { label: "Workout", data: workoutData },
        { label: "Diet", data: dietData }
      ]
    }
  };


  const totalClients = clients?.length;
  const totalCoaches = totalExperts[0].experts?.length;

  const totalTrainers = await totalExperts[0].experts?.filter((expert) => expert.role.includes("Trainer"))?.length;
  const totalDietitians = await totalExperts[0].experts?.filter((expert) => expert.role.includes("Dietician"))?.length;
  const totalTherapists = await totalExperts[0].experts?.filter((expert) => expert.role.includes("Therapist"))?.length;

  let latestReports = [];

  if (clientIds.length > 0) {
    const latestSubmissions = await TaskSubmission.aggregate([
      { $match: { userId: { $in: clientIds } } },
      { $unwind: "$dailySubmissions" },
      { $unwind: "$dailySubmissions.exercises" },
      {
        $project: {
          userId: 1,
          taskType: "$dailySubmissions.exercises.taskType",
          createdAt: "$dailySubmissions.exercises.createdAt",
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
          pipeline: [
            {
              $project: {
                name: 1,
                trainer: 1,
                dietition: 1,
                therapist: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    ]);

    const coachIds = new Set();
    latestSubmissions.forEach((submission) => {
      const userDetails = submission.userDetails || {};
      if (userDetails.trainer) coachIds.add(userDetails.trainer.toString());
      if (userDetails.dietition) coachIds.add(userDetails.dietition.toString());
      if (userDetails.therapist) coachIds.add(userDetails.therapist.toString());
    });

    const coaches = await CoachModel.find({
      _id: { $in: Array.from(coachIds) },
    }).select("name role");

    const coachMap = new Map(
      coaches.map((coach) => [coach._id.toString(), coach]),
    );

    const getExpertType = (taskType) => {
      if (taskType === "Meal") return "Dietitian";
      if (taskType === "Workout") return "Trainer";
      if (taskType === "Therapy") return "Therapist";
      return "Expert";
    };

    const getTaskLabel = (taskType) => {
      if (taskType === "Meal") return "Diet";
      return taskType;
    };

    latestReports = latestSubmissions.map((submission) => {
      const userDetails = submission.userDetails || {};
      const expertType = getExpertType(submission.taskType);
      let coachId = null;

      if (submission.taskType === "Meal") coachId = userDetails.dietition;
      if (submission.taskType === "Workout") coachId = userDetails.trainer;
      if (submission.taskType === "Therapy") coachId = userDetails.therapist;

      const coach = coachId ? coachMap.get(coachId.toString()) : null;
      const coachName = coach?.name;
      const submittedBy = coachName ? `${expertType} ${coachName}` : expertType;

      return {
        name: userDetails.name || "Unknown",
        type: getTaskLabel(submission.taskType),
        expert: expertType,
        submittedBy,
        createdAt: submission.createdAt,
      };
    });
  }

  return {
    totalPrograms,
    totalExperts: totalExperts[0].experts?.length,
    totalClients,
    totalCoaches,
    totalTrainers,
    totalDietitians,
    totalTherapists,
    graphData,
    latestReports,
  }
};

export const getAdminByHead = async ({ headId, page, limit }) => {
  const skip = (page - 1) * limit;
  const totalCount = await AdminModel.countDocuments({ headId });
  const admin = await AdminModel.find({ headId }).select("-password").skip(skip).limit(limit);
  return {
    admin,
    totalCount,
  };
};

export const founderAdminList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await AdminModel.countDocuments();

    const data = await AdminModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Head =====
      {
        $lookup: {
          from: "heads",
          localField: "headId",
          foreignField: "_id",
          as: "head",
        },
      },

      // ===== Category via head =====
      {
        $lookup: {
          from: "categories",
          localField: "head.programCategory",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Programs under category =====
      {
        $lookup: {
          from: "programslists",
          localField: "head.programCategory",
          foreignField: "category",
          as: "programs",
        },
      },

      // ===== Coaches under admin =====
      {
        $lookup: {
          from: "coaches",
          localField: "_id",
          foreignField: "adminId",
          as: "coaches",
        },
      },

      // ===== Users under coaches =====
      {
        $lookup: {
          from: "users",
          let: { coachIds: "$coaches._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $in: ["$trainer", "$$coachIds"] },
                    { $in: ["$therapist", "$$coachIds"] },
                    { $in: ["$dietition", "$$coachIds"] },
                  ],
                },
              },
            },
          ],
          as: "users",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          adminName: "$name",
          status: "$status",

          headName: {
            $arrayElemAt: ["$head.name", 0],
          },

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          programCount: { $size: "$programs" },
          coachCount: { $size: "$coaches" },
          userCount: { $size: "$users" },
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

