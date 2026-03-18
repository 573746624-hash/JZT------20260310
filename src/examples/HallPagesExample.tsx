import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Button, Space } from 'antd';
import { 
  ShoppingCartOutlined, 
  ServiceOutlined, 
  UserOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { PermissionProvider } from '../components/shared/PermissionProvider';
import ProcurementHall from '../pages/ProcurementHall';
import BusinessHall from '../pages/BusinessHall';
import { UserRole } from '../utils/permissions';
import '../styles/global.scss';

const { Header, Sider, Content } = Layout;

const HallPagesExample: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/business-hall',
      icon: <ServiceOutlined />,
      label: <Link to="/business-hall">业务大厅</Link>,
    },
    {
      key: '/procurement-hall',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/procurement-hall">采购大厅</Link>,
    },
  ];

  const roleOptions = [
    { value: 'guest', label: '游客' },
    { value: 'buyer', label: '采购方' },
    { value: 'supplier', label: '供应商' },
    { value: 'operator', label: '运营方' },
  ];

  return (
    <PermissionProvider userRole={userRole}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          {/* 侧边栏 */}
          <Sider 
            collapsible 
            collapsed={collapsed} 
            onCollapse={setCollapsed}
            theme="light"
            width={256}
          >
            <div style={{ 
              height: 64, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <h2 style={{ margin: 0, color: '#1890ff' }}>
                {collapsed ? 'JZT' : 'JZT 产业管理'}
              </h2>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['/business-hall']}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
          </Sider>

          <Layout>
            {/* 顶部导航 */}
            <Header style={{ 
              background: '#fff', 
              padding: '0 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0 }}>产业管理系统演示</h3>
              </div>
              
              <Space>
                <span>当前角色：</span>
                <Space.Compact>
                  {roleOptions.map(option => (
                    <Button
                      key={option.value}
                      type={userRole === option.value ? 'primary' : 'default'}
                      size="small"
                      onClick={() => setUserRole(option.value as UserRole)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Space.Compact>
                
                <Button icon={<UserOutlined />}>
                  用户中心
                </Button>
                <Button icon={<SettingOutlined />}>
                  设置
                </Button>
              </Space>
            </Header>

            {/* 主要内容区域 */}
            <Content style={{ 
              margin: 0,
              background: '#f5f7fa',
              overflow: 'auto'
            }}>
              <Routes>
                <Route path="/" element={<BusinessHall />} />
                <Route path="/business-hall" element={<BusinessHall />} />
                <Route path="/procurement-hall" element={<ProcurementHall />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </PermissionProvider>
  );
};

export default HallPagesExample;
