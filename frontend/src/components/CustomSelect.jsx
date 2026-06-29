import { useMemo, useState, useEffect } from "react";
import Select from "react-select";
import { components } from "react-select";
import ValidationCheck from "../components/ValidationCheck";
import useClickOutside from "../hooks/useClickOutside";
import { normalizeOptions } from "../utils/select";

export default function CustomSelect({
  value,
  onChange,
  onBlur,
  options = [],
  label = "",
  defaultLabel = "Select...",
  defaultValue = "",
  showCount = false,
  disabled = false,
  showValid = false,
}) {
  const isBlocked = disabled;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useClickOutside(() => setOpen(false));

  // Normalize options
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  // Sync input with selected label
  useEffect(() => {
    if (!isTyping) {
      const selected = normalizedOptions.find((opt) => opt.value === value);

      setSearch(selected?.label ?? "");
    }
  }, [value, normalizedOptions, isTyping]);

  // Filter options
  const filteredOptions = useMemo(() => {
    if (!isTyping || !search.trim()) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [normalizedOptions, search, isTyping]);

  // Format of options
  const formatLabel = (opt) => {
    if (!opt) return "";

    const label = opt.label ?? opt.value;
    const count = opt.count;

    return showCount && count != null ? `${label} (${count})` : label;
  };

  // Mobile options
  const mobileOptions = normalizedOptions.map((opt) => ({
    value: opt.value,
    label: formatLabel(opt),
  }));

  const selectedMobileOption =
    mobileOptions.find((o) => o.value === value) || null;


  return (
    <>
      {/* MOBILE */}
      <div className="relative sm:hidden flex flex-col w-full">
        <div className="sm:hidden flex flex-col w-full">
          {label && <label className="text-xs text-green-900">{label}</label>}

          <Select
            value={selectedMobileOption}
            placeholder={defaultLabel}
            onChange={(option) => onChange(option?.value || defaultValue)}
            options={mobileOptions}
            isSearchable={false}
            unstyled
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            classNames={{
              control: ({ isFocused, isDisabled, selectProps }) =>
                `
                  border border-green-300 p-2 bg-white
                  transition-all
                  ${selectProps.menuIsOpen ? "rounded-t-2xl" : "rounded-2xl"}
                  ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                  ${isFocused ? "ring-1 ring-green-700 border-green-700" : ""}
                `,
              menu: () =>
                "border border-green-700 ring-1 ring-green-700 rounded-b-2xl bg-white shadow-lg overflow-hidden",
              option: ({ isFocused, isSelected }) =>
                `px-3 py-2 cursor-pointer ${
                  isSelected
                    ? "bg-green-100"
                    : isFocused
                      ? "bg-green-50"
                      : "bg-white"
                }`,
              indicatorsContainer: () => "hidden",
            }}
          />
        </div>
        {showValid && <ValidationCheck />}
      </div>

      {/* DESKTOP */}
      <div
        ref={containerRef}
        className="hidden sm:flex relative flex-col flex-1"
      >
        {label && <label className="text-xs text-green-900">{label}</label>}

        <div className="relative">
          <input
            value={search}
            placeholder={defaultLabel}
            disabled={disabled}
            onChange={(e) => {
              const v = e.target.value;

              setSearch(v);
              setIsTyping(true);
              setOpen(true);

              if (v.trim() === "") {
                onChange(defaultValue);
              }
            }}
            onBlur={onBlur}
            onFocus={() => {
              if (!disabled) {
                setOpen(true);
                setIsTyping(false);
              }
            }}
            className={`
            w-full
            border
            border-green-300
            bg-white
            px-4
            py-2
            placeholder:text-gray-400
            focus:outline-none
            focus:placeholder-transparent
            focus:ring-1
            focus:ring-green-700
            focus:border-green-700
            ${open ? "rounded-t-2xl ring-1 ring-green-700 border-green-700" : "rounded-2xl"}
          `}
          />
          {showValid && <ValidationCheck />}
        </div>

        {open && (
          <ul className="absolute top-full left-0 z-50 w-full bg-white border border-green-700 rounded-b-2xl shadow max-h-60 overflow-auto text-left ring-1 ring-green-700">
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                onClick={() => {
                  onChange(opt.value);
                  setSearch(formatLabel(opt));
                  setIsTyping(false);
                  setOpen(false);
                }}
              >
                {formatLabel(opt)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
