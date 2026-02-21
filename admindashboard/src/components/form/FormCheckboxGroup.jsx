import { ErrorMessage, Field } from 'formik';
import React from 'react';

const FormCheckboxGroup = ({ label, name, options }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium mb-3 text-[14px]">{label}</label>
      <div className="grid grid-cols-2 gap-3 bg-[#F8F8F8] p-4 rounded-lg">
        {options.map((option) => (
          <label
            key={option.value ?? option?._id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Field
              type="checkbox"
              name={name}
              value={option.value}
              className="w-3 h-3 text-[#9e5608] border-gray-300 rounded  accent-[#9e5608]"
            />
            <span className="text-[13px] text-[#333]">{option.label}</span>
          </label>
        ))}
      </div>
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormCheckboxGroup;
