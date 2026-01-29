import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { DashboardMeta, DashboardStoreState } from '../types/dashboard';

export const useDashboardStore = create<DashboardStoreState>()(
    persist(
        (set) => ({
            dashboards: [
                {
                    id: 'mock-1',
                    name: 'System Monitor',
                    description: 'Real-time server metrics',
                    creator: 'Admin',
                    createTime: Date.now() - 1000000,
                    updateTime: Date.now(),
                    status: 'published',
                    tags: ['Prod', 'Ops'],
                },
                {
                    id: 'mock-2',
                    name: 'Sales Overview',
                    description: 'Q1 Revenue Data',
                    creator: 'Analyst',
                    createTime: Date.now() - 2000000,
                    updateTime: Date.now() - 500000,
                    status: 'draft',
                    tags: ['Business'],
                },
            ],
            folders: [],

            addDashboard: (meta) => set((state) => ({
                dashboards: [
                    ...state.dashboards,
                    {
                        ...meta,
                        id: uuidv4(),
                        createTime: Date.now(),
                        updateTime: Date.now(),
                    } as DashboardMeta
                ]
            })),

            updateDashboard: (id, meta) => set((state) => ({
                dashboards: state.dashboards.map(d =>
                    d.id === id ? { ...d, ...meta, updateTime: Date.now() } : d
                )
            })),

            deleteDashboard: (id) => set((state) => ({
                dashboards: state.dashboards.filter(d => d.id !== id)
            })),
        }),
        {
            name: 'dashboard-storage',
        }
    )
);
