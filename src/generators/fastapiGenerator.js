/**
 * 엔드포인트 목록 → FastAPI 서버 코드 생성
 */

/**
 * Express 스타일 경로를 FastAPI 스타일로 변환
 * :id → {id}
 */
function toFastAPIPath(path) {
  return path.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, "{$1}");
}

/**
 * 경로에서 파라미터 추출
 * /api/users/:id/:name → ['id', 'name']
 */
function extractPathParams(path) {
  const matches = path.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1));
}

/**
 * JSON 응답을 Python dict 리터럴로 변환
 */
function toPythonLiteral(jsonStr, indent = "    ") {
  try {
    const parsed = JSON.parse(jsonStr);
    return jsonToPython(parsed, indent, indent);
  } catch {
    return `"${jsonStr.replace(/"/g, '\\"')}"`;
  }
}

/**
 * JS 값 → Python 리터럴 문자열 변환
 */
function jsonToPython(value, indent, currentIndent) {
  if (value === null) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map(
      (item) =>
        currentIndent + jsonToPython(item, indent, currentIndent + indent),
    );
    return `[\n${items.join(",\n")}\n${currentIndent.slice(indent.length)}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const items = entries.map(
      ([k, v]) =>
        currentIndent +
        `"${k}": ${jsonToPython(v, indent, currentIndent + indent)}`,
    );
    return `{\n${items.join(",\n")}\n${currentIndent.slice(indent.length)}}`;
  }
  return String(value);
}

/**
 * 단일 엔드포인트 → FastAPI 라우트 코드
 */
function generateRoute(ep) {
  const method = (ep.method || "GET").toLowerCase();
  const path = toFastAPIPath(ep.path || "/");
  const params = extractPathParams(ep.path);
  const lines = [];

  // 주석
  if (ep.description) {
    lines.push(`# ${ep.description}`);
  }

  // 데코레이터
  lines.push(`@app.${method}("${path}")`);

  // 함수 시그니처
  const funcName = `${method}+${ep.path
    .replace(/^\//, "")
    .replace(/[/:.-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/_$/, "")}`;

  const paramStr =
    params.length > 0 ? params.map((p) => `${p}: str`).join(", ") : "";

  if (ep.delay > 0) {
    lines.push(`async def ${funcName}(${paramStr}):`);
    lines.push(`    await asyncio.sleep(${(ep.delay / 1000).toFixed(2)})`);
  } else {
    lines.push(
      `${params.length > 0 ? "async " : ""}def ${funcName}(${paramStr}):`,
    );
  }

  // 응답
  if (ep.statusCode === 204) {
    lines.push(`    return Response(status_code=204)`);
  } else if (ep.statusCode !== 200) {
    lines.push(`    return JSONResponse(`);
    lines.push(`        status_code=${ep.statusCode},`);
    lines.push(
      `        content=${toPythonLiteral(ep.responseBody, "        ")}`,
    );
    lines.push(`    )`);
  } else {
    lines.push(`    return ${toPythonLiteral(ep.responseBody, "        ")}`);
  }

  return lines.join("\n");
}

/**
 * 메인 함수: 전체 FastAPI 서버 파일 생성
 * @param {Array} endpoints
 * @param {object} options
 * @returns {{ filename: string, content: string }[]}
 */
