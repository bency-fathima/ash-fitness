import TaskSubmission from "./taskSubmission.model.js";
import User from "../auth/auth.model.js";
import Plan from "../plan/plan.model.js";
import mongoose from "mongoose";
import { getIO } from "../../utils/socket.js";
import { createNotification } from "../notification/notification.service.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toUtcDateOnly = (dateLike) => {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return null;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const addDaysUtc = (date, days) => new Date(date.getTime() + days * MS_PER_DAY);

const formatDateYYYYMMDD = (date) => date.toISOString().split("T")[0];

// Helper to calculate unlock date (Strict Next Midnight Rule)
export const calculateUnlockDate = (completionDate) => {
    const date = new Date(completionDate);

    // Strict Rule: Next unlock is always the NEXT midnight.

    let unlockDate = new Date(date);
    unlockDate.setDate(unlockDate.getDate() + 1); // Tomorrow
    unlockDate.setHours(0, 0, 0, 0); // Midnight

    return unlockDate;
};

// Sync missed (no-submission) days and extend program end date
export const syncMissedDaysForUser = async (userId) => {
    const user = await User.findById(userId).select(
        "programStartDate programEndDate lastTaskSubmissionDate lastMissedSyncDate"
    );

    if (!user) return { missedDaysApplied: 0 };

    const todayUtc = toUtcDateOnly(new Date());
    if (!todayUtc) return { missedDaysApplied: 0 };

    const startDateUtc = toUtcDateOnly(user.programStartDate);
    if (!startDateUtc) return { missedDaysApplied: 0 };

    let baseDateUtc;
    if (user.lastTaskSubmissionDate) {
        baseDateUtc = toUtcDateOnly(user.lastTaskSubmissionDate);
    } else {
        // No submissions yet: count from program start date
        baseDateUtc = addDaysUtc(startDateUtc, -1);
    }

    if (!baseDateUtc) return { missedDaysApplied: 0 };

    if (user.lastMissedSyncDate) {
        const lastSyncUtc = toUtcDateOnly(user.lastMissedSyncDate);
        if (lastSyncUtc && lastSyncUtc > baseDateUtc) {
            baseDateUtc = lastSyncUtc;
        }
    }

    const diffDays = Math.floor((todayUtc.getTime() - baseDateUtc.getTime()) / MS_PER_DAY);
    // Exclude today (a day counts as "not logged in" only after it fully passes)
    const missedDays = Math.max(diffDays - 1, 0);

    if (missedDays <= 0) return { missedDaysApplied: 0 };

    const endDateUtc = toUtcDateOnly(user.programEndDate);
    if (!endDateUtc) return { missedDaysApplied: 0 };

    const newEndDateUtc = addDaysUtc(endDateUtc, missedDays);
    user.programEndDate = formatDateYYYYMMDD(newEndDateUtc);

    // Mark missed days processed up to yesterday
    user.lastMissedSyncDate = addDaysUtc(todayUtc, -1);

    await user.save();

    return { missedDaysApplied: missedDays, newProgramEndDate: user.programEndDate };
};

