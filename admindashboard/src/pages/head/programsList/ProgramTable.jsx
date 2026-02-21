import React, { useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { useDispatch } from 'react-redux'
import { getAllProgramsByCategory } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { useEffect } from 'react'
import { selectProgramError, selectProgramStatus } from '@/redux/features/program/program.selector'
import { SyncLoader } from 'react-spinners'
import { selectUser } from '@/redux/features/auth/auth.selectores'

export default function ProgramTable() {

  const user =useAppSelector(selectUser)
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [ totalProgramCount, setTotalProgramCount ] = useState(0);
  const [data, setData ] =useState([]);

  const fetchPrograms =() =>{
    dispatch(getAllProgramsByCategory({category: user?.programCategory, page, limit})).unwrap().then((response) => {
      setData(response.data);
      setTotalProgramCount(response.totalProgram);
    });
  }
  useEffect(() => {
   fetchPrograms();
  }, [dispatch, page, limit]);

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
        programs.title?.toLowerCase().includes(value)
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
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ProgramListColumns}
        data={programs}
        pageLabel={"Program List"}
        actionLabel="Add Program"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalProgramCount}
      />
    </div>
  );
}
