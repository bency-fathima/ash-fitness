import * as taskSubmissionService from "./taskSubmission.service.js";

export const submitTask = async (req, res) => {
    try {
        const { programId, weekIndex, dayIndex, globalDayIndex, exerciseIndex, notes, taskType, status } = req.body;
        const userId = req.user._id || req.user.id;
        const file = req.file ? "/uploads/" + req.file.filename : null;

        const submission = await taskSubmissionService.createTaskSubmission({
            userId,
            programId,
            weekIndex,
            dayIndex,
            globalDayIndex,
            exerciseIndex,
            notes,
            file,
            taskType,
            status // Pass status (e.g., "skipped")
        });

        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        if (error.message === "Task already verified" || error.message === "Workouts cannot be skipped.") {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const submitMultipleWorkoutTasks = async (req, res) => {
    try {
        const { programId, weekIndex, dayIndex, globalDayIndex, exerciseIndices, notes, taskType } = req.body;
        const userId = req.user._id || req.user.id;
        const file = req.file ? "/uploads/" + req.file.filename : null;

        // Parse exerciseIndices if it's a string
        const indices = typeof exerciseIndices === 'string' ? JSON.parse(exerciseIndices) : exerciseIndices;

        if (!Array.isArray(indices) || indices.length === 0) {
            return res.status(400).json({ success: false, message: "Exercise indices must be a non-empty array" });
        }

        const submission = await taskSubmissionService.createMultipleWorkoutSubmissions({
            userId,
            programId,
            weekIndex,
            dayIndex,
            globalDayIndex,
            exerciseIndices: indices,
            notes,
            file,
            taskType: taskType || "Workout"
        });

        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        if (error.message === "Task already verified") {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingSubmissions = async (req, res) => {
    try {
        const expertId = (req.user._id || req.user.id);
        const userRole = req.user.role || "";

        const submissions = await taskSubmissionService.getPendingTaskSubmissions(expertId, userRole);

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyTask = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await taskSubmissionService.verifyTaskSubmission(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "Submission not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const result = await taskSubmissionService.rejectTaskSubmission(id, comment);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "Submission not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserTaskStatus = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { globalDayIndex } = req.query;

        // Sync missed (no-submission) days and extend program end date if needed
        await taskSubmissionService.syncMissedDaysForUser(userId);

        // Attempt to advance day if cooldown has expired
        await taskSubmissionService.attemptDayAdvancement(userId);

        const data = await taskSubmissionService.getUserTaskStatusByUserId(userId, globalDayIndex);

        // Fetch User to check lock status
        const User = (await import("../auth/auth.model.js")).default;
        const user = await User.findById(userId).select("lastDayCompletionTime");

        let nextDayUnlockTime = null;
        let isNextDayLocked = false;

        if (user && user.lastDayCompletionTime) {
            const unlockDate = taskSubmissionService.calculateUnlockDate(user.lastDayCompletionTime);


            if (new Date() < unlockDate) {
                isNextDayLocked = true;
                nextDayUnlockTime = unlockDate;
            }
        }

        res.status(200).json({ success: true, data, nextDayUnlockTime, isNextDayLocked });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllUserSubmissions = async (req, res) => {
    try {
        const expertId = (req.user._id || req.user.id);
        const userRole = req.user.role || "";
        const { userId } = req.params;

        const submissions = await taskSubmissionService.getAllUserTaskSubmissions(expertId, userRole, userId);

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
