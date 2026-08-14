# Toastfy 디자인 가이드

이 디렉터리가 디자인 시스템의 단일 원천이다. 토큰 값은 `rootage/*.yaml`에만 존재하고, CSS는 전부 생성물이다.

## 원천과 정본

| 층 | 정본 | 근거 |
| --- | --- | --- |
| 라이트 팔레트 | 피그마 "Toaster 디자인 가이드" = 제품 colors.ts (100% 일치 확인 2026-08-11) | `rootage/color.yaml` |
| 다크 팔레트 | 자체 설계 (규칙 R1~R6, WCAG 검증) | `color.yaml` 헤더 + `npm run contrast` |
| 타이포 | 제품 typo-* 15종 + 디스플레이 4종 신설(피그마 실사용 유래), 폰트 SUIT | `rootage/typography.yaml` |
| success 계열 | 신설 (가이드에 없음 — ML 도구 요구, AutoJudge 그린 계승) | `color.yaml` 주석 |
| 치수·라운드·그림자 | 제품 tailwind.config.js | `dimension.yaml`·`radius.yaml`·`shadow.yaml` |

## 파이프라인 · 브랜드 프리셋

```text
rootage/
├── typography·radius·dimension·shadow.yaml      공통 구조 토큰
└── presets/<브랜드>/ color.yaml · font.yaml     브랜드 프리셋 (고객사 추가 = 폴더 1개)
        │
        └─(npm run tokens [-- --preset=X | --all-brands])──▶ src/generated/tokens.css + brands.json
              ├─ @font-face          (프리셋 font.yaml의 face.* — face2가 있으면 라틴+CJK 2폰트 페어)
              ├─ :root / .dark       기본 프리셋 변수 (--tk-*)
              ├─ [data-brand="X"]    타 프리셋 스코프 (런타임 전환용 — --all-brands 또는 config runtimeBrands)
              ├─ @theme inline       Tailwind v4 유틸 매핑
              └─ @utility typo-*     타이포 유틸
```

- 토큰 추가·변경은 YAML만 수정 → `npm run tokens`. `src/generated/`는 손대지 않는다.
- **프리셋 선택** — 서비스 `toastfy.config.json`의 `"preset"` (스캐폴드 `--preset`으로 지정) 또는 `npm run tokens -- --preset=이름`. 고객사 프리셋 추가는 `npm run preset -- <이름>`(기본 프리셋 복제 스캐폴드) 후 값 교체 — 토큰 이름 집합이 다르면 코드젠이 에러로 잡는다. 필수 원값은 primary 계열·서피스 2톤·잉크·상태 3색이고 나머지(-bg 틴트·third 8색·다크)는 파생 가능 — 절차는 MANUAL 7.3·데모 "브랜드 프리셋" 페이지.
- **런타임 브랜드 전환**(멀티테넌트·데모용) — `toastfy.config.json`에 `"runtimeBrands": true`(또는 `--all-brands`)로 빌드하면 전 프리셋 스코프가 생성되고, **설정 → 모양 → 브랜드** 피커로 즉시 전환된다. 상태는 `ds/providers/brand-store.ts`(zustand, `localStorage toastfy.brand`, 기본 프리셋이면 `data-brand` 속성 제거) — 직접 `dataset.brand`를 만지지 말고 `useBrandStore().setBrand()`를 쓴다. 다크모드와 동일한 CSS 변수 스코프 메커니즘이라 `.dark[data-brand="X"]` 조합도 성립. 코드젠이 함께 내는 `src/generated/brands.json`(`{default, runtime, brands}`)이 피커의 데이터 소스다. `runtimeBrands: false`면 스코프가 없어 전환이 무효 — 피커는 비활성 + 안내를 표시한다(컨트롤 상시 렌더 원칙). 차트 등 JS 하드코딩 색은 추종하지 않음 — `useChartColors()` 훅 사용(GUIDE "차트" 절).
- 색 변경·프리셋 추가 시 `npm run contrast` — **전 프리셋 × 양 모드**를 순회해 WCAG 기준 미달을 등록 시점에 잡는다 (실패 시 exit 1).
- 유틸리티 이름 매핑은 `scripts/build-tokens.mjs`의 `THEME_MAP` 단일 지점.
- 그림자 hover 글로우는 `color-mix(var(--tk-color-palette-primary-light))` 참조라 프리셋을 자동 추종한다.

