import React, { Suspense } from 'react';
import { Spin } from 'antd';
import type { ComponentMeta } from '../../../types/component';

// Lazy load components
const LineChart = React.lazy(() => import('../../../components/charts/LineChart'));
const BarChart = React.lazy(() => import('../../../components/charts/BarChart'));

const ComponentRenderer: React.FC<{ component: ComponentMeta }> = ({ component }) => {
    const renderContent = () => {
        // Extract config from style or data.config depending on where we store it
        // For now, let's assume visual config is in 'style' and data config is separate
        // In a real app, we might merge them
        const config = component.style;

        switch (component.type) {
            case 'LineChart':
                return <LineChart config={config as any} data={undefined} />;
            case 'BarChart':
                return <BarChart config={config as any} data={undefined} />;
            default:
                return (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        Unknown Component: {component.type}
                    </div>
                );
        }
    };

    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Spin /></div>}>
            {renderContent()}
        </Suspense>
    );
};

export default ComponentRenderer;
