export interface DashboardMeta {
    id: string;
    name: string;
    description?: string;
    creator: string;
    createTime: number;
    updateTime: number;
    status: 'draft' | 'published';
    tags: string[];
    thumbnail?: string; // URL or base64
    group?: string; // Folder ID
}

export interface DashboardFolder {
    id: string;
    name: string;
    parentId?: string;
}

export interface DashboardStoreState {
    dashboards: DashboardMeta[];
    folders: DashboardFolder[];

    // Actions
    addDashboard: (meta: Omit<DashboardMeta, 'id' | 'createTime' | 'updateTime'>) => void;
    updateDashboard: (id: string, meta: Partial<DashboardMeta>) => void;
    deleteDashboard: (id: string) => void;
    // ... more actions for folders
}
