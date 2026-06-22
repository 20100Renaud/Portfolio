import { useState } from "react";

export default function MarketLocationFilter({
  displayMode,
  setDisplayMode,
  radius,
  setRadius,
  activeLocation,
  setActiveLocation,
}) {
console.log("MarketLocationFilter displayMode =", displayMode);

  const [results, setResults] = useState([]);

  const handleCityChange = async (value) => {
    if (value === "") {
      setActiveLocation({
        city: "",
        lat: null,
        lng: null,
      });

      setResults([]);
      return;
    }

    setActiveLocation((prev) => ({
      ...prev,
      city: value,
      lat: null,
      lng: null,
    }));

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${value}&fields=centre,codesPostaux`,
      );

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Search mode switch */}
      <label className="flex justify-center items-center gap-3 mb-4 border border-green-200 rounded-2xl bg-green-100 p-2 cursor-pointer select-none">
        <span
          className={`text-sm transition ${
            displayMode === "all"
              ? "font-semibold text-green-800 text-lg"
              : "text-green-800/50"
          }`}
        >
          All deposits
        </span>

        <input
          type="checkbox"
          className="toggle border bg-white p-1"
          checked={displayMode === "local"}
          onChange={(e) => {
            const next = e.target.checked ? "local" : "all";

            setDisplayMode(next);
          }}
        />

        <span
          className={`text-sm transition ${
            displayMode === "local"
              ? "font-semibold text-green-800"
              : "text-green-800/50"
          }`}
        >
          Local search
        </span>
      </label>

      {/* Location filters */}
      {displayMode === "local" && (
        <div className="flex flex-wrap justify-center items-center gap-4">
          <div className="flex flex-col relative">
            <label className="text-xs text-gray-600">City</label>

            <input
              type="text"
              value={activeLocation?.city || ""}
              onChange={(e) => handleCityChange(e.target.value)}
              className="border p-2 rounded"
              placeholder="Choose a city"
            />
          </div>

          {results.length > 0 && (
            <ul className="absolute z-50 bg-white border rounded-box shadow-lg max-h-60 overflow-y-auto">
              {results.map((commune) => (
                <li
                  key={commune.code}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                  onClick={() => {
                    setActiveLocation({
                      city: commune.nom,
                      lat: commune.centre.coordinates[1],
                      lng: commune.centre.coordinates[0],
                    });

                    setResults([]);
                  }}
                >
                  <span>{commune.nom}</span>

                  <span className="text-xs text-gray-500">
                    {commune.codesPostaux?.[0]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {activeLocation?.lat && activeLocation?.lng && (
            <div className="flex flex-col">
              <label className="text-xs text-gray-600">
                Radius: {radius} km
              </label>

              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-48"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
