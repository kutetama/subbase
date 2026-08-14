# Toastfy — 새 애플리케이션 개발 매뉴얼

Toastfy 템플릿으로 새 서비스를 만들고, 화면·설정·백엔드를 확장하고, 디자인을 커스텀하고, DS 업데이트를 수신하는 전 과정을 다룬다. 모든 명령은 실측 검증된 것이다 (2026-08-11).

- 디자인 규칙·토큰 원천 근거: [design-system/GUIDE.md](../design-system/GUIDE.md)
- 스택 선정 이력·프로젝트 경위: Toastfy 저장소(github.com/kutetama/toastfy)의 `STACK.md`·`BRIEF.md`

## 0. 전제

- Node 22+ (실측 환경 v24), npm. 백엔드 실행에 `uv`(권장) 또는 pip.
- Toastfy 저장소: `/home/minds/toastfy` (원격 github.com/kutetama/toastfy)
- 폐쇄망 동작 전제 — 폰트 셀프호스팅, 외부 CDN 없음.

## 1. 빠른 시작

```bash
cd /home/maumai/toastfy
node scripts/create-service.mjs my-app                 # minimal(기본)
node scripts/create-service.mjs my-admin --profile=admin
node scripts/create-service.mjs my-showcase --profile=showcase
# 대상 경로·브랜드 프리셋·DS 지속 동기화 지정 시:
node scripts/create-service.mjs my-app /원하는/경로 --preset=teal-demo --managed
```

스캐폴드가 하는 일 — 프로필에 필요한 DS·앱 overlay만 복사, 서비스명 치환, `toastfy.config.json` 생성, 프로필별 의존성 설치. 기본은 copy-once이며 `--managed`일 때만 DS 동기화 기준선(`.toastfy-sync.json`)을 기록한다.

```bash
cd ../my-app
npm run dev                                            # minimal/admin: 프론트 (기본 5173)

cd ../my-showcase
npm run dev                                            # showcase: Vite 5173 + FastAPI/SSE 8000
```

- `minimal`: 단일 시작 화면. 라우터·백엔드·i18n 없음.
- `admin`: 얇은 사이드바와 라우터, 데이터 UI 포함. 인증·API는 서비스가 결정.
- `showcase`: `/example`, `/design/*`, 설정과 FastAPI/SSE 예제를 포함한 Toastfy 전체 검토용. `npm run dev`가 두 서버를 함께 시작하며, UI만 볼 때는 `npm run dev:frontend`를 사용한다.

이하 3~6장의 앱 셸·설정·백엔드 설명은 해당 기능을 포함한 `showcase`의 참고 자료다. `minimal`/`admin`은 없는 기능을 지우는 대신 필요한 기능만 서비스 요구에 맞춰 추가한다.

## 2. 구조와 소유 경계 (`--managed` 서비스만)

기본 copy-once 서비스는 생성 직후 모든 파일을 서비스가 소유한다. `--managed`로 생성해 `npm run sync`를 사용하는 경우에만 **선택 프로필의 DS 소유 경로를 직접 수정하지 않는 것**이 규약이다. 앱·페이지는 프로필과 무관하게 항상 서비스 소유다.

| DS 소유 (sync가 관리 — 수정 금지) | 서비스 소유 (자유 수정) |
| --- | --- |
| `design-system/` (토큰 원천·코드젠·GUIDE) | `src/app/` — nav-config·settings-config·service-icons 등 |
| `src/ds/**` (컴포넌트 40여 종·아이콘·훅·스토어) | `src/pages/` — 라우트 페이지 |
| `src/lib/api.ts` · `src/i18n/index.ts` | `src/i18n/locales/` — 문자열 키 추가 지점 |
| `src/index.css` · `src/vite-env.d.ts` | `server/` · `main.tsx` · `index.html` · `toastfy.config.json` |

예외: 서비스가 **프리셋 폴더를 추가**하는 것은 허용 — sync가 로컬 추가로 인식해 보존한다.

## 3. 화면(페이지·메뉴) 추가 (`admin`/`showcase`)

4개 파일이면 끝난다 — 사이드바·라우트·활성 표시·헤더 타이틀이 전부 따라온다.

```tsx
// ① src/pages/ExperimentsPage.tsx — 페이지 생성
export default function ExperimentsPage() {
  return <div className="mx-auto max-w-[1120px] px-8 py-8">…</div>;
}
```

```tsx
// ② src/main.tsx — 라우트 등록
{ path: "experiments", element: <ExperimentsPage /> },
```

```tsx
// ③ src/app/nav-config.tsx — 메뉴 등록 (선언형 단일 원천)
{ path: "/experiments", labelKey: "nav.experiments", icon: "OL_INBOX_STACK" },
```

