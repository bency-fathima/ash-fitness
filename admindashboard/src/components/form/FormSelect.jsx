import { ErrorMessage, Field } from "formik";
import React from "react";

const FormSelect = ({ label, name, options, onChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium">{label}</label>

      <Field name={name}>
        {({ field, form }) => (
          <select
            {...field}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608]"
            onChange={(e) => {
              field.onChange(e);
              if (onChange) onChange(e, form);
            }}
          >
            <option value="">Select {label}</option>

            {options?.map((opt) => (
              <option key={opt.value ?? opt?._id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormSelect;
