// 소개(Get Started) - subBase 카탈로그와 기반인 Toastfy 사용 안내.
import { getAppIcon, type appIcon } from "@/ds/icons";
import Badge from "@/ds/ui/Badge";

interface Feature {
  icon: appIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: "OL_SPARKLES",
    title: "파운데이션",
    desc: "브랜드 프리셋, 시맨틱 색상, 타이포 19종과 아이콘 레지스트리를 확인합니다.",
  },
  {
    icon: "OL_TABLE_CELLS",
    title: "컴포넌트 카탈로그",
    desc: "버튼·입력부터 오버레이·검색·테이블까지 실제 동작과 사용 형태를 살펴봅니다.",
  },
  {
    icon: "OL_CURSOR_ARROW_RAYS",
    title: "적용 예시",
    desc: "컴포넌트 조립, ECharts, API와 SSE를 함께 사용하는 showcase 전용 레퍼런스입니다.",
  },
];

const PROFILES = [
  {
    name: "minimal",
    badge: "기본",
    fit: "랜딩·도구·제품 UI를 처음부터 구성할 때",
    includes: "토큰 · 라이트/다크 테마 · 핵심 버튼/입력/모달/상태 UI",
    excludes: "라우터 · 사이드바 · 백엔드 · i18n · 차트 제외",
    command: "node scripts/create-service.mjs my-app",
  },
  {
    name: "admin",
    badge: "관리 도구",
    fit: "인프라 체커·운영 콘솔처럼 내비게이션과 데이터 UI가 필요할 때",
    includes: "minimal + 얇은 사이드바/라우터 + 테이블/필터/페이지네이션",
    excludes: "인증 · API · 백엔드 · i18n · 차트 제외",
    command: "node scripts/create-service.mjs runtime-checker --profile=admin",
  },
  {
    name: "showcase",
    badge: "전체 예제",
    fit: "Toastfy의 전체 구성과 ML 연동 예제를 검토할 때",
    includes: "전체 카탈로그 · 설정 · i18n · ECharts · npm run dev로 FastAPI/SSE 동시 실행",
    excludes: "제품 시작점이 아니라 DS 검토·레퍼런스 용도",
    command: "node scripts/create-service.mjs toastfy-demo --profile=showcase",
  },
];

