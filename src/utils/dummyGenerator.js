/**
 * JSON Schema 기반 더미 데이터 자동 생성기
 * 외부 라이브러리 없이 자체 구현
 */

// ── 랜덤 유틸 ──
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

// ── 더미 값 사전 ──
const NAMES = [
  "김민수",
  "이지은",
  "박서준",
  "최유나",
  "정하늘",
  "강도윤",
  "윤서연",
  "임재혁",
  "한소희",
  "오준영",
];
const EMAILS = [
  "alice@example.com",
  "bob@test.io",
  "charlie@demo.net",
  "diana@mail.com",
  "eve@sample.org",
];
const TITLES = [
  "프로젝트 보고서",
  "회의록 정리",
  "주간 업무 현황",
  "API 설계 문서",
  "배포 가이드",
];
const LOREM = [
  "이것은 테스트 데이터입니다.",
  "더미 텍스트가 생성되었습니다.",
  "목 서버용 샘플 응답입니다.",
  "개발 환경에서만 사용하세요.",
  "API 테스트를 위한 임시 데이터입니다.",
];
const URLS = [
  "https://example.com",
  "https://test.io/api",
  "https://demo.net/resource",
];
const STATUSES = ["active", "inactive", "pending", "completed", "archived"];

/**
 * format 힌트에 따른 문자열 생성
 */
function generateStringByFormat(format) {
  switch (format) {
    case "email":
      return pick(EMAILS);
    case "name":
      return pick(NAMES);
    case "date":
    case "date-time":
      return new Date(
        Date.now() - rand(0, 365 * 24 * 60 * 60 * 1000),
      ).toISOString();
    case "uri":
    case "url":
      return pick(URLS);
    case "uuid":
      return crypto.randomUUID();
    case "title":
      return pick(TITLES);
    case "status":
      return pick(STATUSES);
    case "phone":
      return `010-${rand(1000, 9999)}-${rand(1000, 9999)}`;
    default:
      return pick(LOREM);
  }
}

/**
 * 스키마 하나를 기반으로 값 생성
 */
function generateFromSchema(schema) {
  if (!schema || typeof schema !== "object") {
    return pick(LOREM);
  }

  // enum이 있으면 그 중에서 선택
  if (schema.enum && Array.isArray(schema.enum)) {
    return pick(schema.enum);
  }

  // const가 있으면 그대로
  if (schema.const !== undefined) {
    return schema.const;
  }

  switch (schema.type) {
    case "string":
      return generateStringByFormat(schema.format || "");

    case "number":
    case "float":
      return +(
        rand(schema.minimum || 0, schema.maximum || 1000) + Math.random()
      ).toFixed(2);

    case "integer":
      return rand(schema.minimum || 0, schema.maximum || 1000);

    case "boolean":
      return Math.random() > 0.5;

    case "null":
      return null;

    case "array": {
      const count = rand(schema.minItems || 1, schema.maxItems || 3);
      const itemSchema = schema.items || { type: "string" };
      return Array.from({ length: count }, () =>
        generateFromSchema(itemSchema),
      );
    }

    case "object": {
      const result = {};
      const props = schema.properties || {};
      for (const [key, propSchema] of Object.entries(props)) {
        result[key] = generateFromSchema(propSchema);
      }
      return result;
    }

    default:
      return pick(LOREM);
  }
}

/**
 * 메인 함수: 스키마 문자열/객체 → 더미 JSON 문자열
 * @param {string|object} schemaInput - JSON Schema (문자열 또는 객체)
 * @param {number} count - 배열로 생성할 개수 (0이면 단일 객체)
 * @returns {{ success: boolean, data: string, error: string | null }}
 */
export function generateDummyData(schemaInput, count = 0) {
  try {
    const schema =
      typeof schemaInput === "string" ? JSON.parse(schemaInput) : schemaInput;

    if (count > 0) {
      const items = Array.from({ length: count }, () =>
        generateFromSchema(schema),
      );
      return {
        success: true,
        data: JSON.stringify(items, null, 2),
        error: null,
      };
    }

    const result = generateFromSchema(schema);
    return {
      success: true,
      data: JSON.stringify(result, null, 2),
      error: null,
    };
  } catch (e) {
    return {
      success: false,
      data: "",
      error: e.message,
    };
  }
}

// ── 프리셋 스키마 ──
export const PRESET_SCHEMAS = [
  {
    name: "사용자 (User)",
    schema: {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string", format: "name" },
        email: { type: "string", format: "email" },
        phone: { type: "string", format: "phone" },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  },
  {
    name: "게시글 (Post)",
    schema: {
      type: "object",
      properties: {
        id: { type: "integer" },
        title: { type: "string", format: "title" },
        body: { type: "string" },
        authorName: { type: "string", format: "name" },
        status: { type: "string", enum: ["draft", "published", "archived"] },
        tags: {
          type: "array",
          items: {
            type: "string",
            enum: ["tech", "design", "backend", "frontend", "devops"],
          },
          minItems: 1,
          maxItems: 3,
        },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  },
  {
    name: "상품 (Product)",
    schema: {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string", format: "title" },
        price: { type: "number", minimum: 1000, maximum: 99000 },
        inStock: { type: "boolean" },
        category: {
          type: "string",
          enum: ["electronics", "clothing", "food", "books"],
        },
        rating: { type: "number", minimum: 1, maximum: 5 },
      },
    },
  },
  {
    name: "에러 응답 (Error)",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", const: false },
        error: {
          type: "object",
          properties: {
            code: {
              type: "string",
              enum: ["NOT_FOUND", "UNAUTHORIZED", "VALIDATION_ERROR"],
            },
            message: { type: "string" },
          },
        },
      },
    },
  },
  {
    name: "페이지네이션 (Paginated)",
    schema: {
      type: "object",
      properties: {
        page: { type: "integer", minimum: 1, maximum: 10 },
        perPage: { type: "integer", const: 20 },
        totalCount: { type: "integer", minimum: 50, maximum: 500 },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string", format: "name" },
              email: { type: "string", format: "email" },
            },
          },
          minItems: 3,
          maxItems: 5,
        },
      },
    },
  },
];
