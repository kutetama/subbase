// TOAST DataMemoDescForm 이식 (common-business/data-memo-desc-form).
// 원본: TOAST asset/components/common-business/data-memo-desc-form/DataMemoDescForm.tsx
// 변경: getAppIcon·cn 경로 교체, TextButton·SolidButton·Textarea를 ds/ui로 교체
// (TextButton·SolidButton은 다른 워커가 동시 이식 중 — 원본 API 보존 가정, 파일 미열람).
// 클래스 리매핑: text-neutral-darkGray→text-fg-muted, gap-5px→gap-[5px](원 키: gap-5px, 커스텀 치수 키 폐기).
import type { ReactElement } from 'react';

import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';
import TextButton from '@/ds/ui/TextButton';
import SolidButton from '@/ds/ui/SolidButton';
import Textarea from '@/ds/ui/Textarea';
import useDataMemoDescForm, { type UseDataMemoDescFormProps } from '@/ds/hooks/useDataMemoDescForm';

const DataMemoDescForm = (props: UseDataMemoDescFormProps): ReactElement => {
  const { text, type } = props;
  const { loading, status, keyword, onEditClick, onSaveMemo, onInputChanged } =
    useDataMemoDescForm(props);

  if (status === 'empty') {
    // empty
    return <TextButton name={`${keyword} 추가`} size="fit" onClick={onEditClick} />;
  } else if (status === 'filled') {
    // filled
    return (
      <div
        className={cn(
          'flex gap-2.5 items-start',
          type === 'general' ? 'max-w-[305px]' : 'max-w-[500px]',
        )}
      >
        <div className="flex gap-[5px] py-2">
          <div className="pt-px pb-[2px] shrink-0">
            {getAppIcon('OL_CHAT_BUBBLE_LEFT', {
              size: 16,
              colorClass: 'text-neutral-middleGray',
            })}
          </div>
          <p className="typo-regular_caption text-fg-muted">{text}</p>
        </div>
        <TextButton
          name={`${keyword} 수정`}
          size="fit"
          onClick={onEditClick}
          className="shrink-0"
        />
      </div>
    );
  } else {
    // on edit
    return (
      <div className="flex gap-2.5 items-start">
        <div className="w-[360px]">
          <Textarea
            maxLength={30}
            height="64px"
            initialValue={text}
            onChange={onInputChanged}
            disabled={loading}
          />
        </div>
        <SolidButton name="저장" size="fit" onClick={onSaveMemo} disabled={loading} />
      </div>
    );
  }
};

export default DataMemoDescForm;
