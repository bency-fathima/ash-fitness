import ProgramModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import Plan from "./plan.model.js";

export const createPlan = async (planData) => {
    const newPlan = await Plan.create(planData);

   await ProgramModel.findByIdAndUpdate(planData.program, { plan: newPlan._id });
    return  newPlan;
}


export const getPlanById = async (planId) => {
    const plan = await Plan.findById(planId);
    return plan;
}


export const updatePlan = async (planId, updateData) => {
    // Optionally validate plan content
    const updatedPlan = await Plan.findByIdAndUpdate(planId, { $set: updateData }, { new: true });
    return updatedPlan;
};

export const getPlanByProgramId = async (programId) => {    
    const plan = await Plan.findOne({ program: programId });
    if (!plan) return null;
    const clients = await User.find({ programType: programId }).select("name email");
    return {...plan.toObject(), clients};
}

export const deletePlan = async (planId) => {
    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Plan not found");

    // Remove plan reference from program
    await ProgramModel.findByIdAndUpdate(plan.program, { $unset: { plan: "" } });

    // Delete the plan
    await Plan.findByIdAndDelete(planId);
    
    return { success: true, message: "Plan deleted successfully" };
}