import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom';
import { useEditorStore } from '../../store/editorStore';
import Toolbar from './components/Toolbar';
import ComponentLibrary from './components/ComponentLibrary';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';

const { Sider, Content } = Layout;

const EditorLayout: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const setDashboardId = useEditorStore(state => state.setDashboardId);

    useEffect(() => {
        if (id) setDashboardId(id);
    }, [id, setDashboardId]);

    return (
        <Layout className="h-screen w-screen overflow-hidden">
            <Toolbar />
            <Layout className="overflow-hidden">
                <Sider width={240} className="border-r border-gray-800 bg-[#141414] z-10">
                    <ComponentLibrary />
                </Sider>

                <Content className="relative bg-[#0a0a0a]">
                    <Canvas />
                </Content>

                <Sider width={300} className="border-l border-gray-800 bg-[#141414] z-10">
                    <PropertyPanel />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default EditorLayout;
