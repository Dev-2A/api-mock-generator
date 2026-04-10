/**
 * 엔드포인트 목록 → Express.js 서버 코드 생성
 */

/**
 * Express 경로 파라미터 변환 (:id → :id 그대로, Express 네이티브)
 */
function normalizeExpressPath(path) {
  return path;
}

/**
 * 응답 바디를 JS 객체 리터럴 문자열로 변환
 */
function responseToJsLiteral(responseBody, indent = "    ") {
  try {
    const parsed = JSON.parse(responseBody);
    const json = JSON.stringify(parsed, null, 2);
    // 들여쓰기 보정
    return json
      .split("\n")
      .map((line, i) => (i === 0 ? line : indent + line))
      .join("\n");
  } catch {
    return `"${responseBody.replace(/"/g, '\\"')}"`;
  }
}

/**
 * 단일 엔드포인트 → Express 라우트 코드
 */
function generateRoute(ep) {
  const method = ep.method.toLowerCase();
  const path = normalizeExpressPath(ep.path);
  const lines = [];

  // 주석
  if (ep.description) {
    lines.push(`// ${ep.description}`);
  }

  lines.push(`app.${method}('${path}', (req, res) => {`);

  // 지연
  if (ep.delay > 0) {
    lines.push(`  setTimeout(() => {`);
    lines.push(
      `    res.status(${ep.statusCode}).json(${responseToJsLiteral(ep.responseBody, "      ")});`,
    );
    lines.push(`  }, ${ep.delay});`);
  } else {
    if (ep.statusCode === 204) {
      lines.push(`  res.status(204).end();`);
    } else {
      lines.push(
        `  res.status(${ep.statusCode}).json(${responseToJsLiteral(ep.responseBody, "    ")});`,
      );
    }
  }

  lines.push(`});`);
  return lines.join("\n");
}

/**
 * 메인 함수: 전체 Express 서버 파일 생성
 * @param {Array} endpoints
 * @param {object} options
 * @returns {{ filename: string, content: string }[]}
 */
export function generateExpressCode(endpoints, options = {}) {
  const port = options.port || 3000;
  const files = [];

  // ── package.json ──
  const packageJson = {
    name: "mock-server",
    version: "1.0.0",
    description: "API Mock Generator로 생성된 Express 목 서버",
    main: "server.js",
    scripts: {
      start: "node server.js",
      dev: "node --watch server.js",
    },
    dependencies: {
      express: "^4.18.2",
      cors: "^2.8.5",
    },
  };

  files.push({
    filename: "package.json",
    content: JSON.stringify(packageJson, null, 2),
  });

  // ── server.js ──
  const serverLines = [];

  serverLines.push(`const express = require('express');`);
  serverLines.push(`const cors = require('cors');`);
  serverLines.push(``);
  serverLines.push(`const app = express();`);
  serverLines.push(`const PORT = process.env.PORT || ${port};`);
  serverLines.push(``);
  serverLines.push(`// 미들웨어`);
  serverLines.push(`app.use(cors());`);
  serverLines.push(`app.use(express.json());`);
  serverLines.push(``);
  serverLines.push(`// 요청 로깅`);
  serverLines.push(`app.use((req, res, next) => {`);
  serverLines.push(
    `  console.log(\`[\${new Date().toLocaleTimeString()}] \${req.method} \${req.path}\`);`,
  );
  serverLines.push(`  next();`);
  serverLines.push(`});`);
  serverLines.push(``);
  serverLines.push(`// ──────────────────────────────────`);
  serverLines.push(`// 엔드포인트 (${endpoints.length}개)`);
  serverLines.push(`// ──────────────────────────────────`);
  serverLines.push(``);

  // 라우트
  endpoints.forEach((ep, i) => {
    serverLines.push(generateRoute(ep));
    if (i < endpoints.length - 1) {
      serverLines.push(``);
    }
  });

  serverLines.push(``);
  serverLines.push(`// 404 처리`);
  serverLines.push(`app.use((req, res) => {`);
  serverLines.push(
    `  res.status(404).json({ error: 'Not Found', path: req.path });`,
  );
  serverLines.push(`});`);
  serverLines.push(``);
  serverLines.push(`// 서버 시작`);
  serverLines.push(`app.listen(PORT, () => {`);
  serverLines.push(
    `  console.log(\`🔌 Mock Server running at http://localhost:\${PORT}\`);`,
  );
  serverLines.push(`  console.log('');`);

  // 엔드포인트 목록 출력
  serverLines.push(`  console.log('📋 등록된 엔드포인트:');`);
  endpoints.forEach((ep) => {
    const delay = ep.delay > 0 ? ` (${ep.delay}ms delay)` : "";
    serverLines.push(
      `  console.log('  ${ep.method.padEnd(7)} ${ep.path}${delay}');`,
    );
  });

  serverLines.push(`  console.log('');`);
  serverLines.push(`});`);

  files.push({
    filename: "server.js",
    content: serverLines.join("\n"),
  });

  // ── README.md ──
  const readmeLines = [
    `# 🔌 Mock Server (Express)`,
    ``,
    `[API Mock Generator](https://dev-2a.github.io/api-mock-generator/)로 자동 생성된 목 서버입니다.`,
    ``,
    `## 실행 방법`,
    ``,
    `\`\`\`bash`,
    `npm install`,
    `npm start`,
    `\`\`\``,
    ``,
    `개발 모드 (파일 변경 시 자동 재시작):`,
    ``,
    `\`\`\`bash`,
    `npm run dev`,
    `\`\`\``,
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