## DS 소유 경계와 업데이트 동기화

서비스는 **DS 소유 경로를 직접 수정하지 않는 것**이 기본 규약이다 — 그래야 `npm run sync`로 DS 업데이트를 무마찰 수신한다.

| DS 소유 (sync 대상) | 서비스 소유 (sync 불가침) |
| --- | --- |
| `design-system/` (rootage 공통·scripts·GUIDE) | `src/app/` `src/pages/` (nav-config·settings-config 포함) |
| `src/ds/**` | `src/i18n/locales/` (서비스 키 추가 지점) |
| `src/lib/api.ts` · `src/i18n/index.ts`·`check-parity.ts` | `server/` · `index.html` · `vite.config.ts` · `main.tsx` |
| `src/index.css` · `src/vite-env.d.ts` | `toastfy.config.json` · 서비스가 추가한 프리셋 폴더 |

- **동기화 절차** — 서비스에서 `npm run sync`(드라이런) → `npm run sync -- --apply`. 3-way 판정: 서비스가 안 건드린 파일만 갱신되고, 수정한 파일은 충돌로 보존된다(`--force`로 덮어쓰기 가능). 기준선은 `.toastfy-sync.json`(스캐폴드가 생성). 적용 후 `npm run tokens && npm run typecheck` 권장.
- 의존성 변경은 자동 반영하지 않고 드리프트만 보고한다 — package.json은 수동 갱신.

## 색 사용 규칙

- **신규 코드는 시맨틱 롤 우선**: `bg-surface` `bg-surface-page` `text-fg` `text-fg-muted` `text-fg-subtle` `border-line` `bg-accent` `bg-accent-bg` `text-danger` `bg-danger-bg` `text-success` `bg-success-bg`. 다크모드는 토큰 층에서 자동 전환된다 — 컴포넌트에 `dark:` 분기를 넣지 않는 것이 기본.
- **팔레트 직결 클래스**(`bg-primary`, `text-neutral-darkGray`, `bg-semantic-errorBg` …)는 제품 코드 이식 호환층. 이식할 때는 유지하고, 새로 쓸 때는 시맨틱이 없는 경우만.
- **브랜드 예외 (라이트 모드)**: `accent`(2.77:1)·`caution`(2.10:1)은 흰 배경 위 소형 텍스트 단독 사용 금지 — 제품 브랜드 정본이라 값을 바꾸지 않는다. 텍스트가 필요하면 accent는 `primary-dark`(3.37:1), caution은 배지(cautionBg 배경) 패턴으로. `npm run contrast`가 이 예외를 NOTE로 표기한다.

## 차트

- **기본 엔진 = echarts** (`ds/ui/EChart` 래퍼 — 수명주기·리사이즈·다크 테마 캡슐화). 대용량·실시간 라인이 중심인 ML 도구 용도 기준.
- **recharts는 선택 의존** — 소량 정적 차트 중심 서비스는 `npm i recharts` 후 바로 사용 (선언형이라 래퍼 불요, DS와 충돌 없음). 엔진 선택은 config 분기가 아니라 **서비스의 import 선택**이다.
- **차트 색은 반드시 `useChartColors()`** (`ds/hooks/useChartColors`) — 토큰을 런타임에 읽고 다크모드·`data-brand` 전환에 반응한다. JS 하드코딩 색은 브랜드를 추종하지 못하므로 금지. 알파는 `withAlpha(hex, a)`.

