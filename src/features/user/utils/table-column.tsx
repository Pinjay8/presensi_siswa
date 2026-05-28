import { ColumnDef } from "@tanstack/react-table";
import { Badge, dayjs, lang, simpleEncode } from "@/core/libs";
import { BaseActionTable, BaseTableHeader } from "@/features/_global";
import { UserDataModel } from "@/core/models";

export const adminUserColumns = (): ColumnDef<UserDataModel>[] => {
  return [
    {
      accessorKey: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("adminName")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "email",
      accessorFn: (row) => row.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("adminEmail")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "role",
      accessorFn: (row) => row.role,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("role")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "isVerified",
      accessorFn: (row) => row.isVerified,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("isVerified")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const isActive = row.original.isVerified;
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? lang.text("isVerified") : lang.text("isNotVerified")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastLogin",
      accessorFn: (row) => row.lastLogin,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("lastLogin")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <span>
            {dayjs(row.original.lastLogin).format("HH:mm, DD MMM YYYY")}
          </span>
        );
      },
    },
    {
      accessorKey: "isActive",
      accessorFn: (row) => row.isActive,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("status")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const isActive = row.original.isActive === 2;
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        );
      },
    },

    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      size: 50,
      enableSorting: false,
      header: () => {
        return null;
      },
      cell: ({ row }) => {
        const encryptPayload = simpleEncode(
          JSON.stringify({ id: row.original.id, text: row.original.name }),
        );
        return (
          <BaseActionTable
            // detailPath={`/admin/users/${encryptPayload}`}
            editPath={`/admin/users/edit/${encryptPayload}`}
            // deletePath={`/admin/users/delete/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const adminUserDataFallback: UserDataModel[] = [];
