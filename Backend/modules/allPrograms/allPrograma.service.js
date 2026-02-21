import mongoose from "mongoose";
import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import planModel from "../plan/plan.model.js";
import programModel from "./allPrograma.model.js";
import User from "../auth/auth.model.js";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";

export const createProgram = async (data) => {
  return await programModel.create(data);
};

export const getAllProgram = async (page, limit) => {
  const totalProgram = await programModel.countDocuments();
  const program = await programModel
    .find()
    .populate("category", "name -_id")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  const formattedPrograms = program.map((program) => ({
    ...program,
    category: program.category?.name || null,
  }));
  return { program: formattedPrograms, totalProgram };
};

export const getSingleProgram = async (id) => {
  return await programModel.findById(id).populate("plan");
};

export const updateProgram = async (id, data) => {
  if (!data?.title) {
    throw new Error("program name is required");
  }

  const duplicate = await programModel.findOne({
    title: data.title.trim(),
    _id: { $ne: id },
  });

  if (duplicate) {
    throw new Error("Program name already exists");
  }


  return await programModel.findByIdAndUpdate(
    id,
    {
      ...data,
      title: capitalizeFirst(data.title),
    },
    { new: true, runValidators: true },
  );
};

export const deleteProgram = async (id) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid program ID");
    }

    // Check program exists
    const program = await programModel.findById(id);
    if (!program) {
      throw new Error("Program not found");
    }

    // Check Admin usage
    const adminsUsingProgram = await AdminModel.find(
      { program: id },
      { _id: 1, name: 1 },
    );

    // Check Coach usage
    const coachesUsingProgram = await CoachModel.find(
      { assignedPrograms: id },
      { _id: 1, name: 1 },
    );

    // Check User usage
    const usersUsingProgram = await User.find(
      { programType: id },
      { _id: 1, name: 1 },
    );

    // Block delete if used anywhere
    if (
      adminsUsingProgram.length ||
      coachesUsingProgram.length ||
      usersUsingProgram.length
    ) {
      const adminNames = adminsUsingProgram.map((a) => a.name).join(", ");
      const coachNames = coachesUsingProgram.map((e) => e.name).join(", ");
      const userNames = usersUsingProgram.map((c) => c.name).join(", ");

      let message = "Cannot delete program.this program";

      if (adminNames) message += ` Assigned to admins: ${adminNames},`;
      if (coachNames) message += ` Assigned to experts: ${coachNames},`;
      if (userNames) message += ` Assigned to clients: ${userNames},`;

      return {
        canDelete: false,
        message,
      };
    }

    // Safe delete
    await programModel.findByIdAndDelete(id);

    return {
      canDelete: true,
      message: "Program deleted successfully",
      program,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllProgramByCategory = async (category, page, limit) => {
  const totalProgram = await programModel.countDocuments({ category });
  const data = await programModel
    .find({ category })
    .populate("category", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { program: data, totalProgram };
};

export const getAllProgramsByExpert = async (expertId, page, limit) => {
  const coach = await CoachModel.findById(expertId)
    .select("assignedPrograms")
    .populate({
      path: "assignedPrograms",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .lean();

  if (!coach) {
    return { program: [], totalProgram: 0 };
  }

  const programsWithPlans = await Promise.all(
    coach.assignedPrograms.map(async (program) => {
      const plans = await planModel.find({ program: program._id }).lean();
      return { ...program, plans };
    }),
  );

  const totalProgram = programsWithPlans?.length || 0;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPrograms =
    programsWithPlans?.slice(startIndex, endIndex) || [];

  return { program: paginatedPrograms, totalProgram };
};

export const getAllProgramsByAdmin = async (adminId, page, limit) => {
  const admin = await AdminModel.findById(adminId)
    .populate({
      path: "program",
      select: "title category duration status",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .lean();

  if (!admin) {
    return { program: [], totalProgram: 0 };
  }

  const programsWithPlans = await Promise.all(
    admin.program.map(async (program) => {
      const plans = await planModel.find({ program: program._id }).lean();
      return { ...program, plans };
    }),
  );

  const totalProgram = admin.program?.length || 0;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPrograms =
    programsWithPlans?.slice(startIndex, endIndex) || [];
  return { program: paginatedPrograms, totalProgram };
};

export const founderProgramList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await programModel.countDocuments();

    const data = await programModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Category lookup =====
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Experts (Coaches) under program =====
      {
        $lookup: {
          from: "coaches",
          localField: "_id",
          foreignField: "assignedPrograms",
          as: "experts",
        },
      },

      // ===== Users under program =====
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "programType",
          as: "users",
        },
      },

      // ===== Shape response =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          programTitle: "$title",
          programStatus: "$status",

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          expertCount: { $size: "$experts" },
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