```ts
// ④ src/i18n/locales/ko.ts · en.ts — 라벨 키 추가 (양쪽 모두 — npm run i18n:check가 패리티 검증)
"nav.experiments": "실험",   // en: "Experiments"
```

## 4. 컴포넌트 사용

**세 가지 강제 규칙** (제품 검증 컨벤션 — GUIDE 참조):

1. 클래스 병합은 반드시 `cn()` (`@/ds/lib/cn`) — clsx·twMerge 직접 호출 금지.
2. 타이포는 `typo-*` 유틸만 (`typo-bold_smallP` 등 19종). `text-*`는 색상 전용.
3. 아이콘은 `getAppIcon("키", { size, colorClass })` (`@/ds/icons`) — react-icons 직접 import 금지. **서비스 고유 아이콘은 `src/app/service-icons.ts`에 등록** (ds 파일 무수정 병합).

대표 패턴 — 나머지는 디자인 카탈로그(사이드바 컴포넌트 섹션)에서 실물·소스(`src/pages/design/*.tsx`)를 보고 복사하면 된다:

```tsx
// 데이터 테이블 (+정렬 헤더·선택 행·상태) — @tanstack/react-table 기반
<DataTable columns={columns} cellData={rows} isEmpty={false} isError={false}
  selectedRows={ids} getRowId={(r) => r.id} onRowClick={...} />

// 모달 — id 레지스트리 방식 (포탈 #modal은 index.html에 내장)
const { openModal } = useModal();               // @/ds/providers/modal-store
openModal("confirm", { name: "..." });          // 데이터 전달 가능 → getModalData(id)
<Modal id="confirm" size="medium" title="제목">
  <Modal.Body>…</Modal.Body>
  <Modal.Footer primaryButtonText="확인" primaryButtonClick={...} />
</Modal>

// 로딩·에러·빈 상태 게이트 (재시도 포함)
<FetchStatusGate loading={loading} error={error} errorMessage="..." retryCallback={reload}>
  <정상콘텐츠 />
</FetchStatusGate>

// 토스트 — 셸이 ToastContainer를 이미 마운트함
toast(<Toast message="저장되었습니다." />);      // react-toastify의 toast + @/ds/ui/Toast

// 차트 — 기본 echarts(EChart 래퍼), 색은 반드시 토큰 훅 (브랜드·다크 자동 추종)
const colors = useChartColors();                 // @/ds/hooks/useChartColors
<EChart option={{ series: [{ type: "line", lineStyle: { color: colors.primary } }] }} />
// 정적 소형 차트 위주 서비스는 recharts를 선택 의존으로: npm i recharts — GUIDE '차트' 절 참조
```

## 5. 설정 패널 확장 (`showcase` 참고)

단일 원천은 `src/app/settings/settings-config.tsx`.

- **옵션 모듈 켜기** — 한 줄: `{ id: "api-keys", ..., enabled: false }` → `enabled: true`. 레일에 탭이 등장한다 (프로필·API 키·연결 스켈레톤 동봉).
- **서비스 탭 추가** — 탭 컴포넌트를 만들고 배열에 항목 추가. `SettingsSection`/`SettingsRow`/`Segmented` 프리미티브(`settings/primitives.tsx`)로 조립하면 기존 탭과 톤이 맞는다. `adminOnly: true`로 관리자 전용 표시 가능.
- **딥링크** — `useSettingsUi().openSettings("탭id")` 또는 URL `?settings=탭id`. 마지막 탭은 자동 기억된다.

## 6. 백엔드 연동 (`showcase` 선택 예제)

- **규약**: 프론트는 동일 오리진 `/api/*`만 호출 (dev는 vite 프록시 → :8000, 배포는 리버스 프록시).
- `apiFetch<T>(path, init?)` (`@/lib/api`) — JSON·에러 정규화(`ApiError{status,message}`).
- **SSE**: `subscribeSse(path, { onMessage, onError, onOpen })` → 해제 함수 반환. 로그 뷰어는 `<LogStreamPanel path="/api/jobs/j1/logs" />` 재사용 (자동 스크롤·연결 배지·재연결 내장).
- **서버 확장**: `server/main.py`에 엔드포인트 추가. 골격 제공분 — `/api/system`(설정 시스템 탭 페어), `/api/jobs`, SSE 데모. 경로 파라미터를 SSE에 반영할 땐 골격의 새니타이즈 패턴을 따를 것. 인증은 미포함(LAN 단일 유저 전제) — 외부 노출 시 인증 미들웨어 필수.

## 7. 디자인 커스텀

### 7.1 원칙 — 값은 토큰으로, 코드는 건드리지 않는다

