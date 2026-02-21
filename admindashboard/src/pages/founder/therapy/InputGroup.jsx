export const InputGroup = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  bg = "transparent",
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-[#011412]">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 ${
        bg === "white" ? "bg-white" : "bg-white"
      } border border-gray-200 rounded-xl text-xs outline-none focus:border-[#9e5608] transition-colors placeholder:text-gray-400`}
    />
  </div>
);
