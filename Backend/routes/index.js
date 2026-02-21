import express from "express"
import coachRoutes from "../modules/coach/coach.route.js"
import programRoutes from "../modules/allPrograms/allPrograma.route.js"
import authRoutes from '../modules/auth/auth.routes.js'
import clientRoutes from "../modules/clients/client.routes.js"
import chatRoutes from "../modules/chat/chat.route.js"
import therapyRouts from "../modules/therapy/therapy.route.js"
import adminRoutes from "../modules/admin/admin.routes.js"
import headRouts from "../modules/Heads/heads.route.js"
import categoryRouts from "../modules/category/category.routes.js"
import incentiveRouts from "../modules/incentive/incentive.route.js";
import planRoutes from "../modules/plan/plan.route.js"
import founderRoutes from "../modules/founder/founder.routes.js"
import financeRoutes from "../modules/finance/finance.route.js"
import taskSubmissionRoutes from "../modules/taskSubmission/taskSubmission.routes.js";
import broadcastRoutes from "../modules/broadcast/broadcast.routes.js"
import habitRoutes from "../modules/habit/habit.routes.js"
import notificationRoutes from "../modules/notification/notification.routes.js";

const router = express.Router();

router.use('/', authRoutes)
router.use("/clients", clientRoutes)
router.use("/coach", coachRoutes);
router.use("/programs", programRoutes);
router.use("/chats", chatRoutes)
router.use("/therapy", therapyRouts);
router.use("/admin", adminRoutes)
router.use("/heads", headRouts);
router.use("/category", categoryRouts);
router.use("/incentive", incentiveRouts);
router.use("/plans", planRoutes)
router.use("/founder", founderRoutes)
router.use("/finance", financeRoutes)
router.use("/tasks", taskSubmissionRoutes);
router.use("/broadcast", broadcastRoutes);
router.use("/habits",habitRoutes)
router.use("/notifications", notificationRoutes)




export default router;
