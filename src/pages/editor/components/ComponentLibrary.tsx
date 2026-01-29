import React from 'react';
import { Button } from 'antd';
import {
    BarChartOutlined, LineChartOutlined, PieChartOutlined,
    TableOutlined, DashboardOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '@/store/editorStore';
import type { ComponentMeta } from '../../../types/component';

const ComponentLibrary: React.FC = () => {
    const addComponent = useEditorStore(state => state.addComponent);
    // const { token } = theme.useToken();

    const handleAdd = (type: string, name: string) => {
        // Basic template for new components
        const baseComponent: ComponentMeta = {
            id: uuidv4(),
            type,
            name,
            layout: { x: 50, y: 50, w: 400, h: 300, zIndex: 1 },
            style: {},
            data: {
                sourceType: 'static',
                queryType: 'simple',
                formatType: 'timeSeries',
                config: {}
            },
            events: []
        };

        // Specific defaults based on type
        if (type === 'LineChart') {
            baseComponent.style = { lineColor: '#1677ff', lineWidth: 2, showArea: true };
        } else if (type === 'BarChart') {
            baseComponent.style = { barColor: '#1677ff', barWidth: 20, borderRadius: 4, showLabel: true };
        }

        addComponent(baseComponent);
    };

    const components = [
        { type: 'LineChart', name: 'Line Chart', icon: <LineChartOutlined /> },
        { type: 'BarChart', name: 'Bar Chart', icon: <BarChartOutlined /> },
        { type: 'PieChart', name: 'Pie Chart', icon: <PieChartOutlined /> },
        { type: 'MetricsCard', name: 'Metrics Card', icon: <DashboardOutlined /> },
        { type: 'Table', name: 'Data Table', icon: <TableOutlined /> },
    ];

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-gray-800 p-3 text-sm font-medium text-gray-400">
                Components
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
                {components.map(c => (
                    <Button
                        key={c.type}
                        className="flex h-20 flex-col items-center justify-center gap-2 border-gray-700 bg-[#1f1f1f] text-gray-300 hover:border-blue-500 hover:text-blue-500"
                        onClick={() => handleAdd(c.type, c.name)}
                    >
                        <span className="text-xl">{c.icon}</span>
                        <span className="text-xs">{c.name}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ComponentLibrary;
