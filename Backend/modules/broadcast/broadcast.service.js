import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { broadcastModel } from "./broadcast.model.js";

export const createBroadcast = async (data) => {
  try {
    const duplicate = await broadcastModel.findOne({
      title: data.title.trim(),
    });

    if (duplicate) {
      throw new Error("Broadcast title already exists");
    }
    return await broadcastModel.create({
      ...data,
      title: capitalizeFirst(data.title),
    });
  } catch (error) {
    throw error;
  }
};

export const getAllBroadcast = async (page, limit, type) => {
  try {
    const skip = (page - 1) * limit;

    const filter = {};
    if (type && type !== "All") {
      filter.type = type;
    }

    const totalCount = await broadcastModel.countDocuments(filter);
    const broadcast = await broadcastModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      totalCount,
      broadcast,
    };
  } catch (error) {
    throw error;
  }
};

export const getBroadcast = async (id)=> {
  try {
    return await broadcastModel.findById(id)
  } catch (error) {
    throw error;
  }
}

export const deleteBroadcast = async (id) => {
  try {
    return await broadcastModel.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};


export const updateBroadcast = async (id, data) => {
  try {
    if (data.title) {
      const duplicate = await broadcastModel.findOne({
        title: data.title.trim(),
        _id: { $ne: id },
      });

      if (duplicate) {
        throw new Error("Broadcast title already exists");
      }
    }

    const updatedBroadcast = await broadcastModel.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(data.title && { title: capitalizeFirst(data.title) }),
      },
      { new: true }
    );

    if (!updatedBroadcast) {
      throw new Error("Broadcast not found");
    }

    return updatedBroadcast;
  } catch (error) {
    throw error;
  }
};

