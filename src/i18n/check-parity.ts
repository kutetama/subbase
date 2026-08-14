// 로케일 패리티 체크 — ko(정본)와 en의 키 집합이 다르면 실패 (npm run i18n:check).
// 실행: node --experimental-strip-types src/i18n/check-parity.ts
// (Node ESM 직실행이라 .ts 확장자 명시 필요 — tsconfig allowImportingTsExtensions)
import { ko } from "./locales/ko.ts";
import { en } from "./locales/en.ts";

const koKeys = new Set(Object.keys(ko));
const enKeys = new Set(Object.keys(en));

const missingInEn = [...koKeys].filter((k) => !enKeys.has(k));
const extraInEn = [...enKeys].filter((k) => !koKeys.has(k));

if (missingInEn.length || extraInEn.length) {
  if (missingInEn.length) console.error("en에 누락:", missingInEn.join(", "));
  if (extraInEn.length) console.error("en에 잉여:", extraInEn.join(", "));
  process.exit(1);
}
console.log(`로케일 패리티 통과 — ${koKeys.size}개 키`);
