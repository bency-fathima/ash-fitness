import React, { useState, useEffect } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { useDispatch } from 'react-redux'
import { getAllProgramsByExpertId } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { selectUser } from '@/redux/features/auth/auth.selectores'

export default function ProgramTable() {
  const user = useAppSelector(selectUser)
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [allPrograms, setAllPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  const fetchPrograms = async () => {
    const data = await dispatch(getAllProgramsByExpertId({ expertId: user?._id, page, limit }));
    setAllPrograms(data.payload);
    setFilteredPrograms(data.payload?.data || []);
  }

  useEffect(() => {
    fetchPrograms();
  }, [dispatch, page, limit]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setFilteredPrograms(allPrograms.data || []);
      return;
    }

    const filtered = (allPrograms.data || []).filter((program) =>
      program.title?.toLowerCase().includes(value)
    );

    setFilteredPrograms(filtered);
  };

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ProgramListColumns}
        data={filteredPrograms}
        pageLabel={"Program List"}
        actionLabel="Add Program"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={allPrograms.totalProgram}
      />
    </div>
  );
}
