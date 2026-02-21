import User from '../auth/auth.model.js';
import Therapy from './therapy.model.js'

export const createTherapy = async (data) => {
  return await Therapy.create(data);
};



export const getAllTherapy = async (page, limit) => {
  const totalTherapy = await Therapy.countDocuments();
  const therapyList = await Therapy.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Optimized user counting using aggregation
  const therapyIds = therapyList.map(t => t._id);
  const userCountsTrigger = await User.aggregate([
    { $match: { therapyType: { $in: therapyIds } } },
    { $group: { _id: "$therapyType", count: { $sum: 1 } } }
  ]);
  
  const countsMap = {};
  userCountsTrigger.forEach(item => {
      countsMap[item._id.toString()] = item.count;
  });

  const therapy = therapyList.map((t) => ({
      ...t,
      clients: countsMap[t._id.toString()] || 0
  }));

  const users = await User.countDocuments({
    therapyType: { $in: therapyIds },
  });

  return {
    totalTherapy,
    therapy,
    users,
  };
};

export const getTherapyById = async (therapyId) => {
  const therapy = await Therapy.findById(therapyId).lean();
  if (!therapy) return null;
  const clients = await User.countDocuments({ therapyType: therapyId });
  return { ...therapy, clients };
};

export const updateTherapy = async (id, data) => {
  return await Therapy.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTherapy = async (id) => {
  return await Therapy.findByIdAndDelete(id);
};