import * as Yup from "yup";
import BaseForm from "../../../components/form/BaseForm";
import { updateClient, getClient } from "../../../redux/features/client/client.thunk";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllProgramsByAdmin } from "@/redux/features/program/program.thunk";
import { useEffect, useState } from "react";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";

const initialFormValues = {
  name: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  medicalConditions: [],
  allergies: [],
  foodPreferences: "",
  goals: "",
  currentWeight: "",
  targetWeight: "",
  programType: "",
  therapyType: "",
  duration: "",
  startDate: "",
  endDate: "",
  dietician: "",
  trainer: "",
  therapist: "",
  autoSendWelcome: false,
  autoSendGuide: false,
  automatedReminder: false,
};

const schema = Yup.object({
  name: Yup.string().required("Required"),
  // dob: Yup.string().required("Required"),
  // gender: Yup.string().required("Required"),
});

export default function ClientEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [program, setProgram] = useState(null);
  const [coachesOfAdmin, setCoachesOfAdmin] = useState([]);
  const [selectedTherapyType, setSelectedTherapyType] = useState("");
  const [therapy, setTherapy] = useState([]);
  const [initialValues, setInitialValues] = useState(null);

  const fetchProgram = async () => {
    await dispatch(
      getAllProgramsByAdmin({ adminId: user?._id, page: 1, limit: 120 }),
    ).then((res) => {
      setProgram(res.payload.data);
    });
    const coachessOfAdmin = await dispatch(getAllCoachesByAdmin(user.experts));
    setCoachesOfAdmin(coachessOfAdmin.payload);
  };

  const fetchTherapy = async () => {
    const res = await dispatch(fetchTherapyPlans({page:1, limit:100}));
    if (res.payload?.data) {
      setTherapy(res.payload.data.therapy);
    }
  };

  useEffect(() => {
    fetchProgram();
    fetchTherapy();
  }, []);

  useEffect(() => {
    if (id) {
       dispatch(getClient({ id })).unwrap().then((data) => {
           const formattedValues = {
               ...initialFormValues,
               ...data,
               dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
               startDate: data.programStartDate ? new Date(data.programStartDate).toISOString().split('T')[0] : "",
               endDate: data.programEndDate ? new Date(data.programEndDate).toISOString().split('T')[0] : "",
               programType: data.programType?._id || data.programType, 
               therapyType: data.therapyType?._id || data.therapyType,
               dietician: data.dietician?._id || data.dietician,
               trainer: data.trainer?._id || data.trainer,
               therapist: data.therapist?._id || data.therapist,
           };
           
           if (formattedValues.therapyType) {
               setSelectedTherapyType(formattedValues.therapyType);
           }

           setInitialValues(formattedValues);
       }).catch(err => {
           toast.error("Failed to fetch client details");
           navigate(-1);
       });
    }
  }, [id, dispatch, navigate]);
  
  

  const fields = [
    {
      section: "Personal Information",
      position: "left",
      fields: [
        { name: "name", label: "Full Name", type: "text" },
        { name: "dob", label: "Date Of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "radio",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
      ],
    },

    {
      section: "Contact Information",
      position: "left",
      fields: [
        { name: "email", label: "Email Address", type: "email" },
        { name: "phone", label: "Phone Number", type: "text" },
        { name: "address", label: "Address", type: "text" },
      ],
    },

    {
      section: "Health Profile",
      position: "left",
      fields: [
        {
          name: "medicalConditions",
          label: "Medical Conditions",
          type: "multiple",
          options: [
            { label: "Diabetes", value: "diabetes" },
            { label: "Hypertension", value: "hypertension" },
            { label: "Asthma", value: "asthma" },
            { label: "Heart Disease", value: "heart_disease" },
            { label: "None", value: "none" },
          ],
          allowCustom: true,
        },
        {
          name: "allergies",
          label: "Allergies",
          type: "multiple",
          options: [
            { label: "Peanuts", value: "peanuts" },
            { label: "Seafood", value: "seafood" },
          ],
          allowCustom: true,
        },
        {
          name: "foodPreferences",
          label: "Food Preference",
          type: "select",
          options: [
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Non-Vegetarian", value: "non_vegetarian" },
          ],
          allowCustom: true,
        },
        {
          name: "goals",
          label: "Fitness Goal",
          type: "select",
          options: [
            { label: "Weight Loss", value: "weight_loss" },
            { label: "Muscle Gain", value: "muscle_gain" },
          ],
          allowCustom: true,
        },
        { name: "currentWeight", label: "Current Weight", type: "text" },
        { name: "targetWeight", label: "Target Weight", type: "text" },
      ],
    },

   
    ...((!initialValues?.therapyType || !initialValues.therapist)
      ? [
          {
            section: "Therapy Assignment",
            position: "right",
            fields: [
              {
                name: "therapyType",
                label: "Therapy",
                type: "select",
                options: therapy
                  ? therapy.map((t) => ({
                      label: t.name,
                      value: t?._id,
                    }))
                  : [],
                onChange: (e) => setSelectedTherapyType(e.target.value),
              },
            ],
          },
        ]
      : []),
    ...(selectedTherapyType && !initialValues?.therapist
      ? [
          {
            section: "Expert Assignment",
            position: "right",
            fields: [
              {
                name: "therapist",
                label: "Therapist",
                type: "select",
                options: coachesOfAdmin
                  ? coachesOfAdmin
                      ?.filter((coach) => coach?.role === "Therapist")
                      ?.map((coach) => ({
                        label: coach.name,
                        value: coach?._id,
                      }))
                  : [],
              },
            ],
          },
        ]
      : []),
   
  ];

  const handleUpdate = async (values) => {    
    const client = await dispatch(updateClient({ id, values }));
    if (client.payload.success) { 
      toast.success("Client updated successfully");
      navigate(-1);
    } else {
      toast.error("Failed to update client");
    }
  };

  if (!initialValues) {
      return <div>Loading...</div>;
  }

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      validationSchema={schema}
      submitLabel="Update Client"
      onSubmit={(values) => handleUpdate(values)}

    />
  );
}
