import BaseTable from "@/components/table/BaseTable";
import { workoutColumns } from "./WorkoutColumns";
import {
  selectAllWorkout,
  selectWorkoutStatus,
} from "@/redux/features/workout/workout.selectors";
import { getAllWorkout } from "@/redux/features/workout/workout.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";

const WorkoutList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllWorkout({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useSelector(selectAllWorkout);
  const status = useSelector(selectWorkoutStatus);
  // const error = useSelector(selectHeadError);

  const [heads, setWorkout] = useState([]);

  useEffect(() => {
    setWorkout(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setWorkout(data);
      return;
    }

    const filtered = data.filter((workout) =>
      workout.name?.toLowerCase().includes(value)
    );

    setWorkout(filtered);
  };


  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto  no-scrollbar">
      <BaseTable
        data={heads}
        columns={workoutColumns}
        actionLabel="Add workout"
        actionPath="/founder/workout/create"
        pageLabel={"Workouts"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
      />
    </div>
  );
}

export default WorkoutList;
