import { PageShell, Panel } from './shared';
import keyFeature from '@/assets/figma/common-key-feature.png';
import art from '@/assets/figma/common-art.png';
import placeholder from '@/assets/figma/common-placeholder.png';

const brand = [
  ['400', '#1C6BFF'], ['600', '#244BD7'], ['300', '#E1EBFF'], ['200', '#EBF1FD'],
] as const;
const state = [
  ['Green', '#00BB2A'], ['Yellow', '#F9A80C'], ['Orange', '#FF881A'], ['Red', '#EE4700'],
] as const;
const neutral = [
  ['900', '#222222'], ['800', '#434855'], ['700', '#5F646F'], ['600', '#9397A1'],
  ['500', '#ABB0B9'], ['400', '#C5C8CE'], ['200', '#E2E5EB'], ['150', '#EBEEF1'],
  ['100', '#F2F4F8'], ['50', '#FBFBFD'], ['20', '#FDFDFE'], ['0', '#FFFFFF'],
] as const;

type ColorToken = readonly [name: string, value: string];

const colorTokens: readonly { title: string; tokens: readonly ColorToken[] }[] = [
  {
    title: 'Text',
    tokens: [
      ['primary', '#222222'], ['secondary', '#5F646F'], ['tertiary', '#9397A1'],
      ['disabled', '#C5C8CE'], ['ghost', '#ABB0B9'], ['emphasis', '#1C6BFF'],
      ['danger', '#EE4700'], ['warning', '#FF881A'], ['caution', '#F9A80C'],
      ['success', '#00BB2A'], ['invert', '#FFFFFF'],
    ],
  },
  {
    title: 'Surface',
    tokens: [
      ['primary', '#1C6BFF'], ['secondary', '#EBF1FD'], ['tertiary', '#F2F4F8'],
      ['disabled', '#FBFBFD'], ['ghost', '#FBFBFD'], ['base', '#FFFFFF'],
      ['danger', '#EE4700'], ['warning', '#FF881A'], ['caution', '#F9A80C'],
      ['success', '#00BB2A'], ['track', '#EBEEF1'], ['invert', '#222222'],
    ],
  },
  {
    title: 'Surface Pressed',
    tokens: [['primary', '#244BD7'], ['secondary', '#E1EBFF'], ['tertiary', '#EBEEF1']],
  },
  {
    title: 'Border',
    tokens: [
      ['primary', '#E2E5EB'], ['secondary', '#EBEEF1'], ['ghost', '#EBEEF1'],
      ['emphasis', '#1C6BFF'], ['danger', '#EE4700'], ['warning', '#FF881A'],
      ['caution', '#F9A80C'], ['success', '#00BB2A'],
    ],
  },
  {
    title: 'Icon',
    tokens: [
      ['primary', '#222222'], ['secondary', '#5F646F'], ['tertiary', '#9397A1'],
      ['disabled', '#C5C8CE'], ['ghost', '#E2E5EB'], ['emphasis', '#1C6BFF'],
      ['danger', '#EE4700'], ['invert', '#FFFFFF'],
    ],
  },
];

const Swatches = ({ values }: { values: readonly (readonly [string, string])[] }) => (
  <div className="flex flex-wrap gap-5">
    {values.map(([label, color]) => (
      <div key={label} className="w-[76px]">
        <div className="size-[60px] rounded-control border border-black/5" style={{ backgroundColor: color }} />
        <p className="mt-2 text-sm font-semibold text-fg">{label}</p>
        <code className="text-[11px] text-fg-subtle">{color}</code>
      </div>
    ))}
  </div>
);

export function GridPage() {
  return <PageShell title="Grid & Vertical Rhythm" note="Figma 30:4074"><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[30px] text-fg-muted">그리드와 버티컬리듬은 화면상에 요소들이 어디에 위치할지 결정합니다. 8dp 구성을 기본으로 하지만 수치의 일관성보다 시각적 보정이 우선되며, 이를 위해 짝수 값을 모두 사용할 수 있습니다.</p></Panel><Panel><p className="mb-6 max-w-3xl text-base leading-[30px] text-fg-muted">정보의 우선순위, 요소의 크기와 간격을 결정할 때 Perfect Fourth, Golden Ratio 등 잘 알려진 비율을 활용해 리듬감을 구성합니다.</p><div className="grid grid-cols-2 gap-8"><div><strong>4:3</strong><div className="mt-3 aspect-[4/3] border border-primary bg-primary-bg p-4"><div className="h-1/4 bg-primary/20"/><div className="mt-4 h-1/2 bg-white"/></div><p className="mt-2 text-sm text-fg-muted">제목 22 · 본문 16</p></div><div><strong>3:4</strong><div className="mt-3 mx-auto aspect-[3/4] max-h-64 border border-primary bg-primary-bg p-4"><div className="h-1/4 bg-primary/20"/><div className="mt-4 h-1/2 bg-white"/></div><p className="mt-2 text-sm text-fg-muted">16 · 8 rhythm</p></div></div></Panel></div></PageShell>;
}

