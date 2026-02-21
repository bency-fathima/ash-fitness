import { ErrorMessage, Field } from "formik";
import React, { useState, useRef, useEffect } from "react";

const MultipleSelectForm = ({ label, name, options, allowCustom = false }) => {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col w-full" ref={ref}>
      <label className="font-medium">{label}</label>
      <Field name={name}>
        {({ field, form }) => {
          const currentValues = field.value || [];
          const knownValues = new Set(options ? options.map((opt) => opt.value) : []);

          // Include selected values that are not in the predefined options
          const customOptions = currentValues
            .filter((val) => !knownValues.has(val))
            .map((val) => ({ label: val, value: val }));

          const displayOptions = [...(options || []), ...customOptions];

          const handleAddCustom = () => {
            const trimmed = customValue.trim();
            if (trimmed) {
              if (!currentValues.includes(trimmed)) {
                form.setFieldValue(name, [...currentValues, trimmed]);
              }
              setCustomValue("");
            }
          };

          return (
            <div className="relative">
              <div
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              >
                {currentValues.length > 0
                  ? currentValues
                    .map(
                      (val) =>
                        displayOptions.find((opt) => opt.value === val)?.label || val
                    )
                    .join(", ")
                  : "Select..."}
              </div>
              {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                  <div className="max-h-60 overflow-auto">
                    {displayOptions?.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={field.value?.includes(opt.value) || false}
                          onChange={(e) => {
                            let newValue = field.value ? [...field.value] : [];
                            if (e.target.checked) {
                              newValue.push(opt.value);
                            } else {
                              newValue = newValue.filter((v) => v !== opt.value);
                            }
                            form.setFieldValue(name, newValue);
                          }}
                          className="mr-2"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {allowCustom && (
                    <div className="p-2 border-t border-gray-200 bg-gray-50 flex gap-2">
                      <input
                        type="text"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustom();
                          }
                        }}
                        className="flex-1 w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#9e5608]"
                        placeholder="Add other..."
                      />
                      <button
                        type="button"
                        onClick={handleAddCustom}
                        className="bg-[#9e5608] text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default MultipleSelectForm;
