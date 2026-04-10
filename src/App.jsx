import Layout from "./components/layout/Layout";
import { EndpointProvider } from "./context/EndpointContext";
import EndpointForm from "./components/endpoint/EndpointForm";
import EndpointList from "./components/endpoint/EndpointList";
import CodeGenSection from "./components/codegen/CodeGenSection";

function App() {
  return (
    <EndpointProvider>
      <Layout>
        <div className="space-y-6">
          <EndpointForm />
          <EndpointList />
          <CodeGenSection />
        </div>
      </Layout>
    </EndpointProvider>
  );
}

export default App;