// Helper to determine if we should advance the user's day
export const checkAndAdvanceDay = async (userId, globalDayIndex) => {
    const user = await User.findById(userId).populate({
        path: 'programType',
        populate: { path: 'plan' }
    });

    if (!user?.programType?.plan) return false;

    const plan = user.programType.plan;
    let currentDayConfig = null;
    let dayCounter = 0;

    for (const week of plan.weeks) {
        for (const day of week.days) {
            dayCounter++;
            if (dayCounter === Number(globalDayIndex)) {
                currentDayConfig = day;
                break;
            }
        }
        if (currentDayConfig) break;
    }

    if (!currentDayConfig) return false;

    // Determine meal count based on program title
    const programTitle = user.programType.title || "";
    const isWeightLoss = programTitle.toLowerCase().includes("weight loss");
    const mealCount = isWeightLoss ? 5 : 6;

    // Total exercises = workout exercises from plan + mealCount static meal tasks
    // NOTE: This assumes meal tasks are static and defined by program type
    const totalExercises = currentDayConfig.exercises.length + mealCount;

    // Count total VERIFIED/SKIPPED exercises for this userId and globalDayIndex
    const userSubmission = await TaskSubmission.findOne({ userId });
    if (!userSubmission) return false;

    const daySubmission = userSubmission.dailySubmissions.find(d => d.globalDayIndex === Number(globalDayIndex));
    if (!daySubmission) return false;

    // Filter for verified OR skipped
    // Filter for eligible exercises
    const completedTasks = daySubmission.exercises.filter(ex => {
        if (ex.taskType === "Workout") {
            // Workouts: Verify, Pending. (Skipped/Rejected not allowed to count)
            return ex.status === "verified" || ex.status === "pending";
        }
        // Others: Verify, Pending, Skipped, Rejected all count towards "completion" of the list check
        return ["verified", "pending", "skipped", "rejected"].includes(ex.status);
    });

    const completedCount = completedTasks.length;

    // ADDITIONAL CHECK: Workouts CANNOT be skipped.
    // Ensure all workout tasks are strictly "verified" (not skipped).

    const hasSkippedWorkout = completedTasks.some(ex => ex.taskType === "Workout" && ex.status === "skipped");
    if (hasSkippedWorkout) return false; // Strict rule: Workouts cannot be skipped.

    if (completedCount >= totalExercises) {
        if (user.currentGlobalDay === Number(globalDayIndex)) {
            // Check if we already have a completion time for this day? 
            if (!user.lastDayCompletionTime) {
                user.lastDayCompletionTime = new Date(); // Record completion time
                await user.save();

                // Notify the client that they've completed the day
                try {
                    const io = getIO();
                    // Send "day_completed" instead of "day_advanced"
                    const nextUnlock = calculateUnlockDate(user.lastDayCompletionTime);

                    io.to(userId.toString()).emit("day_completed", {
                        completedDay: globalDayIndex,
                        nextDayUnlockTime: nextUnlock
                    });
                } catch (socketError) {
                    console.error("Socket notification for day completion failed:", socketError.message);
                }
            }

            return true;
        }
    }
    return false;
};

