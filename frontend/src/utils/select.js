export function normalizeOptions(options = []) {
  return options.map((opt) => {
    // If Array then string then normalize
    if (Array.isArray(opt)) {
      const [value, count] = opt;

      return {
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        count,
      };
    }

    // If string then normalize
    if (typeof opt === "string") {
      return {
        value: opt,
        label: opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase(),
        count: null,
      };
    }

    // Else return
    return {
      value: opt.value,
      label: opt.label ?? opt.value,
      count: opt.count ?? null,
    };
  });
}
