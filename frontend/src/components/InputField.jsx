import ValidationCheck from "../components/ValidationCheck";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "",
  error = "",
  touched = false,
  required = false,
  showValid = false,
}) {
  return (
    <div className="relative">
      <label className="block">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={`
            w-full
            rounded-2xl
            border
            border-green-300
            bg-white
            px-4
            py-2
            placeholder:text-gray-400
            focus:outline-none
            focus:placeholder-transparent
            ${
              touched && error
                ? "border-red-700 ring-1 ring-red-700"
                : "focus:border-green-700 focus:ring-1 focus:ring-green-700"
            }
          `}
      />

      <div className="h-2">
        {touched && error && <p className="text-red-500 text-sm w-full ml-2">{error}</p>}
      </div>

      {showValid && <ValidationCheck />}
    </div>
  );
}
