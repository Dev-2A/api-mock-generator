import { useState, useEffect } from "react";
import { validateJSON, formatJSON } from "../../utils/json";

export default function JsonEditor({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // 외부에서 value가 바뀌면 동기화
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);

    const result = validateJSON(newVal);
    if (result.valid) {
      setError(null);
      onChange(newVal);
    } else {
      setError(result.error);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 유효한 JSON이면 포맷팅 적용
    const result = validateJSON(localValue);
    if (result.valid) {
      const formatted = formatJSON(localValue);
      setLocalValue(formatted);
      onChange(formatted);
    }
  };

  const handleFormat = () => {
    const result = validateJSON(localValue);
    if (result.valid) {
      const formatted = formatJSON(localValue);
      setLocalValue(formatted);
      onChange(formatted);
      setError(null);
    }
  };

  // 줄 수 계산 (최소 4줄, 최대 16줄)
  const lineCount = Math.min(Math.max(localValue.split("\n").length, 4), 16);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">응답 JSON</label>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-[10px] text-red-400 max-w-50 truncate">
              ⚠ {error}
            </span>
          )}
          <button
            type="button"
            onClick={handleFormat}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            정렬
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          rows={lineCount}
          spellCheck={false}
          className={`
            w-full bg-gray-950 rounded-lg p-3
            text-xs text-gray-200 font-mono leading-relaxed
            resize-y min-h-25
            focus:outline-none focus:ring-2 focus:border-transparent
            border transition-colors
            ${
              error
                ? "border-red-500/50 focus:ring-red-500/40"
                : "border-gray-700 focus:ring-indigo-500"
            }
          `}
        />

        {/* 유효성 인디케이터 */}
        <div className="absolute top-2 right-2">
          <span
            className={`
              inline-block w-2 h-2 rounded-full
              ${error ? "bg-red-500" : "bg-green-500"}
            `}
            title={error ? "잘못된 JSON" : "유효한 JSON"}
          />
        </div>
      </div>
    </div>
  );
}
