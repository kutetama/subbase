import { PageShell, Panel } from './shared';
import AppBar from '@/ds/ui/AppBar';
import BottomNavigation from '@/ds/ui/BottomNavigation';
import Subheader from '@/ds/ui/Subheader';
import ListItem from '@/ds/ui/ListItem';
import ImageList from '@/ds/ui/ImageList';
import keyFeature from '@/assets/figma/common-key-feature.png';
import art from '@/assets/figma/common-art.png';

const principles = [
  ['Universal', '불필요한 학습 시간을 최소화하는 모두를 위한 공용, 보편적 설계'],
  ['Experiential', '단편적 박제 이상의 파생되는 경험적 요소를 고려'],
  ['Equal', '사용자 단말 환경과 신체 환경에 따른 차별을 가하지 않는 설계'],
  ['Intuitive', '구조화와 친숙한 어휘를 통해 즉각적 행동을 유발하는 직관적인 사용성'],
] as const;

export function PrinciplesPage() {
  return <PageShell title="Design Principles" note="Figma 250:3689"><div className="grid grid-cols-2 gap-5">{principles.map(([title, body], i)=><Panel key={title} className="min-h-48"><span className="text-sm text-primary">0{i+1}</span><h2 className="mt-8 text-2xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-fg-muted">{body}</p></Panel>)}</div></PageShell>;
}

const contentDocs = {
  'voice-tone': ['Voice and Tone Principle', '35:5245'],
  'writing-style': ['Writing Style', '35:5285'],
  vocabulary: ['Vocabulary', '35:5331'],
} as const;

export function ContentPage({ kind }: Readonly<{ kind: keyof typeof contentDocs }>) {
  const [title, node] = contentDocs[kind];
  return <PageShell title={title} note={`Figma ${node}`}><Panel><div className="rounded-control border border-dashed border-line bg-semantic-bg px-6 py-16 text-center"><strong className="text-lg">Sample Page</strong><p className="mt-2 text-sm text-fg-muted">피그마 정본에 상세 콘텐츠가 정의되지 않은 템플릿 페이지입니다. 임의 가이드 문구를 추가하지 않습니다.</p></div></Panel></PageShell>;
}

export type PatternKind = 'bottom-navigation'|'app-bar'|'subheader'|'list'|'image-list';
const imageTitle = (index: number) => {
  if (index === 0) return 'Text';
  if (index === 1) return 'Text + Badge';
  return 'Image + Text';
};
export function PatternPage({ kind }: Readonly<{ kind: PatternKind }>) {
  const titles = { 'bottom-navigation':'Bottom Navigation', 'app-bar':'App Bar', subheader:'Sub Header', list:'List', 'image-list':'Image List' };
  let preview;
  if(kind==='bottom-navigation') preview=<div className="grid gap-8 overflow-x-auto">{[3,4,5].map(count=><div key={count}><code className="mb-2 block text-xs text-fg-subtle">{count} items</code><BottomNavigation activeId="home" onChange={()=>{}} items={[{id:'home',label:'홈',icon:'OL_HAPPY' as const},{id:'search',label:'검색',icon:'OL_SEARCH' as const},{id:'favorite',label:'좋아요',icon:'OL_SPARKLES' as const},{id:'notice',label:'알림',icon:'OL_BELL' as const},{id:'setting',label:'설정',icon:'OL_COG_6_TOOTH' as const}].slice(0,count)}/></div>)}</div>;
  else if(kind==='app-bar') preview=<div className="grid grid-cols-2 gap-6">{[['Base',false,false],['Base (Scrolled)',true,false],['With Action Button',false,true],['With Action Button (Scrolled)',true,true]].map(([label,scrolled,action])=><div key={String(label)}><code className="mb-2 block text-xs text-fg-subtle">{label}</code><div className="border border-line"><AppBar title="페이지 타이틀" scrolled={Boolean(scrolled)} action={action?<button type="button" className="px-3 text-primary">버튼</button>:undefined}/></div></div>)}<div><code className="mb-2 block text-xs text-fg-subtle">Placeholder + Focus</code><div className="flex h-14 items-center gap-3 border border-primary bg-white px-4"><span>‹</span><input autoFocus className="min-w-0 flex-1 outline-none" placeholder="플레이스홀더"/></div></div><div><code className="mb-2 block text-xs text-fg-subtle">With Text Field</code><div className="flex h-14 items-center border border-line bg-white px-4"><input className="min-w-0 flex-1 outline-none" value="입력된 값" readOnly/></div></div></div>;
  else if(kind==='subheader') preview=<div className="grid max-w-xl gap-6"><div><code className="text-xs text-fg-subtle">Normal</code><Subheader title="서브헤더"/></div><div><code className="text-xs text-fg-subtle">Action Button</code><Subheader title="서브헤더" action={<button type="button">버튼 레이블</button>}/></div><div><code className="text-xs text-fg-subtle">Edit Mode</code><Subheader title="전체선택" action={<span className="flex gap-4"><button type="button">삭제</button><button type="button">취소</button></span>}/></div></div>;
  else if(kind==='list') preview=<div className="grid max-w-xl gap-1">{[['Content',false,false],['Control + Content',true,false],['Content + Action',false,true],['Control + Content + Action',true,true]].map(([title,control,action])=><ListItem key={String(title)} title={String(title)} description="상세 설명 상세 설명" control={control?<input type="checkbox"/>:undefined} action={action?'›':undefined}/>)}</div>;
  else preview=<div className="grid gap-10"><div><code className="mb-3 block text-xs text-fg-subtle">Single</code><ImageList columns={1} className="max-w-[220px]" items={[{id:'s',title:'리스트 제목',description:'부제목',src:keyFeature}]}/></div>{([2,3,4] as const).map(columns=><div key={columns}><code className="mb-3 block text-xs text-fg-subtle">{columns} Columns</code><ImageList columns={columns} items={Array.from({length:columns},(_,i)=>({id:String(i),title:imageTitle(i),description:'상세 설명',src:i%2?art:keyFeature}))}/></div>)}<div><code className="mb-3 block text-xs text-fg-subtle">Scrollable</code><div className="flex gap-4 overflow-x-auto">{Array.from({length:5},(_,i)=><div key={`scroll-${i}`} className="w-40 shrink-0"><ImageList columns={1} items={[{id:String(i),title:`항목 ${i+1}`,src:i%2?art:keyFeature}]}/></div>)}</div></div></div>;
  return <PageShell title={titles[kind]} note="Figma Patterns · 250:3765"><Panel>{preview}</Panel></PageShell>;
}

