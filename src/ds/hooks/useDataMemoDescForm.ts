// TOAST useDataMemoDescForm 이식 (common-business/data-memo-desc-form).
// 원본: TOAST asset/components/common-business/data-memo-desc-form/useDataMemoDescForm.ts
// 변경 없음 — 외부 의존이 react뿐이라 로직 그대로 이식.
import { useEffect, useState } from 'react';

export interface UseDataMemoDescFormProps {
  text: string;
  onEdit: (text: string) => Promise<boolean>;
  type?: 'general' | 'ai';
}

/** @deprecated `UseDataMemoDescFormProps`를 사용하세요. */
export type useDataMemoDescFormProps = UseDataMemoDescFormProps; // NOSONAR -- 기존 서비스의 공개 타입 호환성 유지

const useDataMemoDescForm = ({ text, onEdit, type = 'general' }: UseDataMemoDescFormProps) => {
  const [status, setStatus] = useState<'empty' | 'filled' | 'edit'>('empty');
  const [memoInput, setMemoInput] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(!text ? 'empty' : 'filled');
  }, [text]);

  const onInputChanged = (value: string) => {
    setMemoInput(value);
  };

  const onEditClick = () => {
    setStatus('edit');
  };

  const onSaveMemo = async () => {
    if (loading) return;
    setLoading(true);
    const result = await onEdit(memoInput);
    if (result) {
      setStatus('filled');
    }
    setLoading(false);
  };

  return {
    loading,
    status,
    onEditClick,
    onSaveMemo,
    onInputChanged,
    keyword: type === 'general' ? '메모' : '디스크립션',
  };
};

export default useDataMemoDescForm;
