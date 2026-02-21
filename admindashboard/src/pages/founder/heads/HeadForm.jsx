import BaseForm from '@/components/form/BaseForm';
import { selectAllCategories } from '@/redux/features/category/category.selector';
import { getAllCategories } from '@/redux/features/category/category.thunk';
import { createHead } from '@/redux/features/head/head.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";

const HeadForm = () => {
  const dispatch = useDispatch(); 
   
  
    useEffect(() => {
      dispatch(getAllCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    const data = useAppSelector(selectAllCategories);
    // const status = useAppSelector(selectCategoryStatus);
    // const error = useAppSelector(selectCategoryError);

     const navigate = useNavigate();

    
        useEffect(() => {
          if (data?.data?.length === 0) {
            toast.error("Add category");
            navigate(-1);
          }
        }, [data, navigate]);

    const fields = [
      {
        section: "Personal Information",
        position: "left",
        fields: [
          {
            name: "name",
            label: "Full Name",
            type: "text",
          },
          {
            name: "dob",
            label: "Date Of Birth",
            type: "date",
          },
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
          {
            name: "email",
            label: "Email",
            type: "email",
          },
          {
            name: "phone",
            label: "phone number",
            type: "text",
          },
          {
            name: "address",
            label: "Address",
            type: "text",
          },
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
              { label: "diabetes", value: "diabetes" },
            ],
            allowCustom: true,
          },
          {
            name: "experience",
            label: "Experience",
            type: "text",
          },
          {
            name: "qualification",
            label: "Qualification",
            type: "text",
          },
        ],
      },
      {
        section: "Program Assignment",
        position: "right",
        fields: [
          {
            name: "programCategory",
            label: "Program Category",
            type: "select",
            options: data?.data?.map((items) => ({
              label: items?.name,
              value: items?._id,
            })),
          },
        ],
      },
      {
        section: "Salary",
        position: "right",
        fields: [
          {
            name: "salary",
            label: "Base Salary",
            type: "dropdown",
          },
        ],
      },
      {
        section: "Password",
        position: "right",
        fields: [
          {
            name: "password",
            label: "Create password",
            type: "dropdown",
          },
        ],
      },
    ];

const validationSchema = Yup.object({

  name: Yup.string()
    .required("Full Name is required")
    .min(3, "Name must be at least 3 characters"),

  dob: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "DOB cannot be in the future"),

  gender: Yup.string()
    .oneOf(["male", "female"], "Gender is required")
    .required("Gender is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),

  address: Yup.string()
    .required("Address is required")
    .min(5, "Address too short"),

  specialization: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one specialization")
    .required("Specialization is required"),

  experience: Yup.string().required("Experience is required"),

  qualification: Yup.string().required("Qualification is required"),

  programCategory: Yup.string().required("Program Category is required"),

  salary: Yup.number()
    .typeError("Salary must be a number")
    .required("Base Salary is required")
    .positive("Salary must be positive"),

  // Password
  password: Yup.string()
    .min(6, "Password must be at least 6 characters"),
});


    const initialValues = {
      name: "",
      gender: "",
      dob: "",
      email: "",
      phone: "",
      address: "",
      experience: "",
      qualification: "",
      programCategory: "",
      salary: "",
      specialization: [],
    };

 
  

  const handelSubmit = async (value) => {
    try {
      const result = await dispatch(createHead(value)).unwrap();
      if (result.success) {
        toast.success("Head created successfully");
        navigate("/founder/heads");
      } else {
        toast.error("Failed to create head");
      }
    } catch (error) {
      toast.error(error || "Failed to create head");
    }
  };


  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        heading={"Add Head"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}

export default HeadForm;
