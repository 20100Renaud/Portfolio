import { useState } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { searchCities } from "../services/city.service";
import ValidationCheck from "../components/ValidationCheck";

export default function CitySelect({
  value,
  onChange,
  onSelect,
  onBlur,
  isValid = false,
  showWarning = false,
  label = "City",
  placeholder = "Search a city",
  showValid = false,
  showClear = false,
}) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  // CLose the menu on click outside
  const containerRef = useClickOutside(() => {
    setOpen(false);
  });

  // Typing behavior
  const handleChange = async (input) => {
    onChange(input);
    setOpen(true);

    if (input.length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const cities = await searchCities(input);
      setResults(cities.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Selecting behavior
  const handleSelect = (commune) => {
    onChange(commune.nom);

    onSelect?.({
      city: commune.nom,
      lat: commune.centre.coordinates[1],
      lng: commune.centre.coordinates[0],
    });

    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col w-full">
      <label className="block">{label}</label>
      <div className="relative">
        <input
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={`
          w-full
          border
          bg-white
          px-4
          py-2
          placeholder:text-gray-400
          focus:outline-none
          focus:placeholder-transparent
          ${
            showWarning
              ? "border-red-700 ring-1 ring-red-700"
              : "border-green-300 focus:ring-1 focus:ring-green-700 focus:border-green-700"
          }
          ${open ? "rounded-t-2xl" : "rounded-2xl"}
        `}
        />
        {showClear && value?.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange("");

              setResults([]);
              setOpen(false);

              onSelect?.({
                city: "",
                lat: null,
                lng: null,
              });
            }}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-green-700 hover:text-red-600
              text-sm font-bold
              px-1
            "
          >
            ✕
          </button>
        )}

        {isValid && <ValidationCheck />}

        {loading && (
          <div className="absolute top-full mt-1 text-xs">Loading...</div>
        )}

        {open && results.length > 0 && (
          <ul className="absolute top-full left-0 z-50 w-full bg-white border border-green-700 rounded-b-2xl shadow max-h-40 overflow-auto text-left ring-1 ring-green-700">
            {results.map((commune) => (
              <li
                key={`${commune.nom}-${commune.centre.coordinates[0]}-${commune.centre.coordinates[1]}`}
                className="px-3 py-1 hover:bg-green-100 cursor-pointer flex justify-between"
                onClick={() => handleSelect(commune)}
              >
                <span>{commune.nom}</span>

                <span className="text-xs text-green-900/50">
                  {commune.codesPostaux?.[0]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-2">
        {showWarning && (
          <p className="text-red-500 text-sm ml-2">
            Please select a city from the list.
          </p>
        )}
      </div>
    </div>
  );
}
