// import React from "react";
// import { Brand } from "./_components/Brand";
// import { SidebarProps } from "../types";
// import { Nav } from "../_components/Nav";
// import { cn } from "@/core/libs";

// export const DefaultSidebar = React.memo((props: SidebarProps) => {
//   return (
//     <div
//       className={cn(
//         "sidebar sidebar-default",
//         "hidden border-r bg-muted-foreground/5 md:block",
//         props.className,
//       )}
//     >
//       <div className=" sidebar-content flex h-full max-h-screen flex-col gap-2">
//         <Brand />
//         <div className="px-4 overflow-y-auto py-2">
//           <Nav items={props.menus} />
//         </div>
//       </div>
//     </div>
//   );
// });

// DefaultSidebar.displayName = "DashboardSidebar";


import { cn } from "@/core/libs";
import React from "react";
import { Nav } from "../_components/Nav";
import { SidebarProps } from "../types";
import { Brand } from "./_components/Brand";
// import { SidebarContext } from "@/features/_global";

export const DefaultSidebar = React.memo((props: SidebarProps) => {
  // const { visible } = useContext(SidebarContext);
  // const [visible, setVisible] = useState(false)

  return (
    <div
      className={cn(
        "sidebar sidebar-default",
        "hidden border-r bg-muted-foreground/5 md:block",
        "transition-all duration-300 ease-in-out",
        props.visible ? "w-[280px]" : "w-[60px]",
        props.className,
      )}
    >
      <div className="sidebar-content flex h-full max-h-screen items-center flex-col gap-2">
        <Brand isCollapsed={!props.visible} />
        <div className="px-4 overflow-y-auto py-2">
          <Nav items={props.menus} isCollapsed={!props.visible} />
        </div>
      </div>
    </div>
  );
});

DefaultSidebar.displayName = "DashboardSidebar";