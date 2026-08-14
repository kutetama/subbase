// 원본: TOAST asset/components/common/input/SelectBox.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체. '@/types/common'의 IdNameProps 부재로 파일 내 최소 재구현.
// 클래스 리매핑: border-semantic-lineGray→border-line, bg-white→bg-surface, rounded-lgx→rounded-control,
// hover:bg-primary-bg(호버/선택 틴트)→hover:bg-accent-bg, text-neutral-darkMiddleGray→text-fg-subtle,
// bg-primary-bg(선택 틴트)→bg-accent-bg. border-semantic-error는 원본 그대로(리매핑표 밖) 무변경.
// 오타 클래스 수정(제품의 죽은 클래스 버그 — 확정 지침): text-nuetral-black→text-fg, hover:text-nuetral-darkGray→hover:text-fg-muted.
import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

// '@/types/common'의 IdNameProps 부재로 인한 최소 재구현 (사용부 계약 기반: id/name 쌍)
interface IdNameProps {
  id: string;
  name: string;
}

interface Props {
  selectList: IdNameProps[];
  selectedId?: string;
  disabled?: boolean;
  invalidText?: string;
  emptyText?: string[]; // 0: 버튼 text, 1: 리스트 text
  onChange: (el: IdNameProps) => void;
}

const INIT_PAIR = {
  id: '',
  name: '선택해주세요',
};

const SelectBox = (props: Props) => {
  const [userSelected, setUserSelected] = useState<boolean>(false);
  const [valuePair, setValuePair] = useState<IdNameProps>();
  const [listOpen, setListOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.selectList.length > 0) {
      if (props.selectedId) {
        setUserSelected(true);
        setValuePair(findValuePair(props.selectedId));
      } else {
        setUserSelected(false);
        setValuePair(findValuePair(undefined));
      }
    } else {
      setUserSelected(false);
      setValuePair(findValuePair(undefined));
    }
  }, [props.selectedId, props.selectList]);

  const findValuePair = (id: string | undefined): IdNameProps => {
    if (id) {
      const pair = props.selectList.find((el) => el.id === id);
      if (pair) return pair;
      else return INIT_PAIR;
    } else return INIT_PAIR;
  };

  return (
    <Popover.Root open={listOpen} onOpenChange={setListOpen}>
      <div className="relative">
        <Popover.Trigger asChild className="w-full">
          <button
            type="button"
            disabled={props?.disabled ?? false}
            title={valuePair?.name}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'flex justify-between items-center h-9 py-2 px-4 border border-line bg-surface rounded-control text-fg typo-regular_smalllP text-left transition-colors',
              'hover:bg-accent-bg hover:text-fg-muted',
              listOpen && 'border-primary-light',
              'disabled:bg-semantic-bg disabled:text-neutral-middleGray',
              !listOpen && props?.invalidText && 'border-semantic-error',
            )}
          >
            <span
              className={cn(
                'overflow-hidden flex-1 text-ellipsis whitespace-nowrap',
                !userSelected && 'text-fg-subtle',
              )}
            >
              {props.selectList.length === 0 && props.emptyText
                ? props.emptyText[0]
                : valuePair?.name}
            </span>
            <span className="shrink-0 ml-2">
              {/* Filter와 같은 이유 — <button> 안의 <div>는 무효이고, block이 빠지면
                  inline이 되어 회전 transform이 먹지 않는다. */}
              <span
                className={cn(
                  'block transition-transform duration-500',
                  listOpen ? '-rotate-180' : 'rotate-0',
                )}
              >
                {getAppIcon('CHEVRON_DOWN', { size: 20, colorClass: 'text-neutral-middleGray' })}
              </span>
            </span>
          </button>
        </Popover.Trigger>

        {!listOpen && props?.invalidText && (
          <div className="absolute top-full left-3.5 typo-regular_caption text-danger">
            {props.invalidText}
          </div>
        )}

        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className="w-[--radix-popover-trigger-width] z-10"
        >
          <div className="bg-surface border border-line rounded-control">
            {props.selectList.length > 0 ? (
              <ul className="scrollbar-default max-h-60 my-1.5 mr-1.5">
                {props.selectList.map((el, index) => (
                  <li key={el.id}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValuePair(el);
                        props.onChange(el);
                        setUserSelected(true);
                        setListOpen(false);
                      }}
                      className={cn(
                        'w-full overflow-hidden py-2 px-4 cursor-pointer text-left text-ellipsis whitespace-nowrap',
                        props.selectList.length - 1 !== index && 'border-b border-line',
                        'hover:bg-accent-bg',
                        el.id === valuePair?.id && 'bg-accent-bg',
                      )}
                      title={el.name}
                    >
                      {el.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                <li
                  className={cn(
                    'overflow-hidden py-2 px-4 cursor-pointer text-ellipsis whitespace-nowrap',
                  )}
                  title={props.emptyText?.[1]}
                >
                  {props.emptyText?.[1]}
                </li>
              </ul>
            )}
          </div>
        </Popover.Content>
      </div>
    </Popover.Root>
  );
};

export default SelectBox;
