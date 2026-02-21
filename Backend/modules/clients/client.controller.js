import * as service from "./client.services.js";
import { getUserComplianceStats, calculateUserStreaks } from "../../utils/complianceCalculator.js";
import { getSingleProgram } from "../allPrograms/allPrograma.service.js";
import { getTherapyById } from "../therapy/therapy.service.js";
import { attemptDayAdvancement, syncMissedDaysForUser } from "../taskSubmission/taskSubmission.service.js";
import mongoose from "mongoose";


export const getAllClients = async (req, res) => {
  try {
    const { page, limit } = req.params
    const { clients, totalCount } = await service.getAllClient(page, limit);
    res.status(200).json({
      success: true,
      data: clients,
      totalCount
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getSingleClient = async (req, res) => {
  try {
    const { id } = req.params;

    // First fetch the client to check status
    let client = await service.getSingleClient(id);
    if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
    }

    if (client.status === "Inactive") {
       // If inactive, just return the client data without syncing or advancing.
       // The frontend should handle showing the "Coordinator Admin" message based on status.
       return res.status(200).json({
         success: true,
         data: { ...client.toObject() }, 
       });
    }

    if (client.status === "Completed") {
        // If completed, just return. Frontend handles "Completed" view.
        return res.status(200).json({
            success: true,
            data: { ...client.toObject() },
        });
    }

    // Only sync if Active
    // Sync missed (no-submission) days and extend program end date if needed
    await syncMissedDaysForUser(id);

    // Re-fetch in case sync updated the end date
    client = await service.getSingleClient(id);

    // Check if program expired
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(client.programEndDate);
    // Ensure endDate is parsed correctly (it might be a string YYYY-MM-DD or full date)
    
    if (endDate < today && client.status === "Active") {
         client = await service.updateOneClient({ status: "Completed" }, id);
         return res.status(200).json({
             success: true,
             data: { ...client.toObject() },
         });
    }

    // Attempt to advance day if cooldown has expired
    await attemptDayAdvancement(id);

    // Re-fetch final state
    client = await service.getSingleClient(id);

    // Calculate next day unlock time if applicable
    let nextDayUnlockTime = null;
    let isNextDayLocked = false;

    if (client.lastDayCompletionTime) {
      const completionDate = new Date(client.lastDayCompletionTime);
      const unlockDate = new Date(completionDate);
      unlockDate.setDate(unlockDate.getDate() + 1);
      unlockDate.setHours(0, 0, 0, 0); // 12 AM next day

      // If NOW < unlockDate, it IS locked
      if (new Date() < unlockDate) {
        isNextDayLocked = true;
        nextDayUnlockTime = unlockDate;
      }
    }

    res.status(200).json({
      success: true,
      data: { ...client.toObject(), nextDayUnlockTime, isNextDayLocked },
    })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateClient = async (req, res) => {
  try {
    const { id } = req.params
    const updatedClient = await service.updateOneClient(req.body, id)
    res.status(200).json({ success: true, data: updatedClient })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const assignDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { mealCount } = req.body;
    let dietPlanPdf = null;

    if (req.file) {
      dietPlanPdf = `/uploads/${req.file.filename}`;
    }

    const updatedClient = await service.assignDietPlanService(id, {
      dietPlanPdf,
      dietPlanMealCount: mealCount,
    });

    res.status(200).json({
      success: true,
      message: "Diet plan assigned successfully",
      data: updatedClient,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params
    const deleteClient = await service.deleteOneClient(id)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const getClientsBasedOnCoach = async (req, res) => {
  try {
    const { coachIds, page, limit } = req.body;


    const { clients, totalCount } = await service.getClientsBasedOnCoach(
      coachIds,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json({
      success: true,
      data: clients,
      total: totalCount
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateWeight = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentWeight } = req.body;

    const user = await service.updateWeightService(userId, currentWeight);

    res.status(200).json({
      message: "Weight updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMeasurements = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await service.updateMeasurementsService(userId, req.body);

    res.status(200).json({
      message: "Measurements updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { feedbacks, totalCount } = await service.getAllFeedbacksService(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: feedbacks,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const getWeightHistoryOnly = async (req, res) => {

  try {
    const userId = req.user.id;



    const data = await service.fetchWeightHistoryService(userId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch weight history",
    });
  }
};



export const getMeasurementHistoryOnly = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await service.fetchMeasurementHistory(userId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch measurement history",
    });
  }
};

export const getFounderClientList = async (req, res) => {
  try {
    const { page, limit } = req.params;

    const list = await service.founderClientList(page, limit);

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

export const getComplianceStats = async (req, res) => {
  try {


    let userId;

    if (
      req.query.userId &&
      req.query.userId !== "undefined" &&
      mongoose.Types.ObjectId.isValid(req.query.userId)
    ) {
      userId = req.query.userId;
    } else if (
      req.user?._id &&
      mongoose.Types.ObjectId.isValid(req.user._id)
    ) {
      userId = req.user._id;
    } else if (
      req.user?.id &&
      mongoose.Types.ObjectId.isValid(req.user.id)
    ) {
      userId = req.user.id;
    } else {
      throw new Error("Valid UserId not found");
    }

    const user = await service.getSingleClient(userId);

    if (!user || !user.programType) {
      return res.status(200).json({
        success: true,
        data: {
          overall: 0,
          workout: 0,
          diet: 0,
          therapy: 0,
          weeklyData: []
        }
      });
    }

    const programId = typeof user.programType === 'object' ? user.programType._id : user.programType;
    const program = await getSingleProgram(programId);

    const therapyId = (user.therapyType && typeof user.therapyType === 'object')
      ? user.therapyType._id
      : user.therapyType;

    let therapyPlan = null;
    if (therapyId) {
      therapyPlan = await getTherapyById(therapyId);
    }

    const complianceData = await getUserComplianceStats(userId, program?.plan, therapyPlan, program?.title);
    const streakData = await calculateUserStreaks(userId);

    res.status(200).json({
      success: true,
      data: {
        ...complianceData,
        streaks: streakData
      }
    });
  } catch (error) {
    console.error("Compliance stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


 
export const getClientsWithHabitPlan = async (req, res) => {
  try {
    const clients = await service.fetchClientsWithHabitPlan();

    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};


