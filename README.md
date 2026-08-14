# subBase

Figma Community의 `subBase` 파일을 기준으로 구현한 독립 React 디자인 시스템입니다.

## 실행

```bash
npm install
npm run dev
```

- `npm run tokens`: YAML 토큰에서 CSS와 브랜드 매니페스트 생성
- `npm run typecheck`: TypeScript 검사
- `npm run contrast`: 모든 프리셋의 라이트·다크 색 대비 검사
- `npm run i18n:check`: 한국어·영어 키 패리티 검사
- `npm run build`: 토큰 생성, 타입 검사, 프로덕션 번들

## 구조

- `figma-source/`: Figma REST 원본 JSON, 에셋, 컴포넌트 커버리지
- `design-system/rootage/`: 색상·타이포그래피·치수·라운드·그림자 토큰
- `src/ds/ui/`: subBase UI 컴포넌트
- `src/pages/design/`: 브라우저 컴포넌트 문서
- `src/app/`: 문서 셸과 설정
- `server/`: 로컬 개발용 FastAPI 서버

Figma 대응 현황은 [COMPONENT_COVERAGE.md](figma-source/COMPONENT_COVERAGE.md), 사용법은 [MANUAL.md](docs/MANUAL.md)를 참고하세요.
