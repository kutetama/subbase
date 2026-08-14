#!/usr/bin/env node
// Toastfy DS 동기화 — 서비스 저장소에서 실행해 템플릿의 DS 소유 파일을 끌어온다.
//   node scripts/sync-from-template.mjs                  # 드라이런(변경 예정·충돌 보고만)
//   node scripts/sync-from-template.mjs --apply          # 적용 (충돌 파일은 건너뜀)
//   node scripts/sync-from-template.mjs --apply --force  # 충돌 파일도 템플릿으로 덮어씀
//   (--template=<경로>는 toastfy.config.json의 templatePath보다 우선. --write-baseline은 스캐폴드 내부용)
//
// 3-way 판정: 기준선(.toastfy-sync.json의 해시) 대비 —
//   서비스 파일 == 기준선, 템플릿만 다름  → UPDATE (안전 갱신)
//   서비스 파일 != 기준선                 → CONFLICT (서비스가 수정 — 기본 보존)
// DS 소유 경로(MANIFEST) 밖은 절대 건드리지 않는다. locales·app/·pages/·server/는 서비스 소유.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SHOWCASE_MANIFEST = [
  "design-system/rootage",
  "design-system/scripts",
  "design-system/GUIDE.md",
  "docs/MANUAL.md",
  "src/ds",
  "src/lib/api.ts",
  "src/i18n/index.ts",
  "src/i18n/check-parity.ts",
  "src/index.css",
  "src/vite-env.d.ts",
  // package.json의 실행 명령은 서비스 소유로 두고, 그 명령이 호출하는 runner만 갱신한다.
  "scripts/dev-showcase.mjs",
  "scripts/sync-from-template.mjs",
];

const SERVICE_ROOT = process.cwd();
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const force = args.includes("--force");
const writeBaselineOnly = args.includes("--write-baseline");
const argTemplate = args.find((a) => a.startsWith("--template="))?.split("=")[1];

const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
};

const config = readJson(path.join(SERVICE_ROOT, "toastfy.config.json")) ?? {};
const TEMPLATE = path.resolve(argTemplate ?? config.templatePath ?? "");
if (!TEMPLATE || !fs.existsSync(path.join(TEMPLATE, "package.json"))) {
  console.error("템플릿 경로를 찾을 수 없습니다 — toastfy.config.json의 templatePath 또는 --template=<경로>.");
  process.exit(1);
}

const profileName = config.profile ?? "showcase";
const profiles = readJson(path.join(TEMPLATE, "scaffold-profiles.json"));
const resolveProfile = (name) => {
  const profile = profiles?.[name];
  if (!profile) return null;
  if (!profile.extends) return profile;
  const base = resolveProfile(profile.extends);
  return {
    ...profile,
    dependencies: [...base.dependencies, ...profile.dependencies],
    source: [...base.source, ...profile.source],
  };
};
const profile = resolveProfile(profileName);
if (profileName !== "showcase" && !profile) {
  console.error(`동기화 프로필을 찾을 수 없습니다: ${profileName}`);
  process.exit(1);
}

// 앱 overlay는 서비스 소유다. managed 모드도 토큰·선택된 DS 코어만 갱신한다.
const MANIFEST =
  profileName === "showcase"
    ? SHOWCASE_MANIFEST
    : [
        "design-system/rootage",
        "design-system/scripts",
        "design-system/GUIDE.md",
        ...profile.source.filter(
          (rel) =>
            rel.startsWith("src/ds/") ||
            rel === "src/assets" ||
            rel === "src/index.css" ||
            rel === "src/vite-env.d.ts",
        ),
        "scripts/sync-from-template.mjs",
      ];

const BASELINE_PATH = path.join(SERVICE_ROOT, ".toastfy-sync.json");
const baseline = readJson(BASELINE_PATH) ?? { files: {} };

const sha = (p) => createHash("sha256").update(fs.readFileSync(p)).digest("hex");

/** MANIFEST 경로를 파일 목록으로 전개 (root 기준 상대경로) */
const listFiles = (root) => {
  const out = [];
  for (const entry of MANIFEST) {
    const abs = path.join(root, entry);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isFile()) {
      out.push(entry);
      continue;
    }
    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.lstatSync(p);
        if (st.isSymbolicLink()) continue; // 심링크 스킵 — 루트 밖 경로 생성 차단 (pre-push 리뷰 2026-08-11)
        if (st.isDirectory()) walk(p);
        else out.push(path.relative(root, p));
      }
    };
    walk(abs);
  }
  return out;
};

const templateFiles = listFiles(TEMPLATE);

