// TOAST DataTable 이식 (Tailwind v3 → v4 + 자사 토큰).
// 원본: TOAST asset/components/common/contents/table/DataTable.tsx — API(props) 완전 보존.
//
// 이식 결정 기록 (본 구현 시 규칙화 대상):
//   tailwind-styled-components(tw.*)  → 일반 컴포넌트 (스타일 시스템 단일화)
//   bg-white                          → bg-surface        (시맨틱 리매핑 — 다크모드 대응)
//   border-semantic-lineGray          → border-line
//   text-neutral-darkGray             → text-fg-muted
//   hover:bg-primary-bg / 선택 행     → hover:bg-accent-bg / bg-accent-bg
//   rounded-3.75xl / rounded-l-3.75xl → rounded-card / rounded-l-card ('.' 키 v4 비호환)
//   h-200px                           → h-[200px] (스페이싱 커스텀 키 폐기, arbitrary로)
//   from-white (Dim 그라데이션)       → from-surface
//   typo-* / scrollbar-*              → 무변경 (토큰·유틸 이식으로 그대로 동작)
import { Fragment, type ReactNode, type Ref } from "react";
import {
  type ColumnDef,
  type Row,
  type RowData,
  type Table as TableInstance,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/ds/lib/cn";
import { ErrorState, NotiState } from "@/ds/ui/states";
import { getAppIcon } from "@/ds/icons";
import { useScrollExist } from "@/ds/hooks/useScrollExist";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData = unknown, TValue = unknown> {
    width?: string;
    verticalAlign?: "top" | "middle" | "bottom";
  }
}

/** 원본 @/types/common-components의 TableSortingProps — 발췌본에 없어 사용부 계약으로 복원 */
export interface TableSortingProps<T> {
  id: keyof T | (string & {});
  desc: boolean;
}

interface SortHeaderProps {
  id: string;
  columnName: string;
  sortState: TableSortingProps<any>[];
  toggle: () => void;
}

export interface DataTableRenderRowParams {
  rowData: any;
  index: number;
  className: string;
  onClick: () => void;
  clickable: boolean;
  children: ReactNode;
}

interface Props {
  columns: ColumnDef<any>[];
  cellData: any[];
  isEmpty: boolean;
  isError: boolean;
  maxHeight?: "fill" | "fit" | (string & {});
  selectedRows?: string[];
  minWidth?: string;
  onRowClick?: (rowData: any) => void;
  getRowId?: (rowData: any, index: number) => string;
  renderRow?: (params: DataTableRenderRowParams) => ReactNode;
  bodyScrollRef?: Ref<HTMLDivElement>;
}

const Dim = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "from-surface to-transparent absolute z-10 pointer-events-none select-none top-0 bottom-0 w-12 rounded-l-card",
      className,
    )}
  />
);

const Table = ({ children }: { children: ReactNode }) => (
  <table className="table-fixed w-full border-collapse">{children}</table>
);

const NotiBox = ({ children }: { children: ReactNode }) => (
  <div className="flex h-[200px] justify-center items-center">{children}</div>
);

const getEdgePosition = (index: number, lastIndex: number) => {
  if (index === 0) return "first";
  if (index === lastIndex) return "last";
  return "";
};

const renderCells = (row: Row<any>, clickable: boolean) => {
  const visibleCells = row.getVisibleCells();
  const lastIndex = visibleCells.length - 1;
  return visibleCells.map((cell, cellIndex) => {
    const position = getEdgePosition(cellIndex, lastIndex);
    const cellElement = (
      <td
        key={cell.id}
        style={{
          width: cell.column.columnDef.meta?.width ?? "auto",
          verticalAlign: cell.column.columnDef.meta?.verticalAlign ?? undefined,
        }}
        className={cn(
          "px-1 py-3 typo-regular_caption text-fg-muted break-all",
          clickable ? "cursor-pointer" : "cursor-default",
        )}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    );
    const spacer = <td key={`${position}-${cell.id}`} className="w-0 px-2.5 py-4" />;

    if (position === "first") return [spacer, cellElement];
    if (position === "last") return [cellElement, spacer];
    return cellElement;
  });
};

