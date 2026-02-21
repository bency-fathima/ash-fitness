import BaseTable from '@/components/table/BaseTable'
import React, { useEffect, useState } from 'react'
import { FinanceColumns } from './FinanceColumns'
import FinanceKpi from './FinanceKpi'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '@/redux/features/auth/auth.selectores'
import { getAllEmployeeHistory } from '@/redux/features/finance/finance.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { selectEmployeeError, selectEmployeeHistory, selectEmployeeHistoryCount, selectEmployeeStatus } from '@/redux/features/finance/finance.selector'
import { SyncLoader } from 'react-spinners'

export default function FinanceTable() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getAllEmployeeHistory({ id: user._id, page, limit }));
  }, [dispatch, page, limit, user._id]);

  const data = useAppSelector(selectEmployeeHistory);
  const count = useAppSelector(selectEmployeeHistoryCount);
  const error = useAppSelector(selectEmployeeError);
  const status = useAppSelector(selectEmployeeStatus);
  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="h-[calc(100vh-130px)] pb-4 overflow-auto no-scrollbar">
      <FinanceKpi />
      {count > 0 && (
        <BaseTable
          columns={FinanceColumns}
          data={data}
          pageLabel={"Payroll History"}
          handlePageChange={setPage}
          handleLimitChange={setLimit}
          page={page}
          limit={limit}
          totalCount={count}
        />
      )}
    </div>
  );
}
