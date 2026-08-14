// 원본: TOAST asset/components/common/input/SearchBoxSelectedItem.tsx
// 변경: getAppIcon 임포트를 @/ds/icons로 교체. '@/types/common-components'의 IdNameSearchBoxProps·SearchBoxUIType
// 부재로 파일 내 최소 재구현 (SearchBox.tsx는 FetchStatusGate 의존 미해결로 이번 웨이브 보류 — 별도 STATUS 보고).
// 클래스 리매핑: rounded-lgx→rounded-control, bg-primary-bg(선택 틴트)→bg-accent-bg, text-neutral-darkGray→text-fg-muted.
import { getAppIcon } from '@/ds/icons';

// '@/types/common-components'의 IdNameSearchBoxProps·SearchBoxUIType 부재로 인한 최소 재구현 (사용부 계약 기반)
export interface IdNameSearchBoxProps {
  id: string;
  name: string;
  description?: string;
}

export type SearchBoxUIType = 'default' | 'desc';

interface Props {
  type?: SearchBoxUIType;
  data: IdNameSearchBoxProps;
  onClick: () => void;
}

const SearchBoxSelectedItem = ({ type = 'default', data, onClick }: Props) => {
  return (
    <div className="flex items-start gap-0.5 py-0.5 pl-2 pr-1 rounded-control bg-accent-bg">
      {type === 'desc' ? (
        <div className="flex-1 flex flex-col">
          <span className="typo-semiBold_smaller text-primary cursor-default">{data.name}</span>
          <span className="typo-regular_caption text-fg-muted">{data.description}</span>
        </div>
      ) : (
        <span className="typo-semiBold_smaller text-primary cursor-default">{data.name}</span>
      )}
      <button type="button" onClick={onClick} className="mt-[3px]">
        {getAppIcon('OL_X_CIRCLE', { size: 16, colorClass: 'text-primary-light' })}
      </button>
    </div>
  );
};

export default SearchBoxSelectedItem;
