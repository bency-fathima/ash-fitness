import fs from 'fs';
import path from 'path';
import TaskSubmission from '../modules/taskSubmission/taskSubmission.model.js';

export const startImageCleanupTask = () => {
    // Run immediately on start (after a short delay to ensure DB is connected)
    setTimeout(cleanupOldClientImages, 5000);

    // Schedule: Runs every 24 hours
    const interval = 24 * 60 * 60 * 1000;
    setInterval(cleanupOldClientImages, interval);
};

const cleanupOldClientImages = async () => {
    console.log("Running scheduled task: Cleanup of old client images (older than 3 months)...");
    try {
        const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        
        // Fetch all task submissions
        // Note: For large datasets, this should be optimized with an aggregation pipeline or specific queries.
        const submissions = await TaskSubmission.find({});
        
        let deletedCount = 0;

        for (const submission of submissions) {
            let isModified = false;

            if (submission.dailySubmissions) {
                for (const daily of submission.dailySubmissions) {
                    if (daily.exercises) {
                        for (const exercise of daily.exercises) {
                            // Check criteria: has file AND created more than 7 days ago
                            if (exercise.file && exercise.createdAt && new Date(exercise.createdAt) < threeMonthsAgo) {
                                const filePathRelative = exercise.file; // e.g. "/uploads/filename"
                                
                                // Remove leading slash if present to make it relative to root
                                const cleanPath = filePathRelative.startsWith('/') ? filePathRelative.slice(1) : filePathRelative;
                                
                                // Resolve absolute path. Assumes process is running from Backend root.
                                const absolutePath = path.resolve(process.cwd(), cleanPath);
                                
                                // Verify it is inside the uploads folder for safety
                                if (absolutePath.includes('uploads')) {
                                    if (fs.existsSync(absolutePath)) {
                                        try {
                                            fs.unlinkSync(absolutePath);
                                            console.log(`[Cleanup] Deleted file: ${absolutePath}`);
                                            deletedCount++;
                                        } catch (err) {
                                            console.error(`[Cleanup] Failed to delete file ${absolutePath}:`, err.message);
                                        }
                                    } else {
                                        // File not found on disk, but we should still clear the DB record
                                        // console.log(`[Cleanup] File not found on disk: ${absolutePath}`);
                                    }

                                    // Clear the DB reference
                                    exercise.file = null;
                                    isModified = true;
                                }
                            }
                        }
                    }
                }
            }
            
            if (isModified) {
                await submission.save();
            }
        }
        
        if (deletedCount > 0) {
            console.log(`[Cleanup] Completed. Deleted ${deletedCount} images.`);
        } else {
            console.log(`[Cleanup] Completed. No old images found to delete.`);
        }

    } catch (error) {
        console.error("[Cleanup] Error in image cleanup task:", error);
    }
};
