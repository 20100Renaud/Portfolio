import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Shovel } from "lucide-react";
import SearchableSelect from "./SearchableSelect";
import MarketLocationFilter from "./MarketLocationFilter";
import FilterSelectMobile from "./filters/FilterSelectMobile";
import FilterSelectDesktop from "./filters/FilterSelectDesktop";

export default function FilterBar({
  mode,
  filtersOpen,
  setFiltersOpen,
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
  onCollapse,
  toggleFilters,
}) {
  const ignoreNextScroll = useRef(false);
  const containerRef = useRef(null);
  const label = config.label || "items";
  const isLocal = displayMode === "local" && activeLocation?.city;

  const summary = isLocal
    ? `${resultCount} ${label} in ${radius} km around ${activeLocation.city}`
    : `${resultCount} ${label} in France`;

  const filters = [filterType, filterCat, filterUser].filter(Boolean);
  const filtersText = filters.length ? `(${filters.join(", ")})` : "";

  return (
    <div className="max-w-full bg-white rounded-2xl shadow-lg border border-green-100 overflow-y-hidden">
      <button
        onClick={toggleFilters}
        className="w-full flex items-center justify-between px-4 py-3 bg-green-100"
      >
        <div className="flex items-center gap-2">
          <Shovel size={24} className="text-green-800" />

          <span className="font-medium text-green-900">
            {summary}
            {filtersText && (
              <>
                <br className="sm:hidden" />
                <span className="sm:ml-1">{filtersText}</span>
              </>
            )}
          </span>
        </div>

        {filtersOpen ? "" : <ChevronDown size={20} />}
      </button>

      <div
        className={`bg-green-100 flex transition-all duration-300 ${
          filtersOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="p-4 flex-1 border-t border-r border-green-200 rounded-tr-3xl bg-white ">
          <p className="">Find the right place to dig</p>
          <div className="mt-4 p-4 border-t border-green-100">
            {/* BLOCK 1: dropdowns + reset btn */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4">
              {/* Type */}
              {config.filters.type && (
                <>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <FilterSelectMobile
                      label="Type"
                      value={filterType}
                      onChange={setFilterType}
                      options={typeOptions}
                      defaultLabel="All"
                    />
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <SearchableSelect
                      label="Type"
                      value={filterType}
                      onChange={setFilterType}
                      options={typeOptions}
                      defaultLabel="All"
                      defaultValue=""
                      showCount={true}
                    />
                  </div>
                </>
              )}

              {/* Category */}
              {config.filters.category && (
                <>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <FilterSelectMobile
                      label="Category"
                      value={filterCat}
                      onChange={setFilterCat}
                      options={categoryOptions}
                    />
                  </div>
                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <SearchableSelect
                      label="Category"
                      value={filterCat}
                      onChange={setFilterCat}
                      options={categoryOptions}
                      defaultLabel="All"
                      defaultValue=""
                      showCount={true}
                    />
                  </div>
                </>
              )}

              {/* Username */}
              {config.filters.user && (
                <>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <FilterSelectMobile
                      label="User"
                      value={filterUser}
                      onChange={setFilterUser}
                      options={usersOptions}
                      defaultLabel="All"
                    />
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <SearchableSelect
                      label="User"
                      value={filterUser}
                      onChange={setFilterUser}
                      options={usersOptions}
                      defaultLabel="All"
                      defaultValue=""
                      showCount={true}
                    />
                  </div>
                </>
              )}

              {/* Reset btn */}
              <div className="flex justify-center mt-3 w-full">
                <button
                  onClick={() => {
                    resetFilters();
                    setFiltersOpen(false);
                  }}
                  className=" bg-green-600 text-white px-3 py-1 text-sm rounded-2xl hover:bg-green-500"
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

        <button onClick={toggleFilters}>
          <div className="bg-green-100 w-12 h-full flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-between transform -translate-y-8 transition-all duration-300 mr-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <ChevronUp
                  key={index}
                  size={16}
                  className={`text-green-900 w-4 h-4 sm:w-5 sm:h-5 ${
                    index >= 3 ? "sm:hidden" : ""
                  }`}
                />
              ))}
              {filtersOpen ? "Done" : ""}
              {Array.from({ length: 5 }).map((_, index) => (
                <ChevronUp
                  key={index}
                  size={16}
                  className={`text-green-900 w-4 h-4 sm:w-5 sm:h-5 ${
                    index >= 3 ? "sm:hidden" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
