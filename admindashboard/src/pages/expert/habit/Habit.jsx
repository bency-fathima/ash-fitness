import * as Yup from "yup";
import BaseForm from "@/components/form/BaseForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createHabitsThunk } from "@/redux/features/habit/habit.thunk.js";
import { toast } from "react-toastify";

const habitFields = [
  {
    section: "Habits",
    position: "left",
    fields: [
      {
        name: "habits",
        label: "Select Habits",
        type: "multiple",allowCustom: true,
        options: [
          { label: "Drink Water", value: "drink_water" },
          { label: "Morning Walk", value: "morning_walk" },
          { label: "Exercise", value: "exercise" },
         
          { label: "Sleep on Time", value: "sleep_on_time" },
        ],
      },
    ],
  },
];

const initialValues = {
  habits: [],
};

const schema = Yup.object({
  habits: Yup.array()
    .min(1, "Select at least one habit")
    .max(6, "You can select up to 6 habits"),
});

export default function HabitForm() {


   const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error } = useSelector(
    (state) => state.habit
  );
  const clientId = id;
  const handleSubmit = async (values) => {
    const result = await dispatch(
      createHabitsThunk({
        clientId,
        habits: values.habits,
      })
      
    );

    if (createHabitsThunk.fulfilled.match(result)) {
      toast.success("Habits assigned successfully!");
      navigate(`/expert/clients`);
    }
  };

   

  return (
    <BaseForm
      fields={habitFields}
      initialValues={initialValues}
      validationSchema={schema}
      submitLabel="Assign Habits"
      onSubmit={handleSubmit}
    />
  );
}
