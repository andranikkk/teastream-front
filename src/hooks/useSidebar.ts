import { sidebarStore } from '@/store/sidebar/sidebar.store';

export function useSidebar() {
  const isCollapsed = sidebarStore((state) => state.isCollapsed);
  const setIsCollapsed = sidebarStore((state) => state.setIsCollapsed);

  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);
  const toggle = () => setIsCollapsed(!isCollapsed);

  return { isCollapsed, collapse, expand, toggle };
}
