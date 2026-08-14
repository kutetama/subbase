#!/usr/bin/env node
// 브랜드 프리셋 스캐폴드 — 원본 프리셋(기본 toast)을 복제해 새 프리셋 폴더를 만든다.
// 사용: npm run preset -- <이름> [--from=원본]
// 이후 절차(원값 교체 → tokens/contrast 게이트 → runtimeBrands 눈 검증)는 출력 체크리스트와
// docs/MANUAL.md "고객사 브랜드 프리셋 만들기" 절을 따른다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PRESETS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "rootage", "presets");

const args = process.argv.slice(2).filter((a) => a !== "--");
const name = args.find((a) => !a.startsWith("--"));
const from = (args.find((a) => a.startsWith("--from=")) ?? "--from=toast").slice("--from=".length);

const die = (msg) => {
  console.error(`오류: ${msg}`);
  console.error("사용법: npm run preset -- <이름> [--from=원본]");
  process.exit(1);
};

if (!name) die("프리셋 이름이 필요합니다.");
if (!/^[a-z][a-z0-9-]*$/.test(name)) die(`이름은 kebab-case(소문자·숫자·하이픈)여야 합니다: "${name}"`);
const srcDir = path.join(PRESETS_DIR, from);
const dstDir = path.join(PRESETS_DIR, name);
if (!fs.existsSync(path.join(srcDir, "color.yaml"))) die(`원본 프리셋이 없습니다: ${from}`);
if (fs.existsSync(dstDir)) die(`이미 존재하는 프리셋입니다: ${name}`);

fs.mkdirSync(dstDir, { recursive: true });
for (const file of ["color.yaml", "font.yaml"]) {
  let body = fs.readFileSync(path.join(srcDir, file), "utf8");
  // metadata name — "Color (toast)" → "Color (acme)" 형태로 치환 (괄호 없던 원본도 부여)
  const lines = body.split(/\r?\n/);
  const metadataIndex = lines.findIndex((line) => {
    const value = line.trimStart();
    return value.startsWith("name: Color") || value.startsWith("name: Font");
  });
  if (metadataIndex >= 0) {
    const line = lines[metadataIndex];
    const indentation = line.slice(0, line.length - line.trimStart().length);
    const value = line.trimStart().slice("name:".length).trimStart();
    const metadataKind = value.startsWith("Color") ? "Color" : "Font";
    lines[metadataIndex] = `${indentation}name: ${metadataKind} (${name})`;
    body = lines.join("\n");
  }
  const kind = file === "color.yaml" ? "색" : "폰트";
  body = `# ${name} 프리셋 — "${from}" 복제 스캐폴드. ${kind} 원값을 브랜드 값으로 교체할 것.\n${body}`;
  fs.writeFileSync(path.join(dstDir, file), body);
}

console.log(`프리셋 생성됨: design-system/rootage/presets/${name}/ (원본: ${from})

다음 단계 — 자세한 절차는 docs/MANUAL.md "고객사 브랜드 프리셋 만들기":
  1. color.yaml 필수 원값 교체 — primary 계열·서피스 2톤(white/base-bg)·잉크(neutral-black)·상태 3색 먼저.
     -bg 틴트·third 8색·다크 값은 파생 가능 (다크 도출 규칙 R1~R6은 color.yaml 헤더 참조).
  2. font.yaml — family.base 폴백 체인 + 셀프호스팅 face(face2로 라틴+CJK 페어 가능). 폰트 라이선스 확인.
  3. npm run tokens && npm run contrast — 토큰 이름 파리티·WCAG 게이트 (미달 값은 동계열 심화).
  4. toastfy.config.json "runtimeBrands": true 상태에서 설정 → 모양 → 브랜드로 눈 검증.
     (데모의 파운데이션 → 브랜드 프리셋 페이지에도 자동 등장)`);
