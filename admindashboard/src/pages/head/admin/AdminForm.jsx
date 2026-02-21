import BaseForm from "@/components/form/BaseForm";
import { createAdmin } from "@/redux/features/admins/admin.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllProgramsByCategory } from "@/redux/features/program/program.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminForm() {
  const user = useAppSelector(selectUser)
  const [programs, setPrograms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPrograms = async () => { 
    const response = await dispatch(
      getAllProgramsByCategory({category: user.programCategory, page: 1, limit: 1000})
    ).unwrap();
    setPrograms(response.data);
  };
  
  useEffect(() => {
    fetchPrograms();
  }, []);

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
      position: "right",
      fields: [
        {
          name: "specialization",
          label: "Specialization",
          type: "multiple",
           options: [
              { label: "pcod", value: "pcod" },
              { label: "thyroid", value: "thyroid" },
              {label:"astma",value:"astma"},
              {label:"diabetes",value:"diabetes"},
              {label:"hypertension",value:"hypertension"},
            ],
            allowCustom: true,
        },
        { name: "experience", label: "Experience", type: "text" },
        { name: "qualification", label: "Qualification", type: "text" },
      ],
    },
    {
      section: "Program Assignment",
      position: "right",
      fields: [
        {
          name: "chooseProgram",
          label: "Choose Program",
          type: "multiple",
          options:programs?.map((program) => ({
            key: program?._id,
            label: program.title,
            value: program.title,
          })),
        },
      ],
    },

    {
      section: "Salary",

      position: "right",
      fields: [{ name: "baseSalary", label: "Base Salary", type: "number" }],
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
    gender: "", //need to add
    // Account Setup
    autoSendWelcome: false,
    autoSendGuide: false,
    automatedReminder: false,
  };

  const handleAdminCreation = async (values) => {
    const selectedProgramIds = values.chooseProgram.map(title => 
      programs.find(program => program.title === title)?._id
    ).filter(Boolean);
    try {
      await dispatch(
        createAdmin({
          ...values,
          chooseProgram: selectedProgramIds,
          headId: user?._id,
        })
      ).unwrap();
      toast("Admin created successfully", { type: "success" });
      navigate("/head/admins");
    } catch (error) {      
      toast("Failed to create admin", { type: "error" });
    }
  };
  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(values) => handleAdminCreation(values)}
      heading={"Admin"}
    ></BaseForm>
  );
}
