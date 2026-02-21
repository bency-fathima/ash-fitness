import { CoachModel } from "../coach/coach.model.js";
import  incentiveModel  from "./incentive.model.js";


export const calculateRatingIncentive = async (coachId) => {
  const coach = await CoachModel.findById(coachId).select(
    "avgRating extraClientIncentive"
  );

  if (!coach) return;

  const payroll = await incentiveModel.findOne({
    id: "6960c69c6b7d7ca635decb87",
  }).lean();

  if (!payroll) return;

  let ratingIncentiveAmount = 0;

  

  if (coach.avgRating >= 4.0 && coach.avgRating <= 4.4)
    ratingIncentiveAmount = payroll.rating1;
  else if (coach.avgRating >= 4.5 && coach.avgRating <= 4.7)
    ratingIncentiveAmount = payroll.rating2;
  else if (coach.avgRating >= 4.8 && coach.avgRating <= 5.0)
    ratingIncentiveAmount = payroll.rating3;

  await CoachModel.findByIdAndUpdate(coachId, {
    ratingIncentiveAmount,
    incentives: ratingIncentiveAmount + (coach.extraClientIncentive || 0),
  });
};


export const calculateExtraClientIncentive = async (coachId) => {
  const coach = await CoachModel.findById(coachId).select(
    "assignedUsers maxClient ratingIncentiveAmount"
  );

  if (!coach) return;

  const payroll = await incentiveModel.findOne({
    id: "6960c69c6b7d7ca635decb87",
  }).lean();

  if (!payroll) return;

  const totalClients = coach.assignedUsers.length;

  if (totalClients <= coach.maxClient) {
    await CoachModel.findByIdAndUpdate(coachId, {
      extraClientIncentive: 0,
      incentives: coach.ratingIncentiveAmount,
    });
    return;
  }

  const extraClients = totalClients - coach.maxClient;
  const extraClientIncentive = extraClients * payroll.extraClient;

  await CoachModel.findByIdAndUpdate(coachId, {
    extraClientIncentive,
    incentives: coach.ratingIncentiveAmount + extraClientIncentive,
  });
};


export const updatePayroll = async (payroll) => {
  // 1️⃣ Update payroll slab
  const updatedPayroll = await incentiveModel.findOneAndUpdate(
    { id: "6960c69c6b7d7ca635decb87" },
    {
      $set: {
        rating1: payroll.rating1,
        rating2: payroll.rating2,
        rating3: payroll.rating3,
        extraClient: payroll.extraClient,
        extendProgram30days: payroll.extendProgram30days,
        extendProgram60days: payroll.extendProgram60days,
        extendProgram90days: payroll.extendProgram90days,
        targetAchieved: payroll.targetAchieved,
      },
    },
    { new: true, upsert: true },
  );

  // Recalculate incentives for all eligible coaches
  const coaches = await CoachModel.find().select(
    "_id"
  );

  for (const coach of coaches) {
    await calculateRatingIncentive(coach._id);
    await calculateExtraClientIncentive(coach._id);
  }

  return updatedPayroll;
};

export const getPayroll = async () => {
  return await incentiveModel.findOne({ id: "6960c69c6b7d7ca635decb87" });
};
