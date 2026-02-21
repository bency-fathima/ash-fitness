import BaseForm from "@/components/form/BaseForm";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { createCoach } from "@/redux/features/coach/coach.thunk";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";
import {
  getAllProgramsByAdmin,
} from "@/redux/features/program/program.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";

export default function ExpertForm() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [program, setProgram] = useState(null);
  const [therapy, setTherapy] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getAllProgramsByAdmin({ adminId: user?._id, page: 1, limit: 120 }),
    ).then((res) => {
      setProgram(res.payload.data);
    });
    dispatch(fetchTherapyPlans({ page: 1, limit: 120 })).then((res) => {
      setTherapy(res.payload.data.therapy);
    });
  }, [dispatch, user?._id]);

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
        { name: "password", label: "Password", type: "text" },
      ],
    },

    {
      section: "Role Assignment",
      position: "left",
      fields: [
        {
          name: "role",
          label: "Choose Role",
          type: "select",
          options: [
            { label: "Trainer", value: "Trainer" },
            { label: "Dietician", value: "Dietician" },
            { label: "Therapist", value: "Therapist" },
          ],
          onChange: (e, form) => {
            setSelectedRole(e.target.value);
            form.setFieldValue("chooseProgram", []);
          },
        },
        {
          name: "specialization",
          label: "Specialization",
          type: "multiple",
          options: user?.specialization.map((spec) => ({
            label: spec,
            value: spec,
          })),
          allowCustom: true,
        },
        { name: "experience", label: "Experience", type: "text" },
        { name: "qualification", label: "Qualification", type: "text" },
        {
          name: "certifications",
          label: "Certifications",
          type: "file",
          accept: ".pdf,.jpg,.jpeg,.png",
        },
        {
          name: "languages",
          label: "Languages",
          type: "multiple",
          options: [
            { label: "English", value: "english" },
            { label: "Malayalam", value: "malayalam" },
            { label: "Tamil", value: "tamil" },
            { label: "Hindi", value: "hindi" },
          ],
          allowCustom: true,
        },
      ],
    },
    {
      section: "Program Assignment",
      position: "left",
      fields: [
        selectedRole === "Therapist"
          ? {
              name: "chooseTherapy",
              label: "Choose Therapy",
              type: "multiple",
              options: therapy?.map((thr) => ({
                label: thr.name,
                value: thr?._id,
              })),
            }
          : {
              name: "chooseProgram",
              label: "Choose Program",
              type: "multiple",
              options: program?.map((prog) => ({
                label: prog.title,
                value: prog?._id,
              })),
            },
      ],
    },
    {
      section: "Work Assignment",
      position: "right",
      fields: [
        { name: "clientLimit", label: "Max Client Limit", type: "text" },
        {
          name: "workingdays",
          label: "Working Days",
          type: "checkbox-group",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
          ],
        },
        {
          type: "time-range",
          label: "Working Hours",
          startName: "workingHours.startTime",
          endName: "workingHours.endTime",
        },
        {
          type: "time-range",
          label: "Break Slots",
          startName: "breakSlots.startTime",
          endName: "breakSlots.endTime",
        },
        { name: "dailyConsults", label: "Max Daily Consults", type: "text" },
        { name: "responseTime", label: "Response Time", type: "text" },
      ],
    },
    {
      section: "Salary",

      position: "right",
      fields: [{ name: "baseSalary", label: "Base Salary", type: "text" }],
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

  const initialValues = {
    fullname: "",
    dob: "",
    gender: "",
    workingdays: [],
    workingHours: {
      startTime: "",
      endTime: "",
    },
    breakSlots: {
      startTime: "",
      endTime: "",
    },
    ratingIncentive: false,
    responseTimeIncentive: false,
    complianceIncentive: false,
    autoSendWelcome: false,
    autoSendGuide: false,
    automatedReminder: false,
    chooseProgram: user?.program || "",
    chooseTherapy:user?.therapy || "",
    certifications: null,
  };

  const handleCoachCreation = async (values) => {
    try {
      const formData = new FormData();

      // Append all form values to FormData
      Object.keys(values).forEach((key) => {
        if (key === "certifications" && values[key] instanceof File) {
          // For file inputs, append the file directly
          formData.append(key, values[key]);
        } else if (key === "workingHours" || key === "breakSlots") {
          // For nested objects, stringify them
          formData.append(key, JSON.stringify(values[key]));
        } else if (Array.isArray(values[key])) {
          // For arrays, stringify
          formData.append(key, JSON.stringify(values[key]));
        } else if (typeof values[key] === "boolean") {
          // For booleans, convert to string explicitly
          formData.append(key, values[key].toString());
        } else if (
          values[key] !== null &&
          values[key] !== undefined &&
          values[key] !== ""
        ) {
          // For other values
          formData.append(key, values[key]);
        }
      });

      if (user?._id) {
        formData.append("adminId", user?._id);
      }
      const coach = await dispatch(createCoach(formData));

      if (coach.meta.requestStatus === "fulfilled") {
        await dispatch(refreshProfile({ id: user?._id, role: user.role }));
        toast("Coach created successfully", { type: "success" });
        navigate(-1);
      } else {
        toast("Failed to create coach", { type: "error" });
      }
    } catch (err) {
      toast("Failed to create coach", { type: "error" });
    }
  };

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(values) => handleCoachCreation(values)}
      heading="Expert"
    ></BaseForm>
  );
}