const START_STEPS = [
  {
    title: "Toastfy 저장소에서 프로필을 선택해 생성",
    command: "cd /home/maumai/toastfy\nnode scripts/create-service.mjs runtime-checker --profile=admin",
    description: "대상 경로를 생략하면 Toastfy 저장소의 상위 디렉터리에 서비스 폴더가 만들어집니다.",
  },
  {
    title: "생성된 서비스로 이동해 개발 서버 실행",
    command: "cd ../runtime-checker\nnpm run dev",
    description: "의존성은 생성 과정에서 설치됩니다. 기본 개발 서버는 Vite의 5173 포트를 사용합니다.",
  },
  {
    title: "서비스 화면·메뉴를 교체",
    command: "# admin 프로필\nsrc/pages/HomePage.tsx\nsrc/app/nav-config.ts\nsrc/main.tsx",
    description: "HomePage에 첫 화면을 만들고 nav-config와 main.tsx에 메뉴·라우트를 함께 추가합니다.",
  },
  {
    title: "변경 사항 검증",
    command: "npm run typecheck\nnpm run contrast\nnpm run build",
    description: "토큰 생성·타입 검사·프리셋 대비·프로덕션 번들을 확인한 뒤 서비스 기능을 확장합니다.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="mx-auto flex max-w-[1040px] flex-col gap-12 px-8 py-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-control bg-primary text-white typo-bold_P">sB</span>
          <h1 className="typo-bold_h2 text-fg">subBase</h1>
          <Badge name={`v${__APP_VERSION__}`} className="border border-accent/30 bg-accent-bg text-accent" />
        </div>
        <p className="max-w-[780px] typo-regular_smalllP text-fg-muted">
          Figma의 subBase 원본을 최신 Toastfy 구조에 맞춰 구현한 디자인 시스템입니다. Principles부터 Foundations,
          Components, Patterns, Best Practices까지 실제 동작하는 카탈로그로 확인할 수 있습니다.
        </p>
      </header>

      <section className="flex flex-col divide-y divide-line/60">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              {getAppIcon(feature.icon, { size: 20, colorClass: "text-accent" })}
              <h2 className="typo-bold_P text-fg">{feature.title}</h2>
            </div>
            <p className="mt-2 typo-regular_smalllP text-fg-muted">{feature.desc}</p>
          </article>
        ))}
      </section>

      <section id="new-service" className="flex scroll-mt-20 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="typo-bold_h3 text-fg">새 서비스 시작 가이드</h2>
          <p className="typo-regular_smalllP text-fg-muted">
            먼저 모든 서비스에 공통으로 필요한 범위를 선택합니다. 처음부터 빼야 할 기능이 가장 적은 프로필이 좋은 출발점입니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
          {PROFILES.map((profile) => (
            <article key={profile.name} className="flex flex-col gap-3 rounded-panel border border-line bg-surface px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-[15px] font-bold text-fg">{profile.name}</h3>
                <Badge name={profile.badge} className="border border-accent/30 bg-accent-bg text-accent" />
              </div>
              <p className="typo-semiBold_caption text-fg">{profile.fit}</p>
              <div className="flex flex-col gap-1">
                <p className="typo-regular_caption text-fg-muted">포함: {profile.includes}</p>
                <p className="typo-regular_caption text-fg-subtle">{profile.excludes}</p>
              </div>
              <code className="mt-auto overflow-x-auto whitespace-nowrap rounded-control bg-neutral-lightGray px-3 py-2 typo-regular_overline text-fg">
                {profile.command}
              </code>
            </article>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-line/60 rounded-panel border border-line bg-surface px-6">
          {START_STEPS.map((step, index) => (
            <div key={step.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-5">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent-bg typo-bold_caption text-accent">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="typo-semiBold_smalllP text-fg">{step.title}</h3>
                <pre className="scrollbar-default overflow-x-auto rounded-control bg-neutral-lightGray px-4 py-3 font-mono text-[12px] leading-relaxed text-fg">
                  <code>{step.command}</code>
                </pre>
                <p className="typo-regular_caption text-fg-subtle">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
          <div className="rounded-panel border border-line bg-surface px-5 py-4">
            <h3 className="typo-semiBold_smalllP text-fg">브랜드 프리셋 지정</h3>
            <p className="mt-1 typo-regular_caption text-fg-muted">
              생성할 때 <code className="text-accent">--preset=이름</code>을 추가하거나, 생성 후{" "}
              <code className="text-accent">toastfy.config.json</code>의 preset을 바꾸고{" "}
              <code className="text-accent">npm run tokens</code>를 실행합니다.
            </p>
          </div>
          <div className="rounded-panel border border-line bg-surface px-5 py-4">
            <h3 className="typo-semiBold_smalllP text-fg">DS 소유 방식</h3>
            <p className="mt-1 typo-regular_caption text-fg-muted">
              기본은 copy-once라 생성 직후 서비스가 전부 소유합니다. Toastfy의 토큰·DS 코어 업데이트를 계속 받을 서비스만{" "}
              <code className="text-accent">--managed</code>를 추가합니다.
            </p>
          </div>
          <div className="rounded-panel border border-line bg-surface px-5 py-4">
            <h3 className="typo-semiBold_smalllP text-fg">전체 showcase 실행</h3>
            <p className="mt-1 typo-regular_caption text-fg-muted">
              showcase의 <code className="text-accent">npm run dev</code>는 Vite(:5173)와 FastAPI/SSE(:8000)를 함께
              시작합니다. 백엔드 없이 카탈로그만 볼 때는 <code className="text-accent">npm run dev:frontend</code>를
              사용합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="typo-bold_P text-fg">문서</h2>
        <div className="flex flex-col gap-1.5 rounded-panel border border-line bg-surface px-6 py-4">
          <p className="typo-regular_smalllP text-fg-muted">
            <span className="typo-semiBold_smalllP text-fg">개발 매뉴얼</span>: docs/MANUAL.md · 프로필 선택·화면
            추가·디자인 커스텀·managed DS 동기화
          </p>
          <p className="typo-regular_smalllP text-fg-muted">
            <span className="typo-semiBold_smalllP text-fg">디자인 가이드</span>: design-system/GUIDE.md · 토큰
            규칙·색 사용 기준·이식 규칙·피그마 매핑 표
          </p>
          <p className="typo-regular_smalllP text-fg-muted">
            <span className="typo-semiBold_smalllP text-fg">버전 히스토리</span>: CHANGELOG.md 또는 사이드바 업데이트
          </p>
        </div>
      </section>
    </main>
  );
}
