import BaseTable from "@/components/table/BaseTable";
import React, { useEffect, useState } from "react";
import { therapyColumns } from "./Therapycolumns";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";
import { selectTherapyCount, selectTherapyError, selectTherapyLoading, selectTherapyPlans } from "@/redux/features/therapy/therapy.selectors";
import { SyncLoader } from "react-spinners";

const TherapyTable = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
      dispatch(fetchTherapyPlans({ page, limit }));
    }, [dispatch, page, limit]);

    const data = useSelector(selectTherapyPlans);
    const count = useSelector(selectTherapyCount);
    const status = useSelector(selectTherapyLoading);
    const error = useSelector(selectTherapyError);

    useEffect(() => {
        setPlans(data);
      }, [data]);

const searchInputHandler = (e) => {
  const value = e.target.value.toLowerCase();

  if (!value) {
    setPlans(data);
    return;
  }

  const filtered = data.filter((plan) =>
    plan.name?.toLowerCase().includes(value),
  );

  setPlans(filtered);
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
        data={plans}
        columns={therapyColumns}
        actionLabel="Add Therapy"
        actionPath="/founder/therapy/create"
        meta={{ navigate }}
        // profilePath= {profilePath}
        pageLabel={"Therapies"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={count}
      />
    </div>
  );
};

export default TherapyTable;
