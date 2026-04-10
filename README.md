# 🔌 API Mock Generator

REST API 엔드포인트를 UI에서 정의하면 **Express** / **FastAPI** 서버 코드를 자동 생성하는 웹 도구입니다.  

프론트엔드 개발 시 백엔드 대기 없이 목 서버를 즉시 만들어 쓸 수 있습니다.

🔗 **배포 URL**: [https://dev-2a.github.io/api-mock-generator/](https://dev-2a.github.io/api-mock-generator/)

---

## ✨ 주요 기능

### 📝 엔드포인트 정의

- HTTP 메서드 선택 (GET / POST / PUT / PATCH / DELETE)
- 경로 입력 (경로 파라미터 `:id` 지원)
- 상태코드 선택 (200, 201, 204, 400, 401, 403, 404, 500)
- 설명 추가 (선택)
- 엔드포인트 복제 / 삭제

### 📦 응답 설정

- JSON 에디터 (구문 검증 + 자동 포맷팅)
- 응답 지연(delay) 설정 (0~30,000ms)
- JSON Schema 기반 더미 데이터 자동 생성
  - 프리셋: 사용자 / 게시글 / 상품 / 에러 응답 / 페이지네이션
  - 커스텀 스키마 직접 입력 가능
  - 단일 객체 또는 N개 배열 생성

### 💻 코드 자동 생성

- **Express.js** (Node.js)
  - `package.json` + `server.js` + `README.md`
  - CORS, 요청 로깅, 404 처리 포함
- **FastAPI** (Python)
  - `requirements.txt` + `main.py` + `README.md`
  - CORS 미들웨어, Swagger/ReDoc 자동 문서 포함
  - 경로 파라미터 `:id` → `{id}` 자동 변환

### 🛠 편의 기능

- 파일별 / 전체 코드 원클릭 복사
- `.zip` 파일 다운로드
- 포트 번호 커스텀 설정
- 반응형 UI (모바일 지원)

---

## 🖼 스크린샷

> 배포 후 스크린샷을 추가해주세요.

---

## 🚀 시작하기

### 온라인 사용

[https://dev-2a.github.io/api-mock-generator/](https://dev-2a.github.io/api-mock-generator/) 에 접속하면 바로 사용할 수 있습니다.

### 로컬 실행

```bash
git clone https://github.com/Dev-2A/api-mock-generator.git
cd api-mock-generator
npm install
npm run dev
```

---

## 🔧 사용 방법

1. **엔드포인트 추가**: 메서드, 경로, 상태코드를 입력하고 "엔드포인트 추가" 클릭
2. **응답 편집**: 카드를 클릭해 펼친 뒤, JSON 에디터에서 응답 바디 수정
3. **더미 데이터**: 프리셋을 선택하거나 JSON Schema를 입력 → "미리보기" → "응답에 적용"
4. **코드 생성**: 하단에서 Express / FastAPI 탭 전환, 코드 확인
5. **내보내기**: "📋 복사" 또는 "📦 .zip 다운로드"로 프로젝트 파일 받기

### 생성된 Express 서버 실행

```bash
# zip 압축 해제 후
cd mock-server-express
npm install
npm start
```

### 생성된 FastAPI 서버 실행

```bash
# zip 압축 해제 후
cd mock-server-fastapi
pip install -r requirements.txt
python main.py
```

---

## 🛠 기술 스택

| 분류 | 기술 |
| --- | --- |
| 프레임워크 | React 19 + Vite |
| 스타일링 | Tailwind CSS v4 |
| ZIP 생성 | JSZip + FileSaver.js |
| 고유 ID | uuid |
| 배포 | GitHub Pages (GitHub Actions) |

---

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── layout/        # Header, Footer, Layout
│   ├── endpoint/      # EndpointForm, EndpointCard, EndpointList,
│   │                  # JsonEditor, DelayInput, DummyDataPanel
│   ├── codegen/       # CodeGenSection, CodePreview
│   └── common/        # Button, MethodBadge, Select
├── context/           # EndpointContext + endpointReducer
├── generators/        # expressGenerator, fastapiGenerator
├── utils/             # json, dummyGenerator, zipDownload
├── constants/         # http (메서드, 상태코드 상수)
├── App.jsx
├── main.jsx
└── index.css
```

---

## 📋 향후 개선 아이디어

- [ ] 엔드포인트 설정 내보내기/불러오기 (JSON 파일)
- [ ] 코드 구문 하이라이팅 (Prism.js / Shiki)
- [ ] Koa, Hono 등 추가 프레임워크 지원
- [ ] 요청 헤더 / 쿼리 파라미터 설정
- [ ] 조건부 응답 (if/else 분기)
- [ ] 다크/라이트 테마 전환

---

## 📄 라이선스

MIT License

---

<p align="center">
  Made with 🥤 and 💙 by <a href="https://github.com/Dev-2A">Dev-2A</a>
</p>
