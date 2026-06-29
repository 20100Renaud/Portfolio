export default function CustomButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary: "bg-green-700 text-white hover:bg-green-800",

    secondary:
      "bg-white border border-green-700 text-green-700 hover:bg-green-50 w-24",

    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-2xl transition shadow-md
        ${
          disabled
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : variants[variant]
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
