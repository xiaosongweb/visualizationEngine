import React from 'react';
import { Form, Input, InputNumber, Collapse, Switch, ColorPicker } from 'antd';
import { useEditorStore } from '@/store/editorStore';

const PropertyPanel: React.FC = () => {
    const { components, selectedComponentId, updateComponent } = useEditorStore();
    const selectedComponent = components.find(c => c.id === selectedComponentId);

    // Memoize form initial values to avoid reset on every keystroke if not careful, 
    // but key={selectedComponent.id} handles the reset on selection change.

    if (!selectedComponent) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-[#141414] text-gray-500">
                <div className="text-center">
                    <p>No component selected</p>
                    <p className="text-xs">Click on a component to edit</p>
                </div>
            </div>
        );
    }

    const renderStyleForm = () => {
        switch (selectedComponent.type) {
            case 'LineChart':
                return (
                    <div className="grid grid-cols-1 gap-2">
                        <Form.Item label="Line Color" name={['style', 'lineColor']}>
                            <ColorPicker showText />
                        </Form.Item>
                        <Form.Item label="Line Width" name={['style', 'lineWidth']}>
                            <InputNumber min={1} max={10} />
                        </Form.Item>
                        <Form.Item label="Show Area" name={['style', 'showArea']} valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                );
            case 'BarChart':
                return (
                    <div className="grid grid-cols-1 gap-2">
                        <Form.Item label="Bar Color" name={['style', 'barColor']}>
                            <ColorPicker showText />
                        </Form.Item>
                        <Form.Item label="Bar Width" name={['style', 'barWidth']}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Border Radius" name={['style', 'borderRadius']}>
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item label="Show Label" name={['style', 'showLabel']} valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                );
            default:
                return <div>No style options</div>;
        }
    };

    return (
        <div className="flex h-full flex-col bg-[#141414]">
            <div className="border-b border-gray-800 p-3 text-sm font-medium text-gray-400">
                Properties
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <Form
                    layout="vertical"
                    initialValues={selectedComponent}
                    onValuesChange={(_, allValues) => updateComponent(selectedComponent.id, allValues)}
                    key={selectedComponent.id}
                    size="small"
                >
                    <Collapse
                        defaultActiveKey={['basic', 'layout', 'style']}
                        ghost
                        items={[
                            {
                                key: 'basic',
                                label: 'General',
                                children: (
                                    <>
                                        <Form.Item label="Name" name="name">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Type">
                                            <Input disabled value={selectedComponent.type} />
                                        </Form.Item>
                                    </>
                                )
                            },
                            {
                                key: 'style',
                                label: 'Visual Style',
                                children: renderStyleForm()
                            },
                            {
                                key: 'layout',
                                label: 'Layout',
                                children: (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Form.Item label="X" name={['layout', 'x']}>
                                            <InputNumber className="w-full" />
                                        </Form.Item>
                                        <Form.Item label="Y" name={['layout', 'y']}>
                                            <InputNumber className="w-full" />
                                        </Form.Item>
                                        <Form.Item label="W" name={['layout', 'w']}>
                                            <InputNumber className="w-full" />
                                        </Form.Item>
                                        <Form.Item label="H" name={['layout', 'h']}>
                                            <InputNumber className="w-full" />
                                        </Form.Item>
                                        <Form.Item label="Layer" name={['layout', 'zIndex']}>
                                            <InputNumber className="w-full" />
                                        </Form.Item>
                                    </div>
                                )
                            },
                            {
                                key: 'data',
                                label: 'Data Source',
                                children: (
                                    <div className="text-xs text-gray-500">
                                        Data Source configuration to be implemented in Phase 3.
                                        Currently using Mock Data.
                                    </div>
                                )
                            }
                        ]}
                    />
                </Form>
            </div>
        </div>
    );
};

export default PropertyPanel;