// NEW HELPER: Attempt to advance day if time condition met
export const attemptDayAdvancement = async (userId) => {
    const user = await User.findById(userId);
    if (!user || !user.lastDayCompletionTime) return user; // No completion recorded or user invalid

    // Check if NOW > Unlock Date
    const unlockDate = calculateUnlockDate(user.lastDayCompletionTime);

    if (new Date() >= unlockDate) {
        // Unlock time passed! Advance the day.
        const previousDay = user.currentGlobalDay;

        // Auto-verify all pending tasks from the completed day
        const userSubmission = await TaskSubmission.findOne({ userId });
        if (userSubmission) {
            const completedDaySubmission = userSubmission.dailySubmissions.find(
                d => d.globalDayIndex === previousDay
            );

            if (completedDaySubmission) {
                let hasChanges = false;
                completedDaySubmission.exercises.forEach(ex => {
                    if (ex.status === 'pending') {
                        ex.status = 'verified';
                        // ex.updatedAt = Date.now();
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    await userSubmission.save();
                }
            }
        }

        user.currentGlobalDay += 1;
        user.lastDayCompletionTime = null; // Clear completion time reset for next day cycle
        await user.save();

        // Notify user of actual advancement?
        try {
            const io = getIO();
            io.to(userId.toString()).emit("day_advanced", {
                newGlobalDay: user.currentGlobalDay
            });
        } catch (socketError) {
            console.error("Socket notification for lazy day advancement failed:", socketError.message);
        }
    }
    return user;
};

// Helper to get task type from plan
const getTaskTypeFromPlan = async (userId, globalDayIndex, exerciseIndex) => {
    const user = await User.findById(userId).populate({
        path: 'programType',
        populate: { path: 'plan' }
    });

    if (user?.programType?.plan) {
        const plan = user.programType.plan;
        let currentDayConfig = null;
        let dayCounter = 0;

        for (const week of plan.weeks) {
            for (const day of week.days) {
                dayCounter++;
                if (dayCounter === globalDayIndex) {
                    currentDayConfig = day;
                    break;
                }
            }
            if (currentDayConfig) break;
        }

        if (currentDayConfig && currentDayConfig.exercises[exerciseIndex]) {
            return currentDayConfig.exercises[exerciseIndex].type || "Workout";
        }
    }
    return "Workout";
};

// Helper to notify via socket
const safeCreateNotification = async (notificationData) => {
    try {
        await createNotification(notificationData);
    } catch (error) {
        console.error("Notification persistence failed:", error.message);
    }
};

const notifyExpertsAndAdmins = async (userId, submissionId, eventType, extraData = {}) => {
    try {
        const io = getIO();
        const client = await User.findById(userId).select("name trainer dietition therapist");

        if (client) {
            const expertsToNotify = [
                client.trainer?.toString(),
                client.dietition?.toString(),
                client.therapist?.toString()
            ].filter(id => id);

            const taskType = String(extraData.taskType || "task");
            const normalizedTaskType = taskType.toLowerCase();
            const status = String(extraData.status || "").toLowerCase();
            const clientName = client.name || "A client";

            let type = "generic";
            let message = `${clientName} has a task update`;

            if (eventType === "new_task_submission") {
                if (normalizedTaskType === "meal") {
                    type = "pending_meal_reviews";
                    message = `${clientName} submitted a meal that is pending review`;
                } else {
                    message = `${clientName} submitted a ${normalizedTaskType} task for review`;
                }
            }

            if (eventType === "task_updated") {
                message = `${clientName}'s ${normalizedTaskType} task was ${status || "updated"}`;
                if (status === "rejected") {
                    type = "feedback_received";
                }
            }

            expertsToNotify.forEach(expertId => {
                io.to(expertId).emit(eventType, { userId, submissionId, ...extraData });
            });

            io.to("admin_tasks").emit(eventType, { userId, submissionId, ...extraData });

            await Promise.all(
                expertsToNotify.map((expertId) =>
                    safeCreateNotification({
                        type,
                        message,
                        recipientRole: "coach",
                        recipientId: expertId,
                        metadata: {
                            eventType,
                            submissionId,
                            userId,
                            ...extraData
                        }
                    })
                )
            );

            await Promise.all(
                ["admin", "head", "founder"].map((role) =>
                    safeCreateNotification({
                        type,
                        message,
                        recipientRole: role,
                        metadata: {
                            eventType,
                            submissionId,
                            userId,
                            ...extraData
                        }
                    })
                )
            );
        }
    } catch (socketError) {
        console.error("Socket notification failed:", socketError.message);
    }
};

export const createTaskSubmission = async (submissionData) => {
    const {
        userId,
        programId,
        weekIndex,
        dayIndex,
        globalDayIndex,
        exerciseIndex,
        notes,
        file,
        taskType: explicitTaskType,
        status: statusInput
    } = submissionData;

    const gIndex = Number(globalDayIndex);
    const eIndex = Number(exerciseIndex);
    const wIndex = Number(weekIndex);
    const dIndex = Number(dayIndex);

    let taskType = explicitTaskType || "Workout";
    let status = statusInput === "skipped" ? "skipped" : "pending";

    // If it's a workout, we verify it against the plan to be safe (and to stay consistent)
    // If it's a meal, we trust the frontend (since meals are static and not in the "plan" document)
    if (taskType === "Workout") {
        taskType = await getTaskTypeFromPlan(userId, gIndex, eIndex);
        if (status === "skipped") {
            throw new Error("Workouts cannot be skipped.");
        }
    }

    let userSubmission = await TaskSubmission.findOne({ userId });

    if (!userSubmission) {
        userSubmission = new TaskSubmission({
            userId,
            programId: mongoose.Types.ObjectId.isValid(programId) ? programId : undefined,
            dailySubmissions: [{
                globalDayIndex: gIndex,
                weekIndex: wIndex,
                dayIndex: dIndex,
                exercises: [{
                    exerciseIndex: eIndex,
                    taskType,
                    status: status,
                    file,
                    notes,
                    updatedAt: Date.now()
                }]
            }]
        });
        await userSubmission.save();
    } else {
        // Find the day
        let day = userSubmission.dailySubmissions.find(d => d.globalDayIndex === gIndex);

        if (!day) {
            userSubmission.dailySubmissions.push({
                globalDayIndex: gIndex,
                weekIndex: wIndex,
                dayIndex: dIndex,
                exercises: [{
                    exerciseIndex: eIndex,
                    taskType,
                    status: status,
                    file,
                    notes,
                    updatedAt: Date.now()
                }]
            });
        } else {
            // Find the exercise
            let exercise = day.exercises.find(e => e.exerciseIndex === eIndex && e.taskType === taskType);

            if (exercise) {
                if (exercise.status === 'verified') {
                    throw new Error("Task already verified");
                }
                exercise.status = status;
                exercise.taskType = taskType;
                exercise.file = file || exercise.file;
                exercise.notes = notes || exercise.notes;
                exercise.adminComment = "";
                exercise.updatedAt = Date.now();
            } else {
                day.exercises.push({
                    exerciseIndex: eIndex,
                    taskType,
                    status: status,
                    file,
                    notes,
                    updatedAt: Date.now()
                });
            }
        }

        if (mongoose.Types.ObjectId.isValid(programId)) {
            userSubmission.programId = programId;
        }
        await userSubmission.save();
    }

    // Update last task submission date for inactivity tracking
    await User.findByIdAndUpdate(userId, { $set: { lastTaskSubmissionDate: new Date() } }).exec();

    // Check if we can complete the day (regardless of status: skipped, verified, or pending)
    await checkAndAdvanceDay(userId, gIndex);

    // Get the specific submission object for socket/response (flattened format)
    const day = userSubmission.dailySubmissions.find(d => d.globalDayIndex === gIndex);
    const submission = day.exercises.find(e => e.exerciseIndex === eIndex);

    // Notify Experts and Admins via Socket
    await notifyExpertsAndAdmins(userId, userSubmission._id, "new_task_submission", { status, taskType });

    if (taskType === "Meal" && status === "skipped") {
        await safeCreateNotification({
            type: "meal_skipped",
            message: "You skipped a meal today",
            recipientRole: "user",
            recipientId: userId,
            metadata: {
                submissionId: userSubmission._id,
                globalDayIndex: gIndex,
                exerciseIndex: eIndex
            }
        });
    }

    return submission;
};

export const createMultipleWorkoutSubmissions = async (submissionData) => {
    const {
        userId,
        programId,
        weekIndex,
        dayIndex,
        globalDayIndex,
        exerciseIndices,
        notes,
        file,
        taskType
    } = submissionData;

    const gIndex = Number(globalDayIndex);
    const wIndex = Number(weekIndex);
    const dIndex = Number(dayIndex);

    if (!Array.isArray(exerciseIndices) || exerciseIndices.length === 0) {
        throw new Error("Exercise indices must be a non-empty array");
    }

    let userSubmission = await TaskSubmission.findOne({ userId });

    if (!userSubmission) {
        userSubmission = new TaskSubmission({
            userId,
            programId: mongoose.Types.ObjectId.isValid(programId) ? programId : undefined,
            dailySubmissions: [{
                globalDayIndex: gIndex,
                weekIndex: wIndex,
                dayIndex: dIndex,
                exercises: exerciseIndices.map(eIndex => ({
                    exerciseIndex: Number(eIndex),
                    taskType: taskType || "Workout",
                    status: "pending",
                    file,
                    notes,
                    updatedAt: Date.now()
                }))
            }]
        });
        await userSubmission.save();
    } else {
        let day = userSubmission.dailySubmissions.find(d => d.globalDayIndex === gIndex);

        if (!day) {
            userSubmission.dailySubmissions.push({
                globalDayIndex: gIndex,
                weekIndex: wIndex,
                dayIndex: dIndex,
                exercises: exerciseIndices.map(eIndex => ({
                    exerciseIndex: Number(eIndex),
                    taskType: taskType || "Workout",
                    status: "pending",
                    file,
                    notes,
                    updatedAt: Date.now()
                }))
            });
        } else {
            // Update or add each exercise
            const targetTaskType = taskType || "Workout";
            for (const eIndex of exerciseIndices) {
                const exerciseIndex = Number(eIndex);
                let exercise = day.exercises.find(e => e.exerciseIndex === exerciseIndex && e.taskType === targetTaskType);
                if (exercise) {
                    if (exercise.status === 'verified') {
                        throw new Error("One or more tasks already verified");
                    }
                    exercise.status = 'pending';
                    exercise.taskType = targetTaskType;
                    exercise.file = file || exercise.file;
                    exercise.notes = notes || exercise.notes;
                    exercise.adminComment = "";
                    exercise.updatedAt = Date.now();
                } else {
                    day.exercises.push({
                        exerciseIndex,
                        taskType: taskType || "Workout",
                        status: "pending",
                        file,
                        notes,
                        updatedAt: Date.now()
                    });
                }
            }
        }

        if (mongoose.Types.ObjectId.isValid(programId)) {
            userSubmission.programId = programId;
        }
        await userSubmission.save();
    }

    // Update last task submission date for inactivity tracking
    await User.findByIdAndUpdate(userId, { $set: { lastTaskSubmissionDate: new Date() } }).exec();

    // Notify Experts and Admins via Socket
    await notifyExpertsAndAdmins(userId, userSubmission._id, "new_task_submission", {
        taskType: taskType || "Workout"
    });

    // Check if day is complete
    await checkAndAdvanceDay(userId, gIndex);

    return { success: true, message: "All workout tasks submitted successfully" };
};



export const getAllUserTaskSubmissions = async (expertId, userRole, targetUserId) => {
    // We are fetching ALL tasks for the user, regardless of the requester's role.
    // Filtering will be handled on the frontend if necessary.
    
    const matchQuery = {
         userId: new mongoose.Types.ObjectId(targetUserId)
    };

    const submissions = await TaskSubmission.aggregate([
        { $match: matchQuery },
        { $unwind: "$dailySubmissions" },
        { $unwind: "$dailySubmissions.exercises" },
        // Removed taskType filter match stage
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $lookup: {
                from: "programslists",
                localField: "programId",
                foreignField: "_id",
                as: "programDetails"
            }
        },
        { $unwind: { path: "$programDetails", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: "$dailySubmissions.exercises._id",
                parentSubmissionId: "$_id",
                userId: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    profileImage: "$userDetails.profileImage"
                },
                programId: {
                    _id: "$programDetails._id",
                    title: "$programDetails.title"
                },
                weekIndex: "$dailySubmissions.weekIndex",
                dayIndex: "$dailySubmissions.dayIndex",
                globalDayIndex: "$dailySubmissions.globalDayIndex",
                exerciseIndex: "$dailySubmissions.exercises.exerciseIndex",
                status: "$dailySubmissions.exercises.status",
                taskType: "$dailySubmissions.exercises.taskType",
                file: "$dailySubmissions.exercises.file",
                notes: "$dailySubmissions.exercises.notes",
                createdAt: "$dailySubmissions.exercises.createdAt",
                adminComment: "$dailySubmissions.exercises.adminComment"
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    return submissions;
};

export const getPendingTaskSubmissions = async (expertId, userRole) => {
    const lowerRole = userRole.toLowerCase();

    let matchQuery = {};
    let taskTypeFilter = null;

    const allowedRolesToSeeAll = ["admin", "manager", "head", "founder"];

    if (!allowedRolesToSeeAll.includes(lowerRole)) {
        const searchId = new mongoose.Types.ObjectId(expertId);

        const clientIds = await User.find({
            $or: [
                { trainer: searchId },
                { dietition: searchId },
                { therapist: searchId }
            ]
        }).distinct("_id");

        matchQuery.userId = { $in: clientIds };

        if (lowerRole.includes("trainer")) taskTypeFilter = "Workout";
        else if (lowerRole.includes("dietician") || lowerRole.includes("dietitian")) taskTypeFilter = "Meal";
        else if (lowerRole.includes("therapist")) taskTypeFilter = "Therapy";
    }

    const submissions = await TaskSubmission.aggregate([
        { $match: matchQuery },
        { $unwind: "$dailySubmissions" },
        { $unwind: "$dailySubmissions.exercises" },
        {
            $match: {
                "dailySubmissions.exercises.status": "pending",
                ...(taskTypeFilter ? { "dailySubmissions.exercises.taskType": taskTypeFilter } : {})
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $lookup: {
                from: "programslists", // Mongoose pluralizes ProgramsList to programslists
                localField: "programId",
                foreignField: "_id",
                as: "programDetails"
            }
        },
        { $unwind: { path: "$programDetails", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: "$dailySubmissions.exercises._id",
                parentSubmissionId: "$_id",
                userId: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    profileImage: "$userDetails.profileImage"
                },
                programId: {
                    _id: "$programDetails._id",
                    title: "$programDetails.title"
                },
                weekIndex: "$dailySubmissions.weekIndex",
                dayIndex: "$dailySubmissions.dayIndex",
                globalDayIndex: "$dailySubmissions.globalDayIndex",
                exerciseIndex: "$dailySubmissions.exercises.exerciseIndex",
                status: "$dailySubmissions.exercises.status",
                taskType: "$dailySubmissions.exercises.taskType",
                file: "$dailySubmissions.exercises.file",
                notes: "$dailySubmissions.exercises.notes",
                createdAt: "$dailySubmissions.exercises.createdAt"
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    return submissions;
};

export const verifyTaskSubmission = async (submissionId) => {
    const userSubmission = await TaskSubmission.findOne({ "dailySubmissions.exercises._id": submissionId });

    if (!userSubmission) {
        throw new Error("Submission not found");
    }

    let foundGlobalDayIndex = null;
    let foundExerciseIndex = null;
    let foundTaskType = "task";

    userSubmission.dailySubmissions.forEach(day => {
        const ex = day.exercises.find(e => e._id.toString() === submissionId);
        if (ex) {
            ex.status = "verified";
            ex.updatedAt = Date.now();
            foundGlobalDayIndex = day.globalDayIndex;
            foundExerciseIndex = ex.exerciseIndex;
            foundTaskType = ex.taskType || "task";
        }
    });

    await userSubmission.save();

    // Check if we need to advance the day
    await checkAndAdvanceDay(userSubmission.userId, foundGlobalDayIndex);

    // Notify Experts and Admins via Socket
    await notifyExpertsAndAdmins(userSubmission.userId, userSubmission._id, "task_updated", {
        status: "verified",
        taskType: foundTaskType
    });

    // Notify the specific client
    try {
        const io = getIO();
        io.to(userSubmission.userId.toString()).emit("task_status_updated", {
            submissionId: userSubmission._id,
            status: "verified",
            globalDayIndex: foundGlobalDayIndex,
            exerciseIndex: foundExerciseIndex
        });
    } catch (socketError) {
        console.error("Socket notification failed:", socketError.message);
    }

    let userMessage = "Your task was approved";
    let userType = "generic";

    if (foundTaskType === "Meal") {
        userType = "meal_approved";
        userMessage = "Meal marked as approved by Dietitian";
    } else if (foundTaskType === "Workout") {
        userMessage = "Workout marked as approved by Trainer";
    } else if (foundTaskType === "Therapy") {
        userMessage = "Therapy marked as approved by Therapist";
    }

    await safeCreateNotification({
        type: userType,
        message: userMessage,
        recipientRole: "user",
        recipientId: userSubmission.userId,
        metadata: {
            submissionId: userSubmission._id,
            globalDayIndex: foundGlobalDayIndex,
            exerciseIndex: foundExerciseIndex,
            taskType: foundTaskType
        }
    });

    return { success: true, message: "Task verified" };
};

export const rejectTaskSubmission = async (submissionId, comment) => {
    const userSubmission = await TaskSubmission.findOne({ "dailySubmissions.exercises._id": submissionId });

    if (!userSubmission) {
        throw new Error("Submission not found");
    }

    let foundGlobalDayIndex = null;
    let foundExerciseIndex = null;
    let foundTaskType = "task";

    // Find the rejected task and its globalDayIndex
    userSubmission.dailySubmissions.forEach(day => {
        const ex = day.exercises.find(e => e._id.toString() === submissionId);
        if (ex) {
            foundGlobalDayIndex = day.globalDayIndex;
            foundExerciseIndex = ex.exerciseIndex;
            foundTaskType = ex.taskType || "task";
        }
    });

    // Reject ONLY the specific task
    if (foundGlobalDayIndex !== null) {
        userSubmission.dailySubmissions.forEach(day => {
            if (day.globalDayIndex === foundGlobalDayIndex) {
                const ex = day.exercises.find(e => e._id.toString() === submissionId);
                if (ex && ex.status !== 'verified') {
                    ex.status = "rejected";
                    ex.adminComment = comment || "Rejected by expert";
                    ex.updatedAt = Date.now();

                    // If it's a Workout, we must revoke day completion (cooldown) to force resubmission
                    if (ex.taskType === "Workout") {

                        User.findByIdAndUpdate(userSubmission.userId, {
                            $unset: { lastDayCompletionTime: 1 }
                        }).exec();
                    }
                }
            }
        });
    }

    await userSubmission.save();

    // Notify Experts and Admins via Socket
    await notifyExpertsAndAdmins(userSubmission.userId, userSubmission._id, "task_updated", {
        status: "rejected",
        taskType: foundTaskType
    });

    // Notify the specific client
    try {
        const io = getIO();
        io.to(userSubmission.userId.toString()).emit("task_status_updated", {
            submissionId: userSubmission._id,
            status: "rejected",
            globalDayIndex: foundGlobalDayIndex,
            exerciseIndex: foundExerciseIndex
        });
    } catch (socketError) {
        console.error("Socket notification failed:", socketError.message);
    }

    const trimmedComment = String(comment || "").trim();
    let userType = "feedback_received";
    let userMessage = trimmedComment
        ? `Task feedback: ${trimmedComment}`
        : "Your task needs an update";

    if (foundTaskType === "Meal") {
        userType = "diet_feedback";
        userMessage = trimmedComment || "Dietitian left feedback on your meal";
    }

    await safeCreateNotification({
        type: userType,
        message: userMessage,
        recipientRole: "user",
        recipientId: userSubmission.userId,
        metadata: {
            submissionId: userSubmission._id,
            globalDayIndex: foundGlobalDayIndex,
            exerciseIndex: foundExerciseIndex,
            taskType: foundTaskType,
            comment: trimmedComment || undefined
        }
    });

    return { success: true, message: "Task rejected" };
};

export const getUserTaskStatusByUserId = async (userId, globalDayIndex) => {
    const userSubmission = await TaskSubmission.findOne({ userId });

    if (!userSubmission) {
        return [];
    }

    let flattenedSubmissions = [];
    userSubmission.dailySubmissions.forEach(day => {
        if (!globalDayIndex || day.globalDayIndex === Number(globalDayIndex)) {
            day.exercises.forEach(ex => {
                const submissionObj = ex.toObject ? ex.toObject() : ex;
                flattenedSubmissions.push({
                    ...submissionObj,
                    globalDayIndex: day.globalDayIndex,
                    weekIndex: day.weekIndex,
                    dayIndex: day.dayIndex,
                    programId: userSubmission.programId,
                    userId: userSubmission.userId
                });
            });
        }
    });

    return flattenedSubmissions;
};
