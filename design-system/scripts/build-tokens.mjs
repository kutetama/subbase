// rootage 형식(YAML) 토큰 → Tailwind v4 테마 CSS 코드젠 (자체 미니 엔진).
// seed-design rootage 엔진은 npm 미발행(private)이라 포맷만 준수하고 생성기는 자체 구현 (PoC 판정 2026-08-11).
//
// 프리셋 체계 (2026-08-11):
//   공통 구조 토큰   design-system/rootage/*.yaml            (타이포 스케일·라운드·치수·그림자)
//   브랜드 프리셋    design-system/rootage/presets/<이름>/    (color.yaml·font.yaml — 고객사 추가 = 폴더 1개)
// 선택: --preset=<이름> > toastfy.config.json {"preset"} > "toast"
// --all-brands: 기본 프리셋은 :root/.dark로, 나머지 전 프리셋을 [data-brand="이름"] 스코프로 함께 생성
//               → documentElement에 data-brand 속성만 바꾸면 런타임 브랜드 전환 (다크모드와 동일 메커니즘)
// 산출: src/generated/tokens.css — @font-face + 변수 스코프 + @theme inline 매핑 + typo-* 유틸리티.
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DS_DIR = path.join(ROOT, "..");
const SRC_DIR = path.join(DS_DIR, "rootage");
const PRESETS_DIR = path.join(SRC_DIR, "presets");
const TEMPLATE_ROOT = path.join(DS_DIR, "..");
const OUT_FILE = path.join(TEMPLATE_ROOT, "src", "generated", "tokens.css");

// ── 프리셋 선택 ──────────────────────────────────────────────
const args = process.argv.slice(2);
const argPreset = args.find((a) => a.startsWith("--preset="))?.split("=")[1];
const allBrands = args.includes("--all-brands");

let configPreset;
let configRuntimeBrands = false;
try {
  const cfg = JSON.parse(fs.readFileSync(path.join(TEMPLATE_ROOT, "toastfy.config.json"), "utf8"));
  configPreset = cfg.preset;
  configRuntimeBrands = cfg.runtimeBrands === true;
} catch {
  /* config 없음 — 기본값 사용 */
}
const DEFAULT_PRESET = argPreset ?? configPreset ?? "toast";
const emitAllBrands = allBrands || configRuntimeBrands;

const presetNames = fs.existsSync(PRESETS_DIR)
  ? fs.readdirSync(PRESETS_DIR).filter((d) => fs.statSync(path.join(PRESETS_DIR, d)).isDirectory())
  : [];
if (!presetNames.includes(DEFAULT_PRESET)) {
  throw new Error(`프리셋 없음: "${DEFAULT_PRESET}" (사용 가능: ${presetNames.join(", ")})`);
}

// ── YAML 로드 ────────────────────────────────────────────────
const varName = (tokenPath) => `--tk-${tokenPath.replace(/^\$/, "").replaceAll(".", "-")}`;

const loadTokens = (dir) => {
  /** @type {Record<string, {collection: string, values: Record<string,string>}>} */
  const tokens = {};
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    const doc = parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (doc.kind !== "Tokens") continue;
    const { collection, tokens: t } = doc.data;
    for (const [name, def] of Object.entries(t)) tokens[name] = { collection, values: def.values };
  }
  return tokens;
};

const commonTokens = loadTokens(SRC_DIR);
const presets = Object.fromEntries(
  presetNames.map((name) => [name, loadTokens(path.join(PRESETS_DIR, name))]),
);

// ── 프리셋 패리티 검증 — 토큰 이름 집합이 기본 프리셋과 일치해야 함 ──
const defaultKeys = new Set(Object.keys(presets[DEFAULT_PRESET]).filter((k) => !k.startsWith("$font.face")));
for (const [name, tokens] of Object.entries(presets)) {
  if (name === DEFAULT_PRESET) continue;
  const keys = new Set(Object.keys(tokens).filter((k) => !k.startsWith("$font.face")));
  const missing = [...defaultKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !defaultKeys.has(k));
  if (missing.length || extra.length) {
    throw new Error(
      `프리셋 "${name}" 토큰 불일치 — 누락: [${missing.join(", ")}] 잉여: [${extra.join(", ")}]`,
    );
  }
}

