import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const serverDir = path.join(projectDir, "server");
const requirementsPath = path.join(serverDir, "requirements.txt");
const require = createRequire(import.meta.url);

let viteEntry;
try {
  const vitePackage = require.resolve("vite/package.json");
  viteEntry = path.join(path.dirname(vitePackage), "bin", "vite.js");
} catch {
  console.error("[showcase] Vite를 찾을 수 없습니다. 프로젝트 루트에서 npm install을 먼저 실행하세요.");
  process.exit(1);
}

if (!existsSync(viteEntry)) {
  console.error(`[showcase] Vite 실행 파일을 찾을 수 없습니다: ${viteEntry}`);
  process.exit(1);
}
if (!existsSync(requirementsPath)) {
  console.error(`[showcase] FastAPI 의존성 파일을 찾을 수 없습니다: ${requirementsPath}`);
  process.exit(1);
}

const children = [];
let stopping = false;

const waitFor = (promise, milliseconds) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), milliseconds);
    promise.then(() => {
      clearTimeout(timer);
      resolve(true);
    });
  });

async function shutdown(exitCode = 0, signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;

  for (const { child } of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill(signal);
  }

  const finished = Promise.allSettled(children.map(({ done }) => done));
  await waitFor(finished, 3_000);

  for (const { child } of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
  }

  await waitFor(finished, 1_000);
  process.exitCode = exitCode;
}

function start(label, command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: "inherit" });
  let finish;
  const done = new Promise((resolve) => {
    finish = resolve;
  });
  children.push({ child, done });

  child.on("error", (error) => {
    finish();
    console.error(`[showcase] ${label} 시작 실패: ${error.message}`);
    if (label === "FastAPI" && error.code === "ENOENT") {
      console.error("[showcase] uv를 설치한 뒤 다시 실행하세요: https://docs.astral.sh/uv/");
    }
    void shutdown(1);
  });

  child.on("exit", (code, signal) => {
    finish();
    if (stopping) return;
    const detail = signal ? `signal ${signal}` : `code ${code ?? 1}`;
    console.error(`[showcase] ${label} 종료 (${detail})`);
    void shutdown(code ?? 1);
  });
}

process.on("SIGINT", () => void shutdown(0, "SIGINT"));
process.on("SIGTERM", () => void shutdown(0, "SIGTERM"));

console.log("[showcase] FastAPI :8000 + Vite를 함께 시작합니다.");

start(
  "FastAPI",
  "uv",
  [
    "run",
    "--no-project",
    "--with-requirements",
    "requirements.txt",
    "uvicorn",
    "main:app",
    "--host",
    "127.0.0.1",
    "--port",
    "8000",
  ],
  serverDir,
);

start("Vite", process.execPath, [viteEntry, ...process.argv.slice(2)], projectDir);
