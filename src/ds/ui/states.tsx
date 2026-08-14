// TOAST NotiState/ErrorState 이식.
// 원본: TOAST asset/components/common/contents/state/{NotiState,ErrorState}.tsx
// 변경: cn·getAppIcon 경로 교체, 색상 시맨틱 리매핑(text-neutral-darkGray→text-fg-muted).
// ErrorState retry는 원본대로 TextButton 사용 (TextButton 이식 완료로 보류 해소).
import { cn } from "@/ds/lib/cn";
import { getAppIcon } from "@/ds/icons";
import TextButton from "@/ds/ui/TextButton";

interface NotiStateProps {
  message: string | string[];
}

const withStableKeys = (lines: string[]) => {
  const occurrences = new Map<string, number>();
  return lines.map((line) => {
    const occurrence = occurrences.get(line) ?? 0;
    occurrences.set(line, occurrence + 1);
    return { key: `${line}-${occurrence}`, line };
  });
};

export function NotiState(props: Readonly<NotiStateProps>) {
  const lines = Array.isArray(props.message) ? props.message : props.message.split(/\r?\n/);

  return (
    <div className="flex flex-col items-center gap-2.5">
      {getAppIcon("OL_SEARCH_CIRCLE", { size: 27, colorClass: "text-neutral-middleGray" })}
      <div className="flex flex-col items-center">
        {withStableKeys(lines).map(({ key, line }) => (
          <span key={key} className="typo-semiBold_smalllP text-fg-muted">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string | string[];
  retryLabel: string;
  retryIconSize?: number;
  retryIconClassname?: string;
  retryCallback?: () => void;
}

export function ErrorState(props: Readonly<ErrorStateProps>) {
  const lines = Array.isArray(props.message) ? props.message : props.message.split(/\r?\n/);

  return (
    <div className="flex flex-col items-center gap-2.5">
      {getAppIcon("OL_EXCLAMATION_CIRCLE", { colorClass: "text-neutral-middleGray" })}
      <div className="flex flex-col items-center">
        {withStableKeys(lines).map(({ key, line }) => (
          <span key={key} className="typo-semiBold_smalllP text-fg-muted">
            {line}
          </span>
        ))}
      </div>
      <TextButton
        name={props.retryLabel}
        appIcon="OL_REFRESH"
        size="fit"
        iconSize={props.retryIconSize}
        iconColorClass={cn(props.retryIconClassname)}
        onClick={() => (props.retryCallback ? props.retryCallback() : window.location.reload())}
      />
    </div>
  );
}
