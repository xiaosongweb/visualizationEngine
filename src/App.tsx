import React, { Suspense } from 'react';
import { ConfigProvider, theme, Spin } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';

// Lazy load pages
const DashboardWorkspace = React.lazy(() => import('./pages/dashboard/Workspace'));
const EditorLayout = React.lazy(() => import('./pages/editor/EditorLayout'));

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><Spin size="large" /></div>}>
          <Routes>
            <Route path="/" element={<DashboardWorkspace />} />
            <Route path="/editor/:id" element={<EditorLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
