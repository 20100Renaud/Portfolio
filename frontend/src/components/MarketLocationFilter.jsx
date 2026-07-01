import CitySelect from "./CitySelect";
import useDepos from "../hooks/useDepos";
import { RotateCcw } from "lucide-react";

export default function MarketLocationFilter({
  displayMode,
  setDisplayMode,
  radius,
  setRadius,
  activeLocation,
  setActiveLocation,
  resetCity,
  cityIsSelected,
}) {
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
          className="toggle border border-green-200 bg-green-50 p-1"
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
          {/* City search */}
          <div className="flex flex-col relative w-full">
            <CitySelect
              selected={cityIsSelected}
              showClear={true}
              value={activeLocation?.city || ""}
              onChange={(city) =>
                setActiveLocation((prev) => ({
                  ...prev,
                  city,
                  lat: null,
                  lng: null,
                }))
              }
              onSelect={({ city, lat, lng }) =>
                setActiveLocation({
                  city,
                  lat,
                  lng,
                })
              }
            />
          </div>

          <div className="flex justify-around w-full">
            {/* Reset City Btn */}
            <button
              type="button"
              onClick={resetCity}
              className="
                text-xs
                px-2 py-1
                rounded-full
                border border-green-300
                text-green-700
                bg-green-50
                hover:bg-green-100
                transition
                flex gap-2
                active:scale-95
                active:opacity-80
              "
            >
              <RotateCcw className="w-3 h-3" />
              Reset city
            </button>

            {/* Radius bar */}
            {activeLocation?.lat && activeLocation?.lng && (
              <div className="flex flex-col">
                <label className="text-xs text-green-900">
                  Radius: {radius} km
                </label>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className=" h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-600"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