// ── Tailwind v4 @theme 키 매핑 (토큰→유틸리티 단일 지점, 제품 클래스명 1:1 유지) ──
const THEME_MAP = {
  "--color-surface": "$color.semantic.surface",
  "--color-surface-page": "$color.semantic.surface-page",
  "--color-fg": "$color.semantic.fg",
  "--color-fg-muted": "$color.semantic.fg-muted",
  "--color-fg-subtle": "$color.semantic.fg-subtle",
  "--color-line": "$color.semantic.line",
  "--color-accent": "$color.semantic.accent",
  "--color-accent-bg": "$color.semantic.accent-bg",
  "--color-danger": "$color.semantic.danger",
  "--color-danger-bg": "$color.semantic.danger-bg",
  "--color-success": "$color.semantic.success",
  "--color-success-bg": "$color.semantic.success-bg",
  "--color-white": "$color.palette.white",
  "--color-primary": "$color.palette.primary",
  "--color-primary-dark": "$color.palette.primary-dark",
  "--color-primary-light": "$color.palette.primary-light",
  "--color-primary-lightBg": "$color.palette.primary-light-bg",
  "--color-primary-bg": "$color.palette.primary-bg",
  "--color-sub": "$color.palette.sub",
  "--color-third-1": "$color.palette.third-1",
  "--color-third-2": "$color.palette.third-2",
  "--color-third-3": "$color.palette.third-3",
  "--color-third-4": "$color.palette.third-4",
  "--color-third-5": "$color.palette.third-5",
  "--color-third-6": "$color.palette.third-6",
  "--color-third-7": "$color.palette.third-7",
  "--color-third-8": "$color.palette.third-8",
  "--color-neutral-black": "$color.palette.neutral-black",
  "--color-neutral-darkGray": "$color.palette.neutral-dark-gray",
  "--color-neutral-darkMiddleGray": "$color.palette.neutral-dark-middle-gray",
  "--color-neutral-middleGray": "$color.palette.neutral-middle-gray",
  "--color-neutral-lightMiddleGray": "$color.palette.neutral-light-middle-gray",
  "--color-neutral-lightGray": "$color.palette.neutral-light-gray",
  "--color-semantic-error": "$color.palette.error",
  "--color-semantic-errorBg": "$color.palette.error-bg",
  "--color-semantic-lineGray": "$color.palette.line-gray",
  "--color-semantic-caution": "$color.palette.caution",
  "--color-semantic-cautionBg": "$color.palette.caution-bg",
  "--color-semantic-success": "$color.palette.success",
  "--color-semantic-successBg": "$color.palette.success-bg",
  "--color-semantic-bg": "$color.palette.base-bg",
  "--radius-control": "$radius.control",
  "--radius-panel": "$radius.panel",
  "--radius-card": "$radius.card",
  "--shadow-basic": "$shadow.basic",
  "--shadow-hover": "$shadow.hover",
  "--shadow-shadow1": "$shadow.shadow1",
};

// ── 스코프 블록 생성 ─────────────────────────────────────────
const makeResolver = (tokens) => (v) => {
  if (typeof v === "string" && v.startsWith("$")) {
    if (!tokens[v]) throw new Error(`참조 대상 없음: ${v}`);
    return `var(${varName(v)})`;
  }
  return v;
};

/** 토큰 집합 → { light: [줄], dark: [줄] } (global은 light에, color는 양쪽에) */
const emitDecls = (tokens, resolve, { skipFontFaceTokens = true } = {}) => {
  const light = [];
  const dark = [];
  for (const [name, { collection, values }] of Object.entries(tokens)) {
    if (skipFontFaceTokens && name.startsWith("$font.face")) continue;
    const cssVar = varName(name);
    if (collection === "global") {
      light.push(`  ${cssVar}: ${resolve(values.default)};`);
    } else if (collection === "color") {
      const l = resolve(values["theme-light"]);
      const d = resolve(values["theme-dark"]);
      light.push(`  ${cssVar}: ${l};`);
      if (d !== l) dark.push(`  ${cssVar}: ${d};`);
    }
  }
  return { light, dark };
};

const faceBlock = (tokens, prefix) => {
  const fam = tokens[`$font.${prefix}.family`]?.values.default;
  const src = tokens[`$font.${prefix}.src`]?.values.default;
  if (!fam || !src) return null;
  const weight = tokens[`$font.${prefix}.weight`]?.values.default ?? "100 900";
  return `@font-face {
  font-family: "${fam}";
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
  src: url("${src}") format("woff2-variations");
}`;
};

// face(주 폰트) + face2(보조 — 라틴+CJK 페어 등)
const fontFace = (tokens) =>
  [faceBlock(tokens, "face"), faceBlock(tokens, "face2")].filter(Boolean).join("\n\n") || null;

