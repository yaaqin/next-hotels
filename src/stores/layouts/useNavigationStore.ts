import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { create } from 'zustand';
import { useMenuList } from '@/src/hooks/query/menu/list';
import { buildNavigation, matchSidebarByPath } from '@/src/utils/menu';

// export type SidebarKey = 'site' | 'finance' | 'food' | 'user' | 'dashboard';

interface NavigationState {
  activeSidebar: string;
  setActiveSidebar: (key: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSidebar: 'dashboard',
  setActiveSidebar: (key) => set({ activeSidebar: key }),
}));

// NAVIGATION + menu dari Access Control
export function useNavigation() {
  const { data: menus } = useMenuList();
  return useMemo(() => buildNavigation(menus?.data), [menus]);
}

// Parent menu aktif diturunkan dari URL, jadi tetap benar setelah refresh.
export function useActiveSidebar() {
  const pathname = usePathname();
  const navigation = useNavigation();
  const { activeSidebar, setActiveSidebar } = useNavigationStore();
  const matched = matchSidebarByPath(navigation, pathname, activeSidebar);

  useEffect(() => {
    if (matched && matched !== activeSidebar) setActiveSidebar(matched);
  }, [matched, activeSidebar, setActiveSidebar]);

  return matched ?? activeSidebar;
}
