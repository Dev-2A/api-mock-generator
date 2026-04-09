import Layout from "./components/layout/Layout";

function App() {
  return (
    <Layout>
      {/* 임시 콘텐츠 — Step 4~5에서 실제 UI로 교체 예정 */}
      <div className="space-y-6">
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            📝 엔드포인트 정의 영역
          </h2>
          <p className="text-sm text-gray-400">
            REST API 엔드포인트(메서드, 경로, 상태코드, 응답 JSON)를 정의하는
            폼이 들어갑니다.
          </p>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            📋 엔드포인트 목록 영역
          </h2>
          <p className="text-sm text-gray-400">
            추가된 엔드포인트들이 카드 형태로 나열됩니다.
          </p>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            💻 코드 생성 영역
          </h2>
          <p className="text-sm text-gray-400">
            Express / FastAPI 서버 코드를 프리뷰하고 복사 · 다운로드합니다.
          </p>
        </section>
      </div>
    </Layout>
  );
}

export default App;
