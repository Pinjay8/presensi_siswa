import {
  AvatarImage,
  lang,
  Avatar,
  AvatarFallback,
  simpleEncode,
} from "@/core/libs";
import { ColumnDef } from "@tanstack/react-table";
import { UserDataModel } from "@/core/models";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
  useAlert,
} from "@/features/_global";
import { getStaticFile } from "@/core/utils";
import { Switch } from "@mui/material";
import { useState } from "react";
import { userService } from "@/core/services";

export const parentColumnWithFilter = ({
  columnFilter,
  onDelete,
}: {
  columnFilter?: BaseTableFilter;
  onDelete?: (row: any) => void;
}): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("fullName")}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const nameArr = row.original.name?.split(" ") || [];
        const initialName =
          nameArr && nameArr.length > 0
            ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
            : "-";
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={getStaticFile(String(row.original?.image))}
                alt={row.original.name}
              />
              <AvatarFallback>{initialName}</AvatarFallback>
            </Avatar>
            <p>{row.original.name}</p>
          </div>
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
            {lang.text("email")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "noTlp",
      accessorFn: (row) => row.noTlp,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("noHP")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "nik",
      accessorFn: (row) => row.nik,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIK"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "school.namaSekolah",
      accessorFn: (row) => row.school?.namaSekolah,
      ...(columnFilter?.schoolOptions &&
        columnFilter.schoolOptions.length > 0 && {
          meta: {
            filterLabel: lang.text("school"),
            filterPlaceholder: lang.text("selectSchool"),
            filterVariant: "select",
            filterOptions: columnFilter?.schoolOptions,
          },
        }),
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("schoolName")}
          </BaseTableHeader>
        );
      },
    },
    // {
    //   accessorKey: "student.name",
    //   accessorFn: (row) => row.student?.user?.name,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {lang.text("student")}
    //       </BaseTableHeader>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const nameArr = row.original.student?.user?.name?.split(" ") || [];
    //     const initialName =
    //       nameArr && nameArr.length > 0
    //         ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
    //         : "-";
    //         // console.log("ORTU: ", row)
    //     return (
    //       <div className="flex flex-row items-center gap-2">
    //         <Avatar>
    //           <AvatarImage
    //             src={getStaticFile(String(row.original?.student?.user?.image))}
    //             alt={row.original.student?.user?.name}
    //           />
    //           <AvatarFallback>{initialName}</AvatarFallback>
    //         </Avatar>
    //         <p>{row.original.student?.user?.name}</p>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "notifOrtuEnabled",
      accessorFn: (row) => row.notifOrtuEnabled,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("notify")}
          </BaseTableHeader>
        );
      },

      cell: ({ row }) => {
        const [loading, setLoading] = useState(false);
        const value = row.original.notifOrtuEnabled;

        const handleToggle = async (checked: boolean) => {
          setLoading(true);
          try {
            await userService.updateNotifParents(row.original.id, {
              notifOrtuEnabled: checked,
            });

            row.original.notifOrtuEnabled = checked;
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={value}
              disabled={loading}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            {loading && (
              <span className="text-xs text-gray-400">Saving...</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      size: 50,
      enableSorting: false,
      header: () => lang.text("action"),
      cell: ({ row }) => {
        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: row.original.id,
            text: row.original.name,
          }),
        );
        return (
          <BaseActionTable
            detailPath={`/parents/${encryptPayload}`}
            editPath={`/parents/edit/${encryptPayload}`}
            onDelete={() => onDelete?.(row.original)}
          />
        );
      },
    },
  ];
};
