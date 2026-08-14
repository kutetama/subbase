// TOAST FilterSearchBox 이식 (common-business/search-box).
// 원본: TOAST asset/components/common-business/search-box/FilterSearchBox.tsx
// 변경: SearchBox를 ds/ui/SearchBox로 교체(다른 워커가 동시 이식 중 — 원본 API 보존 가정, 파일 미열람).
// filterByName·filterByIds(@/utils/filter-by-name, @/utils/filter-by-ids)와 IdNameSearchBoxProps
// (@/types/common-components)는 발췌본에 없어 사용부 계약으로 파일 내 최소 재구현(중복 허용, 공유 모듈화는 범위 밖).
import { useMemo, useState } from 'react';

import SearchBox, { type SearchBoxProps } from '@/ds/ui/SearchBox';

/** 원본 @/types/common-components의 IdNameSearchBoxProps — 최소 재구현 */
interface IdNameSearchBoxProps {
  id: string;
  name: string;
  description?: string;
}

/** 원본 @/utils/filter-by-name — name 부분일치(대소문자 무시) 필터로 최소 재구현 */
function filterByName<T extends { name: string }>(list: T[], keyword: string): T[] {
  if (!keyword) return list;
  const lower = keyword.toLowerCase();
  return list.filter((item) => item.name.toLowerCase().includes(lower));
}

/** 원본 @/utils/filter-by-ids — id 포함 여부 필터로 최소 재구현 */
function filterByIds<T extends { id: string }>(list: T[], ids: string[]): T[] {
  return list.filter((item) => ids.includes(item.id));
}

type FilterSearchBoxProps = Omit<SearchBoxProps, 'selectedList' | 'onChange'> & {
  selectedList?: IdNameSearchBoxProps[];
  /**
   * 선택된 항목 표시 방식
   * - true: selectedIds 와 함께 사용 (string[])
   * - false/undefined: selectedList 사용 (객체 배열)
   */
  selectedAsIds?: boolean;
  selectedIds?: string[];
};

const FilterSearchBox = ({
  searchList,
  selectedList = [],
  selectedAsIds = false,
  selectedIds = [],
  ...searchProps
}: FilterSearchBoxProps) => {
  const [search, setSearch] = useState('');

  const filteredList: IdNameSearchBoxProps[] = useMemo(() => {
    if (!selectedAsIds || !searchList || searchList.length === 0) return [];
    return filterByIds(searchList, selectedIds);
  }, [selectedAsIds, selectedIds, searchList]);

  return (
    <SearchBox
      {...searchProps}
      searchList={filterByName(searchList ?? [], search)}
      selectedList={selectedAsIds ? filteredList : selectedList}
      onChange={setSearch}
      onSelected={searchProps.onSelected}
    />
  );
};

export default FilterSearchBox;
