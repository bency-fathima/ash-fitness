import mongoose from "mongoose";
import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import ProgramModel from "../allPrograms/allPrograma.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "./heads.modal.js";
import TaskSubmission from "../taskSubmission/taskSubmission.model.js";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { sendEmail } from "../../utils/email.js";

export const createHead = async (head) => {
  let hashedPassword;
  let plainPassword;

  if (head.password) {
    plainPassword = head.password;
    hashedPassword = await hashPassword(head.password);
  } else {
    plainPassword = generatePassword();
    console.log("Generated Password for head:", plainPassword);
    hashedPassword = await hashPassword(plainPassword);
  }

  const newHead = await HeadsModel.create({
    name: head.name,
    dob: head.dob,
    gender: head.gender,
    email: head.email,
    phone: head.phone,
    password: hashedPassword,
    address: head.address,
    status: "Active",
    specialization: head.specialization,
    experience: head.experience,
    qualification: head.qualification,
    programCategory: head.programCategory,
    salary: head.salary,
  });

  await sendEmail({
    to: head.email,
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
            <p>Hello <strong>${head.name}</strong>,</p>
            <p>Your Head account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials-box">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${head.email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${plainPassword}</p>
            </div>
            
            <p>Please log in and change your password immediately for security purposes.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/login" style="background-color: #9e5608; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} fitness. All rights reserved.</p>
            <p>This email was sent to ${head.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return newHead;
};

export const getAllHeads = async (page, limit) => {
  const skip = (page - 1) * limit;

  const totalCount = await HeadsModel.countDocuments();
  const head = await HeadsModel.find().skip(skip).limit(limit);
  return {
    head,
    totalCount,
  };
};

export const getHeadById = async (id) => {
  return await HeadsModel.findById(id).populate({
    path: "programCategory",
    select: "name",
  });
};

export const updateHead = async (id, data) => {
  try {
    if (!data?.name || !data?.email || !data?.phone) {
      throw new Error("Name, email, and phone are required");
    }

    const duplicate = await HeadsModel.findOne({
      _id: { $ne: id },
      $or: [
        { name: data.name.trim() },
        { email: data.email?.trim() },
        { phone: data.phone?.trim() },
      ],
    });

    if (duplicate) {
      throw new Error("Head already exists with same name, email, or phone");
    }

    const updated = await HeadsModel.findByIdAndUpdate(
      id,
      {
        name: capitalizeFirst(data.name.trim()),
        dob: data.dob,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        address: data.address,
        specialization: data.specialization,
        experience: data.experience,
        qualification: data.qualification,
        salary: data.salary,
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new Error("Head not found");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};

export const deleteHead = async (id) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid head ID");
    }

    // Check head exists
    const head = await HeadsModel.findById(id);
    if (!head) {
      throw new Error("Head not found");
    }

    // Check admins using this head
    const adminsUsingHead = await AdminModel.find(
      { headId: id },
      { _id: 1, name: 1 },
    );

    // Block delete if head is in use
    if (adminsUsingHead.length > 0) {
      const adminNames = adminsUsingHead.map((a) => a.name).join(", ");

      return {
        canDelete: false,
        message: `Cannot delete head.This head assigned to admins: ${adminNames}.`,
      };
    }

    // Safe delete
    await HeadsModel.findByIdAndDelete(id);

    return {
      canDelete: true,
      message: "Head deleted successfully",
      head,
    };
  } catch (error) {
    throw error;
  }
};

export const getDashboardData = async (id, duration) => {
  let startDate = new Date();
  const months = parseInt(duration) || 3; // Default to 3 months if not provided
  startDate.setMonth(startDate.getMonth() - months);

  const head = await HeadsModel.find({ _id: id }).populate("programCategory")
  const totalAdmins = await AdminModel.find({ headId: id });

  const totalExpertsResults = await Promise.all(totalAdmins.map(async (admin) => {
    return await CoachModel.find({ adminId: admin._id }).populate("assignedUsers");
  }));
  const totalExperts = totalExpertsResults.flat();


  const uniqueClientIds = new Set();
  totalExperts.forEach(expert => {
    if (expert.assignedUsers && expert.assignedUsers.length > 0) {
      expert.assignedUsers.forEach(user => uniqueClientIds.add(user._id ? user._id.toString() : user.toString()));
    }
  });

  const clientIds = Array.from(uniqueClientIds);
  const totalClients = clientIds.length;


  const totalPrograms = await ProgramModel.countDocuments({ category: head[0].programCategory._id });

  const totalTrainers = totalExperts.filter(expert => expert.role === "Trainer").length;

  const totalDietitians = totalExperts.filter(expert => expert.role === "Dietician").length;

  const totalTherapists = totalExperts.filter(expert => expert.role === "Therapist").length;



  const newProgramsCount = await ProgramModel.countDocuments({
    category: head[0].programCategory._id,
    createdAt: { $gte: startDate }
  });

  const newExpertsCount = totalExperts.filter(expert => new Date(expert.createdAt) >= startDate).length;


  let newClientsCount = 0;
  const processedUserIds = new Set();
  totalExperts.forEach(expert => {
    if (expert.assignedUsers && expert.assignedUsers.length > 0) {
      expert.assignedUsers.forEach(user => {
        const uId = user._id ? user._id.toString() : user.toString();
        if (!processedUserIds.has(uId)) {
          if (user.createdAt && new Date(user.createdAt) >= startDate) {
            newClientsCount++;
          }
          // If createdAt is missing (e.g. not selected in populate), this will be 0.
          // Assuming standard populate returns all fields or at least timestamps.
          processedUserIds.add(uId);
        }
      });
    }
  });


  // --- Expert Performance Metrics ---

  // Filter by submission date >= startDate
  const clientCompletionRates = await TaskSubmission.aggregate([
    {
      $match: {
        userId: { $in: clientIds.map(id => new mongoose.Types.ObjectId(id)) },
      }
    },
    { $unwind: "$dailySubmissions" },
    { $unwind: "$dailySubmissions.exercises" },
    // Filter by dailySubmissions.exercises.createdAt or updatedAt
    { $match: { "dailySubmissions.exercises.updatedAt": { $gte: startDate } } },
    {
      $group: {
        _id: "$userId",
        totalTasks: { $sum: 1 },
        verifiedTasks: {
          $sum: { $cond: [{ $eq: ["$dailySubmissions.exercises.status", "verified"] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        completionRate: {
          $cond: [
            { $eq: ["$totalTasks", 0] },
            0,
            { $multiply: [{ $divide: ["$verifiedTasks", "$totalTasks"] }, 100] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        averageCompletionRate: { $avg: "$completionRate" }
      }
    }
  ]);

  const taskCompletionRate = clientCompletionRates.length > 0
    ? Math.round(clientCompletionRates[0].averageCompletionRate)
    : 0;

  // 2. Average Rating (Filtered)
  let totalRating = 0;
  let ratingCount = 0;
  totalExperts.forEach(expert => {
    if (expert.feedback && expert.feedback.length > 0) {
      expert.feedback.forEach(f => {
        // Assuming feedback has a date or createdAt field
        if (f.rating && (!f.createdAt || new Date(f.createdAt) >= startDate)) {
          totalRating += f.rating;
          ratingCount++;
        }
      });
    }
  });
  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

  // 3. Clients Assigned Rate (unique clients / Sum of Max Capacities)
  const sumMaxCapacity = totalExperts.reduce((acc, c) => acc + (c.maxClient || 0), 0);
  
  // Use unique clients count (totalClients calculated above) as per user request
  const clientsAssignedRate = sumMaxCapacity > 0
    ? Math.round((totalClients / sumMaxCapacity) * 100)
    : 0;

  // --- Latest Progress Reports ---
  const latestReports = await TaskSubmission.aggregate([
    {
      $match: {
        userId: { $in: clientIds.map(id => new mongoose.Types.ObjectId(id)) },
        // ensure exercises exist and have been updated/acted upon (optional check)
        "dailySubmissions.exercises": { $exists: true, $ne: [] }
      }
    },
    { $unwind: "$dailySubmissions" },

    { $unwind: "$dailySubmissions.exercises" },
    // Filter out items without timestamp if necessary, or just sort
    // Assuming 'updatedAt' exists per admin functionality
    { $sort: { "dailySubmissions.exercises.updatedAt": -1, "dailySubmissions.exercises.status": -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $lookup: { from: "coaches", localField: "user.trainer", foreignField: "_id", as: "trainer" }
    },
    {
      $lookup: { from: "coaches", localField: "user.dietition", foreignField: "_id", as: "dietitian" }
    },
    {
      $lookup: { from: "coaches", localField: "user.therapist", foreignField: "_id", as: "therapist" }
    },
    {
      $project: {
        clientName: "$user.name",
        taskType: "$dailySubmissions.exercises.taskType",
        status: "$dailySubmissions.exercises.status",
        updatedAt: "$dailySubmissions.exercises.updatedAt",
        trainerName: { $arrayElemAt: ["$trainer.name", 0] },
        dietitianName: { $arrayElemAt: ["$dietitian.name", 0] },
        therapistName: { $arrayElemAt: ["$therapist.name", 0] }
      }
    }
  ]);

  // Format for frontend
  const formattedReports = latestReports.map(report => {
    let expertName = "N/A";
    let expertType = "N/A";

    if (report.taskType === 'Workout') {
      expertName = report.trainerName;
      expertType = "Trainer";
    } else if (report.taskType === 'Meal' || report.taskType === 'Diet') {
      expertName = report.dietitianName;
      expertType = "Dietitian";
    } else if (report.taskType === 'Therapy') {
      expertName = report.therapistName;
      expertType = "Therapist";
    }

    return {
      name: report.clientName,
      type: report.taskType === 'Meal' ? 'Diet' : report.taskType,
      expert: expertType,
      submittedBy: expertName ? `${expertType} ${expertName.split(' ')[0]}` : "Client",
      time: report.updatedAt
    };
  });

  return {
    totalClients,
    totalPrograms,
    totalAdmins: totalAdmins.length,
    totalExperts: totalExperts.length,
    totalTrainers,
    totalDietitians,
    totalTherapists,
    adminPerformance: {
      programs: newProgramsCount, // Filtered
      experts: newExpertsCount,   // Filtered
      clients: newClientsCount    // Filtered
    },
    expertPerformance: {
      taskCompletion: taskCompletionRate, // Filtered
      rating: averageRating,            // Filtered
      clientsAssigned: clientsAssignedRate, // Updated Logic
      totalClientsAssigned: totalClients,
      totalCapacity: sumMaxCapacity,
    },
    latestReports: formattedReports
  };
};


export const getAllCoachesByHead = async (headId, page, limit) => {
  const skip = (page - 1) * limit;

  const totalAdmins = await AdminModel.find({ headId })
  const totalCount = (await Promise.all(totalAdmins.map(admin => CoachModel.countDocuments({ adminId: admin._id })))).reduce((acc, count) => acc + count, 0);
  const coaches = await Promise.all(totalAdmins.map(admin => CoachModel.find({ adminId: admin._id }).skip(skip).limit(limit).populate("assignedUsers")));
  return {
    coaches: coaches.flat(),
    totalCount: totalCount,
  };
}

export const getAllUsersByHead = async (headId, page, limit) => {


  const totalAdmins = await AdminModel.find({ headId })

  // Fetch all coaches to get all potential users
  const coaches = await Promise.all(totalAdmins.map(admin => CoachModel.find({ adminId: admin._id }).populate("assignedUsers")));

  const allUsers = coaches.flat().flatMap(coach => coach.assignedUsers);

  const uniqueUsersMap = new Map();
  allUsers.forEach(user => {
    if (user && user._id) {
      uniqueUsersMap.set(user._id.toString(), user);
    }
  });

  const uniqueUsersList = Array.from(uniqueUsersMap.values());

  const totalCount = uniqueUsersList.length;

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = uniqueUsersList.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    totalCount: totalCount,
  };
}

export const founderHeadList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await HeadsModel.countDocuments();

    const data = await HeadsModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Category =====
      {
        $lookup: {
          from: "categories",
          localField: "programCategory",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Programs under category =====
      {
        $lookup: {
          from: "programslists",
          localField: "programCategory",
          foreignField: "category",
          as: "programs",
        },
      },

      // ===== Admins under head =====
      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "headId",
          as: "admins",
        },
      },

      // ===== Coaches under admins =====
      {
        $lookup: {
          from: "coaches",
          localField: "admins._id",
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
          headName: "$name",
          status: "$status",

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          programCount: { $size: "$programs" },
          adminCount: { $size: "$admins" },
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

