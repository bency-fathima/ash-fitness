import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { AdminColumns } from "./AdminColumns";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFounderAllAdmins,  } from "@/redux/features/admins/admin.thunk";
import {
  getAdminError,
  getAdminStatus,
  selectAdminCount,
  selectFounderAllAdmins,
} from "@/redux/features/admins/admins.selecters";
import { SyncLoader } from "react-spinners";

export default function AdminsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFounderAllAdmins({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useSelector(selectFounderAllAdmins);
  const totalCount = useSelector(selectAdminCount);
  const status = useSelector(getAdminStatus);
  const error = useSelector(getAdminError);

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    setAdmins(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setAdmins(data);
      return;
    }

    const filtered = data.filter((admin) =>
      admin.adminName?.toLowerCase().includes(value),
    );

    setAdmins(filtered);
  };

  const profilePath = (id) => {
    navigate(`/founder/admins/profile/${id}`);
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
      <BaseTable
        columns={AdminColumns}
        data={admins}
        profilePath={profilePath}
        pageLabel="Admins"
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
