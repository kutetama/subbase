// TOAST DragDropDataTable 이식 (common-business/drag-drop-table).
// 원본: TOAST asset/components/common-business/drag-drop-table/DragDropDataTable.tsx
// 변경: cn·getAppIcon 경로 교체, DataTable을 ds/ui/DataTable로 교체, useDragAutoScroll을 ds/hooks로 분리.
// react-dnd·react-dnd-html5-backend 임포트는 원본 그대로 유지.
import { createContext, useContext, useId, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop, type ConnectDragSource } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { ColumnDef } from '@tanstack/react-table';

import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';
import DataTable, { type DataTableRenderRowParams } from '@/ds/ui/DataTable';
import useDragAutoScroll from '@/ds/hooks/useDragAutoScroll';

interface Props {
  /** **핸들 컬럼을 뺀** 컬럼. 핸들 컬럼은 내부에서 맨 앞에 삽입한다 */
  columns: ColumnDef<any>[];
  cellData: any[];
  isEmpty: boolean;
  isError: boolean;
  maxHeight?: 'fill' | 'fit' | (string & {});
  minWidth?: string;
  selectedRows?: string[];
  onRowClick?: (rowData: any) => void;
  /** 재정렬 시 셀 내부 상태가 행을 따라가야 하므로 index 기반 id를 쓸 수 없다 (필수) */
  getRowId: (rowData: any, index: number) => string;
  /** 드래그 불가. 핸들 컬럼 자리(26px)는 유지하고 핸들만 렌더하지 않는다 */
  readOnly?: boolean;
  /** **드롭이 확정된 시점에만** 재정렬된 배열을 전달한다 */
  onReorder: (nextRows: any[]) => void;
}

interface DragItem {
  index: number;
}

/**
 * 드래그 커서를 move로 고정한다 (기본값은 Alt를 누르면 copy로 바뀐다)
 * - **모듈 상수로 두어야 한다.** `useDragSourceConnector`의 layout effect deps가 이 객체의 identity이고
 *   cleanup이 `disconnectDragSource()`라, 인라인 리터럴로 넘기면 렌더마다 드래그 소스가 끊겨 드래그가 시작되지 않는다
 */
const DRAG_SOURCE_OPTIONS = { dropEffect: 'move' };

/**
 * 핸들 셀은 컬럼 정의 안에서, tr은 DraggableRow가 렌더하므로 드래그 커넥터를 직접 넘길 수 없다.
 * 행 단위로 context에 실어 내린다. (Provider가 없으면 = readOnly면 핸들을 렌더하지 않는다)
 */
const DragHandleContext = createContext<ConnectDragSource | null>(null);

const DragHandleCell = () => {
  const drag = useContext(DragHandleContext);

  if (!drag) return null;

  return (
    // getAppIcon은 아이콘에 pointer-events-none을 얹으므로 커넥터는 감싸는 요소에 붙인다
    // react-dnd v16의 ConnectDragSource는 React 19 ref 타입과 명목상 불일치(런타임은 호환) — 캐스트로 해소
    <button
      type="button"
      ref={drag as unknown as React.Ref<HTMLButtonElement>}
      onClick={(e) => e.stopPropagation()}
      aria-label="행 순서 변경"
      className="flex items-center cursor-grab active:cursor-grabbing"
    >
      {getAppIcon('DRAG_HANDLE_DOTS', { size: 18, colorClass: 'text-neutral-middleGray' })}
    </button>
  );
};

const HANDLE_COLUMN: ColumnDef<any> = {
  id: 'dragHandle',
  meta: { width: '26px', verticalAlign: 'middle' },
  header: () => <div />,
  cell: () => <DragHandleCell />,
};

interface DraggableRowProps extends DataTableRenderRowParams {
  dragType: string;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDragStart: () => void;
  onDragEnd: (didDrop: boolean) => void;
}

