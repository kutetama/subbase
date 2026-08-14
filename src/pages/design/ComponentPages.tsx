import { useState } from 'react';
import { PageShell, Panel } from './shared';
import Chip from '@/ds/ui/Chip';
import Slider, { RangeSlider } from '@/ds/ui/Slider';
import Snackbar from '@/ds/ui/Snackbar';
import Rating from '@/ds/ui/Rating';
import Chart from '@/ds/ui/Chart';
import Divider from '@/ds/ui/Divider';
import SectionMessage from '@/ds/ui/SectionMessage';
import Description from '@/ds/ui/Description';
import Spinner from '@/ds/ui/Spinner';
import DatePicker from '@/ds/ui/DatePicker';
import InputRadio from '@/ds/ui/InputRadio';
import InputCheckbox from '@/ds/ui/InputCheckbox';
import Switch from '@/ds/ui/Switch';
import Badge from '@/ds/ui/Badge';
import AppBar from '@/ds/ui/AppBar';

type DocKey = 'button' | 'label-helper' | 'text-field' | 'text-area' | 'selection-control' | 'dropdown' | 'date-picker' | 'slider' | 'chip' | 'menu' | 'snackbar' | 'tab' | 'pagination' | 'badge' | 'rating' | 'progress-indicator' | 'chart' | 'divider' | 'dialog' | 'section-message' | 'description';

const docs: Record<DocKey, { title: string; node: string; description: string; variants: string[] }> = {
  button: { title: 'Button', node: '39:6314', description: '버튼은 사용자가 액션 또는 이벤트를 발생시킬 수 있는 요소입니다.', variants: ['Primary', 'Secondary', 'Tertiary', 'Critical', 'Dialog', 'Ghost', 'Text', 'Subtle', 'Function', 'Utility', 'Detail', 'Textfield'] },
  'label-helper': { title: 'Label & Helper', node: '39:6364', description: '레이블은 입력 요소의 제목을, 헬퍼는 입력 힌트와 유효성 결과를 표시합니다.', variants: ['Normal', 'Required', 'Error'] },
  'text-field': { title: 'Text Field', node: '39:6340', description: '텍스트필드는 사용자가 텍스트를 직접 입력하거나 수정할 수 있는 요소입니다.', variants: ['Placeholder', 'Normal', 'Focused', 'Error', 'Readonly'] },
  'text-area': { title: 'Text Area', node: '39:6388', description: '텍스트에어리어는 사용자가 다량의 텍스트를 직접 입력하거나 수정할 수 있는 요소입니다.', variants: ['Placeholder', 'Normal', 'Focused'] },
  'selection-control': { title: 'Selection Control', node: '39:6412', description: '옵션 중 일부를 선택하거나 세부 기능을 켜고 끌 때 사용합니다.', variants: ['Radio Button', 'Checkbox', 'Checkbox (Limited)', 'Switch'] },
  dropdown: { title: 'Dropdown', node: '39:6436', description: '여러 옵션 중 하나 또는 여러 개를 선택할 수 있는 요소입니다.', variants: ['Selectbox', 'Selectbox List', 'Custom', 'Custom List'] },
  'date-picker': { title: 'Date Picker', node: '39:6508', description: '유효성이 검증된 날짜만 선택할 수 있도록 하는 요소입니다.', variants: ['Calendar', 'Selected', 'Actions'] },
  slider: { title: 'Slider', node: '39:6532', description: '사용자가 구간 중 특정 값을 선택할 때 사용하는 요소입니다.', variants: ['Single', 'Double', 'Value Label'] },
  chip: { title: 'Chip', node: '39:6556', description: '옵션·필터를 선택하거나 사용자가 입력한 값을 표시합니다.', variants: ['Filter', 'Option', 'Input'] },
  menu: { title: 'Menu', node: '39:6580', description: '여러 링크 또는 메뉴를 레이어로 표시하는 요소입니다.', variants: ['Default', 'App bar menu'] },
  snackbar: { title: 'Snackbar', node: '39:6604', description: '중요도가 낮은 정보를 화면 하단에 잠시 표시합니다.', variants: ['Normal', 'Action', 'Flexible'] },
  tab: { title: 'Tab', node: '125:9473', description: '구분된 화면 사이를 이동하기 위해 사용하는 요소입니다.', variants: ['Primary', 'Secondary', '2', '3', '4', '5', 'Scrollable'] },
  pagination: { title: 'Pagination', node: '125:9499', description: '현재 보고 있는 콘텐츠 묶음의 위치를 표시합니다.', variants: ['Dots', 'Numbered'] },
  badge: { title: 'Badge', node: '125:9505', description: '키워드를 분리해 강조하거나 시각적 단서를 제공합니다.', variants: ['Ellipse', 'Rounded', 'Rectangle', 'New', 'Error', 'Dot'] },
  rating: { title: 'Rating', node: '125:9527', description: '단계별 평가 값을 표시하고 선택합니다.', variants: ['5', '4', '3', '2', '1', '0'] },
  'progress-indicator': { title: 'Progress Indicator', node: '125:9521', description: '스피너는 애니메이션이 가미된 그래픽으로 현재 데이터가 로드 중임을 알리는 요소입니다.', variants: ['Standalone', 'Label'] },
  chart: { title: 'Chart', node: '125:9536', description: '수치의 관계와 변화를 시각적으로 전달합니다.', variants: ['Group Bar', 'Bar', 'Bar & Line', 'Group Line', 'Lollipop', 'Stacked Line', 'Donut', 'Gauge'] },
  divider: { title: 'Divider', node: '124:6868', description: '화면 안에서 콘텐츠 그룹을 구분할 때 사용합니다.', variants: ['Normal', 'Light', 'Horizontal', 'Vertical'] },
  dialog: { title: 'Dialog', node: '124:6894', description: '사용자의 주의가 필요한 중요 내용을 상위 레이어에 표시합니다.', variants: ['Alert', 'Confirm', 'Confirm with Desc.', 'Confirm Scrollable'] },
  'section-message': { title: 'Section Message', node: '124:6908', description: '중요 알림과 태스크를 페이지에서 구분해 강조합니다.', variants: ['Normal', 'Ghost', 'Error'] },
  description: { title: 'Description', node: '124:6915', description: '상대적으로 중요도가 낮은 상세 정보를 구분해 표시합니다.', variants: ['Default', 'Long text'] },
};

