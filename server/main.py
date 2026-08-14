# subBase FastAPI development server.
# 실행:  uv run --with fastapi --with uvicorn uvicorn main:app --port 8000   (server/ 디렉터리에서)
# 또는:  pip install fastapi uvicorn && uvicorn main:app --port 8000
# vite dev 서버가 /api/* 를 이쪽(8000)으로 프록시한다 (vite.config.ts).
import asyncio
import re
import platform
import subprocess
import time
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI(title="subbase-server", version="0.1.0")
STARTED_AT = time.time()


def _gpus() -> list[str]:
    """nvidia-smi가 있으면 GPU 목록, 없으면 빈 목록 (폐쇄망·CPU 장비 대응)."""
    try:
        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
            capture_output=True, text=True, timeout=5,
        )
        if out.returncode != 0:
            return []
        return [line.strip() for line in out.stdout.splitlines() if line.strip()]
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return []


@app.get("/api/system")
def system_info():
    """설정 '시스템' 탭 페어 — 서버 버전·가동 시간·플랫폼·GPU·저장소 경로.
    주의: 인증 없음(LAN 단일 유저 데모 골격 — BRIEF OUT). 외부 노출·프로덕션 전환 시 인증 미들웨어 필수."""
    uptime = int(time.time() - STARTED_AT)
    h, rem = divmod(uptime, 3600)
    m, s = divmod(rem, 60)
    return {
        "version": app.version,
        "uptime": f"{h}h {m}m {s}s",
        "platform": f"{platform.system()} {platform.machine()} · Python {platform.python_version()}",
        "gpus": _gpus(),
        "dataDir": str(Path.cwd()),
    }


@app.get("/api/jobs")
def jobs():
    """잡 목록 데모 — 실제 서비스는 자체 잡 저장소로 교체."""
    return [
        {"id": "j1", "name": "exaone-sft-0811", "model": "EXAONE-4.5-33B", "status": "running"},
        {"id": "j2", "name": "qwen-dpo-batch2", "model": "H100-Qwen3.6", "status": "done"},
    ]


@app.get("/api/jobs/{job_id}/logs")
async def job_logs(job_id: str):
    """SSE 로그 스트림 데모 — 가짜 학습 로그를 0.5초 간격으로 흘린다 (Exit Criteria: SSE 실동작)."""
    # 경로 파라미터를 스트림에 반영하므로 새니타이즈 필수 — 개행 주입(SSE 이벤트 위조) 차단 (pre-push 리뷰 2026-08-11)
    job_id = re.sub(r"[^A-Za-z0-9_-]", "", job_id)[:64] or "unknown"

    async def stream():
        step = 0
        loss = 2.4
        while step < 400:
            step += 1
            loss = max(0.32, loss * 0.997)
            yield f"data: [{job_id}] step {step:>4}  loss {loss:.4f}  lr 2.0e-5  gpu_mem 41.2GiB\n\n"
            await asyncio.sleep(0.5)
        yield f"data: [{job_id}] 학습 완료 — final loss {loss:.4f}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
