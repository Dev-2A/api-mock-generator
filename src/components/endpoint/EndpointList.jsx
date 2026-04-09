import { useEndpoints } from "../../context/EndpointContext";
import EndpointCard from "./EndpointCard";
import Button from "../common/Button";

export default function ENdpointList() {
  const { endpoints, clearAll } = useEndpoints();

  if (endpoints.length === 0) {
    return (
      <section className="bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-500 text-sm">아직 엔드포인트가 없습니다.</p>
        <p className="text-gray-600 text-xs mt-1">
          위 폼에서 첫 번째 엔드포인트를 추가해보세요!
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
          <span>📋</span>
          엔드포인트 목록
          <span className="text-xs font-normal text-gray-500">
            ({endpoints.length}개)
          </span>
        </h2>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          전체 삭제
        </Button>
      </div>

      {/* 카드 목록 */}
      <div className="space-y-2">
        {endpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>
    </section>
  );
}