const baseButton = 'h-10 rounded-[6px] px-4 text-sm font-semibold disabled:bg-[#FBFBFD] disabled:text-[#C5C8CE]';

const guidelines: Partial<Record<DocKey, { do?: string; dont?: string; caution?: string }>> = {
  button: { do: '주요 액션과 보조 액션은 사용자가 상황을 확실히 인지하도록 명확히 이름 짓고 위계를 부여합니다.', dont: 'Primary 버튼을 한 화면의 여러 곳에 반복 사용하지 않습니다.' },
  'label-helper': { do: '반복되는 텍스트 필드에는 적절한 레이블을 사용해 입력할 값을 명확히 알립니다.', dont: '레이블과 헬퍼로 표시할 내용을 플레이스홀더로 대체하지 않습니다.' },
  'selection-control': { do: '다중 선택은 Checkbox, 추가 액션 없이 즉시 적용되는 설정은 Switch를 사용합니다.', dont: 'Radio Button을 다중 선택에 사용하거나 Checkbox 선택 즉시 효과를 발생시키지 않습니다.' },
  slider: { do: '구체적 수치가 도움이 되는 경우 Pressed 상태에서 Value Label을 표시합니다.', dont: '슬라이더에 여러 톤의 컬러를 혼합하지 않습니다.' },
  chip: { dont: '선택 가능한 옵션이 하나뿐인 경우 Chip을 사용하지 않습니다.', caution: '여러 줄 배치는 한눈에 파악하기 어려울 수 있으므로 주의합니다.' },
  snackbar: { do: '긴 내용은 최대 두 줄까지 줄바꿈합니다.', caution: '자동으로 사라지므로 닫기·무시 액션 사용에 주의합니다.' },
  tab: { do: '탭 이름은 한 줄로 간결하고 알기 쉽게 사용합니다.', dont: '탭 이름을 두 줄 이상으로 사용하지 않습니다.' },
  divider: { do: '충분한 여백만으로 그룹 구분이 어려운 경우 Divider를 사용합니다.' },
  dialog: { do: 'Dialog는 반드시 Dimmed Background와 함께 사용합니다.' },
};

