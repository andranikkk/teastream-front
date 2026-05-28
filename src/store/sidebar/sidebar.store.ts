import { create } from 'zustand';
import { SidebarStore } from './sidebar.types';
import { createJSONStorage, persist } from 'zustand/middleware';

export const sidebarStore = create(
  persist<SidebarStore>(
    (set) => ({
      isCollapsed: false,
      setIsCollapsed: (value: boolean) => set({ isCollapsed: value })
    }),
    {
      name: 'sidebar',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
