import React from 'react';
import BaseChart from './BaseChart';

interface BarChartProps {
    data?: any[];
    config?: {
        barColor?: string;
        barWidth?: number;
        showLabel?: boolean;
        borderRadius?: number;
    };
}

const getMockData = () => {
    const x = [];
    const y = [];
    for (let i = 0; i < 7; i++) {
        x.push(`Day ${i + 1}`);
        y.push(Math.floor(Math.random() * 100));
    }
    return { x, y };
};

const BarChart: React.FC<BarChartProps> = ({ data, config }) => {
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
                type: 'bar',
                barWidth: config?.barWidth || 'auto',
                itemStyle: {
                    color: config?.barColor || '#1677ff',
                    borderRadius: [config?.borderRadius || 0, config?.borderRadius || 0, 0, 0],
                },
                label: {
                    show: config?.showLabel || false,
                    position: 'top',
                },
            },
        ],
        tooltip: { trigger: 'axis' },
    };

    return <BaseChart options={option} />;
};

export default BarChart;