export function generateFastAPICode(endpoints, options = {}) {
  const port = options.port || 8000;
  const files = [];

  // -- 필요한 import 판별 --
  const needsAsyncio = endpoints.some((ep) => ep.delay > 0);
  const needsResponse = endpoints.some((ep) => ep.statusCode === 204);
  const needsJSONResponse = endpoints.some(
    (ep) => ep.statusCode !== 200 && ep.statusCode !== 204,
  );

  // -- requirements.txt --
  files.push({
    filename: "requirements.txt",
    content: ["fastapi==0.115.0", "uvicorn[standard]=0.30.0"].join("\n"),
  });

  // ── main.py ──
  const mainLines = [];

  // import
  if (needsAsyncio) {
    mainLines.push(`import asyncio`);
  }

  const fastapiImports = ["FastAPI"];
  if (needsResponse) fastapiImports.push("Response");
  if (needsJSONResponse) fastapiImports.push("JSONResponse");

  mainLines.push(`from fastapi import ${fastapiImports.join(", ")}`);
  mainLines.push(`from fastapi.middleware.cors import CORSMiddleware`);
  mainLines.push(``);
  mainLines.push(`app = FastAPI(`);
  mainLines.push(`    title="Mock Server",`);
  mainLines.push(
    `    description="API Mock Generator로 생성된 FastAPI 목 서버",`,
  );
  mainLines.push(`    version="1.0.0",`);
  mainLines.push(`)`);
  mainLines.push(``);
  mainLines.push(`# CORS 설정`);
  mainLines.push(`app.add_middleware(`);
  mainLines.push(`    CORSMiddleware,`);
  mainLines.push(`    allow_origins=["*"],`);
  mainLines.push(`    allow_credentials=True,`);
  mainLines.push(`    allow_methods=["*"],`);
  mainLines.push(`    allow_headers=["*"],`);
  mainLines.push(`)`);
  mainLines.push(``);
  mainLines.push(`# ──────────────────────────────────`);
  mainLines.push(`# 엔드포인트 (${endpoints.length}개)`);
  mainLines.push(`# ──────────────────────────────────`);
  mainLines.push(``);

  // 라우트
  endpoints.forEach((ep, i) => {
    mainLines.push(generateRoute(ep));
    if (i < endpoints.length - 1) {
      mainLines.push(``);
      mainLines.push(``);
    }
  });

  mainLines.push(``);
  mainLines.push(``);
  mainLines.push(`if __name__ == "__main__":`);
  mainLines.push(`    import uvicorn`);
  mainLines.push(
    `    print("🔌 Mock Server running at http://localhost:${port}")`,
  );
  mainLines.push(`    print("")`);
  mainLines.push(`    print("📋 등록된 엔드포인트:")`);

  endpoints.forEach((ep) => {
    const delay = ep.delay > 0 ? ` (${ep.delay}ms delay)` : "";
    mainLines.push(`    print("  ${ep.method.padEnd(7)} ${ep.path}${delay}")`);
  });

  mainLines.push(`    print("")`);
  mainLines.push(`    print("📖 API 문서: http://localhost:${port}/docs")`);
  mainLines.push(`    print("")`);
  mainLines.push(`    uvicorn.run(app, host="0.0.0.0", port=${port})`);

  files.push({
    filename: "main.py",
    content: mainLines.join("\n"),
  });

  // ── README.md ──
  const readmeLines = [
    `# 🔌 Mock Server (FastAPI)`,
    ``,
    `[API Mock Generator](https://dev-2a.github.io/api-mock-generator/)로 자동 생성된 목 서버입니다.`,
    ``,
    `## 실행 방법`,
    ``,
    `\`\`\`bash`,
    `pip install -r requirements.txt`,
    `python main.py`,
    `\`\`\``,
    ``,
    `또는 uvicorn 직접 실행:`,
    ``,
    `\`\`\`bash`,
    `uvicorn main:app --reload --port ${port}`,
    `\`\`\``,
    ``,
    `## API 문서`,
    ``,
    `서버 실행 후 자동 생성되는 문서:`,
    `- Swagger UI: http://localhost:${port}/docs`,
    `- ReDoc: http://localhost:${port}/redoc`,
    ``,
    `## 엔드포인트 목록`,
    ``,
    `| 메서드 | 경로 | 상태코드 | 지연 | 설명 |`,
    `|--------|------|----------|------|------|`,
  ];

  endpoints.forEach((ep) => {
    readmeLines.push(
      `| ${ep.method} | \`${ep.path}\` | ${ep.statusCode} | ${ep.delay}ms | ${ep.description || "-"} |`,
    );
  });

  readmeLines.push(``);
  readmeLines.push(`> 생성 시각: ${new Date().toLocaleString("ko-KR")}`);

  files.push({
    filename: "README.md",
    content: readmeLines.join("\n"),
  });

  return files;
}
