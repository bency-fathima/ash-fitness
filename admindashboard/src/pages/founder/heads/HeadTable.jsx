import BaseTable from "@/components/table/BaseTable";
import React, { useEffect, useState } from "react";
import { therapyColumns } from "./Headcolumns";
import { useDispatch, useSelector } from "react-redux";
import { getFounderAllHeads } from "@/redux/features/head/head.thunk";
import {
  selectFounderAllHeads,
  selectHeadCount,
  selectHeadError,
  selectHeadStatus,
} from "@/redux/features/head/head.selectors";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const HeadTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profilePath = (id) => {
    navigate(`/founder/heads/profile/${id}`);
  };

  useEffect(() => {
    dispatch(getFounderAllHeads({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useSelector(selectFounderAllHeads);
  const totalCount = useSelector(selectHeadCount);
  const status = useSelector(selectHeadStatus);
  const error = useSelector(selectHeadError);

  const [heads, setHeads] = useState([]);
 

  useEffect(() => {
    setHeads(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setHeads(data);
      return;
    }

    const filtered = data.filter((head) =>
      head.headName?.toLowerCase().includes(value),
    );

    setHeads(filtered);
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
        data={heads}
        columns={therapyColumns()}
        actionLabel="Add Head"
        actionPath="/founder/heads/add-head"
        profilePath={profilePath}
        pageLabel={"Heads"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
};

export default HeadTable;
