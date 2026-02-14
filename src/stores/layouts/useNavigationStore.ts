import { create } from 'zustand';

export type SidebarKey = 'site' | 'finance' | 'food' | 'user' | 'dashboard';

interface NavigationState {
  activeSidebar: SidebarKey;
  setActiveSidebar: (key: SidebarKey) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSidebar: 'site',
  setActiveSidebar: (key) => set({ activeSidebar: key }),
}));
