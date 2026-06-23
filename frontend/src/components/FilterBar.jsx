import { useState } from "react";
import MarketLocationFilter from "./MarketLocationFilter";
import { ChevronDown, ChevronUp, Shovel } from "lucide-react";


export default function FilterBar({
  mode,
  filterType,
  setFilterType,
  filterCat,
  setFilterCat,
  filterUser,
  setFilterUser,
  typeOptions = [],
  categoryOptions = [],
  usersOptions = [],
  resultCount,
  resetFilters,
  config,
  displayMode,
  setDisplayMode,
  activeLocation,
  setActiveLocation,
  radius,
  setRadius,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const label = config.label || "items";

  const isLocal = displayMode === "local" && activeLocation?.city;
  const summary = isLocal
    ? `${resultCount} ${label} in ${radius} km around ${activeLocation.city}`
    : `${resultCount} ${label} in France`;

  function buildSummary() {
    const filters = [filterType, filterCat, filterUser].filter(Boolean);

    return filters.length ? `${summary} (${filters.join(", ")})` : summary;
  }
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-green-100"
      >
        <div className="flex items-center gap-2">
          <Shovel size={24} className="text-green-800" />

          <span className="font-medium text-green-900">{buildSummary()}</span>
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
            {config.filters.type && (
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
            )}

            {/* Category */}
            {config.filters.category && (
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
            )}

            {/* Username */}
            {config.filters.user && (
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
            )}

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

          {/* BLOCK 2: Switch btn (All / Local) */}
          {config.filters.radius && (
            <MarketLocationFilter
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              radius={radius}
              setRadius={setRadius}
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