const DataRow = ({
  row,
  index,
  selectedRows,
  onRowClick,
  renderRow,
}: Readonly<{
  row: Row<any>;
  index: number;
  selectedRows?: string[];
  onRowClick?: (rowData: any) => void;
  renderRow?: (params: DataTableRenderRowParams) => ReactNode;
}>) => {
  const clickable = Boolean(onRowClick);
  const onClick = () => onRowClick?.(row.original);
  const className = cn(
    "border-t border-line hover:bg-accent-bg",
    index === 0 && "border-none",
    selectedRows?.includes(row.original.id) && "bg-accent-bg",
    clickable && "cursor-pointer",
  );
  const cells = renderCells(row, clickable);

  if (renderRow) {
    return (
      <Fragment>
        {renderRow({ rowData: row.original, index, className, onClick, clickable, children: cells })}
      </Fragment>
    );
  }

  return (
    <tr
      role={clickable ? "row" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={(event) => {
        if (clickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      className={className}
    >
      {cells}
    </tr>
  );
};

type DataTableContentProps = Readonly<{
  table: TableInstance<any>;
  isError: boolean;
  isEmpty: boolean;
  selectedRows?: string[];
  onRowClick?: (rowData: any) => void;
  renderRow?: (params: DataTableRenderRowParams) => ReactNode;
}>;

const DataTableContent = ({
  table,
  isError,
  isEmpty,
  selectedRows,
  onRowClick,
  renderRow,
}: DataTableContentProps) => {
  if (isError) {
    return (
      <NotiBox>
        <ErrorState
          message="목록을 불러오지 못했습니다."
          retryLabel="새로고침"
          retryIconClassname="text-fg-subtle"
        />
      </NotiBox>
    );
  }
  if (isEmpty) {
    return (
      <NotiBox>
        <NotiState message="저장된 데이터가 없습니다" />
      </NotiBox>
    );
  }

  const rows = table.getRowModel().rows;
  if (rows.length === 0) {
    return (
      <NotiBox>
        <NotiState message="일치하는 데이터가 없습니다" />
      </NotiBox>
    );
  }

  return (
    <Table>
      <tbody>
        {rows.map((row, index) => (
          <DataRow
            key={row.id}
            row={row}
            index={index}
            selectedRows={selectedRows}
            onRowClick={onRowClick}
            renderRow={renderRow}
          />
        ))}
      </tbody>
    </Table>
  );
};

const DataTable = (props: Props) => {
  const table = useReactTable({
    data: props.cellData,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: props.getRowId,
  });
  const { scrollRef, leftVisible, rightVisible } = useScrollExist();

  const isFillHeight = props.maxHeight === "fill";
  const isFitHeight = props.maxHeight === "fit";
  const isFlexHeight = isFillHeight || isFitHeight;

  return (
    <div
      className={cn(
        "relative bg-surface border border-line rounded-card overflow-hidden",
        isFlexHeight && "flex flex-col",
        isFillHeight && "h-full",
        isFitHeight && "min-h-0",
      )}
    >
      {leftVisible && <Dim className="bg-gradient-to-r left-0" />}
      {rightVisible && <Dim className="bg-gradient-to-l right-0" />}
      <div ref={scrollRef} className={cn("scrollbar-table", isFlexHeight && "flex-1 min-h-0")}>
        <div
          className={cn("bg-surface", isFlexHeight && "h-full flex flex-col")}
          style={{ minWidth: props.minWidth ?? undefined }}
        >
          <div className={cn(props.maxHeight && "pr-3", "bg-neutral-lightGray")}>
            <Table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => {
                  const lastIndex = headerGroup.headers.length - 1;
                  return (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => {
                        const position = getEdgePosition(index, lastIndex);
                        const thElement = (
                          <th
                            key={header.id}
                            style={{ width: header.column.columnDef.meta?.width ?? "auto" }}
                            className="px-1 py-3 typo-bold_smaller text-fg-muted text-left cursor-default select-none"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        );
                        const extraElement = (
                          <th key={`${position}-${header.id}`} className="w-0 px-2.5" />
                        );

                        if (position === "first") return [extraElement, thElement];
                        if (position === "last") return [thElement, extraElement];
                        return thElement;
                      })}
                    </tr>
                  );
                })}
              </thead>
            </Table>
          </div>

          <div
            className={cn(
              props.maxHeight && "py-1.5 pr-1.5",
              "bg-surface",
              isFlexHeight && "flex-1 min-h-0 overflow-hidden",
            )}
          >
            <div
              ref={props.bodyScrollRef}
              style={{
                overflowY: props.maxHeight ? "scroll" : "unset",
                maxHeight: isFlexHeight ? undefined : (props.maxHeight ?? "fit-content"),
              }}
              className={cn(
                props.maxHeight && "scrollbar-default",
                isFlexHeight && "h-full overflow-y-scroll",
              )}
            >
              <DataTableContent
                table={table}
                isError={props.isError}
                isEmpty={props.isEmpty}
                selectedRows={props.selectedRows}
                onRowClick={props.onRowClick}
                renderRow={props.renderRow}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DataTable.SortHeader = function SortHeader(props: SortHeaderProps) {
  const isSorted = props.sortState.find((s) => s.id === props.id)?.desc;

  return (
    <button type="button" onClick={props.toggle} className="flex items-center text-fg-muted cursor-pointer">
      {props.columnName}
      <span className="ml-1">
        {getAppIcon("ARROW_UP_DOWN", {
          size: 16,
          colorClass: cn(isSorted === undefined ? "text-fg-subtle" : "text-fg"),
        })}
      </span>
    </button>
  );
};

export default DataTable;