모든 색·폰트·라운드·그림자는 `design-system/rootage/`의 YAML이 단일 원천이고 CSS는 생성물이다. **컴포넌트 코드 수정 없이** YAML만 바꾸면 전체가 따라온다.

```bash
npm run tokens        # YAML → src/generated/tokens.css 재생성
npm run contrast      # WCAG 대비 검증 — 전 프리셋 × 라이트/다크 (실패 시 exit 1)
```

### 7.2 색 바꾸기 (현재 프리셋 직접 수정)

`design-system/rootage/presets/<프리셋>/color.yaml`의 값 교체 → `npm run tokens`. 팔레트 층(`$color.palette.*`)이 실제 값이고, 시맨틱 층(`$color.semantic.*`)은 팔레트 참조라 보통 손댈 필요 없다. 다크 값은 `theme-dark` 키 — 도출 규칙 R1~R6이 파일 헤더에 있다. 수정 후 반드시 `npm run contrast`.

### 7.3 고객사 브랜드 프리셋 만들기 (권장 방식)

절차는 데모의 **파운데이션 → 브랜드 프리셋** 페이지에도 요약돼 있다.

```bash
npm run preset -- acme            # ① 스캐폴드 — 기본(toast) 복제. --from=claude로 원본 변경 가능
# ② acme/color.yaml 필수 원값 교체 — primary 계열·서피스 2톤(white/base-bg)·잉크(neutral-black)·상태 3색 먼저.
#    -bg 틴트·카테고리 8색(third)·다크 값은 파생 가능 — 다크 도출 규칙 R1~R6은 color.yaml 헤더 참조.
#    토큰 이름은 그대로(파리티) — 슬롯을 빠뜨리면 코드젠이 에러로 잡는다. acme/font.yaml은 7.4.
npm run tokens && npm run contrast   # ③ 게이트 — 파리티 + 전 프리셋 × 양 모드 WCAG (미달 값은 동계열 심화, YAML 주석에 근거)
# ④ 눈 검증 — runtimeBrands 상태에서 설정 → 모양 → 브랜드로 전환해 갤러리 전체를 훑는다
```

입력 소스는 **용도가 라벨링된 hex**(캔버스·액센트·상태…)와 폰트 woff2+라이선스가 최선이다 — 용도 불명 색상표·스크린샷은 매핑 판단이 개입돼 정확도가 떨어진다.

적용 3경로:

| 방식 | 방법 | 용도 |
| --- | --- | --- |
| 서비스 고정 | `toastfy.config.json`의 `"preset": "acme"` → `npm run tokens` | 고객사 납품 빌드 |
| 생성 시점 | `create-service.mjs <이름> --preset=acme` | 고객사 앱 신규 생성 |
| 런타임 전환 | `toastfy.config.json`에 `"runtimeBrands": true`(또는 `npm run tokens -- --all-brands`) → 설정 → 모양 → **브랜드** 피커, 코드에서는 `useBrandStore().setBrand("acme")` — `dataset.brand` 직접 조작 금지 | 멀티테넌트·데모·프리셋 비교 검토 |

주의 — JS에서 색을 하드코딩하면(차트 옵션 등) 런타임 전환을 추종하지 못한다. 차트 색은 `useChartColors()` 훅(8장)으로 토큰을 읽어 쓸 것. 등록된 프리셋·활성 폰트는 데모의 **브랜드 프리셋**·**타이포그래피** 페이지에 표시된다(`src/generated/brands.json` 매니페스트 소비).

### 7.4 폰트 교체

`presets/<프리셋>/font.yaml` — `face.*` 하나면 단일 폰트, `face2.*`를 추가하면 두 번째 `@font-face`가 나와 **라틴+CJK 페어**(예: claude 프리셋 = Inter 라틴 서브셋 + SUIT 한글 폴백)를 구성할 수 있다. `family.base`의 나열 순서가 곧 폴백 순서다:

```yaml
$font.family.base: { values: { default: '"MyFont Variable", system-ui, sans-serif' } }
$font.face.family: { values: { default: "MyFont Variable" } }
$font.face.src:    { values: { default: "../assets/fonts/MyFont-Variable.woff2" } }
$font.face.weight: { values: { default: "100 900" } }
```

woff2를 `src/assets/fonts/`에 넣고 `npm run tokens` — @font-face까지 생성된다. 시스템 폰트만 쓰려면 `face.*` 세 항목을 삭제하면 된다. 폰트 라이선스 파일을 함께 두는 것(기본 SUIT는 OFL 1.1)을 권장.

### 7.5 타이포·라운드·그림자·치수

