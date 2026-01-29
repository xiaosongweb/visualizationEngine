import React, { useState, useEffect, useRef } from 'react';
import { Responsive } from 'react-grid-layout';
import { useEditorStore } from '@/store/editorStore';
import type { ComponentMeta } from '../../../types/component';
import ComponentRenderer from './ComponentRenderer';
import { DeleteOutlined, EditOutlined, DragOutlined } from '@ant-design/icons';
import { Button, Tooltip, Popconfirm } from 'antd';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Custom WidthProvider Implementation using ResizeObserver
const withWidth = (ComposedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const [width, setWidth] = useState(1200);
        const elementRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const element = elementRef.current;
            if (!element) return;

            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setWidth(entry.contentRect.width);
                }
            });

            resizeObserver.observe(element);
            // Initial width
            setWidth(element.offsetWidth);

            return () => {
                resizeObserver.disconnect();
            };
        }, []);

        return (
            <div ref={elementRef} className="w-full h-full" style={{ minHeight: '100%' }}>
                <ComposedComponent
                    {...props}
                    width={width}
                    measureBeforeMount={false}
                />
            </div>
        );
    };
};

// @ts-ignore - Ignoring type check for Responsive due to loose typing in v2
const ResponsiveGridLayout = withWidth(Responsive);

const GRID_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

// Define local Layout interface to avoid conflicts
interface RGLLayout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
}

// Toolbar for Component Actions
const ComponentToolbar: React.FC<{
    onEdit: () => void;
    onDelete: () => void;
}> = ({ onEdit, onDelete }) => (
    <div className="absolute -top-10 right-0 z-50 flex gap-1 rounded bg-[#1f1f1f] p-1 shadow-md border border-gray-700 animate-fadeIn">
        <Tooltip title="Drag Handle">
            <div className="drag-handle flex h-6 w-6 cursor-move items-center justify-center rounded hover:bg-gray-700 text-gray-400">
                <DragOutlined />
            </div>
        </Tooltip>
        <div className="h-6 w-[1px] bg-gray-700 mx-1"></div>
        <Tooltip title="Edit Configuration">
            <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="!text-blue-400 hover:!bg-blue-900/30"
            />
        </Tooltip>
        <Popconfirm
            title="Delete this component?"
            onConfirm={(e) => { e?.stopPropagation(); onDelete(); }}
            okText="Yes"
            cancelText="No"
        >
            <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
                className="!text-red-400 hover:!bg-red-900/30"
            />
        </Popconfirm>
    </div>
);

const CanvasComponentWrapper: React.FC<{
    component: ComponentMeta;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    style?: React.CSSProperties;
    className?: string;
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;
    onTouchEnd?: React.TouchEventHandler;
}> = ({ component, isSelected, onSelect, onDelete, style, className, onMouseDown, onMouseUp, onTouchEnd, ...props }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={style}
            className={`${className} group flex flex-col transition-all duration-200 ${isSelected ? 'z-10' : 'z-0'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            {...props}
        >
            {/* Outline & Selection State */}
            <div className={`absolute inset-0 pointer-events-none transition-colors border-2 rounded ${isSelected
                ? 'border-blue-500 bg-blue-500/5'
                : isHovered
                    ? 'border-blue-400/50 bg-white/5'
                    : 'border-transparent'
                }`} />

            {/* Component Toolbar - Visible on Hover or Selection */}
            {(isSelected || isHovered) && (
                <ComponentToolbar onEdit={onSelect} onDelete={onDelete} />
            )}

            {/* Component Body */}
            <div className="flex-1 w-full h-full overflow-hidden relative bg-[#1f1f1f] rounded shadow-sm">
                <ComponentRenderer component={component} />
            </div>
        </div>
    );
};

const Canvas: React.FC = () => {
    const { components, scale, selectComponent, selectedComponentId, updateComponent, removeComponent } = useEditorStore();
    const [layouts, setLayouts] = useState<{ lg: RGLLayout[] }>({ lg: [] });

    // Sync store components to layout
    useEffect(() => {
        const currentLayout = components.map(c => ({
            i: c.id,
            x: c.layout?.x || 0,
            y: c.layout?.y || 0,
            w: c.layout?.w || 4,
            h: c.layout?.h || 6,
        }));
        setLayouts({ lg: currentLayout });
    }, [components]);

    const handleLayoutChange = (currentLayout: RGLLayout[]) => {
        // Update all components with new positions
        currentLayout.forEach(l => {
            const existing = components.find(c => c.id === l.i);
            if (existing) {
                // Check if layout actually changed to avoid infinite loop if store update triggers re-render
                // But RGL handles this usually.
                updateComponent(l.i, {
                    layout: {
                        ...existing.layout, // Preserve zIndex etc
                        x: l.x,
                        y: l.y,
                        w: l.w,
                        h: l.h
                    }
                });
            }
        });
    };

    return (
        <div className="h-full w-full overflow-auto bg-[#0a0a0a] p-10">
            <div
                className="relative mx-auto transition-transform origin-top shadow-2xl"
                style={{
                    width: '100%', // Responsive width
                    minHeight: '100vh',
                    transform: `scale(${scale})`, // Keep scale for zooming entire canvas if needed
                    transformOrigin: '50% 0'
                }}
            >
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={GRID_COLS}
                    rowHeight={30}
                    draggableHandle=".drag-handle"
                    onLayoutChange={handleLayoutChange}
                    margin={[10, 10]}
                    containerPadding={[0, 0]}
                    isDraggable
                    isResizable
                    compactType="vertical" // Auto-sorting: compact vertically
                    preventCollision={false} // Allow pushing
                >
                    {components.map(component => (
                        <div key={component.id} data-grid={{
                            x: component.layout?.x || 0,
                            y: component.layout?.y || 0,
                            w: component.layout?.w || 4,
                            h: component.layout?.h || 6,
                        }}>
                            <CanvasComponentWrapper
                                component={component}
                                isSelected={selectedComponentId === component.id}
                                onSelect={() => selectComponent(component.id)}
                                onDelete={() => removeComponent(component.id)}
                            />
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default Canvas;
