import * as coachService from "./coach.service.js"
import mongoose from "mongoose";

export const createCoach = async (req, res) => {
  try {

    // Handle file uploads
    if (req.files) {
      if (req.files.certifications && req.files.certifications[0]) {
        req.body.certifications = "/uploads/" + req.files.certifications[0].filename;
      }
      if (req.files.photo && req.files.photo[0]) {
        req.body.photo = "/uploads/" + req.files.photo[0].filename;
      }
    }

    const coach = await coachService.createCoach(req.body);

    res
      .status(201)
      .json({
        success: true,
        message: "Coach created successfully",
        data: coach,
      });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllCoach = async (req, res) => {
  try {
    const { page, limit } = req.params
    const coachs = await coachService.getAllCoach(page, limit);
    res
      .status(200)
      .json({
        success: true,
        data: coachs,
      });


  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getCoachById = async (req, res) => {
  try {
    const { coachId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coach ID",
      });
    }

    const coach = await coachService.getCoachById(coachId);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "coach not found",
      });
    }

    res.status(200).json({
      success: true,
      data: coach,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateCoachById = async (req, res) => {
  try {

    // Handle file uploads
    if (req.files) {
      if (req.files.certifications && req.files.certifications[0]) {
        req.body.certifications = "/uploads/" + req.files.certifications[0].filename;
      }
      if (req.files.photo && req.files.photo[0]) {
        req.body.photo = "/uploads/" + req.files.photo[0].filename;
      }
    }

    const { coachId } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coach ID",
      });
    }

    const data = await coachService.updateCoachById(coachId, updatedData);

    if (data.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coach details updated successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteCoachById = async (req, res) => {
  try {
    const { coachId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coach ID",
      });
    }

    const data = await coachService.deleteCoachById(coachId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "coach not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coach deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const AssignCoachToUser = async (req, res) => {
  try {
    const { coachId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coach ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const data = await coachService.AssignCoachToUser(coachId, userId);

    res.status(200).json({
      success: true,
      message: "Coach assigned to user successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const getUsersAssignedToACoach = async (req, res) => {
  const { coachId, page, limit } = req.params;

  if (!mongoose.Types.ObjectId.isValid(coachId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid coach ID",
    });
  }

  const { users, total } = await coachService.getUsersAssignedToACoach(coachId, parseInt(page), parseInt(limit));
  res.status(200).json({
    success: true,
    data: users,
    total: total
  })

}

export const getCoachesByAdmin = async (req, res) => {
  try {
    const coaches = await coachService.getCoachesByAdmin(req.body);
    res.status(200).json({
      success: true,
      data: coaches,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { expertId, userId, rating, feedback } = req.body;

    const data = await coachService.createFeedback(expertId, userId, rating, feedback);

    res.status(200).json({
      success: true,
      message: "Feedback created successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getClientsForExpert = async (req, res) => {
  try {
    const coachId = req.user._id;

    const clients = await getAssignedClientsService(coachId);

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCoachDashboardStats = async (req, res) => {
  try {
    const { coachId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coach ID",
      });
    }

    const stats = await coachService.getCoachDashboardStats(coachId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({ success: false, message: err.message });
  }
}

export const getFounderCoachList = async (req, res) => {
  try {
    const { page, limit } = req.params;

    const list = await coachService.founderCoachList(page, limit);

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getClientComplianceGraphData = async (req, res) => {
  try {
    const coachId = req.user._id;
    const { duration } = req.params;
    const result = await coachService.getClientComplianceGraphData(
      coachId,
      duration,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoachRatingGraph = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.query; // duration in months

    const result = await coachService.getMonthWiseAverageRating(id, duration);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};