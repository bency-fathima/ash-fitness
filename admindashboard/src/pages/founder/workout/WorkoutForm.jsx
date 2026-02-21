import BaseForm from '@/components/form/BaseForm';
import { createWorkout } from '@/redux/features/workout/workout.thunk';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const WorkoutForm = () => {
    const fields = [
      {
        section: "Create new head",
        position: "left",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
          },
          
        ],
      },
    ];
    const initialValues = {
      name: "",
    };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

    const handelSubmit = (value) => {
      dispatch(createWorkout(value));
      navigate("/founder/workout")
    };

  return (
    <div>
            <BaseForm fields={fields} initialValues={initialValues} onSubmit={(value)=> handelSubmit(value)}/>
          
        </div>
  )
}

export default WorkoutForm;