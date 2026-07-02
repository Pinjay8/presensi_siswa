// import { cn } from '@/core/libs';
// import React, { useCallback, useContext, useMemo, useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { NavItemProps, NavProps } from '../types';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import { Icon, SidebarContext } from '@/features/_global';

// const NavItem = React.memo((props: NavItemProps) => {
//   const [visibleChild, setVisibleChild] = useState(false);

//   const sidebarContext = useContext(SidebarContext);
//   const hasChild = useMemo(
//     () => props.items && props.items?.length > 0,
//     [props.items],
//   );

//   const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
//     (e) => {
//       if (!hasChild) return sidebarContext.setVisible();
//       if (hasChild) {
//         e.preventDefault?.();
//       }
//       setVisibleChild((v) => !v);
//     },
//     [hasChild, sidebarContext],
//   );

//   return (
//     <li className="relative">
//       <NavLink
//         onClick={handleClick}
//         to={props.url || ''}
//         className={(p) =>
//           cn(
//             ' sidebar-nav-item flex gap-3 px-3 py-2 mb-2 items-center rounded-lg border-none hover:bg-muted-foreground/15 justify-between text-sm',
//             p.isActive && 'bg-muted-foreground/15',
//           )
//         }
//         end
//       >
//         <div className="flex flex-row items-center gap-2">
//           {props.icon && (
//             <Icon
//               iconName={props.icon}
//               className="sidebar-nav-item-icon h-4 w-4"
//             />
//           )}
//           {props.title}
//         </div>
//         {hasChild &&
//           (visibleChild ? (
//             <ChevronDown size={16} />
//           ) : (
//             <ChevronRight size={16} />
//           ))}
//       </NavLink>

//       {hasChild && visibleChild && (
//         <Nav isChild items={props.items || []} mobile={props.mobile} />
//       )}
//     </li>
//   );
// });

// export const Nav = React.memo(
//   ({ items = [], mobile = false, isChild }: NavProps) => {
//     return (
//       <ul className={cn(isChild && 'pl-4')}>
//         {items?.map((item, index) => {
//           return <NavItem key={index} {...item} mobile={mobile} />;
//         })}
//       </ul>
//     );
//   },
// );

// Nav.displayName = 'Nav';

import { cn } from "@/core/libs";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { NavItemProps, NavProps } from "../types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Icon, SidebarContext } from "@/features/_global";

interface NavItemPropsExtended extends NavItemProps {
  isCollapsed?: boolean;
}

const NavItem = React.memo(
  ({ isCollapsed, ...props }: NavItemPropsExtended) => {
    const [visibleChild, setVisibleChild] = useState(false);
    const sidebarContext = useContext(SidebarContext);
    const hasChild = useMemo(
      () => props.items && props.items?.length > 0,
      [props.items],
    );

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
      (e) => {
        if (!hasChild) return sidebarContext.setVisible();
        if (hasChild) {
          e.preventDefault?.();
        }
        setVisibleChild((v) => !v);
      },
      [hasChild, sidebarContext],
    );

    return (
      <li className="relative">
        <NavLink
          onClick={handleClick}
          to={props.url || ""}
          className={(p) =>
            cn(
              "sidebar-nav-item flex gap-3 px-3 py-2 mb-2 items-center rounded-lg border-none hover:bg-muted-foreground/15 justify-between text-sm",
              // p.isActive && "bg-muted-foreground/15",
              p.isActive &&
                "bg-primary text-primary-foreground border-l-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              isCollapsed && "justify-center px-2",
            )
          }
          end
        >
          <div
            className={cn(
              "flex flex-row items-center gap-2",
              isCollapsed && "justify-center",
            )}
          >
            {props.icon && (
              <Icon
                iconName={props.icon}
                className="sidebar-nav-item-icon h-4 w-4"
              />
            )}
            {!isCollapsed && props.title}
          </div>
          {hasChild &&
            !isCollapsed &&
            (visibleChild ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </NavLink>

        {hasChild && visibleChild && !isCollapsed && (
          <Nav
            isChild
            items={props.items || []}
            mobile={props.mobile}
            isCollapsed={isCollapsed}
          />
        )}
      </li>
    );
  },
);

export const Nav = React.memo(
  ({
    items = [],
    mobile = false,
    isChild,
    isCollapsed,
  }: NavProps & { isCollapsed?: boolean }) => {
    return (
      <ul className={cn(isChild && "pl-4")}>
        {/* {items?.map((item, index) => (
          <NavItem key={index} {...item} mobile={mobile} isCollapsed={isCollapsed} />
        ))} */}
        {items?.map((item, index) => {
          const { key, ...rest } = item;

          return (
            <NavItem
              key={key ?? index}
              {...rest}
              mobile={mobile}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </ul>
    );
  },
);

Nav.displayName = "Nav";
