// 원본 @/providers/ModalStore(발췌본 누락)의 재구현 — Modal.tsx·ModalDelete.tsx 사용부 계약에서 복원.
// 계약: openModal(id, data?) · closeModal(id) · closeAllModals() · isModalOpen(id) · getModalData(id).
// 상태관리는 스택 확정에 따라 zustand (STACK.md). 제품 원본 수신 시 대조할 것.
import { create } from "zustand";

interface ModalStoreState {
  /** 열린 모달 id → 전달 데이터 (열림 여부 = 키 존재) */
  modals: Record<string, unknown>;
  open: (id: string, data?: unknown) => void;
  close: (id: string) => void;
  closeAll: () => void;
}

const useModalStore = create<ModalStoreState>((set) => ({
  modals: {},
  open: (id, data) => set((s) => ({ modals: { ...s.modals, [id]: data } })),
  close: (id) =>
    set((s) => {
      const { [id]: _removed, ...rest } = s.modals;
      return { modals: rest };
    }),
  closeAll: () => set({ modals: {} }),
}));

export const useModal = () => {
  const modals = useModalStore((s) => s.modals);
  const open = useModalStore((s) => s.open);
  const close = useModalStore((s) => s.close);
  const closeAll = useModalStore((s) => s.closeAll);

  return {
    openModal: (id: string, data?: unknown) => open(id, data),
    closeModal: (id: string) => close(id),
    closeAllModals: () => closeAll(),
    isModalOpen: (id: string) => id in modals,
    getModalData: (id: string) => modals[id],
  };
};
