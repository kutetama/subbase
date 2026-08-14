// TOAST LabeledSection 이식 (제목+콘텐츠 세로 섹션).
// 원본: TOAST asset/components/common/contents/labeled-section/LabeledSection.tsx
// 변경 없음 — 리매핑 표에 해당하는 클래스가 없어 그대로 포팅 (text-black은 text-neutral-black과
// 다른 raw 클래스라 표 대상 아님, text-primary는 팔레트 직접 클래스라 무변경).
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  gap?: string; //tailwind 문법으로 작성 ex) gap-1, gap-[4px]
  className?: string;
  labelTypo?: string;
  isRequired?: boolean;
}

const LabeledSection = ({ className, children, title, gap, labelTypo, isRequired }: Props) => {
  return (
    <div className={className}>
      <div className={`flex flex-col ${gap ?? "gap-1"} `}>
        {/* title */}
        <div className="flex justify-between">
          <p className={`text-black ${labelTypo ?? "typo-bold_smallP"}`}>
            {isRequired ? <span className="inline-block w-2 text-primary">*</span> : ""}
            {title}
          </p>
        </div>

        {/* items */}
        {children}
      </div>
    </div>
  );
};

export default LabeledSection;
