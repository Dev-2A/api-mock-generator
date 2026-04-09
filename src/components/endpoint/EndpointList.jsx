import { useEndpoints } from "../../context/EndpointContext";
import EndpointCard from "./EndpointCard";
import Button from "../common/Button";

export default function EndpointList() {
  const { endpoints, clearAll } = useEndpoints();

  if (endpoints.length === 0) {
    return (
      <section className="bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-8 text-center">
        <div className="text-3xl mb-3">📭</div>
        <p className="text-gray-500 text-sm">아직 엔드포인트가 없습니다.</p>
        <p className="text-xs text-gray-600 mt-1">
          위 폼에서 첫 번째 엔드포인트를 추가해보세요!
        </p>
      </section>
    );
  }

  const methodCounts = endpoints.reduce((acc, ep) => {
    acc[ep.method] = (acc[ep.method] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
            <span>📋</span>
            엔드포인트 목록
            <span className="text-xs font-normal text-gray-500">
              ({endpoints.length}개)
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {Object.entries(methodCounts).map(([method, count]) => (
              <span
                key={method}
                className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded"
              >
                {method} {count}
              </span>
            ))}
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={clearAll}>
          전체 삭제
        </Button>
      </div>

      <div className="space-y-2">
        {endpoints.map((ep, idx) => (
          <EndpointCard key={ep.id} endpoint={ep} index={idx} />
        ))}
      </div>
    </section>
  );
}
