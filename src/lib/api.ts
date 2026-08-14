// API 클라이언트 규약 — fetch 래퍼(JSON·에러 정규화) + SSE 구독 헬퍼 (BRIEF 앱 공통 기능).
// 백엔드는 동일 오리진 `/api/*` (dev는 vite 프록시 → FastAPI 골격, 배포는 리버스 프록시 전제).

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      headers: { "Content-Type": "application/json", ...init?.headers },
      ...init,
    });
  } catch (e) {
    throw new ApiError(0, e instanceof Error ? e.message : "network error");
  }
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.detail ?? body.message ?? message;
    } catch {
      /* JSON 아님 — statusText 유지 */
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * SSE 구독 헬퍼 — 잡 로그 스트림 등. 반환된 함수로 구독 해제.
 * onError는 연결 실패·유실 시 호출된다 (EventSource가 자동 재연결을 시도하는 동안에도).
 */
export function subscribeSse(
  path: string,
  handlers: {
    onMessage: (data: string) => void;
    onError?: (e: Event) => void;
    onOpen?: () => void;
  },
): () => void {
  const source = new EventSource(path);
  source.onmessage = (e) => handlers.onMessage(e.data);
  if (handlers.onOpen) source.onopen = handlers.onOpen;
  if (handlers.onError) source.onerror = handlers.onError;
  return () => source.close();
}
