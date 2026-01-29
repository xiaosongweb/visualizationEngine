import React from 'react';
import BaseChart from './BaseChart';

interface LineChartProps {
    data?: any[];
    config?: {
        lineColor?: string;
        lineWidth?: number;
        showArea?: boolean;
    };
}

// Mock data generator if no data provided
const getMockData = () => {
    const x = [];
    const y = [];
    for (let i = 0; i < 7; i++) {
        x.push(`Day ${i + 1}`);
        y.push(Math.floor(Math.random() * 100));
    }
    return { x, y };
};

const LineChart: React.FC<LineChartProps> = ({ data, config }) => {
    const mock = getMockData();

    const option = {
        grid: { top: 30, right: 20, bottom: 30, left: 40 },
        xAxis: {
            type: 'category',
            data: mock.x,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: data || mock.y,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: config?.lineColor || '#1677ff',
                    width: config?.lineWidth || 2,
                },
                areaStyle: config?.showArea ? { opacity: 0.2 } : undefined,
            },
        ],
        tooltip: { trigger: 'axis' },
    };

    return <BaseChart options={option} />;
};

export default LineChart;
