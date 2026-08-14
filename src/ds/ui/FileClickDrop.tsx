// TOAST FileClickDrop 이식 (클릭/드래그앤드롭 파일 선택 래퍼).
// 원본: TOAST asset/components/common/contents/file-click-drop/FileClickDrop.tsx
// 변경: useFileClickDrop을 @/ds/hooks로 교체. SingleMultiMode(@/types/common-components, 미존재
// 의존)는 최소 재구현 — 이 파일에 로컬 타입으로 복원. React.memo → 네임드 memo import(기존 ds
// 컴포넌트들의 named import 관례 준수).
import { memo, type PropsWithChildren } from "react";
import useFileClickDrop from "@/ds/hooks/useFileClickDrop";

/** 원본 @/types/common-components의 SingleMultiMode — 발췌본에 없어 사용부 계약으로 복원 */
export type SingleMultiMode = "single" | "multi";

export interface Props {
  mode: SingleMultiMode;
  allowed?: string[];
  onFile: (files: File[]) => void;
  onDrag: (dragEnter: boolean) => void;
}

const FileClickDrop = memo(function FileClickDrop({
  mode,
  allowed = [],
  onFile,
  onDrag,
  children,
}: Props & PropsWithChildren) {
  const { fileRef, onDragEnter, onDragOver, onDragLeave, onDrop, onPick } = useFileClickDrop({
    mode,
    allowed,
    onFile,
    onDrag,
  });

  return (
    <div>
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => {
          fileRef.current?.click();
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {children}
      </button>
      {/* 파일 input */}
      <input
        ref={fileRef}
        type="file"
        multiple={mode === "multi"}
        accept={allowed.map((ext) => `.${ext}`).join(",")}
        onChange={onPick}
        className="fixed invisible w-0 h-0"
      />
    </div>
  );
});

export default FileClickDrop;
