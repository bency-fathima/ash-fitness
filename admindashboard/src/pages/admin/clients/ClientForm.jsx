import * as Yup from "yup";
import BaseForm from "../../../components/form/BaseForm";
import { createClient } from "../../../redux/features/auth/auth.thunk";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllProgramsByAdmin } from "@/redux/features/program/program.thunk";
import { useEffect, useState } from "react";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";

const initialValues = {
  fullname: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  medicalconditions: [],
  allergy: [],
  foodPreference: "",
  fitnessGoal: "",
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
  fullname: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
});

export default function ClientForm() {
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [coachesOfAdmin, setCoachesOfAdmin] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTherapyType, setSelectedTherapyType] = useState("");
  const [therapy, setTherapy] = useState([]);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

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



  const setProgramId = (programId) => {
    const selectedProgram = program?.find((p) => p?._id === programId);
    setSelectedProgram(selectedProgram);
  };

  const calculateEndDate = (start, durationValue, setFieldValue) => {
    if (start && durationValue) {
      const date = new Date(start);
      if (isNaN(date.getTime())) return;

      const durationString = String(durationValue).toLowerCase();
      // Match number, optionally followed by unit. Default unit to 'days' if missing.
      const match = durationString.match(/(\d+)(?:\s*([a-z]+))?/);

      if (match) {
        const number = parseInt(match[1], 10);
        const unit = match[2] || "days"; // Default to days

        let endDate = new Date(date);

        if (unit.includes("day")) {
          endDate.setUTCDate(date.getUTCDate() + number);
        } else if (unit.includes("week")) {
          endDate.setUTCDate(date.getUTCDate() + number * 7);
        } else if (unit.includes("month")) {
          endDate.setUTCMonth(date.getUTCMonth() + number);
        } else if (unit.includes("year")) {
          endDate.setUTCFullYear(date.getUTCFullYear() + number);
        }

        const formattedDate = endDate.toISOString().split("T")[0];
        setFieldValue("endDate", formattedDate);
      }
    }
  };

  const fields = [
    {
      section: "Personal Information",
      position: "left",
      fields: [
        { name: "fullname", label: "Full Name", type: "text" },
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
          name: "medicalconditions",
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
          name: "allergy",
          label: "Allergies",
          type: "multiple",
          options: [
            { label: "Peanuts", value: "peanuts" },
            { label: "Seafood", value: "seafood" },
          ],
          allowCustom: true,
        },
        {
          name: "foodPreference",
          label: "Food Preference",
          type: "select",
          options: [
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Non-Vegetarian", value: "non_vegetarian" },
          ],
          allowCustom: true,
        },
        {
          name: "fitnessGoal",
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

    {
      section: "Program Assignment",
      position: "right",
      fields: [
        {
          name: "programType",
          label: "Program Type",
          type: "select",
          options: program?.map((prog) => ({
            label: prog.title,
            value: prog?._id,
          })),
          onChange: (e) => setProgramId(e.target.value),
        },
        {
          name: "duration",
          label: "Duration",
          type: "select",
          options: selectedProgram?.duration?.map((d) => ({
            label: d,
            value: d,
          })),
          onChange: (e, form) => {
            calculateEndDate(
              form.values.startDate,
              e.target.value,
              form.setFieldValue,
            );
          },
        },
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
          onChange: (e, form) => {
            calculateEndDate(
              e.target.value,
              form.values.duration,
              form.setFieldValue,
            );
          },
        },
        { name: "endDate", label: "End Date", type: "date", readOnly: true },
      ],
    },
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
    {
      section: "Expert Assignment",
      position: "right",
      fields: [
        {
          name: "dietician",
          label: "Dietician",
          type: "select",
          options: coachesOfAdmin
            ? coachesOfAdmin
                ?.filter((coach) => {
                  if (coach?.role !== "Dietician") return false;
                  // If a program is selected, only show dieticians assigned to that program
                  if (selectedProgram?._id) {
                    return coach.assignedPrograms?.some(
                      (p) => p?._id === selectedProgram?._id,
                    );
                  }
                  return true;
                })
                ?.map((coach) => ({ label: coach.name, value: coach?._id }))
            : [],
        },
        {
          name: "trainer",
          label: "Trainer",
          type: "select",
          options: coachesOfAdmin
            ? coachesOfAdmin
                ?.filter((coach) => {
                  if (coach?.role !== "Trainer") return false;
                  // If a program is selected, only show trainers assigned to that program
                  if (selectedProgram?._id) {
                    return coach.assignedPrograms?.some(
                      (p) => p?._id === selectedProgram?._id,
                    );
                  }
                  return true;
                })
                ?.map((coach) => ({ label: coach.name, value: coach?._id }))
            : [],
        },
        ...(selectedTherapyType
          ? [
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
            ]
          : []),
      ],
    },
    {
      section: "Account Setup",
      position: "right",
      fields: [
        {
          name: "autoSendWelcome",
          label: "Auto-send welcome message",
          type: "toggle",
        },
        {
          name: "autoSendGuide",
          label: "Auto-send Onboarding Guide",
          type: "toggle",
        },
        {
          name: "automatedReminder",
          label: "Automated Reminders",
          type: "toggle",
        },
      ],
    },
  ];

  const handleUserCreation = async (values) => {
    const updatedValues = { ...values, adminId: user?._id };
    const client = await dispatch(createClient(updatedValues));
    if (client.payload.success) {
      toast.success("Client created successfully");
      navigate(-1);
    } else {
      toast.error("Failed to create client");
    }
  };

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      validationSchema={schema}
      submitLabel="Login"
      onSubmit={(values) => handleUserCreation(values)}
    />
  );
}
