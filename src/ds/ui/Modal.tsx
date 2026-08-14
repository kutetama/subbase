// 원본: TOAST asset/components/common/modal/Modal.tsx
// 변경: useModal → @/ds/providers/modal-store(재구현 — 원본 ModalStore 발췌본 누락), tw.* → 일반 컴포넌트,
//       modalSize 타입 로컬 복원(원본 @/types/common-components 부재).
// 리매핑: border-semantic-lineGray→border-line, rounded-2.5xl→rounded-panel, bg-white→bg-surface,
//         text-neutral-black→text-fg, h-modal_head→h-[55px], h-modal_foot→h-[57px],
//         min-w-modal_small→min-w-[400px], min-w-modal_medium→min-w-[768px], px-60px→px-[60px].
// 다크 대응: Top/BottomLinear 스크롤 페이드의 #FFF 리터럴 그라디언트를 surface 토큰 변수로 교체.
// 포탈 대상 #modal은 index.html에 추가됨.
import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useModal } from "@/ds/providers/modal-store";
import { cn } from "@/ds/lib/cn";

import SolidButton from "@/ds/ui/SolidButton";
import XButton from "@/ds/ui/XButton";

export type modalSize = "small" | "medium" | "full";

interface ModalProps {
  id: string;
  size: modalSize;
  title: string;
  headerChildren?: ReactNode;
  onClose?: () => void;
  containerClassName?: string;
}

interface ModalFooterProps {
  primaryButtonText?: string;
  primaryButtonDisabled?: boolean;
  primaryButtonClick?: () => void;
}

type ModalCtxValue = { size: modalSize };

const ModalCtx = createContext<ModalCtxValue | null>(null);

const Modal = (props: ModalProps & PropsWithChildren) => {
  const { isModalOpen, closeModal } = useModal();
  const open = isModalOpen(props.id);
  const contextValue = useMemo(() => ({ size: props.size }), [props.size]);
  if (!open) {
    return null;
  }

  return createPortal(
    <ModalCtx.Provider value={contextValue}>
      <dialog
        open
        aria-modal="true"
        aria-label={props.title}
        className="fixed z-[9999] inset-0 m-0 grid h-auto w-auto max-h-none max-w-none grid-cols-8 border-0 bg-transparent px-[60px]"
      >
        <button
          type="button"
          aria-label={`${props.title} 닫기`}
          className="absolute inset-0 cursor-default border-0 bg-[rgba(34,34,34,0.15)] backdrop-blur-[1.5px]"
          onClick={() => {
            closeModal(props.id);
            props.onClose?.();
          }}
        />
        <div className="relative z-10 flex justify-center items-center col-span-8">
          <div
            className={cn(
              "overflow-hidden flex flex-col justify-between pr-3 border border-line rounded-panel shadow-basic bg-surface",
              // full만 화면 크기를 고정으로 차지하고, 나머지는 내용 크기 + 뷰포트 상한을 따른다.
              props.size === "full"
                ? "h-[calc(100vh-100px)] min-h-[640px]"
                : "w-fit h-fit max-h-[80vh]",
              props.size === "small" && "w-[25%] min-w-[400px]", // min-w-modal_small, col-span-2
              props.size === "medium" && "w-[50%] min-w-[768px]", // min-w-modal_medium, col-span-4
              props.size === "full" && "w-full min-w-[960px]",
              props.containerClassName,
            )}
          >
            <div className="flex justify-between items-center shrink-0 h-[55px] pt-5 pr-[14px] pl-[22px]">
              <p className="flex items-center gap-2.5">
                <span className="typo-bold_bigP text-fg">{props.title}</span>
                {/* NOTE: headerChildren으로 인해 UI가 어긋나는 경우가 생기면 추가 보완 필요 */}
                {props.headerChildren}
              </p>

              <XButton
                onClick={() => {
                  closeModal(props.id);
                  if (props.onClose) props.onClose();
                }}
                colorClass="text-neutral-middleGray"
              />
            </div>
            {props.children}
          </div>
        </div>
      </dialog>
    </ModalCtx.Provider>,
    document.getElementById("modal") as Element,
  );
};

export const useModalCtx = () => {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error("Modal.* must be used within <Modal>");
  return ctx;
};

// NOTE : Modal 외부로 컨텐츠가 그려야 할 경우가 있어 ModalContent className props 추가

Modal.Body = function Body({ children, className }: PropsWithChildren & { className?: string }) {
  const { size } = useModalCtx();

  return (
    <div className={cn("scrollbar-default !overflow-y-scroll flex-1 pl-5 pr-2", className)}>
      <div
        aria-hidden
        className="sticky -top-1 h-0 z-[1] pointer-events-none after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-4 after:pointer-events-none after:bg-[linear-gradient(180deg,var(--tk-color-semantic-surface)_0%,transparent_100%)]"
      />
      {/* full은 이 래퍼가 auto 높이면 자식의 h-full이 잡히지 않는다 (border-box라 패딩 포함 높이) */}
      <div className={cn("pt-4 pb-5 break-keep", size === "full" && "h-full")}>{children}</div>
      <div
        aria-hidden
        className="sticky -bottom-1 h-0 z-[1] pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-5 after:pointer-events-none after:bg-[linear-gradient(0deg,var(--tk-color-semantic-surface)_0%,transparent_100%)]"
      />
    </div>
  );
};

Modal.Footer = function Footer({
  primaryButtonText,
  primaryButtonDisabled,
  primaryButtonClick,
  children,
}: ModalFooterProps & PropsWithChildren) {
  const { size } = useModalCtx();

  return (
    <>
      {children ? (
        <ModalFoot>{children}</ModalFoot>
      ) : (
        <>
          {primaryButtonText && primaryButtonClick && (
            <ModalFoot>
              <SolidButton
                size={size === "small" ? "small" : "default"}
                name={primaryButtonText}
                disabled={primaryButtonDisabled}
                onClick={primaryButtonClick}
              />
            </ModalFoot>
          )}
        </>
      )}
    </>
  );
};

export default Modal;

export const ModalFoot = ({ children }: PropsWithChildren) => (
  <div className="flex justify-end gap-2.5 shrink-0 h-[57px] pl-5 pr-[14px] pb-4 text-right">
    {children}
  </div>
);