```tsx
const colors = useChartColors();
// echarts
<EChart option={{ series: [{ type: "line", lineStyle: { color: colors.primary },
  areaStyle: { color: withAlpha(colors.primary, 0.08) } }] }} />
// recharts (선택 의존 설치 후)
<LineChart data={data}><Line stroke={colors.primary} dot={false} />
  <CartesianGrid stroke={colors.line} /></LineChart>
// 카테고리 시리즈는 colors.series (팔레트 third 1~8)
```

## 타이포 규칙 (제품 규칙 계승)

- 타이포는 **`typo-*`만** 사용한다. `text-*`는 색상 전용 (tailwind-merge 충돌 그룹 분리 — `lib/cn.ts`가 보장).
- 클래스 병합은 **반드시 `cn()`** (clsx·twMerge 직접 호출 금지, 단일 문자열 제외).
- px 단위 규약 유지 (rem 금지 — 제품 규칙).

## 아이콘 규칙 (제품 규칙 계승)

- 아이콘 렌더링은 **반드시 `getAppIcon(키, { size, colorClass })`** (`src/ds/icons.tsx`). react-icons 직접 import 금지.
- **서비스 고유 아이콘은 `src/app/service-icons.ts`에 등록** — `ds/icons.tsx`(DS 소유)는 수정하지 않는다. 두 맵이 병합되고 타입도 합쳐지므로 `getAppIcon("내키")`가 그대로 동작하며, DS 동기화 때 충돌하지 않는다.

## 컴포넌트 이식 규칙 (TOAST asset → ds/ui)

public API(props·이름·기본값) 불변. 클래스 리매핑은 아래 표만 적용, 그 외 무변경.

| 원본 (v3) | 이식 (v4 + 토큰) |
| --- | --- |
| `bg-white` | `bg-surface` |
| `text-neutral-black` / `-darkGray` / `-darkMiddleGray` | `text-fg` / `text-fg-muted` / `text-fg-subtle` |
| `border-semantic-lineGray` | `border-line` |
| 호버·선택 틴트 `bg-primary-bg` | `bg-accent-bg` |
| `text-semantic-error` / `bg-semantic-errorBg` | `text-danger` / `bg-danger-bg` |
| `rounded-lgx` / `-2.5xl` / `-3.75xl` | `rounded-control` / `rounded-panel` / `rounded-card` |
| 커스텀 치수 키 (`min-w-button` 등) | arbitrary px + 원 키 주석 (값은 `dimension.yaml`) |
| `tailwind-styled-components` | 일반 컴포넌트로 (클래스 문자열 보존) |
| `typo-*` `scrollbar-*` `shadow-basic/hover/shadow1` 팔레트 직결 | 무변경 |

- 발췌본에 없는 의존은 사용부 계약 기반 최소 재구현 + 파일 헤더에 명기.
- 이식·신규 컴포넌트는 **디자인 카탈로그(`src/pages/design/` 카테고리 페이지)에 등재해야 완료** — 카탈로그가 육안 검증 수단이다.

## 다크모드

- 전환 = `documentElement`에 `.dark` 클래스 (커스텀 변형 `@custom-variant dark`). seed 벤더링 컴포넌트 사용 시 `data-seed-color-mode`도 함께 세팅 (테마 스토어 담당 — 3단계).
- 다크 값 조정은 `color.yaml`의 theme-dark만. 규칙 R1~R6(헤더) 위반 여부는 `npm run contrast`로 확인.

## 부록 — 원천 값 ↔ 코드 토큰 1:1 매핑 표

라이트 = 피그마 "Toaster 디자인 가이드" 정본(제품 colors.ts와 100% 일치 확인). 다크 = 자체 설계 정본(R1~R6).

