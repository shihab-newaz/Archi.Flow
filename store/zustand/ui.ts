import { create, type StateCreator } from 'zustand'

interface UiState {
  isSidebarOpen: boolean
  activeModal: string | null
  toggleSidebar: (nextState?: boolean) => void
  setActiveModal: (modal: string | null) => void
}

const uiStore: StateCreator<UiState> = (set) => ({
  isSidebarOpen: true,
  activeModal: null,
  toggleSidebar: (nextState?: boolean) =>
    set((state) => ({
      isSidebarOpen:
        typeof nextState === 'boolean' ? nextState : !state.isSidebarOpen,
    })),
  setActiveModal: (modal: string | null) => set({ activeModal: modal }),
  // theme is now handled by next-themes
})

export const useUiStore = create<UiState>(uiStore)
