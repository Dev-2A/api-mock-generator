import { useMemo, useState } from "react";
import { useEndpoints } from "../../context/EndpointContext";
import { generateExpressCode } from "../../generators/expressGenerator";
import CodePreview from "./CodePreview";
import Button from "../common/Button";

export default function CodeGenSection() {
  const { endpoints } = useEndpoints();
  const [activeFramework, setActiveFramework] = useState("express");
  const [port, setPort] = useState(3000);

  const expressFiles = useMemo(
    () => generateExpressCode(endpoints, { port }),
    [endpoints, port],
  );

  if (endpoints.length === 0) {
    return (
      <section className="bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-8 text-center">
        <div className="text-3xl mb-3">💻</div>
        <p className="text-gray-500 text-sm">
          엔드포인트를 추가하면 서버 코드가 자동 생성됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
          <span>💻</span>
          서버 코드 생성
        </h2>

        <div className="flex items-center gap-3">
          {/* 포트 설정 */}
          <div className="flex items-center gap-1.5">
            <label className="text-[10px] text-gray-500">PORT:</label>
            <input
              type="number"
              value={port}
              onChange={(e) =>
                setPort(Math.max(1, parseInt(e.target.value, 10) || 3000))
              }
              className="w-17.5 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[11px] text-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 프레임워크 탭 */}
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setActiveFramework("express")}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                activeFramework === "express"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Express
            </button>
            <button
              onClick={() => setActiveFramework("fastapi")}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                activeFramework === "fastapi"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              FastAPI
            </button>
          </div>
        </div>
      </div>

      {/* 코드 프리뷰 */}
      {activeFramework === "express" && (
        <CodePreview files={expressFiles} framework="Express.js" />
      )}

      {activeFramework === "fastapi" && (
        <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm">
            🐍 FastAPI 코드 생성은 다음 단계에서 구현됩니다.
          </p>
        </div>
      )}
    </section>
  );
}