// 스캐폴드 내부용 — 기준선만 기록하고 종료
if (writeBaselineOnly) {
  const files = {};
  for (const rel of templateFiles) files[rel] = sha(path.join(TEMPLATE, rel));
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify({ template: TEMPLATE, files }, null, 2)}\n`);
  console.log(`기준선 기록 — ${templateFiles.length}개 파일 (.toastfy-sync.json)`);
  process.exit(0);
}

const report = { NEW: [], UPDATE: [], SAME: [], CONFLICT: [], FORCED: [] };
const nextBaseline = { template: TEMPLATE, files: { ...baseline.files } };

for (const rel of templateFiles) {
  const tAbs = path.join(TEMPLATE, rel);
  const sAbs = path.join(SERVICE_ROOT, rel);
  const tHash = sha(tAbs);
  const baseHash = baseline.files[rel];

  if (!fs.existsSync(sAbs)) {
    report.NEW.push(rel);
    if (apply) {
      fs.mkdirSync(path.dirname(sAbs), { recursive: true });
      fs.copyFileSync(tAbs, sAbs);
      nextBaseline.files[rel] = tHash;
    }
    continue;
  }
  const sHash = sha(sAbs);
  if (sHash === tHash) {
    report.SAME.push(rel);
    nextBaseline.files[rel] = tHash;
    continue;
  }
  const serviceModified = baseHash ? sHash !== baseHash : true; // 기준선 없으면 보수적으로 충돌 취급
  if (!serviceModified) {
    report.UPDATE.push(rel);
    if (apply) {
      fs.copyFileSync(tAbs, sAbs);
      nextBaseline.files[rel] = tHash;
    }
  } else if (force) {
    report.FORCED.push(rel);
    if (apply) {
      fs.copyFileSync(tAbs, sAbs);
      nextBaseline.files[rel] = tHash;
    }
  } else {
    report.CONFLICT.push(rel);
  }
}

// 서비스 로컬 추가 파일 (템플릿에 없는 매니페스트 하위 파일 — 예: 서비스가 만든 프리셋) — 보존·보고만
const serviceFiles = listFiles(SERVICE_ROOT);
const localOnly = serviceFiles.filter((rel) => !templateFiles.includes(rel));

// 의존성 드리프트 보고 (자동 적용 안 함)
const tPkg = readJson(path.join(TEMPLATE, "package.json"));
const sPkg = readJson(path.join(SERVICE_ROOT, "package.json"));
const depDrift = [];
for (const section of ["dependencies", "devDependencies"]) {
  for (const [name, ver] of Object.entries(tPkg?.[section] ?? {})) {
    if (section === "dependencies" && profile?.dependencies !== "all" && !profile.dependencies.includes(name)) {
      continue;
    }
    const cur = sPkg?.[section]?.[name];
    if (!cur) depDrift.push(`누락 ${name}@${ver}`);
    else if (cur !== ver) depDrift.push(`버전 상이 ${name}: 서비스 ${cur} vs 템플릿 ${ver}`);
  }
}

console.log(`Toastfy 동기화 ${apply ? "적용" : "드라이런"} — 템플릿: ${TEMPLATE}`);
const forcedSummary = force ? ` · 강제 ${report.FORCED.length}` : "";
console.log(
  `  동일 ${report.SAME.length} · 신규 ${report.NEW.length} · 갱신 ${report.UPDATE.length} · ` +
    `충돌 ${report.CONFLICT.length}${forcedSummary}`,
);
for (const [tag, items] of [["신규", report.NEW], ["갱신", report.UPDATE], ["강제 덮어씀", report.FORCED]])
  for (const rel of items) console.log(`  + [${tag}] ${rel}`);
for (const rel of report.CONFLICT)
  console.log(`  ! [충돌 — 서비스 수정 감지, 보존] ${rel}  (--force로 덮어쓰기 가능)`);
for (const rel of localOnly) console.log(`  · [서비스 로컬 추가 — 보존] ${rel}`);
if (depDrift.length) {
  console.log("  의존성 드리프트 (수동 반영 필요):");
  for (const d of depDrift) console.log(`    - ${d}`);
}

if (apply) {
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(nextBaseline, null, 2)}\n`);
  console.log("적용 완료 — 기준선 갱신됨. `npm run tokens && npm run typecheck` 실행을 권장합니다.");
} else if (report.NEW.length + report.UPDATE.length + report.CONFLICT.length === 0) {
  console.log("변경 없음 — 템플릿과 동기 상태입니다.");
} else {
  console.log("적용하려면 --apply (충돌까지 덮으려면 --apply --force).");
}
