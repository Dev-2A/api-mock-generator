export default function DelayInput({ value, onChange }) {
  const handleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    onChange(isNaN(num) ? 0 : Math.max(0, Math.min(num, 30000)));
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400">
        응답 지연 (ms)
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={0}
          max={30000}
          step={100}
          className="
            w-30 bg-gray-950 border border-gray-700 rounded-lg
            px-3 py-1.5 text-xs text-gray-200 font-mono
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          "
        />
        <span className="text-[10px] text-gray-500">
          {value === 0
            ? "즉시 응답"
            : value < 1000
              ? `${value}ms`
              : `${(value / 1000).toFixed(1)}초`}
        </span>
      </div>
    </div>
  );
}
