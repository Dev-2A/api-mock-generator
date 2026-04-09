export default function Select({
  options,
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        bg-gray-800 border border-gray-700 rounded-lg
        px-3 py-2 text-sm text-gray-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        ${className}
      `}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
