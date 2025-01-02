import { LucideIcon } from "lucide-react";

export type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export type SidebarMenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
};