공통 구조 토큰은 프리셋 밖 — `rootage/typography.yaml`(typo 19종), `radius.yaml`(control 10 · panel 20 · card 30), `shadow.yaml`, `dimension.yaml`. 이들은 **전 프리셋 공통**이다(브랜드는 색·폰트만 다르다는 설계). 그림자 hover는 `color-mix(primary-light)` 참조라 브랜드를 자동 추종한다.

### 7.6 컴포넌트 겉모습 커스텀 (ds 무수정 원칙)

- 1순위: 컴포넌트의 `className` prop + `cn()` — tailwind-merge가 충돌 클래스를 교체해준다.
- 2순위: 서비스 컴포넌트로 감싸기 (`src/app/` 또는 `src/pages/` 아래 조합 컴포넌트).
- 금지: `src/ds/**` 직접 수정 — sync 충돌의 근원. 정말 DS 자체의 개선이면 **템플릿 저장소에서 고치고** 각 서비스는 `npm run sync`로 수신한다.
- 색 클래스 선택 기준 — 신규 코드는 시맨틱(`bg-surface`·`text-fg`·`border-line`·`bg-accent-bg`…) 우선. 라이트 모드에서 `accent`·`caution`은 소형 텍스트 단독 사용 금지(브랜드 정본 대비 예외 — 텍스트는 `primary-dark`, caution은 배지 패턴).

## 8. DS 업데이트 수신 (`--managed` 서비스만)

템플릿(디자인 시스템)이 개선되면 각 서비스에서:

```bash
npm run sync                 # 드라이런 — 갱신/충돌/로컬 추가/의존성 드리프트 보고
npm run sync -- --apply      # 적용 (서비스가 수정한 DS 파일은 충돌로 보존됨)
npm run sync -- --apply --force   # 충돌 파일까지 템플릿으로 덮어쓸 때만
npm run tokens && npm run typecheck   # 적용 후 확인 (권장)
```

3-way 판정 기준선은 `.toastfy-sync.json`(커밋 대상). "충돌"은 서비스가 그 파일을 직접 수정했다는 뜻 — 2절의 소유 규약을 지켰다면 발생하지 않는다. 의존성 변경은 자동 반영하지 않고 보고만 하므로 package.json은 수동 갱신.

## 9. 품질 게이트 · 출시 전 체크리스트

```bash
npm run typecheck   # 타입 (strict)
npm run build       # 토큰 + 타입 + 번들
npm run contrast    # 색 접근성 (전 프리셋)
npm run i18n:check  # showcase/i18n 사용 서비스만 — ko/en 키 패리티
```

- [ ] 새 컴포넌트·변형을 만들었다면 디자인 카탈로그(`src/pages/design/` 해당 카테고리 페이지)에 등재했는가 (완료 기준)
- [ ] 문자열을 셸·설정·공통 영역에 추가했다면 ko/en 모두 넣었는가
- [ ] 색을 바꿨다면 contrast 통과·다크모드 육안 확인을 했는가
- [ ] DS 소유 경로를 건드리지 않았는가 (`npm run sync` 드라이런이 충돌 0인가)
- [ ] 백엔드를 외부에 노출한다면 인증을 붙였는가

## 10. 트러블슈팅

| 증상 | 원인·해법 |
| --- | --- |
| 토큰을 바꿨는데 화면 그대로 | `npm run tokens` 미실행 — `npm run dev`는 시작 시 1회만 생성한다. 재실행 또는 dev 재시작 |
| `프리셋 "x" 토큰 불일치 — 누락:[…]` | 프리셋 폴더의 토큰 이름 집합이 기본(toast)과 다름 — 이름은 유지하고 값만 교체 |
| 설정 → 시스템 탭이 에러 | 백엔드 미기동 — 1절의 uvicorn 명령 실행 (재시도 버튼으로 복구) |
| 폰트가 안 바뀜 | woff2 경로(`../assets/fonts/…`)·`face.family`와 `family.base`의 이름 일치 확인 후 `npm run tokens` |
| 런타임 브랜드 전환이 일부만 적용 | `--all-brands`로 빌드했는지 확인. 그래도 남으면 JS 하드코딩 색 — 7.3 주의 참조 |
| sync가 온통 충돌 | `.toastfy-sync.json`(기준선) 삭제·유실 여부 확인 — 기준선 없으면 보수적으로 전부 충돌 처리된다. 템플릿에서 `--write-baseline` 재기록 가능 |
| 모달이 안 뜸 | `index.html`의 `<div id="modal">` 포탈 확인 (템플릿 기본 포함 — 커스텀 html로 교체했다면 복원) |
| 캘린더 두 달이 세로로 쌓임 | 컨테이너 폭 부족 — 기본 셀 크기 기준 두 달에 약 700px 필요. `className="w-[720px]"` 지정 |
