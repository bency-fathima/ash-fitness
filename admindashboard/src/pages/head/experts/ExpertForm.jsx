import BaseForm from "@/components/form/BaseForm";
import { createCoach } from "@/redux/features/coach/coach.thunk";
import React from "react";
import { useDispatch } from "react-redux";

export default function ExpertForm() {
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
      section: "Role Assignment",
      position: "left",
      fields: [
        { name: "role", label: "Choose Role", type: "text" },
        { name: "specialization", label: "Specialization", type: "text" },
        { name: "experience", label: "Experience", type: "text" },
        { name: "qualification", label: "Qualification", type: "text" },
        { name: "certifications", label: "Certifications", type: "text" },
        { name: "languages", label: "Languages", type: "text" },
      ],
    },
    {
      section: "Program Assignment",
      position: "left",
      fields: [
        { name: "chooseProgram", label: "Choose Program", type: "text" },
      ],
    },
    {
      section: "Work Assignment",
      position: "right",
      fields: [
        { name: "clientLimit", label: "Max Client Limit", type: "text" },
        { name: "assignedClients", label: "Current Assigned", type: "text" },
        {
          name: "workingdays",
          label: "Working Days",
          type: "radio",
          options: [
            { label: "Mon-Wed-Fri", value: "mwf" },
            { label: "Tue-Thu-Sat", value: "tts" },
            { label: "Mon-Fri", value: "mf" },
          ],
        },
        { name: "workingHours", label: "Working Hours", type: "text" },
        { name: "breakSlots", label: "Break Slots", type: "text" },
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
      section: "Enable Incentives",
      position: "right",
      fields: [
        { name: "ratingIncentive", label: "Rating Incentives", type: "toggle" },
        {
          name: "responseTimeIncentive",
          label: "Response Time Incentives",
          type: "toggle",
        },
        {
          name: "complianceIncentive",
          label: "Compliance Incentives",
          type: "toggle",
        },
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

  const initialValues = {
    fullname: "",
    dob: "",
    gender: "", //need to add
    ratingIncentive: false,
    responseTimeIncentive: false,
    complianceIncentive: false,

    // Account Setup
    autoSendWelcome: false,
    autoSendGuide: false,
    automatedReminder: false,
  };

  const dispatch = useDispatch()

  const handleCoachCreation =async(values)=>{
    const coach = await dispatch(createCoach(values))    
  }

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(values) => handleCoachCreation(values)}
    ></BaseForm>
  );
}
