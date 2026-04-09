import { useState } from "react";
import { generateDummyData, PRESET_SCHEMAS } from "../../utils/dummyGenerator";
import Button from "../common/Button";

export default function DummyDataPanel({ onApply }) {
  const [schemaText, setSchemaText] = useState(
    JSON.stringify(PRESET_SCHEMAS[0].schema, null, 2),
  );
  const [count, setCount] = useState(0);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(null);

  const handlePresetSelect = (e) => {
    const preset = PRESET_SCHEMAS[Number(e.target.value)];
    if (preset) {
      setSchemaText(JSON.stringify(preset.schema, null, 2));
      setError(null);
      setPreview("");
    }
  };

  const handleGenerate = () => {
    const result = generateDummyData(schemaText, count);
    if (result.success) {
      setPreview(result.data);
      setError(null);
    } else {
      setError(result.error);
      setPreview("");
    }
  };

  const handleApply = () => {
    if (preview) {
      onApply(preview);
    }
  };

  const schemaLineCount = Math.min(
    Math.max(schemaText.split("\n").length, 4),
    12,
  );

  return (
    <div className="space-y-3 border border-gray-700 rounded-lg p-3 bg-gray-900/50">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">
          🎲 더미 데이터 생성
        </label>
        <select
          onChange={handlePresetSelect}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-gray-300 focus:outline-none"
        >
          {PRESET_SCHEMAS.map((p, i) => (
            <option key={i} value={i}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* 스키마 입력 */}
      <textarea
        value={schemaText}
        onChange={(e) => {
          setSchemaText(e.target.value);
          setError(null);
        }}
        rows={schemaLineCount}
        spellCheck={false}
        placeholder="JSON Schema를 입력하세요..."
        className="
          w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5
          text-[11px] text-gray-300 font-mono leading-relaxed resize-y
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
      />

      {/* 개수 + 버튼 */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-[10px] text-gray-500">개수:</label>
        <input
          type="number"
          value={count}
          onChange={(e) =>
            setCount(Math.max(0, parseInt(e.target.value, 10) || 0))
          }
          min={0}
          max={100}
          className="w-15 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[11px] text-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-[10px] text-gray-600">
          {count === 0 ? "단일 객체" : `${count}개 배열`}
        </span>

        <div className="ml-auto flex gap-1.5">
          <Button size="sm" variant="secondary" onClick={handleGenerate}>
            미리보기
          </Button>
          {preview && (
            <Button size="sm" onClick={handleApply}>
              응답에 적용
            </Button>
          )}
        </div>
      </div>

      {/* 에러 */}
      {error && <p className="text-[10px] text-red-400">⚠ {error}</p>}

      {/* 프리뷰 */}
      {preview && (
        <div className="relative">
          <pre className="bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-[10px] text-green-400 font-mono max-h-50 overflow-auto whitespace-pre-wrap">
            {preview}
          </pre>
          <span className="absolute top-1.5 right-2 text-[9px] text-gray-600">
            미리보기
          </span>
        </div>
      )}
    </div>
  );
}
