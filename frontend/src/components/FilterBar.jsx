import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronUp, Shovel } from "lucide-react";
import { normalizeOptions } from "../utils/select";
import MarketLocationFilter from "./MarketLocationFilter";
import CustomButton from "../components/CustomButton";

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
  setIsFilterModalOpen,
  config,
  displayMode,
  setDisplayMode,
  activeLocation,
  setActiveLocation,
  radius,
  setRadius,
  onCollapse,
  toggleFilters,
  filtersText,
  summary,
}) {
  return (
    <div className="max-w-full bg-green-100 rounded-2xl shadow-lg border border-green-100 block sm:flex  items-center">
      <button
        onClick={toggleFilters}
        className="w-full flex items-center justify-between px-4 py-3  rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <Shovel size={24} className="text-green-800" />

          <span className="font-medium text-green-900">
            {summary}
            <br className="sm:hidden" />
            <span className="sm:ml-1">{filtersText}</span>
          </span>
        </div>
      </button>

      <div className="flex justify-center gap-2 mb-2 sm:mb-0 sm:mr-2 ">
        {/* Filter the depos btn */}
        {config.showFilters && (
          <CustomButton variant="secondary" onClick={toggleFilters}>
            Filters
          </CustomButton>
        )}

        {/* Reset Filter btn */}
        <CustomButton
          variant="secondary"
          onClick={() => {
            resetFilters();
          }}
        >
          Reset
        </CustomButton>
      </div>
    </div>
  );
}
