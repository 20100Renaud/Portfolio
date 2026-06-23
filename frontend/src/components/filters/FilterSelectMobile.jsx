export default function FilterSelectMobile({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
}) {
  return (
    <div className="sm:hidden flex flex-col w-full">
      <label className="text-xs">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded-2xl w-full text-xs"
      >
        <option value="">{allLabel}</option>

        {options.map(([item, count]) => (
          <option key={item} value={item} className="rounded">
            {item} ({count})
          </option>
        ))}
      </select>
    </div>
  );
}
