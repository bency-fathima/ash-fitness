import React from "react";
import { ChevronDown } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createBroadcast } from "@/redux/features/broadcast/broadcast.thunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateBroadcast = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    type: "Promotional",
    message: "",
    attachment: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Broadcast title is required"),
    type: Yup.string().required("Broadcast type is required"),
    message: Yup.string().required("Message body is required"),
  });

  const handleSubmit = async (values) => {
    
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("type", values.type);
    formData.append("message", values.message);

    if (values.attachment) {
      formData.append("attachment", values.attachment);
    }

    try {
      const broadcast = await dispatch(createBroadcast(formData)).unwrap();
      toast.success("Broadcast created successfully");
      navigate(`/founder/broadcasts/summary/${broadcast?.data?._id}`);
    } catch (error) {
      toast.error(error || "Failed to create Broadcast");
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-auto no-scrollbar h-[calc(100vh-130px)]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="flex flex-col gap-6">
            {/* Main Form Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col gap-8">
              <h2 className="text-xl font-bold text-[#9e5608]">
                Create Broadcast
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Broadcast Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Broadcast Title
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter broadcast title"
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608]"
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>

                {/* Broadcast Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Broadcast Type
                  </label>
                  <div className="relative">
                    <Field
                      as="select"
                      name="type"
                      className="appearance-none w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608] cursor-pointer"
                    >
                      <option value="Promotional">Promotional</option>
                      <option value="Welcome">Welcome</option>
                      <option value="Motivation">Motivation</option>
                      <option value="Progress">Progress</option>
                      <option value="Tips">Tips</option>
                    </Field>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Message Body
                </label>
                <Field
                  as="textarea"
                  name="message"
                  rows={6}
                  placeholder="Write your message here..."
                  className="px-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608] resize-none"
                />
                <ErrorMessage
                  name="message"
                  component="p"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Attachments */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Attachments
                </label>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <label className="px-6 py-3 bg-[#F0F0F0] text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors border-r border-gray-200 cursor-pointer">
                    Upload File
                    <input
                      type="file"
                      hidden
                      accept=".jpg,.png,.pdf"
                      onChange={(e) =>
                        setFieldValue("attachment", e.currentTarget.files[0])
                      }
                    />
                  </label>
                  <span className="px-4 text-sm text-gray-500 italic truncate max-w-60">
                    {values.attachment
                      ? values.attachment.name
                      : "Upload Image (jpg/png) or PDF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6">
              <div className="h-px bg-gray-200 w-full mt-2"></div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/founder/broadcasts")}
                  className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#EBF3F2] text-[#9e5608] hover:bg-green-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#9e5608] text-white hover:bg-[#073a35] shadow-sm"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateBroadcast;
