import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Shop from '@/pages/Shop';
import Nodes from '@/pages/Nodes';
import Account from '@/pages/Account';
import Checkout from '@/pages/Checkout';

function App() {
  // 检查是否已登录
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <div className="app">
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />

        {/* 受保护路由 */}
        <Route
          path="/"
          element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          {/* 其他页面路由将在后续添加 */}
          <Route path="docs" element={<div>使用文档 (开发中)</div>} />
          <Route path="shop" element={<Shop />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="account" element={<Account />} />
          <Route path="orders" element={<div>我的订单 (开发中)</div>} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* 404 路由 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
