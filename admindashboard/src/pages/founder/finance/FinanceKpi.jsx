import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";
import React, { useState } from "react";
import PayrollMenu from "./PayrollMenu";
import { useAppSelector } from "@/redux/store/hooks";
import { selectEmployeeCount, selectTotalBaseSalary, selectTotalIncentive, selectTotalSalary } from "@/redux/features/finance/finance.selector";

export default function FinanceKpi() {
  const [payrollOpen, setPayrollOpen] = useState(false);
  const count = useAppSelector(selectEmployeeCount);
  const totalPayroll = useAppSelector(selectTotalSalary);
  const totalBaseSalary = useAppSelector(selectTotalBaseSalary);
  const totalIncentive = useAppSelector(selectTotalIncentive);



  return (
    <div className="relative flex flex-col items-center gap-8 md:gap-4 w-full bg-white p-5 rounded-xl mb-4 h-[calc()]">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center md:justify-between w-full">
        <h2 className="text-[#9e5608] font-bold text-[16px]">
          Salary & Incentives Overview
        </h2>
        <div className="flex md:justify-end items-center gap-2.5 w-full md:w-fit">
          <button
            className="text-[12px] font-semibold px-3.5 py-2.5 bg-[#9e5608] rounded-md text-white"
            onClick={() => setPayrollOpen(!payrollOpen)}
          >
            Add Incentives
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 justify-between  w-full">
        <KpiCard
          title="Total Employees"
          value={count}
          icon={assets.totalEmploy}
          iconClass="bg-[#9e5608]"
          bg="#9e5608"
        />
        <KpiCard
          title="Total Incentive"
          value={`₹ ${totalIncentive?.toLocaleString("en-IN")}`}
          icon={assets.totalPayroll}
          iconClass="bg-[#F4DBC7]"
          bg="#F4DBC7"
        />
        <KpiCard
          title="Total Base Salary"
          value={`₹ ${totalBaseSalary?.toLocaleString("en-IN")}`}
          icon={assets.pendingPayroll}
          iconClass="bg-[#9e5608]"
          bg="#9e5608"
        />
        <KpiCard
          title="Total Payroll"
          value={`₹ ${totalPayroll?.toLocaleString("en-IN")}`}
          icon={assets.totalPayroll}
          iconClass="bg-[#F4DBC7]"
          bg="#F4DBC7"
        />
      </div>
      {/* payroll menu */}
      {payrollOpen && (
        <PayrollMenu
          setPayrollOpen={setPayrollOpen}
          payrollOpen={payrollOpen}
        />
      )}
    </div>
  );
}
