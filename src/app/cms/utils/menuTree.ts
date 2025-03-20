import { Menu } from "../menu/page";

export function createMenuTree(menus: Menu[]) {
  if (!menus || menus.length === 0) {
    return { menuMap: new Map<number, Menu>(), rootMenus: [] };
  }

  const map = new Map<number, Menu>();
  const roots: Menu[] = [];

  menus.forEach((menu) => {
    if (menu && menu.id) {
      map.set(menu.id, menu);
      if (!menu.parentId) {
        roots.push(menu);
      }
    }
  });

  roots.sort((a, b) => a.sortOrder - b.sortOrder);

  const sortChildren = (menu: Menu) => {
    if (menu.children && menu.children.length > 0) {
      menu.children.sort((a, b) => a.sortOrder - b.sortOrder);
      menu.children.forEach(sortChildren);
    }
  };

  roots.forEach(sortChildren);

  return { menuMap: map, rootMenus: roots };
}
