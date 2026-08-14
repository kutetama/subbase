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
}: DialogProps) => {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15 backdrop-blur-[1.5px]"
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'subbase-dialog-title' : undefined}
        className="w-[312px] rounded-panel bg-surface p-6 shadow-basic"
        onMouseDown={(event) => event.stopPropagation()}
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
    </div>,
    document.getElementById('modal') as Element,
  );
};

export default Dialog;
