import { useMemo, useState } from "react";
import useClickOutside from "../hooks/useClickOutside";

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  label = "",
  defaultLabel = "Select...",
  defaultValue = "",
  showCount = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useClickOutside(() => setOpen(false));

  const filteredOptions = useMemo(() => {
    if (!search) return options;

    return options.filter((opt) => {
      const label = Array.isArray(opt) ? opt[0] : opt;
      return label.toLowerCase().includes(search.toLowerCase());
    });
  }, [options, search]);

  return (
    <div ref={containerRef} className="relative flex flex-col w-full">
      {label && <label className="text-xs text-green-900">{label}</label>}

      <input
        value={search}
        placeholder={defaultLabel}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full border p-2 rounded-2xl"
      />

      {open && (
        <ul className="absolute z-50 min-w-full bg-white border rounded shadow max-h-60 overflow-auto whitespace-nowrap text-left">
          <li
            className="px-3 py-2 hover:bg-green-100 cursor-pointer"
            onClick={() => {
              onChange(defaultValue);
              setOpen(false);
            }}
          >
            {defaultLabel}
          </li>
          {filteredOptions.map((opt) => {

            const [item, count] = Array.isArray(opt) ? opt : [opt, null];

            return (
              <li
                key={item}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onChange(item);
                  setSearch(item);
                  setOpen(false);
                }}
              >
                {showCount && count !== null ? `${item} (${count})` : item}
              </li>
            );
            
          })}

        </ul>
      )}
    </div>
  );
}
