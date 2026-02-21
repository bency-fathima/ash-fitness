import React, { useEffect, useState, useMemo } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { getClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { getClientsBasedOnCoach } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";
import { selectAllCoaches } from "@/redux/features/coach/coach.selector";
import { getAllCoachesByAdminId } from "@/redux/features/admins/admin.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";

export default function ClientsTable() {
  const dispatch = useDispatch();

  const coachIds = useAppSelector(selectAllCoaches);
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);
  const [clients, setClients] = useState([]);
  const [clientsLength, setClientsLength] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  if (coachIds.length === 0) {
    dispatch(getAllCoachesByAdminId(user?._id, page, limit));
  }

  const fetchClientData = async () => {
    const client = await dispatch(
      getClientsBasedOnCoach({ coachIds, page, limit })
    ).unwrap();
    setClients(client.data);
    setClientsLength(client.total);
  };

  const columns = useMemo(() => getClientColumns(fetchClientData), [fetchClientData]);

  const navigate = useNavigate();


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const searchInpiutHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profilePath = (id) => {
    navigate(`/admin/clients/profile/${id}`);
  };

  useEffect(() => {
    fetchClientData();
  }, [page, limit, dispatch]);

  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={columns}
        data={filteredClients}
        actionLabel="Add Client"
        actionPath="/admin/clients/addclient"
        profilePath={profilePath}
        pageLabel={"Clients"}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        onSearchInputChange={searchInpiutHandler}
        page={page}
        limit={limit}
        totalCount={clientsLength}
      />
    </div>
  );
}
