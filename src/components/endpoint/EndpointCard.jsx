import { useState } from "react";
import { useEndpoints } from "../../context/EndpointContext";
import { HTTP_METHODS, STATUS_CODES } from "../../constants/http";
import MethodBadge from "../common/MethodBadge";
import Button from "../common/Button";
import JsonEditor from "./JsonEditor";
import DelayInput from "./DelayInput";
import DummyDataPanel from "./DummyDataPanel";

export default function EndpointCard({ endpoint, index }) {
  const { removeEndpoint, duplicateEndpoint, updateEndpoint } = useEndpoints();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      removeEndpoint(endpoint.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2000);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors overflow-hidden">
      {/* ── 헤더 (항상 보임) ── */}
      <div
        className="flex items-start justify-between gap-3 p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-[10px] text-gray-600 font-mono w-4 text-right shrink-0">
              {index + 1}
            </span>
            <MethodBadge method={endpoint.method} />
            <code className="text-sm text-gray-200 font-mono truncate">
              {endpoint.path}
            </code>
            <span className="text-xs text-gray-500 shrink-0">
              {endpoint.statusCode}
            </span>
          </div>

          {endpoint.description && (
            <p className="text-xs text-gray-500 pl-6 truncate">
              {endpoint.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1.5 pl-6">
            {endpoint.delay > 0 && (
              <span className="text-[10px] text-amber-400/70 bg-amber-500/10 px-1.5 py-0.5 rounded">
                ⏱ {endpoint.delay}ms
              </span>
            )}
            <span className="text-[10px] text-gray-600">
              {isOpen ? "▲ 접기" : "▼ 펼쳐서 편집"}
            </span>
          </div>
        </div>

        {/* 우측 액션 */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => duplicateEndpoint(endpoint.id)}
            title="복제"
          >
            📋
          </Button>
          <Button
            variant={confirmDelete ? "danger" : "ghost"}
            size="sm"
            onClick={handleDelete}
            title={confirmDelete ? "정말 삭제?" : "삭제"}
          >
            {confirmDelete ? "확인" : "🗑️"}
          </Button>
        </div>
      </div>

      {/* ── 편집 패널 ── */}
      {isOpen && (
        <div className="border-t border-gray-800 p-4 space-y-4 bg-gray-950/50">
          {/* 메서드 / 경로 / 상태코드 인라인 편집 */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-400">
              엔드포인트 설정
            </label>
            <div className="flex flex-wrap gap-2">
              {/* 메서드 */}
              <select
                value={endpoint.method}
                onChange={(e) =>
                  updateEndpoint(endpoint.id, { method: e.target.value })
                }
                onClick={(e) => e.stopPropagation()}
                className="w-27.5 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* 경로 */}
              <input
                type="text"
                value={endpoint.path}
                onChange={(e) =>
                  updateEndpoint(endpoint.id, { path: e.target.value })
                }
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-w-45 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* 상태코드 */}
              <select
                value={String(endpoint.statusCode)}
                onChange={(e) =>
                  updateEndpoint(endpoint.id, {
                    statusCode: Number(e.target.value),
                  })
                }
                onClick={(e) => e.stopPropagation()}
                className="w-45 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUS_CODES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 설명 */}
            <input
              type="text"
              value={endpoint.description}
              onChange={(e) =>
                updateEndpoint(endpoint.id, { description: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
              placeholder="설명 (선택사항)"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 구분선 */}
          <hr className="border-gray-800" />

          {/* 더미 데이터 생성 */}
          <DummyDataPanel
            onApply={(generatedJson) =>
              updateEndpoint(endpoint.id, { responseBody: generatedJson })
            }
          />

          {/* 응답 JSON 에디터 */}
          <JsonEditor
            value={endpoint.responseBody}
            onChange={(newBody) =>
              updateEndpoint(endpoint.id, { responseBody: newBody })
            }
          />

          {/* 지연 설정 */}
          <DelayInput
            value={endpoint.delay}
            onChange={(newDelay) =>
              updateEndpoint(endpoint.id, { delay: newDelay })
            }
          />
        </div>
      )}
    </div>
  );
}
