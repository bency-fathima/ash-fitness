import express from "express";
import {
  createUserByAdmin,
  loginController,
  adminLoginController,
  logoutController,
  forgotPasswordController,
  verifyOTPController,
  resetPasswordController,
  editProfileController,
  editPasswordController
} from "./auth.controller.js";

import { authMiddleware } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { validate } from "../../middleware/validate.js";
import { 
  userLoginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema
} from "../../validator/auth.validator.js";

const router = express.Router();

router.post(
  "/admin/create-user",
  authMiddleware,
  allowRoles("admin"),
  // validate(adminUserCreateValidator),
  createUserByAdmin
);

router.post("/auth/login", validate(userLoginSchema), loginController);

router.post("/auth/logout", authMiddleware, logoutController);

router.post("/auth/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);

router.post("/auth/verify-otp", validate(verifyOTPSchema), verifyOTPController);

router.post("/auth/reset-password", validate(resetPasswordSchema), resetPasswordController);

router.patch("/auth/edit-profile", authMiddleware, allowRoles("admin", "user", "expert", "head", "founder"),editProfileController);

router.put("/auth/change-password", authMiddleware, allowRoles("admin", "user", "expert", "head", "founder"), editPasswordController);

export default router;
