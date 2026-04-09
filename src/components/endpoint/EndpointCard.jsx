import { useEndpoints } from "../../context/EndpointContext";
import MethodBadge from "../common/MethodBadge";
import Button from "../common/Button";

export default function EndpointCard({ endpoint }) {
  const { removeEndpoint, duplicateEndpoint } = useEndpoints();

  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* 좌측: 메서드 + 경로 + 상태코드 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
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

          {/* 지연 시간 표시 */}
          {endpoint.delay > 0 && (
            <span className="inline-block mt-1.5 text-[10px] text-amber-400/70 bg-amber-500/10 px-1.5 py-0.5 rounded">
              ⏱ {endpoint.delay}ms 지연
            </span>
          )}
        </div>

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
    </div>
  );
}
