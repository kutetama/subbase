import { PageShell, Panel } from './shared';

const styles = [
  ['Display', 'SemiBold', '28', '40', 'typo-display'],
  ['Heading 1', 'Regular', '22', '30', 'typo-heading1'],
  ['Heading 2', 'Regular', '18', '24', 'typo-heading2'],
  ['Heading 3', 'SemiBold', '16', '22', 'typo-heading3'],
  ['Paragraph 1', 'Regular', '16', '26', 'typo-paragraph1'],
  ['Label 1', 'SemiBold', '16', '20', 'typo-label1'],
  ['Label 2', 'Regular', '16', '20', 'typo-label2'],
  ['Paragraph 2', 'Regular', '14', '22', 'typo-paragraph2'],
  ['Label 3', 'Regular', '14', '18', 'typo-label3'],
  ['Caption', 'Regular', '13', '18', 'typo-caption'],
] as const;

export default function TypographyPage() {
  return <PageShell title="Typography" note="Figma 30:4330 · SUIT / Text Styles 10종"><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[30px] text-fg-muted">본문 서체로는 SUIT를 사용하며 배너 등 개별 이미지에서는 브랜드 폰트 등을 자유롭게 선택하여 사용할 수 있습니다.</p></Panel><Panel><div className="grid grid-cols-[150px_100px_70px_90px_1fr] border-b border-line pb-3 text-xs font-semibold text-fg-subtle"><span>Text Style</span><span>Weight</span><span>Size</span><span>Line Height</span><span>Sample</span></div>{styles.map(([name, weight, size, line, utility])=><div key={name} className="grid grid-cols-[150px_100px_70px_90px_1fr] items-baseline border-b border-line/60 py-4 last:border-0"><strong className="text-sm">{name}</strong><span className="text-sm text-fg-muted">{weight}</span><span className="text-sm text-fg-muted">{size}</span><span className="text-sm text-fg-muted">{line}</span><span className={utility}>환경에 따른 차별을 가하지 않는 설계</span></div>)}</Panel><Panel className="border-[#EE4700]"><strong className="text-[#EE4700]">Don’t</strong><p className="mt-3 leading-7 text-fg-muted">폰트 사이즈를 강제로 지정하고 사용자가 OS에서 설정한 값을 무시하는 것은 Design Principle에 위배됩니다.</p></Panel></div></PageShell>;
}
