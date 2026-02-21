import express from "express";
import * as payrollController from "./incentive.controller.js"

const router = express.Router();

router.put("/update", payrollController.updatePayroll);
router.get("/get-incentive", payrollController.getPayroll)

export default router;