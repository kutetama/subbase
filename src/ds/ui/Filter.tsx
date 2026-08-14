// 원본: TOAST asset/components/common/input/Filter.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체. SolidButton/SubButton을 @/ds/ui/*(기존 이식 파일)로 연결.
// '@/types/common'의 IdNameProps, '@/types/common-components'의 filterWidthMode, '@/constants/common-components'의
// widthModeStyles 부재로 파일 내 최소 재구현 — widthModeStyles는 마스터 스펙의 커스텀 치수 키 매핑표(filter_default=200px)에
// 있는 값만 복원 가능해 'default' 한 개만 구현. 원본 constants 파일 수신 시 실제 모드 키 전수 대조 필요.
// 클래스 리매핑: border-semantic-lineGray→border-line, bg-white→bg-surface, hover:bg-white→hover:bg-surface,
// text-neutral-darkMiddleGray→text-fg-subtle, text-neutral-black→text-fg, rounded-2.5xl→rounded-panel,
// max-h-400px(커스텀 치수 키)→arbitrary(max-h-[400px]). rounded-full/text-primary/text-neutral-middleGray/shadow-basic은
// 팔레트·유틸 직접 클래스(리매핑표 밖)로 무변경.
import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState, type ReactElement } from 'react';

import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

import SolidButton from '@/ds/ui/SolidButton';
import SubButton from '@/ds/ui/SubButton';

// '@/types/common'의 IdNameProps 부재로 인한 최소 재구현 (사용부 계약 기반: id/name 쌍)
interface IdNameProps {
  id: string;
  name: string;
}

// '@/types/common-components'의 filterWidthMode·'@/constants/common-components'의 widthModeStyles 최소 재구현
type filterWidthMode = 'default';

const widthModeStyles: Record<filterWidthMode, string> = {
  default: 'w-[200px]', // filter_default
};

interface Props {
  title: string;
  selectedList: IdNameProps[];
  widthMode?: filterWidthMode;
  disabled?: boolean;
  children: ReactElement;
  onReset: () => void;
  onConfirm: (els: IdNameProps[]) => void;
  onClose?: () => void;
}

const Filter = (props: Props) => {
  const [listOpen, setListOpen] = useState<boolean>(false);
  const [selectedOrigin, setSelectedOrigin] = useState<IdNameProps[]>([]);
  const [selectedList, setSelectedList] = useState<IdNameProps[]>(props.selectedList);
  const [confirmDisabled, setConfirmDisabled] = useState<boolean>(true);

  useEffect(() => {
    setSelectedOrigin(props.selectedList);
    handleDisabled();
  }, []);

  useEffect(() => {
    setSelectedList(props.selectedList);
  }, [props.selectedList]);

  useEffect(() => {
    handleDisabled();
  }, [selectedOrigin, selectedList]);

  useEffect(() => {
    if (!listOpen && props.onClose) props.onClose();
  }, [listOpen]);

  const handleDisabled = () => {
    if (selectedOrigin.length === selectedList.length) {
      const isSameOrigin = selectedOrigin.every((el) =>
        selectedList.some((item) => item.id === el.id),
      );
      setConfirmDisabled(isSameOrigin);
    } else {
      setConfirmDisabled(false);
    }
  };

  return (
    <Popover.Root open={listOpen} onOpenChange={setListOpen}>
      <div className="relative">
        <Popover.Trigger asChild className="w-full">
          <button
            type="button"
            title={props.title}
            disabled={props.disabled}
            className={cn(
              'flex justify-between items-center h-9 pl-2.5 pr-1.5 rounded-full typo-medium_smaller text-left box-border',
              selectedOrigin.length > 0 && 'border border-line bg-surface',
              'hover:bg-surface',
            )}
          >
            <span
              className={cn(
                'text-fg-subtle transition-colors',
                selectedOrigin.length > 0 && ' text-fg',
              )}
            >
              {props.title}

              {selectedOrigin.length > 0 && (
                <span className="ml-1 typo-bold_smaller text-primary">
                  {selectedOrigin.length === 1 ? (
                    <>{selectedOrigin[0].name}</>
                  ) : (
                    <>{`${selectedOrigin[0].name} + ${selectedOrigin.length - 1}`}</>
                  )}
                </span>
              )}
            </span>
            <span className="shrink-0 ml-2 text-neutral-middleGray">
              {/* span + block: <button>은 phrasing content만 받으므로 <div>는 무효다.
                  block이 빠지면 inline 요소가 되어 transform이 적용되지 않는다 —
                  회전이 조용히 사라진다. */}
              <span
                className={cn(
                  'block transition-transform duration-500',
                  listOpen ? '-rotate-180' : 'rotate-0',
                )}
              >
                {getAppIcon('CHEVRON_DOWN', { size: 20 })}
              </span>
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className={cn('z-10', props.widthMode ? widthModeStyles[props.widthMode] : 'w-full')}
        >
          <div className="bg-surface rounded-panel shadow-basic">
            <div className="pl-4 py-4 pr-2.5">
              <div className="scrollbar-default !overflow-y-scroll max-h-[400px]">
                {props.children}
              </div>
            </div>
            <div className="flex justify-end p-2.5">
              <SubButton
                name="초기화"
                appIcon="OL_REFRESH"
                size="small"
                disabled={selectedList.length === 0}
                onClick={() => {
                  props.onReset();
                  setSelectedList([]);
                }}
              />
              <SolidButton
                name="적용"
                size="small"
                disabled={confirmDisabled}
                onClick={() => {
                  props.onConfirm(selectedList);
                  setSelectedOrigin(selectedList);
                  setListOpen(false);
                }}
              />
            </div>
          </div>
        </Popover.Content>
      </div>
    </Popover.Root>
  );
};

export default Filter;
