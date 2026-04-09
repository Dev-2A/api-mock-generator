import { useState } from "react";
import { useEndpoints } from "../../context/EndpointContext";
import {
  HTTP_METHODS,
  STATUS_CODES,
  DEFAULT_RESPONSE,
  DEFAULT_DELAY,
} from "../../constants/http";
import Button from "../common/Button";

export default function EndpointForm() {
  const { addEndpoint } = useEndpoints();

  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("");
  const [statusCode, setStatusCode] = useState("200");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedPath = path.trim();

    if (!trimmedPath) {
      setError("경로를 입력해주세요.");
      return;
    }
    if (!trimmedPath.startsWith("/")) {
      setError("경로는 /로 시작해야 합니다.");
      return;
    }
    if (/\s/.test(trimmedPath)) {
      setError("경로에 공백을 포함할 수 없습니다.");
      return;
    }

    addEndpoint({
      method,
      path: trimmedPath,
      statusCode: Number(statusCode),
      description: description.trim(),
      responseBody: DEFAULT_RESPONSE,
      delay: DEFAULT_DELAY,
    });

    setPath("");
    setDescription("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-base font-semibold text-gray-100 mb-4 flex items-center gap-2">
        <span>📝</span>
        엔드포인트 추가
      </h2>

      <div className="space-y-3">
        {/* 1행: 메서드 + 경로 */}
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setError("");
            }}
            className="w-30 shrink-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {HTTP_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={path}
            onChange={(e) => {
              setPath(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="/api/users/:id"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 2행: 상태코드 + 설명 */}
        <div className="flex gap-2">
          <select
            value={statusCode}
            onChange={(e) => setStatusCode(e.target.value)}
            className="w-50 shrink-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_CODES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="설명 (선택사항)"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 에러 */}
        {error && <p className="text-xs text-red-400 pl-1">{error}</p>}

        {/* 버튼 */}
        <div className="flex justify-end pt-1">
          <Button onClick={handleSubmit}>+ 엔드포인트 추가</Button>
        </div>
      </div>
    </section>
  );
}
