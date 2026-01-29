export interface ComponentStyle {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    [key: string]: any;
}

export interface ComponentDataConfig {
    sourceType: 'static' | 'api' | 'variable';
    queryType: 'sql' | 'promql' | 'json' | 'simple';
    formatType: 'timeSeries' | 'scalar' | 'list';
    config: {
        url?: string;
        method?: 'GET' | 'POST';
        query?: string;
        queryObj?: any;
        interval?: number;
    };
    transform?: string;
}

export interface ComponentMeta {
    id: string;
    type: string; // 'LineChart', 'BarChart', etc.
    name: string;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
        zIndex: number;
        group?: string;
    };
    style: ComponentStyle;
    data: ComponentDataConfig;
    events: Array<{
        trigger: string;
        action: string;
        payload: any;
    }>;
}

export interface EditorState {
    dashboardId: string | null;
    meta: {
        name: string;
        width: number;
        height: number;
        backgroundColor: string;
    };
    components: ComponentMeta[];
    selectedComponentId: string | null;
    scale: number;

    // Actions
    setDashboardId: (id: string) => void;
    updateMeta: (meta: Partial<EditorState['meta']>) => void;
    addComponent: (component: ComponentMeta) => void;
    updateComponent: (id: string, updates: Partial<ComponentMeta>) => void;
    removeComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;
    setScale: (scale: number) => void;
}
