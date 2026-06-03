import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { useProfile } from "@/features/profile";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import { Link } from "react-router-dom";

export interface BaseActionTableProps {
  editPath?: string;
  deletePath?: string;
  detailPath?: string;
  waliKelasPath?: string;
  onEdit?: () => void; // Add onEdit callback
  onWaliKelas?: () => void;
}

export const BaseActionTable = React.memo((props: BaseActionTableProps) => {
  const profile = useProfile();
  const isTeacher = profile?.user?.role === "guru";
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {props.detailPath && (
            <DropdownMenuItem asChild>
              <Link to={props.detailPath}>{lang.text("seeDetails")}</Link>
            </DropdownMenuItem>
          )}
          {props.editPath && (
            <DropdownMenuItem asChild>
              <Link to={props.editPath}>{lang.text("edit")}</Link>
            </DropdownMenuItem>
          )}
          {props.onEdit && (
            <DropdownMenuItem onClick={props.onEdit}>
              {lang.text("edit")}
            </DropdownMenuItem>
          )}
          {props.deletePath && (
            <DropdownMenuItem asChild>
              <Link to={props.deletePath}>{lang.text("delete")}</Link>
            </DropdownMenuItem>
          )}

          {props.onWaliKelas && (
            <DropdownMenuItem onClick={props.onWaliKelas}>
              Wali Kelas
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});
