import express from "express"
import * as founderController from "./founder.controller.js"

const router = express.Router();

router.get("/dashboard-data", founderController.getDashboardData)
router.get("/founder-profile/:id", founderController.getFounderProfile)

export default router