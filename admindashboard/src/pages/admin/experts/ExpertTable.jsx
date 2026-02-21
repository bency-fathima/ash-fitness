import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ExpertColumns } from "./ExpertColumns";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCoachesByAdminId } from "@/redux/features/admins/admin.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";

export default function ExpertTable() {
  const user = useSelector(selectUser);
  const [coaches, setCoaches] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();

  const fetchCoachData = async () => {
    const response = await dispatch(
      getAllCoachesByAdminId({ page, limit, adminId: user?._id })
    ).unwrap();
    const coachesData = response;
    const totalCount = response.length;

    const formattedCoaches = coachesData?.map((coach) => ({
      ...coach,
      clients: coach.assignedUsers ? coach.assignedUsers.length : 0,
    }));
    setCoaches(formattedCoaches);
    setTotal(totalCount);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const searchInpiutHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredAdmins = coaches.filter((admin) => {
      return admin.name.toLowerCase().includes(value);
    });
    setCoaches(filteredAdmins);
    if (value == "") {
      fetchCoachData();
    }
  };

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/admin/experts/profile/${id}`);
  };

  useEffect(() => {
    fetchCoachData();
  }, [page, limit]);

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ExpertColumns}
        data={coaches}
        actionLabel="Add Expert"
        actionPath="/admin/experts/addexpert"
        profilePath={profilePath}
        pageLabel={"Experts"}
        onSearchInputChange={searchInpiutHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        totalCount={total}
      />
    </div>
  );
}
