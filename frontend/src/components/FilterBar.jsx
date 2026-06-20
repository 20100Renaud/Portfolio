import { useState } from "react";
import { ChevronDown, ChevronUp, Shovel } from "lucide-react";

export default function FilterBar({
  filterType,
  setFilterType,
  filterCat,
  setFilterCat,
  filterUser,
  setFilterUser,
  radius,
  setRadius,
  isLoggedIn,
  activeLocation,
  setActiveLocation,
  user,
  typeOptions,
  categories = [],
  categoryOptions,
  usersOptions,
  displayMode,
  setDisplayMode,
  resultCount,
  resetFilters,
  filtersOpen,
  setFiltersOpen,
}) {
  const [results, setResults] = useState([]);

  // When user change the city filter
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

  // Filter summary
  const s = resultCount > 1 ? "chests" : "chest";
  const summary =
    displayMode === "local" && activeLocation?.city && activeLocation?.lat
      ? `${resultCount} ${s} in ${radius} km around ${activeLocation.city}`
      : `${resultCount} ${s} found in France`;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-green-100"
      >
        <div className="flex items-center gap-2">
          <Shovel size={24} className="text-green-800" />

          <span className="font-medium text-green-900">{summary}</span>
        </div>

        {filtersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          filtersOpen ? "max-h-[500px] p-4" : "max-h-0"
        }`}
      >
        <p className="">Find the right place to dig</p>
        <div className="mt-4 p-4 border-t border-green-100">
          {/* BLOCK 1: dropdowns + reset btn */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4">
            {/* Type */}
            <div className="flex flex-col w-full">
              <label className="text-xs">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">All</option>

                {typeOptions.map(([type, count]) => (
                  <option key={type} value={type}>
                    {type} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col w-full">
              <label className="text-xs">Category</label>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">All</option>
                {categoryOptions.map(([cat, count]) => (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div className="flex flex-col w-full">
              <label className="text-xs">User</label>

              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">All</option>

                {usersOptions.map(([user, count]) => (
                  <option key={user} value={user}>
                    {user} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset btn */}
            <div className="flex justify-center mt-3 w-full">
              <button
                onClick={() => {
                  resetFilters();
                  setFiltersOpen(false);
                }}
                className=" bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-500"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* BLOCK 2: Swith mode btn */}

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
                if (e.target.checked) {
                  setDisplayMode("local");
                  setFiltersOpen(true);
                } else {
                  setDisplayMode("all");
                  setFiltersOpen(false);
                }
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

          {/* BLOCK 3: City + radius */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* City */}
            {displayMode === "local" && (
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
            )}

            {results.length > 0 && (
              <ul className="absolute z-50 bg-white border rounded-box shadow-lg w- max-h-60 overflow-y-auto">
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

            {/* Radius */}
            {displayMode === "local" &&
              activeLocation?.city &&
              activeLocation?.lat &&
              activeLocation?.lng && (
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
        </div>
      </div>
    </div>
  );
}
