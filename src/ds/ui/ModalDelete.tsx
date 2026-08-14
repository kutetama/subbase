// 원본: TOAST asset/components/common/modal/ModalDelete.tsx
// 변경: useModal → @/ds/providers/modal-store(재구현), FetchStatusGate → @/ds/biz/FetchStatusGate,
//       버튼·Modal 상호참조를 @/ds/ui/* 경로로 교체. 클래스·API 무변경.
import type { ReactNode } from "react";

import { useModal } from "@/ds/providers/modal-store";
import Modal, { ModalFoot } from "@/ds/ui/Modal";
import FetchStatusGate from "@/ds/biz/FetchStatusGate";
import SolidButton from "@/ds/ui/SolidButton";
import TextButton from "@/ds/ui/TextButton";

interface Props<T = void> {
  modalId: string;
  onDeleteConfirm: (data: T) => void;
  title: string;
  text?: string | ((data: T) => string | ReactNode);
  loading?: boolean;
  isCancleBtn?: boolean;
  onCancle?: () => void;
}

const ModalDelete = <T,>({
  modalId,
  title,
  text,
  onDeleteConfirm,
  loading,
  isCancleBtn = false,
  onCancle,
}: Props<T>) => {
  const { closeModal, getModalData } = useModal();
  const modalData = getModalData(modalId);
  let body: ReactNode = "삭제하시겠습니까?";
  if (typeof text === "string") body = text;
  else if (text && modalData) body = text(modalData as T);

  return (
    <Modal
      id={modalId}
      size="small"
      title={title}
      onClose={() => {
        closeModal(modalId);
        onCancle?.();
      }}
    >
      <FetchStatusGate loading={Boolean(loading)} visibleContent={true}>
        <Modal.Body>
          {body}
        </Modal.Body>

        <ModalFoot>
          {isCancleBtn && (
            <TextButton
              name="취소"
              onClick={() => {
                closeModal(modalId);
                onCancle?.();
              }}
            />
          )}
          <SolidButton
            design="solid2"
            name="삭제"
            onClick={() => {
              onDeleteConfirm(getModalData(modalId) as T);
            }}
          />
        </ModalFoot>
      </FetchStatusGate>
    </Modal>
  );
};
export default ModalDelete;
