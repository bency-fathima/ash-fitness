import { Field, ErrorMessage } from "formik";

export default function FormInput({ label, name, type = "text", onChange, readOnly }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>

      <Field name={name}>
        {({ field, form }) => (
          <input
            {...field}
            value={field.value || ""}
            type={type}
            id={name}
            className={`border border-gray-300 p-2 rounded-lg w-full ${
              readOnly ? "bg-gray-100 text-gray-500" : ""
            }`}
            readOnly={readOnly}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) onChange(e, form);
            }}
          />
        )}
      </Field>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
