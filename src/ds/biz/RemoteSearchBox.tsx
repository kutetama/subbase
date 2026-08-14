// TOAST RemoteSearchBox 이식 (common-business/search-box).
// 원본: TOAST asset/components/common-business/search-box/RemoteSearchBox.tsx
// 변경: SearchBox를 ds/ui/SearchBox로 교체(다른 워커가 동시 이식 중 — 원본 API 보존 가정, 파일 미열람).
// filterByIds(@/utils/filter-by-ids)·IdNameSearchBoxProps(@/types/common-components)·
// RestfulCallbackDataProps(@/types/axios)는 발췌본에 없어 사용부 계약으로 파일 내 최소 재구현
// (axios 인스턴스 자체는 미사용 — searchApi를 prop으로 주입받는 구조라 그대로 이식 가능).
import { useEffect, useMemo, useState } from 'react';

import SearchBox, { type SearchBoxProps } from '@/ds/ui/SearchBox';

/** 원본 @/types/common-components의 IdNameSearchBoxProps — 최소 재구현 */
interface IdNameSearchBoxProps {
  id: string;
  name: string;
  description?: string;
}

/** 원본 @/types/axios의 RestfulCallbackDataProps — 최소 재구현 */
interface RestfulCallbackDataProps<T> {
  success: boolean;
  data: T;
}

/** 원본 @/utils/filter-by-ids — id 포함 여부 필터로 최소 재구현 */
function filterByIds<T extends { id: string }>(list: T[], ids: string[]): T[] {
  return list.filter((item) => ids.includes(item.id));
}

type RemoteSearchBoxProps = Omit<SearchBoxProps, 'onChange' | 'searchList' | 'selectedList'> & {
  searchApi: (searchText?: string | undefined) => Promise<any>;
  selectedList?: IdNameSearchBoxProps[];
  /**
   * 선택된 항목 표시 방식
   * - true: selectedIds 와 함께 사용 (string[])
   * - false/undefined: selectedList 사용 (객체 배열)
   */
  selectedAsIds?: boolean;
  selectedIds?: string[];
};

const RemoteSearchBox = ({
  searchApi,
  type = 'default',
  selectedList = [],
  selectedAsIds = false,
  selectedIds = [],
  ...searchProps
}: RemoteSearchBoxProps) => {
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState<IdNameSearchBoxProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 전체 리스트 캐싱 (search === '' 일 때만 갱신)
  const [allSearchList, setAllSearchList] = useState<IdNameSearchBoxProps[]>([]);

  useEffect(() => {
    if (search === '') {
      setAllSearchList(searchList);
    }
  }, [search, searchList]);

  const filteredList: IdNameSearchBoxProps[] = useMemo(() => {
    if (!selectedAsIds || allSearchList.length === 0) return [];
    return filterByIds(allSearchList, selectedIds);
  }, [selectedAsIds, selectedIds, allSearchList]);

  useEffect(() => {
    setLoading(true);
    searchApi(search).then((res) => {
      const resData: RestfulCallbackDataProps<IdNameSearchBoxProps[]> = res.data;
      if (resData?.success && resData.data) {
        const data = resData.data;
        setSearchList(data);
      }
      setLoading(false);
    });
  }, [search]);

  return (
    <SearchBox
      {...searchProps}
      type={type}
      loading={loading}
      triggerOnEnter={true}
      searchList={searchList}
      selectedList={selectedAsIds ? filteredList : selectedList}
      onChange={setSearch}
      onSelected={searchProps.onSelected}
    />
  );
};

export default RemoteSearchBox;
