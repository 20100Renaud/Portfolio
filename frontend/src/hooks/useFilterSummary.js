import { useMemo } from "react";
import { normalizeOptions } from "../utils/select";
import { pluralize } from "../utils/plural";

export default function useFilterSummary({
  mode,
  filterType,
  filterCat,
  filterUser,
  typeOptions,
  categoryOptions,
  usersOptions,
  displayMode,
  activeLocation,
  radius,
  resultCount,
  label = "items",
}) {
  // Normalize Type options
  const normalizedTypeOptions = useMemo(
    () => normalizeOptions(typeOptions),
    [typeOptions],
  );

  // Normalize Cat options
  const normalizedCategoryOptions = useMemo(
    () => normalizeOptions(categoryOptions),
    [categoryOptions],
  );

  // Normalize User options
  const normalizedUserOptions = useMemo(
    () => normalizeOptions(usersOptions),
    [usersOptions],
  );

  // Choose between label and value
  const getLabel = (value, list) =>
    list.find((o) => o.value === value)?.label ?? value;

  // Summary sentence
  const summary = useMemo(() => {
    const isLocal =
      displayMode === "local" &&
      activeLocation?.lat != null &&
      activeLocation?.lng != null;

    if (mode === "dashboard") {
      if (resultCount === 0) {
        return `You don’t own any ${label}s yet`;
      }

      return `You own ${pluralize(resultCount, label)}`;
    }

    return isLocal
      ? `${pluralize(resultCount, label)} found in ${radius} km around ${activeLocation.city}`
      : `${pluralize(resultCount, label)} in France`;
  }, [
    mode,
    displayMode,
    activeLocation,
    radius,
    resultCount,
    label
  ]);

  // Filter sentence
  const filtersText = useMemo(() => {
    const active = [
      filterType && getLabel(filterType, normalizedTypeOptions),

      filterCat && getLabel(filterCat, normalizedCategoryOptions),

      filterUser && getLabel(filterUser, normalizedUserOptions),
    ].filter(Boolean);

    return active.length ? `(${active.join(", ")})` : "";
  }, [
    filterType,
    filterCat,
    filterUser,
    normalizedTypeOptions,
    normalizedCategoryOptions,
    normalizedUserOptions,
  ]);

  return {
    summary,
    filtersText,
  };
}
