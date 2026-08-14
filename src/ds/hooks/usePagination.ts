// 원본: TOAST asset/components/common/contents/pagination/usePagination.ts
// 변경: Props 타입 임포트 경로를 @/ds/ui/Pagination으로 교체. React.ChangeEvent 사용 시 React 네임스페이스가
// 임포트되지 않던 원본 버그를 ChangeEvent 타입 임포트로 수정(verbatimModuleSyntax/strict 대응).
import { useState, useEffect, type ChangeEvent } from 'react';

import type { Props } from '@/ds/ui/Pagination';

const usePagination = (props: Props) => {
  const [pageGroup, setPageGroup] = useState<number[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [inputPage, setInputPage] = useState<string>(props.currentPage.toString());

  // 페이징 버튼 그룹 생성
  const makePageInfo = (pages: any) => {
    const pageRange = props.small ? 5 : (props.pageRange ?? 10);
    const pageArr: number[] = [];
    const pagination: any = () => {
      for (let i = 0; i < pages.length; i += pageRange) {
        pageArr.push(pages.slice(i, i + pageRange));
      }
      return pageArr;
    };

    const currentGroup = pagination(pageArr)[Math.floor((props.currentPage - 1) / pageRange)];

    return { arr: currentGroup.map((el: any) => el) };
  };

  // 페이징 처리
  useEffect(() => {
    if (props.currentPage > 0 && props.totalPage) {
      setPages(Array.from({ length: props.totalPage }, (_, i) => i + 1) as any);
      setInputPage(props.currentPage.toString());
    }
  }, [props.currentPage, props.totalPage]);

  useEffect(() => {
    if (pages.length > 0) {
      makePageInfo(pages);
      setPageGroup(makePageInfo(pages)?.arr);
    }
  }, [pages]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputPage(value);
  };

  return { pageGroup, pages, onInputChange, inputPage };
};
export default usePagination;
