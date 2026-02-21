import cron from "node-cron";
import { generateMonthlyPayroll } from "../modules/finance/finance.service.js";

// Runs at 12:01 AM on 1st of every month
cron.schedule(
  "1 0 1 * *",
  async () => {
    console.log("Running monthly payroll job...");
    await generateMonthlyPayroll();
  },
  {
    timezone: "Asia/Kolkata",
  },
);
