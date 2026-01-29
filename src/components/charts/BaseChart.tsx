import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Spin } from 'antd';
import { useResizeDetector } from 'react-resize-detector';

interface BaseChartProps {
    options: any;
    loading?: boolean;
    style?: React.CSSProperties;
}

const BaseChart: React.FC<BaseChartProps> = ({ options, loading, style }) => {
    const chartRef = useRef<ReactECharts>(null);
    const { width, height, ref } = useResizeDetector();

    useEffect(() => {
        if (chartRef.current && width && height) {
            chartRef.current.getEchartsInstance().resize();
        }
    }, [width, height]);

    return (
        <div ref={ref} style={{ width: '100%', height: '100%', ...style }}>
            {loading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <Spin />
                </div>
            ) : (
                <ReactECharts
                    ref={chartRef}
                    option={options}
                    style={{ width: '100%', height: '100%' }}
                    theme="dark" // Assuming we set this up or it defaults to a darkish theme
                    opts={{ renderer: 'canvas' }}
                />
            )}
        </div>
    );
};

export default BaseChart;
