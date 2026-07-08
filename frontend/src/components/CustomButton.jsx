export default function CustomButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "big_green",
  className = "",
}) {
  const variants = {
    big_green: "bg-green-700 text-white hover:bg-green-800 min-w-32 py-2",

    big_white:
      "bg-white border border-green-700 text-green-700 hover:bg-green-50 min-w-32 ",

    big_red:
      "bg-white border border-red-300 text-red-600 hover:bg-red-50 min-w-32 py-2",

    small_green: "bg-green-700 text-white hover:bg-green-800 text-xs min-w-16",

    small_white:
      "bg-white border border-green-700 text-xs hover:bg-green-50 min-w-16",

    small_red:
      "bg-white border border-red-300 text-xs text-red-600 rounded-2xl min-w-16 hover:bg-red-50",

    icon:
      "text-red-600 rounded-2xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl transition shadow-md
        ${
          disabled
            ? "bg-gray-400 text-gray-200 cursor-not-allowed min-w-32 py-2"
            : variants[variant]
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
