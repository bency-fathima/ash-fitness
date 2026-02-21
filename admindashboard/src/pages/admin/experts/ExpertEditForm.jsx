import BaseForm from "@/components/form/BaseForm";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { updateCoach, getSingleCoach } from "@/redux/features/coach/coach.thunk";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ExpertEditForm() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState(null);

  
  const navigate = useNavigate();

 

  useEffect(() => {
      if(id) {
          dispatch(getSingleCoach(id)).unwrap().then((data) => {
              const formattedValues = {
                  ...data,
                  dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
                  chooseProgram: data.assignedPrograms?.map(p => p._id) || [],
                  chooseTherapy: data.assignedTherapies?.map(t => t._id) || [],
                  workingHours: data.workingHours ? (typeof data.workingHours === 'string' ? JSON.parse(data.workingHours) : data.workingHours) : { startTime: "", endTime: "" },
                  breakSlots: data.breakSlots ? (typeof data.breakSlots === 'string' ? JSON.parse(data.breakSlots) : data.breakSlots) : { startTime: "", endTime: "" },
              };
               
              setInitialValues(formattedValues);
          }).catch(err => {
              toast.error("Failed to fetch expert details");
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
        { name: "password", label: "Password (leave blank to keep current)", type: "text" },
      ],
    },

    {
      section: "Role Assignment",
      position: "left",
      fields: [
        
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
      section: "Work Assignment",
      position: "right",
      fields: [
        { name: "maxClient", label: "Max Client Limit", type: "text" },
        {
          name: "workingDays",
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
          startName: "workingHours[0].startTime",
          endName: "workingHours[0].endTime",
        },
        {
          type: "time-range",
          label: "Break Slots",
          startName: "breakSlots[0].startTime",
          endName: "breakSlots[0].endTime",
        },
        { name: "maxDailyConsults", label: "Max Daily Consults", type: "text" },
        { name: "responseTime", label: "Response Time", type: "text" },
      ],
    },
    {
      section: "Salary",

      position: "right",
      fields: [{ name: "salary", label: "Base Salary", type: "text" }],
    },
   
  ];

  const handleCoachUpdate = async (values) => {
    try {
      console.log(values);
      const formData = new FormData();

      const isObjectChanged = (obj1, obj2) => {
          return JSON.stringify(obj1) !== JSON.stringify(obj2);
      };

      Object.keys(values).forEach((key) => {
        const value = values[key];
        const initialValue = initialValues?.[key];

        // Check if value has changed
        let hasChanged = false;

        if (typeof value === 'object' && value !== null) {
            // Use loose comparison for objects/arrays via JSON string
            if (isObjectChanged(value, initialValue)) {
                hasChanged = true;
            }
        } else {
             // Use loose equality to be safe with types if needed, but strict is usually better if types match
             if (value !== initialValue) { 
                 hasChanged = true;
             }
        }

        if (hasChanged) {
            if (key === "workingHours" || key === "breakSlots") {
              formData.append(key, JSON.stringify(value));
            } else if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === "boolean") {
              formData.append(key, value.toString());
            } else if (value !== null && value !== undefined && value !== "") {
              formData.append(key, value);
            }
        }
      });


      const coach = await dispatch(updateCoach({ id, values: formData }));

      if (coach.meta.requestStatus === "fulfilled") { 
        await dispatch(refreshProfile({ id: user?._id, role: user.role }));
        toast("Expert updated successfully", { type: "success" });
        navigate(-1);
      } else {
        toast("Failed to update expert", { type: "error" });
      }
    } catch (err) {
      toast("Failed to update expert", { type: "error" });
    }
  };

  if(!initialValues) return <div>Loading...</div>

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(values) => handleCoachUpdate(values)}
      heading="Edit Expert"
      submitLabel="Update Expert"
    ></BaseForm>
  );
}
