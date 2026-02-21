import BaseForm from "@/components/form/BaseForm";
import { selectAllCategories } from "@/redux/features/category/category.selector";
import { getAllCategories } from "@/redux/features/category/category.thunk";
import { createProgram } from "@/redux/features/program/program.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function ProgramForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  const data = useAppSelector(selectAllCategories);

  useEffect(() => {
    if (data?.data?.length === 0) {
      toast.error("Add category");
      navigate(-1);
    }
  }, [data, navigate]);

  const fields = [
    {
      section: "Program Information",
      position: "left",
      fields: [
        { name: "title", label: "Program Name", type: "text" },
        {
          name: "image",
          label: "Choose Image",
          type: "file",
          accept: ".pdf,.jpg,.jpeg,.png",
        },
        {
          name: "category",
          label: "Choose Your Category",
          type: "select",
          options: data?.data?.map((items) => ({
            label: items.name,
            value: items?._id,
          })),
        },
        {
          name: "duration",
          label: "Duration",
          type: "multiple",
          options: [
            { label: "30 Days", value: 30 },
            { label: "60 Days", value: 60 },
            { label: "90 Days", value: 90 },
          ],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Draft", value: "Draft" },
            { label: "Published", value: "Published" },
          ],
        },
      ],
    },
  ];

    const validationSchema = Yup.object({
      title: Yup.string()
        .required("Program Name is required")
        .min(3, "Name must be at least 3 characters"),

      image: Yup.mixed().required("Image is required"),

      category: Yup.string().required("Select Your Category"),

      duration: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one")
        .required("Duration is required"),

      status: Yup.string().required("Select status"),
    });

  const initialValues = {
    title: "",
    image: "",
    category: "",
    duration: [],
    status: "",
  };

  const handleProgramCreation = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "image" && values[key] instanceof File) {
          formData.append("photo", values[key]);
        } else if (Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]));
        } else if (
          values[key] !== null &&
          values[key] !== undefined &&
          values[key] !== ""
        ) {
          formData.append(key, values[key]);
        }
      });

      const program = await dispatch(createProgram(formData)).unwrap();

      if (program.success) {
        toast.success("Program created successfully");
        navigate("/founder/programs");
      } else {
        toast.error("Failed to create program");
      }
    } catch (error) {
      toast.error("Program creation failed:", error);
    }
  };
  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        heading={"Add Program"}
        onSubmit={(values) => {
          handleProgramCreation(values);
        }}
      />
    </div>
  );
}
