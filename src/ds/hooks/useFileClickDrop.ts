// TOAST useFileClickDrop 이식 (클릭/드래그앤드롭 파일 추출 로직).
// 원본: TOAST asset/components/common/contents/file-click-drop/useFileClickDrop.ts
// 변경: Props 임포트 경로를 @/ds/ui/FileClickDrop으로 교체. React.DragEvent/React.ChangeEvent를
// React 네임스페이스 임포트 없이 쓰던 원본을 DragEvent/ChangeEvent 타입 임포트로 수정
// (verbatimModuleSyntax/strict 대응 — usePagination.ts 이식 시 적용한 것과 동일 패턴).
import { useRef, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";
import type { Props } from "@/ds/ui/FileClickDrop";

const useFileClickDrop = ({ mode, onFile, onDrag }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const extractFilesFromDrop = (data: DataTransfer): File[] => {
    const types = Array.from(data.types || []);
    if (!types.includes("Files")) return []; //NOTE: 링크/텍스트 드롭 차단

    //NOTE: items 확인을 먼저하고 files 체크를 한다
    const items = Array.from(data.items || []);
    const out: File[] = [];
    for (const item of items) {
      if (item.kind === "file") {
        const f = item.getAsFile();
        if (f) out.push(f);
      }
    }
    // fallback: files
    if (!out.length && data.files?.length) {
      return Array.from(data.files);
    }
    return out;
  };

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrag(true);
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrag(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    //NOTE: relatedTarget이 없거나, 현재 노드에 포함되지 않으면 드래그 중 상태 끄기
    const current = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !current.contains(related)) {
      onDrag(false);
    }
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrag(false);
    const targetFiles = extractFilesFromDrop(e.dataTransfer);
    if (mode === "multi") onFile(targetFiles);
    else onFile([targetFiles[0]]);
  }, []);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files;
    if (!targetFiles) return;
    onFile(Array.from(targetFiles));
    if (fileRef.current) fileRef.current.value = "";
  };

  return {
    fileRef,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onPick,
  };
};

export default useFileClickDrop;
