import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/libs";
import { Bell, BellRing } from "lucide-react";

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white border-md border-1">
          <BellRing className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem>Notifikasi 1</DropdownMenuItem>

        <DropdownMenuItem>Notifikasi 2</DropdownMenuItem>

        <DropdownMenuItem>Lihat Semua</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
