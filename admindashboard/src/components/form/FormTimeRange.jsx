import { ErrorMessage, Field } from 'formik';
import React from 'react';

const FormTimeRange = ({ label, startName, endName }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium mb-2 text-[14px]">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Field
            type="text"
            name={startName}
            placeholder="Start Time"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608]"
          />
          <ErrorMessage
            name={startName}
            component="p"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div>
          <Field
            type="text"
            name={endName}
            placeholder="End Time"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608]"
          />
          <ErrorMessage
            name={endName}
            component="p"
            className="text-red-500 text-xs mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default FormTimeRange;
