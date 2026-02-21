import express from "express";
import * as adminController from "./admin.controller.js"
import { validate } from "../../middleware/validate.js";
import { adminValidationSchema } from "../../validator/admin.validator.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router =express.Router()

router.get("/all-admins/:page/:limit", authMiddleware, adminController.getAllAdmins)
router.get("/founder/list/:page/:limit", authMiddleware, adminController.getFounderAdminList);
router.post("/add-admin", authMiddleware, validate(adminValidationSchema),adminController.addAdmin)
router.get("/admin-profile/:id", authMiddleware, adminController.getAdminProfile)
router.get("/get-all-coaches-by-admin/:adminId/:page/:limit", authMiddleware, adminController.getAllCoachesByAdmin);

router.get("/dashboard-data/:adminId", authMiddleware, adminController.getDashboardData)
router.get("/get-admin-by-head/:headId/:page/:limit", authMiddleware, adminController.getAdminByHead)
export default router;