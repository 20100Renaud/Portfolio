import { useState } from "react";

export default function FilterBar({
  filterType,
  setFilterType,
  filterCat,
  setFilterCat,
  radius,
  setRadius,
  categories = [],
  isLoggedIn,
  activeLocation,
  setActiveLocation,
  user,

  locationMode,
  setLocationMode,
  displayMode,
  setDisplayMode,
}) {
  const [results, setResults] = useState([]);

  const handleCityChange = async (value) => {
    setActiveLocation((prev) => ({
      ...prev,
      city: value,
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
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 mb-6 border border-green-100">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Type */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="OFFER">Offers</option>
            <option value="REQUEST">Requests</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600">Category</label>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Radius */}
        {displayMode === "local" && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-600">Radius: {radius} km</label>

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

        {/* City */}
        {(!isLoggedIn || locationMode === "travel") &&
          displayMode === "local" && (
            <div className="flex flex-col relative">
              <label className="text-xs text-gray-600">City</label>

              <input
                value={activeLocation?.city || ""}
                onChange={(e) => handleCityChange(e.target.value)}
                className="border p-2 rounded w-64"
                placeholder="Choose a city"
              />

              {results.length > 0 && (
                <ul className="absolute top-full mt-1 z-50 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {results.map((commune) => (
                    <li
                      key={commune.code}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
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

                      {commune.codesPostaux?.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {commune.codesPostaux[0]}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        {/* Buttons */}

        <div className="flex gap-2">
          {/* Local/all */}
          <button
            onClick={() =>
              setDisplayMode(displayMode === "local" ? "all" : "local")
            }
            className="px-3 py-2 bg-green-100 rounded"
          >
            {displayMode === "local" ? "Show all deposits" : "Use local search"}
          </button>
        </div>

        {/* Home/travel */}
        {isLoggedIn && displayMode === "local" && (
          <button
            onClick={() =>
              setLocationMode(locationMode === "home" ? "travel" : "home")
            }
            className="px-3 py-2 bg-blue-100 rounded"
          >
            {locationMode === "home" ? "Travel mode" : "Home mode"}
          </button>
        )}
      </div>
    </div>
  );
}
