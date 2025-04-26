export const authKeys = {
  current: () => ["auth", "current"] as const,
};

export const menuKeys = {
  all: () => ["menu"] as const,
  list: () => [...menuKeys.all(), "list"] as const,
  detail: (id: string) => [...menuKeys.all(), "detail", id] as const,
};
