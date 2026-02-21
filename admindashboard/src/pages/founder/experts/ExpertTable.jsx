import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ExpertColumns } from './ExpertColumns'
import { useDispatch } from 'react-redux';
import { getFounderAllCoaches } from '@/redux/features/coach/coach.thunk';
import { useNavigate } from 'react-router-dom';
import { selectCoachCount, selectCoachStatus, selectFounderAllCoaches,  } from '@/redux/features/coach/coach.selector';
import { useAppSelector } from '@/redux/store/hooks';
import { SyncLoader } from "react-spinners";


export default function ExpertTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const profilePath = (id) => {
    navigate(`/founder/experts/profile/${id}`);
  };

  useEffect(() => {
    dispatch(getFounderAllCoaches({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useAppSelector(selectFounderAllCoaches);
  const totalCount = useAppSelector(selectCoachCount);
  // const error = useAppSelector(selectCoachError);
  const status = useAppSelector(selectCoachStatus);

  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    setCoaches(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setCoaches(data);
      return;
    }

    const filtered = data.filter((coach) =>
      coach.coachName?.toLowerCase().includes(value),
    );

    setCoaches(filtered);
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  // if (error) return <p>{error}</p>;

  return (
    <div className="h-[calc(100vh-130px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ExpertColumns}
        data={coaches}
        profilePath={profilePath}
        pageLabel={"Experts"}
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