| 원천 이름 (피그마/제품) | rootage 토큰 | 라이트 | 다크 | Tailwind 유틸 |
| --- | --- | --- | --- | --- |
| White | `$color.palette.white` | `#FFFFFF` | `#1F2125` | `*-white` (시맨틱: `*-surface`) |
| Primary | `$color.palette.primary` | `#FF6E4D` | `#FF6E4D` | `*-primary` / `*-accent` |
| PrimaryDark | `$color.palette.primary-dark` | `#FF4920` | `#FF5C38` | `*-primary-dark` |
| PrimaryLight / Sub | `$color.palette.primary-light`·`sub` | `#FFB3A2` | `#E09580` | `*-primary-light`·`*-sub` |
| PrimaryLightBg | `$color.palette.primary-light-bg` | `#FFEDE6` | `#3A2A24` | `*-primary-lightBg` |
| PrimaryBg | `$color.palette.primary-bg` | `#FFFAF6` | `#2B2320` | `*-primary-bg` / `*-accent-bg` |
| Gradient end | `$color.palette.primary-gradient-end` | `#FF7E61` | `#FF7E61` | (그라디언트 조합용) |
| Sub 1~8 | `$color.palette.third-1..8` | `#FFC516` `#16B5FF` `#0A77AA` `#EE6A78` `#EE8D98` `#FF4920` `#26D4C5` `#4D53FF` | 3→`#2E9CD4` 6→`#FF6242` 8→`#7A7FFF` 나머지 동일 | `*-third-N` |
| Black~LightGray | `$color.palette.neutral-*` | `#222222` `#555555` `#888888` `#AAAAAA` `#EEEEEE` `#F4F4F4` | `#E9EAEC` `#C6C8CC` `#9A9DA5` `#6B6E76` `#2E3036` `#26282D` | `*-neutral-*` (시맨틱: fg/fg-muted/fg-subtle) |
| Error / ErrorBg | `$color.palette.error`·`error-bg` | `#CF2600` `#FFEBE6` | `#F65238` `#3B211C` | `*-semantic-error(Bg)` / `*-danger(-bg)` |
| Caution / CautionBg | `$color.palette.caution`·`caution-bg` | `#E6A832` `#FCF6EA` | `#E9B44A` `#322C1E` | `*-semantic-caution(Bg)` |
| LineGray | `$color.palette.line-gray` | `#DBDBDB` | `#383B42` | `*-semantic-lineGray` / `*-line` |
| Bg | `$color.palette.base-bg` | `#F8F8F8` | `#17181B` | `*-semantic-bg` / `*-surface-page` |
| (신설) Success / SuccessBg | `$color.palette.success`·`success-bg` | `#0B7A52` `#E6F6EE` | `#34C08D` `#1E3226` | `*-semantic-success(Bg)` / `*-success(-bg)` |
| Shadow Basic/Hover/1 | `$shadow.basic`·`hover`·`shadow1` | 제품 원본 | 블랙 알파 강화 | `shadow-basic`·`shadow-hover`·`shadow-shadow1` |
| Radius 10/20/30 | `$radius.control`·`panel`·`card` | `10px`·`20px`·`30px` | 동일 | `rounded-control`·`panel`·`card` |
| 폰트 | — | SUIT Variable (셀프호스팅) | 동일 | `font-family` 기본 |
| typo 스케일 | `$typography.*` | 제품 15종 + 디스플레이 4종(피그마 실사용) | 동일 | `typo-*` 19종 |

버튼 사이즈(`src/ds/lib/button-styles.ts`)는 피그마 실측 재구성 — default 110×42 · small 90×36 · fit 콘텐츠×32 · full 전폭 (제품 constants 원본 수신 시 대조).

## seed-design 벤더링 (기초 프리미티브 보조)

- 방침: 제품 룩 컴포넌트는 TOAST 이식이 기본, seed는 TOAST에 없는 폼 접근성 계열(체크박스 그룹·필드셋 등) 보조.
- 절차: `seed-design.json` 작성(비대화형) → `npx @seed-design/cli add ui:<이름>` → 스니펫이 `src/seed/`로 소유권 이전 → 브랜드 변수 리매핑(`--seed-color-bg-brand-solid: var(--tk-color-palette-primary)` 패턴). PoC 검증 절차는 `../../poc/FINDINGS.md`.