function Preview({ kind }: Readonly<{ kind: DocKey }>) {
  const [value, setValue] = useState(56);
  const [range, setRange] = useState<[number, number]>([24, 76]);
  const [rating, setRating] = useState(4);
  const [selected, setSelected] = useState('최근 들은');
  const [checked, setChecked] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date(2024, 0, 15));

  switch (kind) {
    case 'button': { const rows=[['Primary','bg-[#1C6BFF] text-white','bg-[#244BD7] text-white'],['Secondary','bg-[#EBF1FD] text-[#1C6BFF]','bg-[#E1EBFF] text-[#244BD7]'],['Tertiary','border border-[#E2E5EB] bg-white text-[#222]','border border-[#E2E5EB] bg-[#EBEEF1] text-[#222]'],['Critical','bg-[#EE4700] text-white','bg-[#EE4700] text-white'],['Ghost','bg-transparent text-[#222]','bg-[#F2F4F8] text-[#222]'],['Text','text-[#1C6BFF]','text-[#244BD7]']] as const; return <div className="grid gap-5">{rows.map(([name,normal,pressed])=><div key={name} className="grid grid-cols-[110px_repeat(3,1fr)] items-center gap-3"><strong className="text-sm">{name}</strong><button type="button" className={`${baseButton} ${normal}`}>Normal</button><button type="button" className={`${baseButton} ${pressed}`}>Pressed, Hover</button><button type="button" disabled className={baseButton}>Disabled</button></div>)}<div className="flex flex-wrap gap-3 border-t border-line pt-5">{['Dialog','Subtle','Function','Utility','Detail','Textfield'].map(x=><button type="button" key={x} className={`${baseButton} border border-line bg-white text-[#222]`}>{x}</button>)}</div></div>; }
    case 'label-helper': return <div className="grid max-w-md gap-7"><label className="grid gap-2 text-sm font-semibold">필수 입력 레이블 <span className="font-normal text-[#EE4700]">* 필수 항목입니다.</span><input className="h-11 rounded-[6px] border border-[#E2E5EB] px-3 font-normal" placeholder="입력 가이드 문구" /></label><label className="grid gap-2 text-sm font-semibold">레이블<input className="h-11 rounded-[6px] border border-[#EE4700] px-3 font-normal" value="잘못된 값" readOnly /><span className="font-normal text-[#EE4700]">에러 문구</span></label></div>;
    case 'text-field': return <div className="grid max-w-2xl grid-cols-2 gap-5">{[['Placeholder','플레이스홀더','border-[#E2E5EB]'],['Normal','입력된 값','border-[#E2E5EB]'],['Focused','입력 중인 값','border-[#1C6BFF]'],['Error','입력된 값','border-[#EE4700]'],['Readonly','Disabled or Read only','border-transparent bg-[#FBFBFD] text-[#C5C8CE]']].map(([label,value,style])=><label key={label} className="grid gap-2"><code className="text-xs text-fg-subtle">{label}</code><input className={`h-11 rounded-[6px] border px-3 outline-none ${style}`} placeholder={label==='Placeholder'?value:undefined} value={label==='Placeholder'?undefined:value} readOnly/></label>)}<label className="grid gap-2"><code className="text-xs text-fg-subtle">Standalone</code><input className="h-11 rounded-[6px] border border-[#E2E5EB] px-3" value="Standalone" readOnly/></label></div>;
    case 'text-area': return <div className="grid grid-cols-3 gap-4"><label className="grid gap-2"><code className="text-xs text-fg-subtle">Placeholder</code><textarea className="h-32 resize-none rounded-[6px] border border-[#E2E5EB] p-3" placeholder="플레이스홀더"/></label><label className="grid gap-2"><code className="text-xs text-fg-subtle">Normal</code><textarea className="h-32 resize-none rounded-[6px] border border-[#E2E5EB] p-3" value="입력된 값 입력된 값\n입력된 값" readOnly/></label><label className="grid gap-2"><code className="text-xs text-fg-subtle">Focused</code><textarea className="h-32 resize-none rounded-[6px] border border-[#1C6BFF] p-3 outline-none" value="입력 중인 값\n입력 중인 값" readOnly/></label></div>;
    case 'selection-control': return <div className="grid gap-7"><div className="flex flex-wrap gap-8"><InputRadio valuePair={{id:'radio',name:'라디오 버튼'}} checked={checked} disabled={false} onChange={()=>setChecked(true)}/><InputCheckbox valuePair={{id:'check',name:'서비스 이용약관 동의'}} checked={checked} disabled={false} onChange={({checked:next})=>setChecked(next)}/><InputCheckbox valuePair={{id:'limited',name:'Checkbox (Limited) · 3'}} checked={false} disabled={false} onChange={()=>{}}/><label className="flex items-center gap-3"><Switch on={checked} onChange={setChecked}/><span>응답 실패 효과음</span></label></div><div className="flex flex-wrap gap-8 opacity-50"><InputRadio valuePair={{id:'disabled',name:'Disabled'}} checked={false} disabled onChange={()=>{}}/><InputCheckbox valuePair={{id:'disabled-check',name:'Disabled'}} checked disabled onChange={()=>{}}/><Switch on={false} disabled onChange={()=>{}}/></div></div>;
    case 'dropdown': { const list=<div className="w-56 rounded-[6px] border border-[#E2E5EB] bg-white p-2 shadow-[0_0_16px_rgba(107,110,116,.16)]">{['옵션 이름 1','옵션 이름 2','옵션 이름 3','옵션 이름 4','옵션 이름 5'].map(x=><button type="button" key={x} className="block w-full rounded px-3 py-2 text-left hover:bg-[#F2F4F8]">{x}</button>)}</div>; return <div className="grid grid-cols-2 gap-8"><div><code className="mb-2 block text-xs text-fg-subtle">Selectbox</code><select className="h-11 w-56 rounded-[6px] border border-[#E2E5EB] bg-white px-3"><option>플레이스홀더</option><option>선택한 값</option></select></div><div><code className="mb-2 block text-xs text-fg-subtle">Selectbox List</code>{list}</div><div><code className="mb-2 block text-xs text-fg-subtle">Custom</code><button type="button" className="h-11 w-56 rounded-[6px] border border-primary bg-white px-3 text-left">설정된 값</button></div><div><code className="mb-2 block text-xs text-fg-subtle">Custom List</code>{list}</div></div>; }
    case 'date-picker': return <DatePicker value={date} defaultMonth={new Date(2024,0,1)} onChange={setDate}/>;
    case 'slider': return <div className="grid gap-10"><Slider value={value} label onChange={setValue}/><RangeSlider value={range} onChange={setRange}/></div>;
    case 'chip': return <div className="flex flex-wrap gap-3"><Chip label="필터" selected/><Chip label="옵션" type="option" selected/><Chip label="입력한 값" type="input" onRemove={()=>{}}/><Chip label="Disabled" disabled/></div>;
    case 'menu': return <div className="max-w-md border border-line"><AppBar title="페이지 타이틀" action={<span>•••</span>}/><div className="ml-auto mr-3 w-56 rounded-[6px] bg-white p-2 shadow-[0_0_16px_rgba(107,110,116,.16)]">{[1,2,3,4].map(x=><button type="button" key={x} className="block w-full rounded px-3 py-2.5 text-left hover:bg-[#F2F4F8]">더보기 메뉴 {x}</button>)}</div></div>;
    case 'snackbar': return <div className="grid max-w-xl gap-4"><div><code className="mb-2 block text-xs text-fg-subtle">Normal</code><Snackbar message="저장되었습니다."/></div><div><code className="mb-2 block text-xs text-fg-subtle">Action</code><Snackbar message="디바이스 상태가 변경되었습니다." actionLabel="취소"/></div><div><code className="mb-2 block text-xs text-fg-subtle">Flexible</code><Snackbar message={'디바이스 연결에 실패하였습니다.\n다시 시도해주세요.'} actionLabel="닫기"/></div></div>;
    case 'tab': { const groups=[['Primary',['탭 이름','이름2']],['Secondary',['주간','월간']],['3',['최근 들은','많이 들은','좋아요']],['4',['이름','이름2','이름3','이름4']],['5',['최근 통화','연락처','114','좋아요','설정']],['Scrollable',["Editor’s Pick",'최근 들은','많이 들은','좋아요']]] as const; return <div className="grid gap-7">{groups.map(([label,tabs])=><div key={label}><code className="mb-2 block text-xs text-fg-subtle">{label}</code><div className="flex max-w-full overflow-x-auto border-b border-[#E2E5EB]">{tabs.map((x,i)=><button type="button" key={x} onClick={()=>setSelected(x)} className={`h-12 shrink-0 px-6 ${(selected===x||(!selected&&i===0))?'border-b-2 border-[#1C6BFF] font-semibold text-[#1C6BFF]':'text-[#5F646F]'}`}>{x}</button>)}</div></div>)}</div>; }
    case 'pagination': return <div className="grid gap-7"><div><code className="mb-2 block text-xs text-fg-subtle">Numbered</code><div className="flex items-center gap-2"><button type="button" className="size-9">‹</button>{[1,2,3,4].map(x=><button type="button" key={x} className={`size-9 rounded-full ${x===1?'bg-[#1C6BFF] text-white':''}`}>{x}</button>)}<button type="button" className="size-9">›</button></div></div><div><code className="mb-3 block text-xs text-fg-subtle">Dots</code><div className="flex gap-2">{[0,1,2,3].map(x=><span key={x} className={`size-2 rounded-full ${x===0?'bg-[#1C6BFF]':'bg-[#E2E5EB]'}`}/>)}</div></div></div>;
    case 'badge': return <div className="grid gap-7"><div className="flex items-center gap-5"><Badge name="19" className="size-[22px] justify-center rounded-full bg-primary text-white"/><Badge name="뱃지 레이블" className="rounded-full bg-primary-bg text-primary"/><Badge name="Rectangle" className="rounded-none bg-neutral-lightGray text-fg-muted"/><Badge name="New" className="bg-primary text-white"/><Badge name="Error" className="bg-error-bg text-error"/><Badge name="닷" className="rounded-full bg-neutral-lightGray text-fg-muted"/></div><div className="flex items-end gap-5"><Badge name="Large" className="h-7 bg-caution-bg text-caution"/><Badge name="Medium" className="bg-success-bg text-success"/><Badge name="Small" className="h-[18px] bg-error-bg text-error"/></div></div>;
    case 'rating': return <div className="grid gap-3">{[5,4,3,2,1,0].map(x=><div key={x} className="flex items-center gap-5"><code className="w-4 text-xs text-fg-subtle">{x}</code><Rating value={x} readOnly/></div>)}<div className="mt-3 border-t border-line pt-4"><Rating value={rating} onChange={setRating}/></div></div>;
    case 'progress-indicator': return <div className="flex items-center gap-12"><div><code className="mb-3 block text-xs text-fg-subtle">Standalone</code><Spinner/></div><div><code className="mb-3 block text-xs text-fg-subtle">Label</code><Spinner label="전송 중"/></div></div>;
    case 'chart': { const charts=[['Group Bar','group-bar'],['Bar','bar'],['Bar & Line','bar-line'],['Group Line','group-line'],['Lollipop','lollipop'],['Stacked Line','stacked-line'],['Donut','donut'],['Gauge','gauge']] as const; return <div className="grid grid-cols-2 gap-5">{charts.map(([label,type])=><figure key={type} className="rounded-control border border-line p-4"><figcaption className="mb-2 text-sm font-semibold">{label}</figcaption><Chart type={type} className="h-[220px] w-full"/></figure>)}</div>; }
    case 'divider': return <div className="grid gap-8"><div><p>리스트 제목</p><Divider className="my-4"/><p className="text-sm text-[#5F646F]">상세 설명 상세 설명</p></div><div className="flex h-12 items-center gap-5"><span>왼쪽</span><Divider direction="vertical"/><span>오른쪽</span></div></div>;
    case 'dialog': return <div className="grid grid-cols-2 gap-6">{[['Alert','이용 동의가 철회되었습니다.'],['Confirm','동의 철회 하시겠습니까?'],['Confirm with Desc.','일부 디바이스는 서비스를 지원하지 않습니다.'],['Confirm Scrollable','회원 탈퇴 시 서비스에 설정된 모든 데이터가 삭제되며 복구할 수 없습니다.']].map(([type,message])=><div key={type} className="rounded-[8px] bg-white p-6 shadow-[0_0_30px_rgba(107,110,116,.2)]"><code className="text-xs text-fg-subtle">{type}</code><h3 className="mt-3 font-semibold">{type==='Alert'?'알림':'동의 철회'}</h3><p className={`mt-3 text-sm leading-6 ${type==='Confirm Scrollable'?'max-h-20 overflow-y-auto':''}`}>{message}</p><div className="mt-8 flex justify-end gap-6">{type!=='Alert'&&<button type="button" className="text-[#9397A1]">취소</button>}<button type="button" className="font-semibold text-[#1C6BFF]">확인</button></div></div>)}</div>;
    case 'section-message': return <div className="grid max-w-xl gap-3"><SectionMessage message="로그인해주세요."/><SectionMessage type="ghost" message="연결중입니다."/><SectionMessage type="error" message="연결에 실패했습니다." onAction={()=>{}}/></div>;
    default: return <div className="grid max-w-2xl gap-8"><Description>상세 설명 상세 설명 상세 설명 상세 설명 상세 설명</Description><Description>상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명</Description><Description tone="subtle">상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명 상세 설명</Description></div>;
  }
}

