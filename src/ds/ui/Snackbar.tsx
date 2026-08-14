import '@/ds/styles/react-toastify.css';

interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const Snackbar = ({ message, actionLabel, onAction }: SnackbarProps) => (
  <div className="flex min-h-10 items-center gap-8 rounded-[6px] bg-[#222222] py-[9px] px-4 text-sm leading-[22px] text-white">
    <div>{message}</div>
    {actionLabel && (
      <button type="button" className="-my-1 px-1 text-base leading-5 text-[#9397a1]" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default Snackbar;
