import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ExpertColumns } from './ExpertColumns'
import { useDispatch } from 'react-redux';
import { getAllCoaches } from '@/redux/features/coach/coach.thunk';
import { useNavigate } from 'react-router-dom';
import { getAllCoachesByHead } from '@/redux/features/head/head.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import { selectUser } from '@/redux/features/auth/auth.selectores';

export default function ExpertTable() {

  const user =useAppSelector(selectUser)
  const [coaches,setCoaches]=useState([])
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
  
  const dispatch = useDispatch();
  const fetchCoachData=async()=>{
    const coache =await dispatch(getAllCoachesByHead({page,limit,headId:user?._id})).unwrap()
    setCoaches(coache.data)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const searchInpiutHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredAdmins = coaches.filter((admin) => {
      return (
        admin.name.toLowerCase().includes(value)
      )
    })
    setCoaches(filteredAdmins)
    if (value == '') {
      fetchCoachData();
    }
  };

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/head/experts/profile/${id}`);
  };

  useEffect(() => {
    fetchCoachData();
  }, []);
  
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ExpertColumns}
        data={coaches}
        profilePath={profilePath}
        pageLabel={"Experts"}
        onSearchInputChange={searchInpiutHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        totalCount={coaches.length}
      />
    </div>
  );
}
