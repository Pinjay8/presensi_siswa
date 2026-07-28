import { lang, simpleEncode } from "@/core/libs";
import { SchedulerDataModel } from "@/core/models";
import {
    BaseActionTable,
    BaseTableFilter,
    BaseTableHeader,
} from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";

export const schedulerColumns = ({ columnFilter, onDelete }: { columnFilter?: BaseTableFilter, onDelete?: (scheduler: any) => void }): ColumnDef<SchedulerDataModel>[] => {
    return [
        {
            id: "no",
            header: "No",
            size: 60,
            enableSorting: false,
            cell: ({ row, table }) => {
                const { pageIndex, pageSize } = table.getState().pagination;

                const visibleIndex = table
                    .getRowModel()
                    .rows.findIndex((r) => r.id === row.id);

                return pageIndex * pageSize + visibleIndex + 1;
            },
        },
        {
            accessorKey: "namaSchedule",
            accessorFn: (row) => row.name,
            header: ({ column }) => {
                return (
                    <BaseTableHeader
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {lang.text("scheduleName")}
                    </BaseTableHeader>
                );
            },
            cell: ({ row }) => {
                return <span>{row.original.name}</span>
            },
        },
        {
            accessorKey: "description",
            size: 250,
            accessorFn: (row) => row.description,
            enableSorting: false,
            header: ({ column }) => {
                return (
                    <BaseTableHeader>{lang.text("schedulerDescription")}</BaseTableHeader>
                );
            },
            cell: ({ row }) => {
                return <span>{row.original.description || "-"}</span>
            },
        },
        {
            accessorKey: "scheduleType",
            // size: 100,
            accessorFn: (row) => row.type,
            enableSorting: false,
            header: ({ column }) => {
                return (
                    <BaseTableHeader

                    >
                        {lang.text("schedulerType")}</BaseTableHeader>
                );
            },
            cell: ({ row }) => {
                return <span style={{ textTransform: 'capitalize !important' }}>{row.original.type}</span>
            },
        },
        {
            accessorKey: "id",
            accessorFn: (row) => row.id,
            size: 50,
            enableSorting: false,
            header: () => {
                return (
                    <BaseTableHeader>{lang.text("action")}</BaseTableHeader>
                )
            },
            cell: ({ row }) => {
                const encryptPayload = simpleEncode(
                    JSON.stringify({ id: row.original.id, text: row.original.name }),
                );
                // console.log("encrypt payload: ",encryptPayload)
                // const encryptPayload = JSON.stringify({ id: row.original.id, text: row.original.namaKelas })
                return (
                    <BaseActionTable
                        detailPath={`/scheduler/${encryptPayload}`}
                        editPath={`/scheduler/edit/${encryptPayload}`}
                        // deletePath={`/scheduler/delete/${encryptPayload}`}
                        onDelete={() => onDelete?.(row.original)}
                    />
                );
            },
        },
    ]
}

export const schedulerDataFallback: SchedulerDataModel[] = [];