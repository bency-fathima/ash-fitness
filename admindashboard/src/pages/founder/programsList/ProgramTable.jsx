import React, { useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { useDispatch } from 'react-redux'
import {  getFounderPrograms } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { useEffect } from 'react'
import {  selectFounderPrograms, selectProgramError, selectProgramStatus, selectTotalProgramCount } from '@/redux/features/program/program.selector'
import { SyncLoader } from "react-spinners";

export default function ProgramTable() {

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getFounderPrograms({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useAppSelector(selectFounderPrograms);
  const totalCount = useAppSelector(selectTotalProgramCount);
  const status = useAppSelector(selectProgramStatus);
  const error = useAppSelector(selectProgramError);

  const [ programs, setProgram ] = useState([]);

  useEffect(()=>{
    setProgram(data)
  },[data])


    const searchInputHandler = (e) => {
      const value = e.target.value.toLowerCase();

      if (!value) {
        setProgram(data);
        return;
      }

      const filtered = data.filter((programs) =>
        programs.programTitle?.toLowerCase().includes(value),
      );

      setProgram(filtered);
    };
  if (status === "loading") return (
    <div className="flex justify-center items-center h-[calc(100vh-120px)]">
      <SyncLoader color="#9e5608" loading margin={2} size={20} />
    </div>
  );
  if (error) return <p>{error}</p>;
  return (
    <div className="h-[calc(100vh-130px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ProgramListColumns}
        data={programs}
        pageLabel={"Program List"}
        actionLabel="Add Program"
        actionPath="/founder/programs/add-program"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
}
