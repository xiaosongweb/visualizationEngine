import React, { useState, useMemo } from 'react';
import {
    Layout, Typography, Button, Input, Select,
    Segmented, Empty, Card, Tag, Dropdown, Table,
    Modal, Form, message
} from 'antd';
import {
    PlusOutlined, AppstoreOutlined, BarsOutlined,
    SearchOutlined, MoreOutlined, CopyOutlined,
    DeleteOutlined, EditOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDashboardStore } from '../../store/dashboardStore';

dayjs.extend(relativeTime);

const { Header, Content } = Layout;
const { Title } = Typography;

const Workspace: React.FC = () => {
    const navigate = useNavigate();
    const { dashboards, addDashboard, deleteDashboard } = useDashboardStore();

    const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState<'updateTime' | 'createTime' | 'name'>('updateTime');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Filter & Sort
    const filteredDashboards = useMemo(() => {
        let result = [...dashboards];

        if (searchText) {
            result = result.filter(d =>
                d.name.toLowerCase().includes(searchText.toLowerCase()) ||
                d.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        result.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            // @ts-ignore
            return (b[sortBy] || 0) - (a[sortBy] || 0);
        });

        return result;
    }, [dashboards, searchText, sortBy]);

    // Actions
    const handleCreate = (values: any) => {
        addDashboard({
            name: values.name,
            description: values.description,
            creator: 'CurrentUser',
            status: 'draft',
            tags: [],
        });
        setIsModalOpen(false);
        form.resetFields();
        message.success('Dashboard created successfully');
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        Modal.confirm({
            title: 'Are you sure delete this dashboard?',
            onOk: () => {
                deleteDashboard(id);
                message.success('Deleted successfully');
            }
        });
    };

    const renderCardView = () => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDashboards.map(dashboard => (
                <Card
                    key={dashboard.id}
                    hoverable
                    className="overflow-hidden border-gray-800 bg-[#1f1f1f] transition-colors hover:border-blue-600"
                    styles={{ body: { padding: 0 } }}
                    onClick={() => navigate(`/editor/${dashboard.id}`)}
                    cover={
                        <div className={`h-40 w-full bg-[#141414] object-cover opacity-80 ${!dashboard.thumbnail ? 'flex items-center justify-center' : ''}`}>
                            {dashboard.thumbnail ? (
                                <img src={dashboard.thumbnail} alt={dashboard.name} />
                            ) : (
                                <span className="text-gray-600">No Preview</span>
                            )}
                        </div>
                    }
                >
                    <div className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-1 truncate text-base font-medium text-white" title={dashboard.name}>
                                    {dashboard.name}
                                </div>
                                <div className="mb-3 text-xs text-gray-400">
                                    Updated {dayjs(dashboard.updateTime).fromNow()}
                                </div>
                            </div>
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: 'edit', label: 'Edit Info', icon: <EditOutlined /> },
                                        { key: 'copy', label: 'Duplicate', icon: <CopyOutlined /> },
                                        { type: 'divider' },
                                        { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: (e) => handleDelete(dashboard.id, e as any) }
                                    ]
                                }}
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<MoreOutlined className="rotate-90 text-gray-400" />}
                                    onClick={e => e.stopPropagation()}
                                />
                            </Dropdown>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {dashboard.status === 'published' ? (
                                    <Tag color="#1f1f1f" className="border-green-800 text-green-500">Published</Tag>
                                ) : (
                                    <Tag color="#1f1f1f" className="border-gray-700 text-gray-500">Draft</Tag>
                                )}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <UserOutlined className="mr-1" /> {dashboard.creator}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    const renderListView = () => (
        <Table
            dataSource={filteredDashboards}
            rowKey="id"
            onRow={(record) => ({
                onClick: () => navigate(`/editor/${record.id}`),
                className: "cursor-pointer hover:bg-[#1f1f1f]"
            })}
            pagination={false}
            columns={[
                {
                    title: 'Name', dataIndex: 'name', render: (t, r) => (
                        <div>
                            <div className="font-medium text-white">{t}</div>
                            <div className="text-xs text-gray-500">{r.description}</div>
                        </div>
                    )
                },
                {
                    title: 'Status', dataIndex: 'status', render: (status) => (
                        <Tag color={status === 'published' ? 'success' : 'default'} bordered={false}>
                            {status ? status.toUpperCase() : 'DRAFT'}
                        </Tag>
                    )
                },
                { title: 'Creator', dataIndex: 'creator' },
                { title: 'Last Updated', dataIndex: 'updateTime', render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm') },
                {
                    title: 'Action', key: 'action', width: 60, render: (_, r) => (
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => handleDelete(r.id, e)}
                        />
                    )
                }
            ]}
        />
    );

    return (
        <Layout className="min-h-screen w-screen overflow-hidden bg-black">
            <Header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-[#141414] px-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">V</div>
                    <Title level={4} style={{ margin: 0, color: 'white' }}>Visualization Engine</Title>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    New Dashboard
                </Button>
            </Header>

            <Content className="mx-auto w-full max-w-[1600px] p-8">
                {/* Filter Bar */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Title level={3} style={{ margin: 0, color: 'white' }}>Dashboards</Title>
                        <span className="text-gray-500">{filteredDashboards.length} items</span>
                    </div>

                    <div className="flex flex-1 justify-end gap-3">
                        <Input
                            prefix={<SearchOutlined className="text-gray-500" />}
                            placeholder="Search dashboards..."
                            className="max-w-xs bg-[#1f1f1f] text-white border-gray-700"
                            variant="filled"
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            options={[
                                { label: 'Sort by Updated', value: 'updateTime' },
                                { label: 'Sort by Created', value: 'createTime' },
                                { label: 'Sort by Name', value: 'name' },
                            ]}
                            className="w-40"
                        />
                        <Segmented
                            value={viewMode}
                            onChange={(v) => setViewMode(v as 'list' | 'card')}
                            options={[
                                { value: 'card', icon: <AppstoreOutlined /> },
                                { value: 'list', icon: <BarsOutlined /> },
                            ]}
                        />
                    </div>
                </div>

                {/* Content */}
                {filteredDashboards.length > 0 ? (
                    viewMode === 'card' ? renderCardView() : renderListView()
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span className="text-gray-500">No dashboards found</span>}
                    />
                )}
            </Content>

            {/* Create Modal */}
            <Modal
                title="Create New Dashboard"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="Dashboard Name" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Optional description" />
                    </Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Workspace;
