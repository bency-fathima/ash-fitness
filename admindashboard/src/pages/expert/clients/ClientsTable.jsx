import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { getClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientStatus,
  selectClientError,
  selectClientsWithHabitPlan,
} from "@/redux/features/client/client.selectors";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import {
  selectAssignedClients,
  selectTotalClientsCount,
} from "@/redux/features/coach/coach.selector";
import { getUsersAssignedToACoach } from "@/redux/features/coach/coach.thunk";
import { getClientsWithHabitPlanThunk } from "@/redux/features/client/client.thunk";
 
export default function ClientsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const coachId = useAppSelector(selectUser);
  useEffect(() => {
    if (coachId?._id) {
      dispatch(getUsersAssignedToACoach({ coachId: coachId?._id, page, limit }));
    }
  }, [dispatch, coachId, page, limit]);

  

 const assignedClients = useAppSelector(selectAssignedClients) || [];
const habitClients = useAppSelector(selectClientsWithHabitPlan) || [];
useEffect(() => {
  dispatch(getClientsWithHabitPlanThunk());
}, [dispatch]);


const mergedClients = assignedClients.map((client) => {
  const habitInfo = habitClients?.find(
    (h) => h?._id === client?._id
  );

  return {
    ...client,
    hasHabitPlan: habitInfo?.hasHabitPlan ?? false,
    habitId: habitInfo?.habitId ?? null,
  };
}).filter(client => 
  client?.name?.toLowerCase().includes(search.toLowerCase()) || 
  client?.email?.toLowerCase().includes(search.toLowerCase())
);
  const clientTotalCount = useAppSelector(selectTotalClientsCount);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

  const profilePath = (id) => {
    navigate(`/expert/clients/profile/${id}`);
  };
  const role = coachId?.role?.toLowerCase();

  const columns = getClientColumns(role, navigate);

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={columns}
        data={mergedClients}
        pageLabel="My Clients"
        profilePath={profilePath}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        totalCount={clientTotalCount}
        onSearchInputChange={handleSearchChange}
      />
    </div>
  );
}
