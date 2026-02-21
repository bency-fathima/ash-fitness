import { Field, ErrorMessage } from "formik";

export default function FormRadio({ label, name, options }) {
  return (
    <div className="flex flex-col w-full   ">
      <label className="font-medium">{label}</label>

      <div className="grid grid-cols-2 gap-3 mt-1  w-full ">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center   cursor-pointer border border-gray-300 rounded-lg   w-full">
            <Field
              type="radio"
              name={name}
              value={opt.value}
              className=" accent-[#9e5608] p-2 px-2 m-2 "  
            />
            <span className="text-[11px] m-2">{opt.label}</span>
          </label>
        ))}
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
