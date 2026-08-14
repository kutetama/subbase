// SSE 로그 스트림 패널 — 잡 실행 로그 뷰어 (BRIEF 앱 공통 기능: ML 도구 3종 반복 패턴).
// subscribeSse(lib/api) 소비, 자동 스크롤(맨 아래 고정, 위로 스크롤 시 해제), 연결 상태 표시.
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/ds/lib/cn";
import Badge from "@/ds/ui/Badge";
import LoadingState from "@/ds/ui/LoadingState";
import TextButton from "@/ds/ui/TextButton";
import { subscribeSse } from "@/lib/api";

type ConnState = "connecting" | "open" | "error" | "closed";

interface Props {
  /** SSE 엔드포인트 (예: /api/jobs/j1/logs) */
  path: string;
  className?: string;
  maxLines?: number;
}

export default function LogStreamPanel({ path, className, maxLines = 2000 }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [conn, setConn] = useState<ConnState>("closed");
  const [epoch, setEpoch] = useState(0); // 재연결 트리거
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true); // 맨 아래 고정 여부

  useEffect(() => {
    setLines([]);
    setConn("connecting");
    const unsubscribe = subscribeSse(path, {
      onOpen: () => setConn("open"),
      onMessage: (data) =>
        setLines((prev) => {
          const next = [...prev, data];
          return next.length > maxLines ? next.slice(next.length - maxLines) : next;
        }),
      onError: () => setConn("error"),
    });
    return () => {
      unsubscribe();
      setConn("closed");
    };
  }, [path, maxLines, epoch]);

  // 자동 스크롤 — 사용자가 위로 올리면 고정 해제, 바닥 근처로 오면 재고정
  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }, []);

  const connBadge = {
    connecting: { label: "연결 중", cls: "bg-neutral-lightGray text-fg-muted" },
    open: { label: "스트리밍", cls: "bg-success-bg text-success border border-success/30" },
    error: { label: "연결 끊김", cls: "bg-danger-bg text-danger border border-danger/30" },
    closed: { label: "종료", cls: "bg-neutral-lightGray text-fg-muted" },
  }[conn];

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-panel border border-line bg-surface", className)}>
      <div className="flex items-center justify-between border-b border-line/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="typo-semiBold_smaller text-fg-muted">로그 스트림</span>
          <code className="typo-regular_caption text-fg-subtle">{path}</code>
        </div>
        <div className="flex items-center gap-2">
          <Badge name={connBadge.label} className={connBadge.cls} />
          {conn === "error" && (
            <TextButton name="재연결" size="fit" onClick={() => setEpoch((n) => n + 1)} />
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="scrollbar-default h-[220px] overflow-y-auto bg-neutral-lightGray/40 px-4 py-2 font-mono text-[12px] leading-relaxed text-fg-muted"
      >
        {lines.length === 0 ? (
          conn === "error" ? (
            <span className="text-fg-subtle">
              백엔드에 연결할 수 없습니다 — server/에서 FastAPI를 기동하세요 (README 참조).
            </span>
          ) : (
            /* 준비 중(연결·잡 초기화 등 로그가 아직 없는 구간)에도 진행 중임이 보이도록 애니메이션 표시 */
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <LoadingState />
              <span className="typo-regular_caption text-fg-subtle">
                {conn === "connecting" ? "연결 중…" : "학습 준비 중 — 로그 대기"}
              </span>
            </div>
          )
        ) : (
          lines.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
}
