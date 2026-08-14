// 팔레트 WCAG 대비율 검증 — 전 프리셋 × 양 모드 순회 (고객사 프리셋 등록 시점에 기준 미달을 잡는다).
// 사용: npm run contrast [-- --preset=이름]   (미지정 시 전 프리셋)
// NOTE 예외: 제품 브랜드 정본 색이라 값 수정 불가 항목 — 사용 규칙(GUIDE.md)으로 해소, 실패로 치지 않음.
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PRESETS_DIR = path.join(ROOT, "..", "rootage", "presets");

const argPreset = process.argv.find((a) => a.startsWith("--preset="))?.split("=")[1];
const presetNames = fs
  .readdirSync(PRESETS_DIR)
  .filter((d) => fs.statSync(path.join(PRESETS_DIR, d)).isDirectory())
  .filter((d) => !argPreset || d === argPreset);
if (!presetNames.length) throw new Error(`프리셋 없음: ${argPreset ?? "(presets/ 비어 있음)"}`);

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [라벨, 전경 토큰, 배경 토큰, 목표, note?]
const PAIRS = [
  ["fg / surface", "$color.semantic.fg", "$color.semantic.surface", 7],
  ["fg / page", "$color.semantic.fg", "$color.semantic.surface-page", 7],
  ["fg-muted / surface", "$color.semantic.fg-muted", "$color.semantic.surface", 4.5],
  ["fg-subtle / surface", "$color.semantic.fg-subtle", "$color.semantic.surface", 3],
  ["line / surface (보더 가시성)", "$color.semantic.line", "$color.semantic.surface", 1.3],
  ["accent / surface", "$color.semantic.accent", "$color.semantic.surface", 3, "브랜드 정본"],
  ["accent 텍스트 대체(primary-dark) / surface", "$color.palette.primary-dark", "$color.semantic.surface", 3],
  ["danger / surface", "$color.semantic.danger", "$color.semantic.surface", 4.5],
  ["success / surface", "$color.semantic.success", "$color.semantic.surface", 4.5],
  ["caution / surface", "$color.palette.caution", "$color.semantic.surface", 4.5, "브랜드 정본"],
  ["fg / accent-bg (선택 행)", "$color.semantic.fg", "$color.semantic.accent-bg", 7],
  ["success / success-bg (배지)", "$color.semantic.success", "$color.semantic.success-bg", 3],
  ["danger / danger-bg (배지)", "$color.semantic.danger", "$color.semantic.danger-bg", 3],
  ["third-3 / surface (차트)", "$color.palette.third-3", "$color.semantic.surface", 3],
  ["third-8 / surface (차트)", "$color.palette.third-8", "$color.semantic.surface", 3],
];

let fail = 0;
for (const preset of presetNames) {
  const doc = parse(fs.readFileSync(path.join(PRESETS_DIR, preset, "color.yaml"), "utf8"));
  const T = {};
  for (const [name, def] of Object.entries(doc.data.tokens)) T[name] = def.values;
  const val = (token, mode) => {
    let v = T[token]?.[mode];
    while (typeof v === "string" && v.startsWith("$")) v = T[v]?.[mode];
    if (!v) throw new Error(`토큰 없음: ${token} (${preset}/${mode})`);
    return v;
  };

  for (const mode of ["theme-light", "theme-dark"]) {
    console.log(`\n[${preset} · ${mode}]`);
    for (const [label, fgT, bgT, target, note] of PAIRS) {
      const r = ratio(val(fgT, mode), val(bgT, mode));
      const ok = r >= target;
      let tag = "PASS";
      if (!ok) {
        if (note) tag = "NOTE";
        else {
          tag = "FAIL";
          fail++;
        }
      }
      const noteText = !ok && note ? `  [예외: ${note} — 사용 규칙으로 해소]` : "";
      console.log(`${tag}  ${r.toFixed(2).padStart(6)} (목표 ${target})  ${label}${noteText}`);
    }
  }
}
console.log(fail ? `\n실패 ${fail}건 — 값 조정 필요` : `\n전 항목 통과 (프리셋 ${presetNames.length}종 × 2모드)`);
process.exit(fail ? 1 : 0);
