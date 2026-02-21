import React, { useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { useDispatch } from 'react-redux'
import {  getAllProgramsByAdmin } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { useEffect } from 'react'
import { selectProgramError, selectProgramStatus } from '@/redux/features/program/program.selector'
import { selectUser } from '@/redux/features/auth/auth.selectores'

export default function ProgramTable() {

  const user =useAppSelector(selectUser)
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userPrograms, setUserPrograms] = useState([])
  const [totalPrograms, setTotalPrograms] = useState(0);

  const fetchUserPrograms = async () => {
    const response = await dispatch(
      getAllProgramsByAdmin({adminId: user._id, page, limit})
    ).unwrap();
    setUserPrograms(response.data);
    setTotalPrograms(response.totalProgram);
  }
  useEffect(() => {
    fetchUserPrograms();
  }, [dispatch, page, limit, user?._id]);

  const status = useAppSelector(selectProgramStatus);
  const error = useAppSelector(selectProgramError);

    const searchInputHandler = (e) => {
      const value = e.target.value.toLowerCase();

      if (!value) {
        fetchUserPrograms()
        return;
      }

      const filtered = userPrograms.filter((programs) =>
        programs.title?.toLowerCase().includes(value)
      );

      setUserPrograms(filtered);
    };
    
  if (status === "loading") return <p>Loading programs...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ProgramListColumns}
        data={userPrograms}
        pageLabel={"Program List"}
        actionLabel="Add Program"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalPrograms}
      />
    </div>
  );
}
