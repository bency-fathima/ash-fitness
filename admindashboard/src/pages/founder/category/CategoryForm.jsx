import BaseForm from "@/components/form/BaseForm";
import { createCategory } from "@/redux/features/category/category.thunk";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function CategoryForm() {
  const fields = [
    {
      section: "Category Information",
      position: "left",
      fields: [
        { name: "name", label: "Category Name", type: "text" },
        { name: "programLimit", label: "Max Program Limit", type: "number" },
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
    name: Yup.string()
      .required("Category Name is required")
      .min(3, "Name must be at least 3 characters"),

    programLimit: Yup.number().required("Max Program Limit is required"),

    status: Yup.string().required("Select status"),
  });

  const initialValues = {
    name: "",
    programLimit: "",
    status: "",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelSubmit = async (value) => {
    try {
      const category = await dispatch(createCategory(value)).unwrap();
      if (category.success) {
        toast.success("Category created successfully");
        navigate("/founder/categories");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      console.error("Category creation failed:", error);
    }
  };

  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        heading={"Add Category"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}
