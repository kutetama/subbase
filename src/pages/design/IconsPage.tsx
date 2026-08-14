import { PageShell, Panel } from './shared';
import iconSprite from '@/assets/figma/metaphor-icons.svg';
import { FIGMA_ICON_NAMES, figmaIconId } from './figma-icon-names';

const FigmaIcon = ({ name, size = 24 }: { name: string; size?: number }) => <svg width={size} height={size} aria-hidden className="text-fg"><use href={`${iconSprite}#${figmaIconId(name)}`}/></svg>;

export default function IconsPage() {
  return <PageShell title="Iconography" note="Figma 33:4126 · 33:4208 · Metaphor 77종"><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[30px] text-fg-muted">아이콘은 시각적으로 정보의 핵심을 이해할 수 있도록 돕는 요소이며, 대상 사용자층 누구나 의미를 이해할 수 있는 형태와 구조를 가져야 합니다.</p><div className="mt-8 grid grid-cols-3 gap-4"><div className="rounded-control bg-semantic-bg p-5"><strong>Outlined</strong><p className="mt-2 text-sm leading-6 text-fg-muted">상세 기능 단위에 권장</p></div><div className="rounded-control bg-primary p-5 text-white"><strong>Brand Tone</strong><p className="mt-2 text-sm leading-6 text-white/80">서비스 대표·주요 기능</p></div><div className="rounded-control bg-[#222] p-5 text-white"><strong>Filled</strong><p className="mt-2 text-sm leading-6 text-white/80">작은 크기·ON/OFF에 제한</p></div></div></Panel><Panel><h2 className="mb-5 text-lg font-semibold">Metaphor</h2><div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-px overflow-hidden rounded-control bg-line">{FIGMA_ICON_NAMES.map(name=><div key={name} className="flex min-h-24 flex-col items-center justify-center gap-3 bg-surface p-3"><FigmaIcon name={name}/><code className="text-center text-[10px] text-fg-subtle">{name}</code></div>)}</div></Panel></div></PageShell>;
}
