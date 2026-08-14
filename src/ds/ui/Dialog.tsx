import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  type?: 'alert' | 'confirm';
  title?: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  critical?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

const Dialog = ({
  open,
  type = 'confirm',
  title,
  children,
  confirmLabel = '확인',
  cancelLabel = '취소',
  critical = false,
  onConfirm,
  onCancel,
}: Readonly<DialogProps>) => {
  if (!open) return null;

  return createPortal(
    <dialog
      open
      className="fixed inset-0 z-[9999] m-0 flex h-auto w-auto max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0"
      aria-labelledby={title ? 'subbase-dialog-title' : undefined}
    >
      <button type="button" aria-label="대화상자 닫기" className="absolute inset-0 border-0 bg-black/15 backdrop-blur-[1.5px]" onClick={onCancel} />
      <section
        className="relative z-10 w-[312px] rounded-panel bg-surface p-6 shadow-basic"
      >
        {title && <h2 id="subbase-dialog-title" className="mb-2 text-base font-semibold leading-[22px] text-fg">{title}</h2>}
        <div className="text-sm leading-[22px] text-fg">{children}</div>
        <div className="mt-8 flex h-[34px] items-center justify-end gap-6 border-t border-[#ebeef1] pt-2.5">
          {type === 'confirm' && (
            <button type="button" className="h-[34px] text-base leading-5 text-[#9397a1]" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={critical ? 'h-[34px] text-base font-semibold leading-5 text-[#ee4700]' : 'h-[34px] text-base font-semibold leading-5 text-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </dialog>,
    document.getElementById('modal') as Element,
  );
};

export default Dialog;