const practices = {
  content: ['Content', '88:6963'],
  setting: ['Setting', '88:7018'],
  search: ['Search', '88:7049'],
  fieldset: ['Fieldset', '88:8184'],
} as const;
export function BestPracticePage({ kind }: Readonly<{ kind: keyof typeof practices }>) {
  const [title, node]=practices[kind];
  let preview;
  if(kind==='content') preview=<div className="mx-auto max-w-md overflow-hidden border border-line bg-white"><AppBar title="페이지명" action={<button type="button" className="px-3 text-primary">버튼 레이블</button>}/><Subheader title="리스트 제목"/><ListItem title="볼륨" description="캡션 캡션 캡션" action="›"/><SectionBlock title="로그인해주세요."/><div className="border-t border-line p-4 text-sm text-fg-muted">스크롤 했을 경우 상단 구조와 정보 위계를 유지합니다.</div></div>;
  else if(kind==='setting') preview=<div className="mx-auto max-w-md overflow-hidden border border-line bg-white"><AppBar title="설정"/><Subheader title="서브헤더" firstChild/><ListItem title="리스트 제목" description="상세 설명 상세 설명" action={<input type="checkbox" role="switch"/>}/><ListItem title="타입 #1" action="›"/><ListItem title="타입 #2" action="›"/></div>;
  else if(kind==='search') preview=<div className="mx-auto max-w-xl space-y-6"><input className="h-11 w-full rounded-control border border-primary px-4" value="입력중인 값" readOnly/><div><Subheader title="인기 검색어" firstChild/><div className="flex flex-wrap gap-2 p-4">{['인기 검색어','인기 검색어 인기 검색어','검색어'].map(x=><span key={x} className="rounded-full bg-primary-bg px-3 py-2 text-sm text-primary">{x}</span>)}</div></div><ListItem title="Text" description="검색 결과 상세 설명" action="›"/></div>;
  else preview=<form className="mx-auto grid max-w-xl gap-5"><h2 className="text-lg font-semibold">기본 배송지</h2><label className="grid gap-2 text-sm font-semibold">배송지 이름 <span className="text-[#EE4700]">*</span><input className="h-11 rounded-control border border-line px-3" placeholder="입력 가이드 문구"/><small className="font-normal text-[#EE4700]">숫자만 입력 가능합니다.</small></label><label className="grid gap-2 text-sm font-semibold">받는 사람<input className="h-11 rounded-control border border-line px-3" placeholder="받는 사람 이름을 입력해 주세요."/></label><label className="grid gap-2 text-sm font-semibold">휴대폰 번호<input className="h-11 rounded-control border border-line px-3" value="abcdefghij" readOnly/></label><label className="grid gap-2 text-sm font-semibold">배송 시 요청사항<select className="h-11 rounded-control border border-line bg-white px-3"><option>배송 시 요청사항을 선택해 주세요.</option></select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox"/> 기본 배송지 저장</label></form>;
  return <PageShell title={title} note={`Figma ${node}`}><Panel>{preview}</Panel></PageShell>;
}

const SectionBlock = ({ title }: Readonly<{ title: string }>) => <div className="mx-4 my-3 rounded-control border border-line bg-semantic-bg px-4 py-3 text-sm text-fg-muted">{title}</div>;
