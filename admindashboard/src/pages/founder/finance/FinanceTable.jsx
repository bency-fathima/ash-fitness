import BaseTable from '@/components/table/BaseTable'
import React, { useEffect, useState } from 'react'
import { FinanceColumns } from './FinanceColumns'
// import { financeData } from './financeData'
import KpiCard from '@/components/cards/KpiCard'
import FinanceKpi from './FinanceKpi'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/redux/store/hooks'
import { SyncLoader } from "react-spinners";
import { getAllEmployees } from '@/redux/features/finance/finance.thunk'
import { selectAllEmployees, selectEmployeeCount, selectEmployeeError, selectEmployeeStatus } from '@/redux/features/finance/finance.selector'


export default function FinanceTable() {
  const dispatch = useDispatch();
  //  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getAllEmployees({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useAppSelector(selectAllEmployees);
  const count = useAppSelector(selectEmployeeCount);
  const error = useAppSelector(selectEmployeeError);
  const status = useAppSelector(selectEmployeeStatus);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setEmployees(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setEmployees(data);
      return;
    }

    const filtered = data.filter((coach) =>
      coach.name?.toLowerCase().includes(value)
    );

    setEmployees(filtered);
  };

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
          data={employees}
          pageLabel={"Finance List"}
          onSearchInputChange={searchInputHandler}
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
