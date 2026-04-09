import { useState } from "react";
import { useEndpoints } from "../../context/EndpointContext";
import MethodBadge from "../common/MethodBadge";
import Button from "../common/Button";
import JsonEditor from "./JsonEditor";
import DelayInput from "./DelayInput";

export default function EndpointCard({ endpoint }) {
  const { removeEndpoint, duplicateEndpoint, updateEndpoint } = useEndpoints();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors overflow-hidden">
      {/* 헤더 (항상 보임) */}
      <div
        className="flex items-start justify-between gap-3 p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 좌측 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <MethodBadge method={endpoint.method} />
            <code className="text-sm text-gray-200 font-mono truncate">
              {endpoint.path}
            </code>
            <span className="text-xs text-gray-500 shrink-0">
              {endpoint.statusCode}
            </span>
          </div>

          {endpoint.description && (
            <p className="text-xs text-gray-500 pl-1 truncate">
              {endpoint.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1.5">
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

        {/* 우측 버튼 */}
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
            variant="ghost"
            size="sm"
            onClick={() => removeEndpoint(endpoint.id)}
            title="삭제"
          >
            🗑️
          </Button>
        </div>
      </div>

      {/* 편집 패널 (토글) */}
      {isOpen && (
        <div className="border-t border-gray-800 p-4 space-y-4 bg-gray-950/50">
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