export function ElevationPage() {
  const levels = [
    ['1', 'Component', '0 1px 2px rgba(107,110,116,.04)'],
    ['10', 'Card', '0 0 16px rgba(107,110,116,.04)'],
    ['20', 'Popup', '0 0 16px rgba(107,110,116,.16)'],
    ['50', 'Navigation', '0 0 40px rgba(107,110,116,.10)'],
    ['100', 'Dialog', '0 0 30px rgba(107,110,116,.20)'],
  ] as const;
  return <PageShell title="Elevation & Shadow" note="Figma 30:4171 · 54:2982"><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[30px] text-fg-muted">화면의 모든 요소는 접근성 중요도, 요소간 관계와 파생 위치를 고려해 Z축을 따라 쌓입니다. 정면 광원을 기준으로 위에 있을수록 그림자가 커집니다.</p></Panel><Panel className="grid grid-cols-5 gap-5">{levels.map(([z, name, shadow]) => <div key={z} className="flex h-36 flex-col justify-between rounded-panel bg-surface p-4" style={{ boxShadow: shadow }}><strong className="text-xl text-fg">{z}</strong><div><span className="text-sm text-fg-muted">{name}</span><code className="mt-1 block text-[10px] text-fg-subtle">{shadow}</code></div></div>)}</Panel><Panel><h2 className="mb-5 font-semibold">MENU layering</h2><div className="relative h-52 rounded-control bg-semantic-bg"><div className="absolute inset-x-8 bottom-6 h-20 rounded-control bg-white p-4 shadow-[0_0_16px_rgba(107,110,116,.04)]">Card · 10</div><div className="absolute right-16 top-8 w-48 rounded-control bg-white p-4 shadow-[0_0_16px_rgba(107,110,116,.16)]">Popup · 20</div></div></Panel></div></PageShell>;
}

export function PrimitiveColorsPage() {
  return <PageShell title="Primitive Color" note="Figma 29:5108 · shade 이름과 HEX 원본"><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[30px] text-fg-muted">Color는 프로덕트의 개성과 캐릭터를 경험하고 기억하게 하는 요소입니다. Neutral Color를 근간으로 설계하며 Brand Color는 한 화면에서 남발해 Identity가 희석되지 않도록 합니다.</p></Panel><Panel><h2 className="mb-5 text-lg text-fg">Brand Color</h2><Swatches values={brand} /></Panel><Panel><h2 className="mb-5 text-lg text-fg">State Color</h2><Swatches values={state} /></Panel><Panel><h2 className="mb-5 text-lg text-fg">Neutral Color</h2><Swatches values={neutral} /></Panel><Panel className="border-[#EE4700]"><strong className="text-[#EE4700]">Don’t</strong><p className="mt-3 max-w-3xl leading-7 text-fg-muted">Brand Color는 핵심적인 곳에 한정적으로 사용합니다. 사용자의 실제 행동으로 발생한 컴포넌트 변화 외 요소에는 사용을 지양합니다.</p></Panel></div></PageShell>;
}

export function ColorTokensPage() {
  return <PageShell title="Color Token" note="Figma 83:4013 · Light Appearance 원본 역할과 HEX"><div className="flex flex-col gap-6">{colorTokens.map(({ title, tokens }) => <Panel key={title}><h2 className="mb-5 text-lg text-fg">{title}</h2><div className="flex flex-wrap gap-5">{tokens.map(([name, value]) => <div key={name} className="w-[76px]"><div className="size-[60px] rounded-control border border-black/5" style={{ backgroundColor: value }} /><p className="mt-2 text-sm font-semibold text-fg">{name}</p><code className="text-[11px] text-fg-subtle">{value}</code></div>)}</div></Panel>)}</div></PageShell>;
}

export function IdentityPage() {
  return <PageShell title="Identity" note="Figma 35:4929 · Primary / Symbol / Logo Type"><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[30px] text-fg-muted">브랜드 아이덴티티와 기업 아이덴티티는 충분히 인식 가능하도록 명확하고 임팩트 있게 사용하며 형태나 컬러를 변형할 수 없습니다. 그 외 지침은 브랜드 가이드라인에 우선합니다.</p></Panel><Panel><div className="grid grid-cols-3 gap-8"><figure><div className="flex h-48 items-center justify-center rounded-control bg-primary p-10"><img src={keyFeature} alt="subBase primary identity" className="max-h-full max-w-full object-contain"/></div><figcaption className="mt-3 text-sm">Primary</figcaption></figure><figure><div className="flex h-48 items-center justify-center rounded-control bg-semantic-bg p-14"><img src={keyFeature} alt="subBase symbol" className="max-h-full max-w-full object-contain"/></div><figcaption className="mt-3 text-sm">Symbol</figcaption></figure><figure><div className="flex h-48 items-center justify-center rounded-control border border-line bg-white"><span className="text-4xl font-medium text-[#222]">sub<strong>Base</strong></span></div><figcaption className="mt-3 text-sm">Logo Type</figcaption></figure></div></Panel></div></PageShell>;
}

export function CommonImagesPage() {
  const images = [['Key Feature', keyFeature], ['Art', art], ['Placeholder', placeholder]];
  return <PageShell title="Common Image" note="Figma 35:5051 · 35:5106 · 다운로드한 원본 image fill"><Panel className="grid grid-cols-3 gap-6">{images.map(([name, src]) => <figure key={name}><div className="flex aspect-square items-center justify-center overflow-hidden rounded-panel bg-semantic-bg"><img src={src} alt={name} className="h-full w-full object-contain" /></div><figcaption className="mt-3 text-sm text-fg-muted">{name}</figcaption></figure>)}</Panel></PageShell>;
}
