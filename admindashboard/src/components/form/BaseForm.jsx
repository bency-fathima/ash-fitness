import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormToggle from "./ToggleForm";
import FormSelect from "./FormSelect";
import MultipleSelectForm from "./MultipleSelectForm";
import FormCheckboxGroup from "./FormCheckboxGroup";
import FormTimeRange from "./FormTimeRange";
import FormFileInput from "./FormFileInput";
import { useNavigate } from "react-router-dom";

export default function BaseForm({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  // submitLabel,
  heading,
  enableReinitialize = false,
}) {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {(formik) => (
        <Form className="rounded-2xl grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4 min-h-[80vh] lg:h-[80vh] overflow-x-hidden">
          {/* LEFT COLUMN */}
          <div className="overflow-y-visible lg:overflow-y-auto no-scrollbar pr-0 lg:pr-2 w-full">
            {fields
              .filter((section) => section.position === "left")
              .map((section, index) => (
                <div
                  key={index}
                  className="space-y-4 bg-white p-4 sm:p-5 rounded-xl mb-4"
                >
                  <h2 className="text-[16px] font-bold text-[#181E27]">
                    {section.section}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                    {section.fields.map((field) => {
                      if (field.type === "radio") {
                        return (
                          <div key={field.name} className="col-span-2">
                            <FormRadio
                              label={field.label}
                              name={field.name}
                              options={field.options}
                            />
                          </div>
                        );
                      } else if (field.type == "select") {
                        return (
                          <div key={field.name}>
                            <FormSelect
                              key={field.name}
                              label={field.label ?? "just text"}
                              name={field.name}
                              options={field.options}
                              onChange={field.onChange}
                            />
                          </div>
                        );
                      } else if (field.type === "multiple") {
                        return (
                          <MultipleSelectForm
                            key={field?._id}
                            label={field.label ?? "just text"}
                            name={field.name}
                            options={field.options}
                            allowCustom={field.allowCustom}
                          />
                        );
                      } else if (field.type === "file") {
                        return (
                          <FormFileInput
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            accept={field.accept}
                          />
                        );
                      }

                      return (
                        <FormInput
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          type={field.type || "text"}
                          onChange={field.onChange}
                          readOnly={field.readOnly}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="overflow-y-visible lg:overflow-y-auto no-scrollbar pl-0 lg:pl-2 w-full">
            {fields
              .filter((section) => section.position === "right")
              .map((section, index) => (
                <div
                  key={index}
                  className="space-y-4 bg-white p-4 sm:p-5 rounded-xl mb-4"
                >
                  <h2 className="text-[16px] font-bold">{section.section}</h2>

                  <div className="space-y-2 text-[11px]">
                    {section.fields.map((field) => {
                      if (field.type === "radio") {
                        return (
                          <div key={field.name} className="col-span-2">
                            <FormRadio
                              label={field.label}
                              name={field.name}
                              options={field.options}
                            />
                          </div>
                        );
                      }
                      if (field.type === "toggle") {
                        return (
                          <div key={field.name} className="col-span-2">
                            <FormToggle name={field.name} label={field.label} />
                          </div>
                        );
                      } else if (field.type == "checkbox-group") {
                        return (
                          <FormCheckboxGroup
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            options={field.options}
                          />
                        );
                      } else if (field.type == "time-range") {
                        return (
                          <div key={field.startName}>
                            <FormTimeRange
                              label={field.label}
                              startName={field.startName}
                              endName={field.endName}
                            />
                          </div>
                        );
                      } else if (field.type == "select") {
                        return (
                          <div key={field.name}>
                            <FormSelect
                              key={field.name}
                              label={field.label ?? "just text"}
                              name={field.name}
                              options={field.options}
                              onChange={field.onChange}
                            />
                          </div>
                        );
                      } else if (field.type === "multiple") {
                        return (
                          <MultipleSelectForm
                            key={field?._id}
                            label={field.label ?? "just text"}
                            name={field.name}
                            options={field.options}
                            allowCustom={field.allowCustom}
                          />
                        );
                      }

                      return (
                        <FormInput
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          type={field.type || "text"}
                          onChange={field.onChange}
                          readOnly={field.readOnly}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
          <div className="w-full col-span-1 lg:col-span-2 flex flex-col items-center gap-3 mt-4">
            <hr className="w-full text-gray-300" />
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center text-[12px] font-semibold w-full gap-3">
              {/* <h2>Save as Draft</h2> */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="bg-[#EBF3F2] rounded-md p-3 sm:p-2 min-h-[44px] sm:min-h-0 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  className="bg-[#9e5608] p-3 sm:p-2 rounded-md text-white min-h-[44px] sm:min-h-0 w-full sm:w-auto"
                  type="submit"
                >
                  Save & {heading ?? "Client"}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
