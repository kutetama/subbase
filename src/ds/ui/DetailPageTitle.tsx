// 원본: TOAST asset/components/common/title/DetailPageTitle.tsx
// 변경: BackButton 임포트를 @/ds/ui/BackButton으로 교체(기존 이식 파일 재사용).
// tailwind-styled-components(tw.span)→일반 컴포넌트로 교체(클래스 보존), children prop을 위해 ReactNode 타입 임포트 추가.
// 클래스 리매핑: text-neutral-black→text-fg. text-neutral-middleGray는 팔레트 직접 클래스(리매핑표 밖)로 무변경.
import type { ReactNode } from 'react';
import BackButton from '@/ds/ui/BackButton';

interface Props {
  title: string[];
  onClick: () => void;
}

const DetailPageTitle = (props: Props) => {
  const segments = props.title.map((title, index) => ({
    key: props.title.slice(0, index + 1).join("/"),
    last: index === props.title.length - 1,
    title,
  }));

  return (
    <div className="flex items-center h-[30px]">
      <BackButton onClick={props.onClick} />
      <span className="ml-2.5 text-base typo-bold_P">
        {props.title.length > 1 ? (
          segments.map((segment) => {
            if (segment.last) {
              return <LastTitle key={segment.key}>{segment.title}</LastTitle>;
            } else {
              return <span key={segment.key} className="text-neutral-middleGray">{`${segment.title} > `}</span>;
            }
          })
        ) : (
          <LastTitle>{props.title}</LastTitle>
        )}
      </span>
    </div>
  );
};

export default DetailPageTitle;

interface LastTitleProps {
  children: ReactNode;
}

const LastTitle = ({ children }: LastTitleProps) => <span className="text-fg">{children}</span>;
