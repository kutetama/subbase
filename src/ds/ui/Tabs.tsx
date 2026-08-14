// 원본: TOAST asset/components/common/tab/Tabs.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체.
// 클래스 리매핑: bg-white→bg-surface, border-semantic-lineGray→border-line, rounded-lgx→rounded-control,
// 커스텀 치수 키 p-5px/gap-5px→arbitrary(p-[5px]/gap-[5px]). rounded-[15px]은 이미 arbitrary라 무변경.
// text-white/text-neutral-middleGray/bg-primary는 팔레트 직접 클래스(리매핑표 밖)로 무변경.
import { cn } from '@/ds/lib/cn';

/**
 * @param {TabProps[]} tabs - Tab 리스트 배열
 * @param {function} onClick - Tab 클릭 이벤트
 * @param {string} activeCode - 활성화 Tab code
 */

interface Props {
  tabs: TabProps[];
  onClick?: (tab: TabProps) => void;
  activeCode: string;
}

export type TabProps = {
  display: string;
  code: string;
};

const Tabs = ({ tabs, onClick, activeCode }: Props) => {
  return (
    <ul className="p-[5px] bg-surface flex gap-[5px] border border-line rounded-[15px]">
      {tabs.map((tab) => {
        return (
          <li key={tab.display}>
            <button
              type="button"
              onClick={(e) => {
                if (onClick) {
                  e.preventDefault();
                  onClick(tab);
                }
              }}
              className={cn(
                'px-2.5 py-[3.5px] typo-bold_smallP rounded-control',
                activeCode === tab.code ? 'text-white bg-primary' : 'text-neutral-middleGray',
              )}
            >
              {tab.display}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Tabs;
