import { useField } from "formik";

export default function FormToggle({ name, label }) {
  const [field, , helpers] = useField(name);

  return (
    <div className="flex items-center gap-3">
    

      <button
        type="button"
        onClick={() => helpers.setValue(!field.value)}
        className={`
          relative w-7 h-4 rounded-full transition-colors duration-300
          ${field.value ? "bg-[#9e5608]" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full
            transition-transform duration-300
            ${field.value ? "translate-x-3" : ""}
          `}
        />
      </button>
        <span className="text-[12px] font-medium text-[#181E27]">
        {label}
      </span>
    </div>
  );
}
