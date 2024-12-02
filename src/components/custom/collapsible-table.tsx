import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSearch } from "@tanstack/react-router";
import ParamPagination, { PaginationProps } from "../param/pagination";
import Loader from "../ui/loader";
import CursorPagination from "../param/cursor-pagination";

interface DataTableProps<TData> {
  data: TData[] | undefined;
  columns: ColumnDef<TData>[];
  loading?: boolean;
  className?: string;
  deleteSelecteds?: (val: number[]) => void;
  rowSelection?: any;
  setRowSelection?: (val: any) => void;
  onRightClick?: (val: any) => void;
  selecteds_count?: boolean;
  onRowClick?: (data: any) => void;
  disabled?: boolean;
  rowColor?: (data: any) => string;
  paginationProps?: PaginationProps;
  cursorPagination?: {
    next: string | null | undefined;
    previous: string | null | undefined;
    disabled?: boolean;
    changePageSize?: boolean;
    pageSizeParamName?: string;
    paramName?: string;
  };
  viewAll?: boolean;
  head?: React.ReactNode;
}

export function CollapsibleDataTable<TData>({
  data,
  columns,
  loading,
  className,
  deleteSelecteds,
  rowSelection,
  setRowSelection,
  onRightClick,
  selecteds_count,
  onRowClick,
  disabled,
  rowColor,
  paginationProps,
  cursorPagination,
  viewAll,
  head,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [selecteds, setSelecteds] = React.useState<any>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const search: any = useSearch({ from: "__root__" });

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelection ?? selecteds,
      pagination: {
        pageIndex: search[paginationProps?.paramName || "page"]
          ? +search[paginationProps?.paramName || "page"] - 1
          : 0,
        pageSize: search[paginationProps?.pageSizeParamName || "page_size"]
          ? +search[paginationProps?.pageSizeParamName || "page_size"]
          : 10,
      },
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection ?? setSelecteds,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel({ initialSync: true }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination:
      !!paginationProps?.totalPages || !!cursorPagination || viewAll,
    getSubRows: (row: any) => row.subRows,
  });

  return (
    <main className="w-full bg-card border rounded-md overflow-hidden pb-4">
      {!!head && <div className="px-4 py-4">{head}</div>}
      {selecteds_count && (
        <div className="flex flex-col gap-2 sm:flex-row items-end sm:items-center sm:justify-between pb-2">
          <div
            className={cn(
              "flex-1 text-sm text-muted-foreground",
              !deleteSelecteds && "text-end"
            )}
          >
            {table.getFilteredRowModel().rows.length} dan{" "}
            {table.getFilteredSelectedRowModel().rows.length} ta qator tanlandi.
          </div>
          <div></div>
        </div>
      )}
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute top-0 w-full h-full grid place-items-center bg-black/80 z-20">
            <Loader variant="secondary" />
          </div>
        )}
        <Table className={`${className} select-text bg-card`}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={i}
                    className={cn(
                      rowSelection && header.index === 0 && "w-8",
                      "text-xs px-4"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={i}
                  data-state={row.getIsSelected() && "selected"}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onRightClick?.(row.original);
                  }}
                  className={cn(
                    `hover:bg-border/50 border-none ${rowColor?.(row.original)}`,
                    !row.original?.id || row.getCanExpand() ? "bg-muted" : "",
                    row.getIsExpanded() && "bg-border/40",
                    "h-full"
                  )}
                  onClick={
                    row.getCanExpand()
                      ? row.getToggleExpandedHandler()
                      : () => {}
                  }
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={i}
                      onClick={() => {
                        onRowClick?.(cell.row.original);
                      }}
                      className={`cursor-pointer px-4 !h-10 !text-sm ${cell.column.id === "non-clickable" && "cursor-default"}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Ma'lumotlar topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter />
        </Table>
      </div>
      {!viewAll && (
        <div className="pt-4 mx-auto w-max">
          {paginationProps?.totalPages ? (
            <ParamPagination
              disabled={disabled || loading}
              {...paginationProps}
            />
          ) : cursorPagination ? (
            <CursorPagination
              {...cursorPagination}
              disabled={disabled || loading}
            />
          ) : (
            <ParamPagination
              disabled={disabled || loading}
              {...paginationProps}
              totalPages={table.getPageCount() || 1}
              pageSize={table.getState().pagination.pageSize}
            />
          )}
        </div>
      )}
    </main>
  );
}
