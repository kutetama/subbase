// 브랜드 스토어 — 런타임 브랜드(프리셋) 전환 단일 소스.
// 다크모드(theme-store)와 동일 메커니즘: documentElement의 data-brand 속성 = CSS 변수 스코프 전환.
// 전제: 토큰이 브랜드 스코프 포함으로 생성돼 있어야 함 (toastfy.config.json "runtimeBrands": true 또는 --all-brands).
import { create } from "zustand";
import brandsManifest from "@/generated/brands.json";

const STORAGE_KEY = "toastfy.brand";

export const BRANDS: string[] = brandsManifest.brands;
export const DEFAULT_BRAND: string = brandsManifest.default;
/** false면 토큰에 브랜드 스코프가 없어 전환이 무효 — 피커는 안내를 표시한다 */
export const RUNTIME_BRANDS_ENABLED: boolean = brandsManifest.runtime;

const readStored = (): string => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && BRANDS.includes(v)) return v;
  } catch {
    /* 무시 */
  }
  return DEFAULT_BRAND;
};

const applyToDocument = (brand: string) => {
  if (brand === DEFAULT_BRAND) delete document.documentElement.dataset.brand;
  else document.documentElement.dataset.brand = brand;
};

interface BrandState {
  brand: string;
  setBrand: (brand: string) => void;
}

const initialBrand = typeof window !== "undefined" ? readStored() : DEFAULT_BRAND;

export const useBrandStore = create<BrandState>((set) => ({
  brand: initialBrand,
  setBrand: (brand) => {
    if (!BRANDS.includes(brand)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, brand);
    } catch {
      /* 무시 */
    }
    applyToDocument(brand);
    set({ brand });
  },
}));

// 모듈 로드 시 1회 적용 (새로고침 후 유지)
if (typeof window !== "undefined") {
  applyToDocument(initialBrand);
}
