export interface Menu {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT";
  url?: string;
  targetId?: number;
  displayPosition: string;
  visible: boolean;
  sortOrder: number;
  parentId?: number;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
}

export interface DragItem {
  id: number;
  type: Menu["type"];
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
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  onDeleteMenu: (id: number) => void;
  onAddMenu: (
    parentId: number | undefined,
    position: "before" | "after" | "inside"
  ) => void;
  index: number;
}

export interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (id: number) => void;
  onMoveMenu: (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  isLoading: boolean;
}

export interface MenuFormProps {
  menu?: Menu | null;
  onSubmit: (menu: Omit<Menu, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}
