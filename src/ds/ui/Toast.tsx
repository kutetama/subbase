// 원본: TOAST asset/components/common/contents/Toast.tsx
// 변경: react-toastify.css를 이 파일에서 연결(실제 전역 <ToastContainer className="app-toast"> 마운트는
// 앱 루트 소관이라 포트 범위 밖 — 이 컴포넌트는 toast() 호출 시 넘기는 콘텐츠 프리젠테이션만 담당).
// 클래스 리매핑: rounded-2.5xl→rounded-panel. bg-[rgba(34,_34,_34,_0.80)]/text-white는 표 대상 아니고
// 다크모드 무관 고정 리터럴이 원본 의도라 그대로 둠(react-tooltip.css 헤더와 동일 사유).
import '@/ds/styles/react-toastify.css';

interface Props {
  message: string;
}

const Toast = (props: Props) => {
  return (
    <div className="py-1 px-4 rounded-panel bg-[rgba(34,_34,_34,_0.80)]">
      <div className="typo-bold_smallP text-white">{props.message}</div>
    </div>
  );
};

export default Toast;
