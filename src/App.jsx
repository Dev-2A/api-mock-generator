import Layout from "./components/layout/Layout";
import { EndpointProvider } from "./context/EndpointContext";
import EndpointForm from "./components/endpoint/EndpointForm";
import EndpointList from "./components/endpoint/EndpointList";

function App() {
  return (
    <EndpointProvider>
      <Layout>
        <div className="space-y-6">
          <EndpointForm />
          <EndpointList />

          {/* 임시: 코드 생성 영역 — Step 9~11에서 교체 예정 */}
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
    </EndpointProvider>
  );
}

export default App;