export function ComponentDocPage({ kind }: Readonly<{ kind: DocKey }>) {
  const doc = docs[kind];
  const guide = guidelines[kind];
  return <PageShell title={doc.title} note={`Figma ${doc.node}`}><div className="flex flex-col gap-6"><Panel><p className="max-w-3xl text-base leading-[26px] text-fg-muted">{doc.description}</p></Panel><Panel><h2 className="mb-6 text-lg font-semibold text-fg">Variants</h2><Preview kind={kind}/><div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5">{doc.variants.map(x=><code key={x} className="rounded bg-semantic-bg px-2 py-1 text-xs text-fg-muted">{x}</code>)}</div></Panel>{guide&&<div className="grid grid-cols-2 gap-5">{guide.do&&<Panel className="border-[#00BB2A]"><strong className="text-[#00BB2A]">Do</strong><p className="mt-3 text-sm leading-6 text-fg-muted">{guide.do}</p></Panel>}{guide.dont&&<Panel className="border-[#EE4700]"><strong className="text-[#EE4700]">Don’t</strong><p className="mt-3 text-sm leading-6 text-fg-muted">{guide.dont}</p></Panel>}{guide.caution&&<Panel className="border-[#F9A80C]"><strong className="text-[#F9A80C]">Caution</strong><p className="mt-3 text-sm leading-6 text-fg-muted">{guide.caution}</p></Panel>}</div>}</div></PageShell>;
}
