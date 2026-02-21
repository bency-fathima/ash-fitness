import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { AdminColumns } from './AdminColumns'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAdminsByHeadId } from '@/redux/features/admins/admin.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import { selectUser } from '@/redux/features/auth/auth.selectores';

export default function AdminsList() {

  const user =useAppSelector(selectUser)
  const [admins,setAdmins]=useState([])
  const [totalCount,setTotalCount]=useState(0)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();
  const fetchAdminData=async()=>{
    const admin =await dispatch(getAdminsByHeadId({page,limit,headId:user?._id})).unwrap()
    setAdmins(admin.data)
    setTotalCount(admin.total)
  }
 const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const navigate = useNavigate();

  const profilePath = (id) => {
    navigate(`/head/admins/profile/${id}`);
  };

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredAdmins = admins.filter((admin) => {
      return (
        admin.name.toLowerCase().includes(value)
      )
    })
    setAdmins(filteredAdmins)
    if (value == '') {
      fetchAdminData();
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page, limit]);
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={AdminColumns}
        data={admins}
        actionLabel="Add Admins"
        actionPath="/head/admins/add-admin"
        profilePath={profilePath}
        pageLabel={"Admins"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
}
