import { Menu } from "@/app/cms/menu/page";

export interface DragItem {
  id: number;
  type: string;
  parentId?: number;
  index: number;
}

export interface MenuItemProps {
  menu: Menu;
  level: number;
  onEditMenu: (menu: Menu) => void;
  expanded: boolean;
  onToggle: () => void;
  onMoveMenu: (
    draggedId: number,
    targetId: number,
    position: "inside" | "before" | "after"
  ) => void;
  onDeleteMenu: (menuId: number) => void;
  onAddMenu: (parentId?: number, position?: "before" | "after") => void;
  index: number;
}

export interface MenuListProps {
  onEditMenu: (menu: Menu) => void;
}
