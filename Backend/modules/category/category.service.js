import { categoryModel } from "./category.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import ProgramModel from "../allPrograms/allPrograma.model.js";
import mongoose from "mongoose";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";

export const createCategory = async (data) => {
  try {
    if (!data?.name) {
      throw new Error("Category name is required");
    }

    const exists = await categoryModel.findOne({
      name: data.name.trim(),
    });

    if (exists) {
      throw new Error("Category already exists");
    }
    return await categoryModel.create(data);
  } catch (error) {
    throw error;
  }
};

export const getAllCategory = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const totalCount = await categoryModel.countDocuments();
    const category = await categoryModel.find().skip(skip).limit(limit);
    return {
      category,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
};

export const getSingleCategory = async (id) => {
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    if (!data?.name) {
      throw new Error("Category name is required");
    }

    const duplicate = await categoryModel.findOne({
      name: data.name.trim(),
      _id: { $ne: id },
    });

    if (duplicate) {
      throw new Error("Category name already exists");
    }

    const updated = await categoryModel.findByIdAndUpdate(
      id,
      {
        name: capitalizeFirst(data.name.trim()),
        programLimit: data.programLimit,
        status: data.status,
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new Error("Category not found");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};
export const deleteSingleCategory = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    const headsUsingCategory = await HeadsModel.find(
      { programCategory: id },
      { name: 1 },
    );

    const programsUsingCategory = await ProgramModel.find(
      { category: id },
      { title: 1 },
    );

    // ❌ Category is in use
    if (headsUsingCategory.length || programsUsingCategory.length) {
      const headNames = headsUsingCategory.map((h) => h.name).join(", ");
      const programNames = programsUsingCategory.map((p) => p.title).join(", ");

      let message = "Cannot delete category.this category";

      if (headNames) message += `Assigned to Heads: ${headNames}.`;
      if (programNames) message += `Assigned to Programs: ${programNames}.`;

      return {
        canDelete: false,
        message,
      };
    }

    await categoryModel.findByIdAndDelete(id);

    return {
      canDelete: true,
      message: "Category deleted successfully",
      category,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteAllCategory = async () => {
  try {
    return await categoryModel.deleteMany({});
  } catch (error) {
    throw error;
  }
};

export const founderCategoryList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await categoryModel.countDocuments();

    const data = await categoryModel.aggregate([
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit },

      // ===== Programs under category =====
      {
        $lookup: {
          from: "programslists",
          localField: "_id",
          foreignField: "category",
          as: "programs",
        },
      },

      // ===== Heads under category =====
      {
        $lookup: {
          from: "heads",
          localField: "_id",
          foreignField: "programCategory",
          as: "heads",
        },
      },

      // ===== Admins under heads =====
      {
        $lookup: {
          from: "admins",
          localField: "heads._id",
          foreignField: "headId",
          as: "admins",
        },
      },

      // ===== Coaches under programs =====
      {
        $lookup: {
          from: "coaches",
          localField: "programs._id",
          foreignField: "assignedPrograms",
          as: "coaches",
        },
      },

      // ===== Users under programs =====
      {
        $lookup: {
          from: "users",
          localField: "programs._id",
          foreignField: "programType",
          as: "users",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: "$_id",
          categoryName: "$name",
          categoryStatus: "$status",

          programsCount: { $size: "$programs" },
          headNames: {
            $cond: [
              { $gt: [{ $size: "$heads" }, 0] },
              {
                $map: {
                  input: "$heads",
                  as: "head",
                  in: "$$head.name",
                },
              },
              [],
            ],
          },
          adminsCount: { $size: "$admins" },
          expertCount: { $size: "$coaches" },
          clientCount: { $size: "$users" },
        },
      },
    ]);

    return { data, totalCount };
  } catch (error) {
    throw error;
  }
};

