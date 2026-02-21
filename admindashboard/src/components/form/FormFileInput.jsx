import { ErrorMessage, useFormikContext } from "formik";

export default function FormFileInput({ label, name, accept }) {
  const { setFieldValue } = useFormikContext();

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue(name, file);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>

      <input
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded-lg w-full"
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
