export default function CustomButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "big_green",
  className = "",
}) {
  const variants = {
    big_green:
      "bg-green-700 text-white hover:bg-green-800 min-w-32 py-2 rounded-2xl",

    big_white:
      "bg-white border border-green-700 text-green-700 hover:bg-green-50 min-w-32 rounded-2xl",

    big_white_Icon_Only:
      "bg-white border border-green-700 text-green-700 hover:bg-green-50 px-4 rounded-2xl",

    big_red:
      "bg-white border border-red-300 text-red-600 hover:bg-red-50 min-w-32 py-2 rounded-2xl",

    small_green:
      "bg-green-700 text-white hover:bg-green-800 text-xs min-w-16 rounded-2xl",

    small_white:
      "bg-white border border-green-700 text-xs hover:bg-green-50 min-w-16 rounded-2xl",

    small_red:
      "bg-white border border-red-300 text-xs text-red-600 rounded-2xl min-w-16 hover:bg-red-50 rounded-2xl",

    icon: "text-red-600 rounded-bl-2xl",

    lifetimeBtn:
      "bg-white border border-green-700 text-green-700 hover:bg-green-50 min-w-16 rounded-2xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        transition shadow-md
        ${
          disabled
            ? "bg-gray-400 text-gray-200 cursor-not-allowed min-w-32 py-2 rounded-2xl"
            : variants[variant]
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
