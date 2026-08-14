// TOAST LabeledAccordionSection 이식 (접이식 라벨 섹션).
// 원본: TOAST asset/components/common/contents/labeled-section/LabeledAccordionSection.tsx
// 변경: cn·getAppIcon 경로 교체, framer-motion→motion/react(심볼명 motion 유지).
import { useState, type PropsWithChildren, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/ds/lib/cn";
import { getAppIcon } from "@/ds/icons";

interface Props {
  title: string | ReactNode;
  initialOpen?: boolean;
}

const LabeledAccordionSection = ({
  title,
  initialOpen = false,
  children,
}: Props & PropsWithChildren) => {
  const [listOpen, setListOpen] = useState<boolean>(initialOpen);

  return (
    <dl>
      <dt>
        <button
          type="button"
          className="flex w-full justify-between items-center cursor-pointer"
          aria-expanded={listOpen}
          onClick={() => setListOpen(!listOpen)}
        >
          <span className="typo-bold_smallP">{title}</span>
          <span className="shrink-0 ml-2 text-neutral-middleGray">
            <span
            className={cn(
              "transition-transform duration-500",
              listOpen ? "-rotate-180" : "rotate-0",
            )}
            >
              {getAppIcon("OL_CHEVRON_DOWN", { size: 21, colorClass: "text-neutral-middleGray" })}
            </span>
          </span>
        </button>
      </dt>
      {listOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <dd className="mt-2">{children}</dd>
        </motion.div>
      )}
    </dl>
  );
};

export default LabeledAccordionSection;