// 기본 프리셋 = common + preset 병합 스코프
const defaultAll = { ...commonTokens, ...presets[DEFAULT_PRESET] };
const resolveDefault = makeResolver(defaultAll);
const base = emitDecls(defaultAll, resolveDefault);

// @font-face — 기본 + (--all-brands 시) 나머지 프리셋, family+src로 중복 제거
const faces = new Map();
const addFace = (tokens) => {
  const css = fontFace(tokens);
  if (css) faces.set(css, true);
};
addFace(presets[DEFAULT_PRESET]);
if (emitAllBrands) for (const name of presetNames) addFace(presets[name]);

// 브랜드 스코프 (--all-brands) — 프리셋 소유 토큰만 오버라이드
const brandBlocks = [];
if (emitAllBrands) {
  // 기본 프리셋도 스코프를 갖는다 — 타 브랜드 활성 중에도 <div data-brand="기본"> 서브트리
  // 미리보기(브랜드 프리셋 페이지 카드)가 정확하도록. 기본 활성 시엔 :root와 중복이라 무해.
  for (const name of presetNames) {
    const merged = { ...commonTokens, ...presets[name] };
    const { light, dark } = emitDecls(presets[name], makeResolver(merged));
    brandBlocks.push(`[data-brand="${name}"] {\n${light.join("\n")}\n}`);
    if (dark.length) brandBlocks.push(`.dark[data-brand="${name}"] {\n${dark.join("\n")}\n}`);
  }
}

// @theme 매핑 검증·생성
const themeDecls = Object.entries(THEME_MAP).map(([key, tokenPath]) => {
  if (!defaultAll[tokenPath]) throw new Error(`THEME_MAP 참조 대상 없음: ${tokenPath}`);
  return `  ${key}: var(${varName(tokenPath)});`;
});

// typo-* 유틸리티 (공통 구조 토큰)
const typoStyles = {};
for (const name of Object.keys(commonTokens)) {
  const match = /^\$typography\.([^.]+)\.(font-size|line-height|font-weight)$/.exec(name);
  if (!match) continue;
  const [, style, property] = match;
  const styleVars = typoStyles[style] ?? {};
  styleVars[property] = varName(name);
  typoStyles[style] = styleVars;
}
const typoBlocks = Object.entries(typoStyles).map(
  ([style, vars]) => `@utility typo-${style} {
  font-size: var(${vars["font-size"]});
  line-height: var(${vars["line-height"]});
  font-weight: var(${vars["font-weight"]});
}`,
);

// ── 출력 ─────────────────────────────────────────────────────
const out = `/* 생성 파일 — 수정 금지. 원천: design-system/rootage/ (scripts/build-tokens.mjs)
   기본 프리셋: ${DEFAULT_PRESET}${allBrands ? ` · 브랜드 스코프 동봉: ${presetNames.filter((n) => n !== DEFAULT_PRESET).join(", ")}` : ""} */
${[...faces.keys()].join("\n\n")}

:root {
${base.light.join("\n")}
}

.dark {
${base.dark.join("\n")}
}

${brandBlocks.join("\n\n")}

@theme inline {
${themeDecls.join("\n")}
}

${typoBlocks.join("\n\n")}
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, out);
// 브랜드 매니페스트 — 설정 '브랜드' 피커·프리셋/타이포 데모 페이지가 소비 (runtime=false면 피커가 안내만 표시)
const fontsManifest = Object.fromEntries(
  presetNames.map((name) => {
    const t = presets[name];
    const faces = [t["$font.face.family"], t["$font.face2.family"]]
      .map((tok) => tok?.values?.default)
      .filter(Boolean);
    return [name, { base: t["$font.family.base"]?.values?.default ?? "", faces }];
  }),
);
// 기본 프리셋이 목록 첫 번째 — 피커·프리셋 페이지 표시 순서의 정본
const brandsOrdered = [DEFAULT_PRESET, ...presetNames.filter((n) => n !== DEFAULT_PRESET)];
fs.writeFileSync(
  path.join(path.dirname(OUT_FILE), "brands.json"),
  `${JSON.stringify({ default: DEFAULT_PRESET, runtime: emitAllBrands, brands: brandsOrdered, fonts: fontsManifest }, null, 2)}\n`,
);
const brandScopeSummary = emitAllBrands ? " + 브랜드 스코프(런타임 전환)" : "";
console.log(
  `tokens.css 생성 — 프리셋 "${DEFAULT_PRESET}"${brandScopeSummary}, 토큰 ${Object.keys(defaultAll).length}개, ` +
    `@theme ${themeDecls.length}, typo ${typoBlocks.length}, 다크 ${base.dark.length}`,
);
