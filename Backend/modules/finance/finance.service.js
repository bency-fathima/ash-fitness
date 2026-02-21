import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import { calculateExtraClientIncentive, calculateRatingIncentive } from "../incentive/incentive.service.js";
import { PayrollModel } from "./finance.model.js";

export const allEmployees = async (page, limit) => {
  const heads = await HeadsModel.find(
    {},
    "_id name salary email role status",
  ).lean();
  const admins = await AdminModel.find(
    {},
    "_id name salary email role status",
  ).lean();
  const experts = await CoachModel.find(
    {},
    "_id name salary email role status incentives",
  ).lean();

  const getCurrentMonthName = () => {
    return new Date().toLocaleString("en-IN", { month: "long" });
  };

  const unifiedData = [
    ...heads.map((h) => ({
      ...h,
      role: "Head",
      netSalary: h.salary,
      incentives: "N/A",
      months: getCurrentMonthName(),
    })),
    ...admins.map((a) => ({
      ...a,
      role: "Admin",
      netSalary: a.salary,
      incentives: "N/A",
      months: getCurrentMonthName(),
    })),
    ...experts.map((c) => ({
      ...c,
      role: "Expert",
      incentives: `₹ ${c.incentives.toLocaleString("en-IN")}`,
      netSalary: Number(c.salary || 0) + Number(c.incentives || 0),
      months: getCurrentMonthName(),
    })),
  ];

  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  const employees = unifiedData.slice(skip, skip + limit);
  const totalSalary = unifiedData.reduce(
    (sum, emp) => sum + Number(emp.netSalary),
    0,
  );
  const totalBaseSalary = unifiedData.reduce(
    (sum, emp) => sum + Number(emp.salary),
    0,
  );
  const totalIncentive = experts.reduce((sum, emp) => sum + emp.incentives, 0);

  return {
    employeeCount: unifiedData.length,
    totalSalary,
    employees,
    totalIncentive,
    totalBaseSalary,
  };
};

export const generateMonthlyPayroll = async () => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const alreadyGenerated = await PayrollModel.exists({ month, year });
    if (alreadyGenerated) return;

    const heads = await HeadsModel.find().lean();
    const admins = await AdminModel.find().lean();
    const coaches = await CoachModel.find().lean();

    const allEmployees = [
      ...heads.map((h) => ({ ...h, type: "Head" })),
      ...admins.map((a) => ({ ...a, type: "Admin" })),
      ...coaches.map((c) => ({ ...c, type: "Coach" })),
    ];

    for (let emp of allEmployees) {
      let updatedEmp = emp;

      if (emp.type === "Coach") {
        await calculateRatingIncentive(emp._id);
        await calculateExtraClientIncentive(emp._id);
        const freshCoach = await CoachModel.findById(emp._id).lean();
        updatedEmp = { ...freshCoach, type: "Coach" };
      }

      const baseSalary = updatedEmp.salary || 0;
      const extraClientIncentive = updatedEmp.extraClientIncentive || 0;
      const ratingIncentive = updatedEmp.ratingIncentiveAmount || 0;
      const incentive = updatedEmp.incentives || 0;
      const netSalary = baseSalary + incentive;

      await PayrollModel.create({
        employeeId: updatedEmp._id,
        employeeType: updatedEmp.type,
        month,
        year,
        baseSalary,
        ratingIncentive,
        extraClientIncentive,
        incentive,
        netSalary,
      });
    }
    return "Payroll generated successfully";
    
  } catch (error) {
    throw error;
  }
};


export const getPayrollHistoryById = async (employeeId, page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;
    const totalCount = await PayrollModel.countDocuments({ employeeId });
    const history = await PayrollModel.find({ employeeId })
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedData = history.map((item) => ({
      ...item,
      monthYear: new Date(item.year, item.month - 1).toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    }));
     return {
       totalCount,
       data: formattedData,
     };
  } catch (error) {
    throw error;
  }
};
