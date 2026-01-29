import React from 'react';
import { Button, Space, Slider, Switch, Typography } from 'antd';
import {
    SaveOutlined, CloudUploadOutlined, ArrowLeftOutlined,
    UndoOutlined, RedoOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/store/editorStore';

const { Text } = Typography;

const Toolbar: React.FC = () => {
    const navigate = useNavigate();
    const { scale, setScale, meta } = useEditorStore();

    return (
        <div className="flex h-14 items-center justify-between border-b border-gray-800 bg-[#141414] px-4 shadow-sm">
            <div className="flex items-center gap-4">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined className="text-gray-400" />}
                    onClick={() => navigate('/')}
                />
                <div className="flex flex-col">
                    <Text strong className="text-white">{meta.name}</Text>
                    <Text type="secondary" className="text-xs">1920 x 1080</Text>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <Space>
                    <Button type="text" icon={<UndoOutlined className="text-gray-400" />} />
                    <Button type="text" icon={<RedoOutlined className="text-gray-400" />} />
                </Space>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Scale</span>
                    <Slider
                        min={10}
                        max={200}
                        value={scale * 100}
                        onChange={(v) => setScale(v / 100)}
                        style={{ width: 100 }}
                    />
                    <span className="text-xs text-gray-400">{Math.round(scale * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                    <Switch checkedChildren={<EyeOutlined />} unCheckedChildren={<EyeOutlined />} />
                    <span className="text-xs text-gray-400">Preview</span>
                </div>
            </div>

            <Space>
                <Button icon={<SaveOutlined />}>Save</Button>
                <Button type="primary" icon={<CloudUploadOutlined />}>Publish</Button>
            </Space>
        </div>
    );
};

export default Toolbar;