const DraggableRow = ({
  index,
  className,
  onClick,
  clickable,
  children,
  dragType,
  onMove,
  onDragStart,
  onDragEnd,
}: DraggableRowProps) => {
  const trRef = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag, preview] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: dragType,
    item: () => {
      onDragStart();
      return { index };
    },
    end: (_item, monitor) => onDragEnd(monitor.didDrop()),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    options: DRAG_SOURCE_OPTIONS,
  });

  const [, drop] = useDrop<DragItem>({
    accept: dragType,
    hover: (item, monitor) => {
      const node = trRef.current;
      if (!node) return;

      const dragIndex = item.index;
      if (dragIndex === index) return;

      const offset = monitor.getClientOffset();
      if (!offset) return;

      // 대상 행의 중간선을 지난 경우에만 재배열한다 (경계에서 떨리는 것을 막는다)
      const rect = node.getBoundingClientRect();
      const middleY = (rect.bottom - rect.top) / 2;
      const hoverY = offset.y - rect.top;
      if (dragIndex < index && hoverY < middleY) return;
      if (dragIndex > index && hoverY > middleY) return;

      onMove(dragIndex, index);
      // 재배열 후 드래그 중인 행의 위치가 바뀌었으므로 item에도 반영한다
      item.index = index;
    },
    // 반환값 자체는 쓰이지 않는다 — 드롭이 이 타깃 위에서 일어났음을 didDrop()으로 알리기 위한 핸들러
    drop: () => ({}),
  });

  // 드롭 타깃 · 드래그 프리뷰 모두 tr → 커서를 따라오는 프리뷰가 행 전체가 된다
  drop(preview(trRef));

  return (
    <tr
      ref={trRef}
      role={clickable ? "row" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={(event) => {
        if (clickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(className, isDragging && 'opacity-40')}
    >
      <DragHandleContext.Provider value={drag}>{children}</DragHandleContext.Provider>
    </tr>
  );
};

const DragDropTableInner = ({ columns, readOnly, onReorder, ...rest }: Props) => {
  /**
   * DndProvider는 격리 장치가 아니다 (매니저가 window 싱글턴으로 재사용된다).
   * drag type이 같으면 한 화면의 다른 인스턴스가 서로의 행을 받으므로 인스턴스별로 고유하게 만든다.
   */
  const dragType = `DATA_TABLE_ROW_${useId()}`;

  // 부모 데이터(cellData)는 드롭 전까지 건드리지 않는다 — 드래그 도중 dirty가 변하지 않는 유일한 장치
  const [previewRows, setPreviewRows] = useState<any[] | null>(null);
  // end 핸들러는 리렌더 이전에 실행될 수 있어 ref를 실제 값으로 둔다
  const previewRowsRef = useRef<any[] | null>(null);

  const { bodyScrollRef, startAutoScroll, stopAutoScroll } = useDragAutoScroll(dragType);

  const mergedColumns = useMemo(() => [HANDLE_COLUMN, ...columns], [columns]);

  const setPreview = (next: any[] | null) => {
    previewRowsRef.current = next;
    setPreviewRows(next);
  };

  // 드래그 중 부모 데이터가 교체된 경우 대비
  const rows = previewRows?.length === rest.cellData.length ? previewRows : rest.cellData;

  const handleDragStart = () => {
    setPreview(rest.cellData);
    startAutoScroll();
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const base = previewRowsRef.current ?? rest.cellData;
    if (fromIndex < 0 || fromIndex >= base.length) return;
    if (toIndex < 0 || toIndex >= base.length) return;

    const next = [...base];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setPreview(next);
  };

  const handleDragEnd = (didDrop: boolean) => {
    const next = previewRowsRef.current;

    // 원복과 커밋을 같은 핸들러에서 처리해 옛 순서가 한 프레임 비치지 않게 한다
    setPreview(null);
    stopAutoScroll();

    // 취소(esc · 테이블 밖 드롭)면 onReorder를 호출하지 않는다 → dirty 불변
    if (didDrop && next) onReorder(next);
  };

  const renderRow = (params: DataTableRenderRowParams) => (
    <DraggableRow
      {...params}
      dragType={dragType}
      onMove={handleMove}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  );

  return (
    <DataTable
      {...rest}
      columns={mergedColumns}
      cellData={rows}
      bodyScrollRef={bodyScrollRef}
      renderRow={readOnly ? undefined : renderRow}
    />
  );
};

/** 드래그앤 드롭으로 행 순서를 바꿀 수 있는 `DataTable` */
const DragDropDataTable = (props: Props) => (
  // useDrag/useDrop은 DndProvider의 자손에서만 호출할 수 있어 상태 · hook은 전부 Inner에 둔다
  <DndProvider backend={HTML5Backend}>
    <DragDropTableInner {...props} />
  </DndProvider>
);

export default DragDropDataTable;
