import * as React from "react"
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
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useSearch } from "@tanstack/react-router"
import ParamPagination, { PaginationProps } from "../param/pagination"
import CursorPagination from "../param/cursor-pagination"
import Loader from "../ui/loader"

interface DataTableProps {
    data: any
    columns: ColumnDef<any>[]
    loading?: boolean
    className?: string
    deleteSelecteds?: (val: number[]) => void
    rowSelection?: any
    setRowSelection?: (val: any) => void
    onRightClick?: (val: any) => void
    selecteds_count?: boolean
    onRowClick?: (data: any) => void
    disabled?: boolean
    rowColor?: (data: any) => string
    paginationProps?: PaginationProps,
    cursorPagination?: { next: string | null | undefined, previous: string | null | undefined, disabed?: boolean, changePageSize?: boolean, pageSizeParamName?: string, paramName?: string, },
    limitOffsetPagination?: { next: string | null | undefined, previous: string | null | undefined, disabed?: boolean, changePageSize?: boolean, pageSizeParamName?: string, paramName?: string, },
    viewAll?: boolean,
    head?: React.ReactNode
}

export function DataTable({
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
    limitOffsetPagination,
    viewAll,
    head
}: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [selecteds, setSelecteds] = React.useState<any>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const search: any = useSearch({ from: "__root__" })
    const table = useReactTable({
        data: data || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel({
            initialSync: true,
        }),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection ?? setSelecteds,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection: rowSelection ?? selecteds,
            pagination: {
                pageIndex:
                    search[paginationProps?.paramName || "page"] ?
                        +search[paginationProps?.paramName || "page"] - 1
                        : 0,
                pageSize:
                    search[paginationProps?.pageSizeParamName || "page_size"] ?
                        +search[
                        paginationProps?.pageSizeParamName || "page_size"
                        ]
                        : 10,
            },
        },
        manualPagination: !!paginationProps?.totalPages || !!cursorPagination || viewAll || !!limitOffsetPagination,
    })

    return (
        <main className="w-full">
              {!!head && <div className="px-4 py-4">{head}</div>}
            {selecteds_count && (
                <div className="flex flex-col gap-2 sm:flex-row items-end sm:items-center sm:justify-between pb-2">
                    <div
                        className={cn(
                            "flex-1 text-sm text-muted-foreground",
                            !deleteSelecteds && "text-end",
                        )}
                    >
                        {table.getFilteredRowModel().rows?.length} dan{" "}
                        {table.getFilteredSelectedRowModel().rows?.length} ta
                        qator tanlandi.
                    </div>
                    <div></div>
                </div>
            )}
            <div className="rounded-md border overflow-x-auto relative">
                {loading && (
                    <div className="absolute top-0 w-full h-full grid place-items-center bg-black/80 z-20">
                        <Loader size="responsive" variant="secondary" />
                    </div>
                )}
                <Table className={`${className} select-text bg-card`}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <TableRow key={index} className="border">
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <TableHead
                                            key={index}
                                            className={cn(
                                                "border border-b-2",
                                                rowSelection &&
                                                index === 0 &&
                                                "w-8",
                                            )}
                                        >
                                            {header.isPlaceholder ? null : (
                                                flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length > 0 ?
                            table.getRowModel().rows?.map((row, index) => (
                                <TableRow
                                    key={index}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    onContextMenu={(e) => {
                                        e.preventDefault()
                                        onRightClick?.(row.original)
                                    }}
                                    className={`hover:bg-border/50 ${rowColor?.(row.original)}`}
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell, index) => (
                                            <TableCell
                                                key={index}
                                                onClick={() =>
                                                    !notClick(cell.column.id) &&
                                                    onRowClick?.(
                                                        cell.row.original,
                                                    )
                                                }
                                                className={`cursor-pointer border ${notClick(cell.column.id) &&
                                                    "cursor-default"
                                                    }`}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                            : <TableRow>
                                <TableCell
                                    colSpan={columns?.length}
                                    className="h-24 text-center"
                                >
                                    Mavjud emas
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </div>
            {!viewAll && <div className="pt-4 mx-auto w-max pb-0.5">
                {paginationProps?.totalPages ?
                    <ParamPagination
                        disabled={disabled || loading}
                        {...paginationProps}
                    />:
                        <CursorPagination
                            {...cursorPagination as any}
                            disabled={disabled || loading}
                        />
                }
            </div>}
        </main>
    )
}

function notClick(id: string) {
    return ["code", "phone_number", 'phone', "Amallar", "Boshqarish", " ", "Telefon"].includes(id)
}
