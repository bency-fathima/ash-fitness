import { assets } from '@/assets/asset'
import KpiCard from '@/components/cards/KpiCard'
import { selectUser } from '@/redux/features/auth/auth.selectores';
import { refreshProfile } from '@/redux/features/auth/auth.thunk';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function FinanceKpi() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(refreshProfile({ id: user?._id, role: user?.role }));
  }, [dispatch, user?._id, user?.role]);
  const netSalary = user?.salary + user?.incentives;
  return (
    <div className=" bg-white p-5 rounded-xl mb-4 space-y-4">
      <h2 className="text-[#9e5608] font-bold text-[16px]">Salary Overview</h2>

      <div className="flex flex-col md:flex-row gap-4 justify-between  ">
        <KpiCard
          title="Base Salary"
          value={`₹ ${user?.salary?.toLocaleString("en-IN")}`}
          icon={assets.totalEmploy}
          bg="#9e5608"
        />
        <KpiCard
          title="Total Incentives"
          value={`₹ ${user?.incentives?.toLocaleString("en-IN")}`}
          icon={assets.totalPayroll}
          bg="#F4DBC7"
        />
        <KpiCard
          title="Net Salary"
          value={`₹ ${netSalary?.toLocaleString("en-IN")}`}
          icon={assets.pendingPayroll}
          bg="#9e5608"
        />
      </div>
    </div>
  );
}
