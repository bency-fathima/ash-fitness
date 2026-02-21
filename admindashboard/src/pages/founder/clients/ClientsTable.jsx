import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientStatus,
  selectClientError,
  selectTotalClientCount,
  selectFounderAllClients,
} from "@/redux/features/client/client.selectors";
import { getFounderAllClients } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";


export default function ClientsTable() {

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();  
  const navigate = useNavigate();

  const profilePath = (id)=> {
        navigate(`/founder/clients/profile/${id}`);
  }

  useEffect(() => {
    dispatch(getFounderAllClients({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useAppSelector(selectFounderAllClients);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);
  const clientsLength = useAppSelector(selectTotalClientCount);

  const [clients, setClient] = useState([]);

  useEffect(()=>{
    setClient(data)
  },[data])

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setClient(data);
      return;
    }

    const filtered = data.filter((client) =>
      client.userName?.toLowerCase().includes(value),
    );

    setClient(filtered);
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
        columns={ClientColumns}
        data={clients}
        profilePath={profilePath}
        pageLabel={"Clients"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={clientsLength}
      />
    </div>
  );
}
