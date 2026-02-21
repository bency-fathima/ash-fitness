import { success } from "zod";
import * as payrollService from "./incentive.service.js"

export const updatePayroll = async (req, res) => {
    try {
        const payroll = await payrollService.updatePayroll(req.body);
        res.status(200).json({
          success: true,
          message: "payroll updated successfully",
          data: payroll,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getPayroll = async (req, res) => {
    try {
        const payroll = await payrollService.getPayroll()
        res.status(200).json({
            success: true,
            data: payroll
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}