#!/usr/bin/env node
// subBase 버전 올림 도구 — 버전 체계(X.Y.Z)에 따라 3파일을 함께 갱신한다.
//   npm run bump -- full    # X+1.0.0 — 완전 판올림 (전면 개편·호환성 파괴)
//   npm run bump -- major   # X.Y+1.0 — 메이저 (기능·컴포넌트 신설)
//   npm run bump -- minor   # X.Y.Z+1 — 마이너 (수정·미세 조정)
// 갱신: package.json version · CHANGELOG.md 섹션 스텁 · src/app/version-history.ts 항목 스텁.
// 이후 스텁의 TODO를 채우고 커밋 → `git tag vX.Y.Z` → push (CHANGELOG의 릴리스 절차 참조).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const level = process.argv[2];
if (!["full", "major", "minor"].includes(level ?? "")) {
  console.error("사용법: npm run bump -- <full|major|minor>  (full=완전 판올림 X, major=메이저 Y, minor=마이너 Z)");
  process.exit(1);
}

const pkgPath = path.join(ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const [x, y, z] = pkg.version.split(".").map(Number);
const next =
  level === "full" ? `${x + 1}.0.0` : level === "major" ? `${x}.${y + 1}.0` : `${x}.${y}.${z + 1}`;

// 오늘 날짜 (로컬)
const today = new Date().toISOString().slice(0, 10);

// 1) package.json
pkg.version = next;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// 2) CHANGELOG.md — 최신 버전 섹션 위에 스텁 삽입
const clPath = path.join(ROOT, "CHANGELOG.md");
let cl = fs.readFileSync(clPath, "utf8");
const firstVersionIdx = cl.search(/^## v\d+\.\d+\.\d+/m);
if (firstVersionIdx === -1) {
  console.error("CHANGELOG.md에서 버전 섹션을 찾지 못했습니다.");
  process.exit(1);
}
cl = `${cl.slice(0, firstVersionIdx)}## v${next} — ${today}\n\n- TODO: 변경 내용 기입\n\n${cl.slice(firstVersionIdx)}`;
fs.writeFileSync(clPath, cl);

// 3) version-history.ts — 배열 맨 앞에 항목 스텁 삽입
const vhPath = path.join(ROOT, "src", "app", "version-history.ts");
let vh = fs.readFileSync(vhPath, "utf8");
const anchor = "export const VERSION_HISTORY: VersionEntry[] = [";
if (!vh.includes(anchor)) {
  console.error("version-history.ts에서 VERSION_HISTORY 배열을 찾지 못했습니다.");
  process.exit(1);
}
vh = vh.replace(
  anchor,
  `${anchor}
  {
    version: "${next}",
    date: "${today}",
    notes: [
      "TODO: 변경 내용 기입",
    ],
  },`,
);
fs.writeFileSync(vhPath, vh);

console.log(`버전 올림: ${[x, y, z].join(".")} → ${next} (${level})
갱신됨: package.json · CHANGELOG.md(스텁) · src/app/version-history.ts(스텁)
다음 단계: 두 스텁의 TODO를 채우고 커밋 → git tag v${next} → git push --tags`);
