import { useState, useEffect } from "react";
import useClickOutside from "../hooks/useClickOutside";

export default function CitySelect({
  value,
  onChange,
  setCoordinates,
  label = "City",
}) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  // Handle change input city when typing
  const handleChange = async (input) => {
    onChange(input);
    setOpen(true);

    if (!input || input.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${input}&fields=centre,codesPostaux`,
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle city infos when selecting
  const handleSelect = (commune) => {
    const city = commune.nom;

    onChange(city);

    if (setCoordinates) {
      setCoordinates({
        lat: commune.centre.coordinates[1],
        lng: commune.centre.coordinates[0],
      });
    }

    setResults([]);
    setOpen(false);
  };

  // Handle click outside dropdown
  const containerRef = useClickOutside(() => {
    setOpen(false);
  });

  return (
    <div ref={containerRef} className="flex flex-col relative w-full">
      <label className="text-xs text-green-900">{label}</label>

      <input
        type="text"
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        className="border p-2 rounded-2xl w-full"
        placeholder="Search a city"
      />

      {loading && (
        <div className="absolute text-xs text-gray-500 mt-1">Loading...</div>
      )}

      {open && results.length > 0 && (
        <ul className="absolute z-50 w-2xl bg-white border rounded shadow max-h-80 overflow-y-auto">
          {results.map((commune) => (
            <li
              key={commune.code}
              className="px-3 py-2 hover:bg-green-100 cursor-pointer flex justify-between"
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
  );
}
