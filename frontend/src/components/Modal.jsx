import useClickOutside from "../hooks/useClickOutside";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;


  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 p-4 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-md sm:max-w-lg
          max-h-[90vh]
          overflow-y-auto
          overflow-x-hidden
          rounded-2xl
          bg-gradient-to-b
          from-white from-[0%] to-[#a5d6a7]
          p-6
        "
      >
        {children}
      </div>
    </div>
  );
}
