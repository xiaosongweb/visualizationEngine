import { create } from 'zustand';
import { produce } from 'immer';
import type { EditorState } from '../types/component';

export const useEditorStore = create<EditorState>((set) => ({
    dashboardId: null,
    meta: {
        name: 'Untitled Dashboard',
        width: 1920,
        height: 1080,
        backgroundColor: '#000000',
    },
    components: [],
    selectedComponentId: null,
    scale: 1,

    setDashboardId: (id) => set({ dashboardId: id }),

    updateMeta: (newMeta) => set(produce((state: EditorState) => {
        state.meta = { ...state.meta, ...newMeta };
    })),

    addComponent: (component) => set(produce((state: EditorState) => {
        state.components.push(component);
        state.selectedComponentId = component.id;
    })),

    updateComponent: (id, updates) => set(produce((state: EditorState) => {
        const index = state.components.findIndex(c => c.id === id);
        if (index !== -1) {
            state.components[index] = { ...state.components[index], ...updates };
        }
    })),

    removeComponent: (id) => set(produce((state: EditorState) => {
        state.components = state.components.filter(c => c.id !== id);
        if (state.selectedComponentId === id) {
            state.selectedComponentId = null;
        }
    })),

    selectComponent: (id) => set({ selectedComponentId: id }),

    setScale: (scale) => set({ scale }),
}));
