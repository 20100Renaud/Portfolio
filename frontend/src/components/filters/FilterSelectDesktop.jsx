import SearchableSelect from "../SearchableSelect";

export default function FilterSelectDesktop({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <SearchableSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      defaultLabel="All"
    />
  );
}
