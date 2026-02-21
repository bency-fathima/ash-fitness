import * as planService from "./plan.service.js";

export const createNewPlan = async (req, res) => {

  try {
    const plan = await planService.createPlan(req.body);
    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSinglePlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await planService.getPlanById(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlanByProgramId = async (req, res) => {
  try {
    const { programId } = req.params;
    const plan = await planService.getPlanByProgramId(programId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updateData = req.body;
    
    // Check if plan exists (or just rely on update result)
    // Assuming planService.updatePlan handles non-existent gracefully or we check here
    
    const updated = await planService.updatePlan(planId, updateData);
    if (!updated) {
        return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    await planService.deletePlan(planId);
    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
