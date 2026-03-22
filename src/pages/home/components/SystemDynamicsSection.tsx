import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Modal, Button } from 'antd';
import { SoundOutlined, BellOutlined, SafetyCertificateOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import './styles/SystemDynamics.css';

const { Text } = Typography;

export interface DynamicItem {
  id: string;
  title: string;
  type: 'policy' | 'system' | 'application' | 'success';
  time: string;
  company?: string;
  detail?: string;
}

const mockDynamics: DynamicItem[] = [
  { id: '1', title: '《2026年高新技术企业认定管理办法》已发布', type: 'policy', time: '10分钟前', detail: '科技部最新发布关于高企认定的新标准，重点关注研发费用归集。' },
  { id: '2', title: '北京XX科技有限公司 成功申报 [创新券补贴]', type: 'success', time: '半小时前', company: '北京XX科技' },
  { id: '3', title: '系统更新：新增企业画像智能诊断功能', type: 'system', time: '2小时前', detail: '现在您可以通过企业画像一键诊断符合申报条件的政策。' },
  { id: '4', title: '您的 [专精特新中小企业] 申报已进入专家评审阶段', type: 'application', time: '3小时前' },
  { id: '5', title: '上海XX医疗器械 成功获批 [重点研发计划]', type: 'success', time: '5小时前', company: '上海XX医疗' },
  { id: '6', title: '《关于促进中小企业专精特新发展的意见》', type: 'policy', time: '1天前', detail: '工信部印发最新指导意见，加大资金支持力度。' },
];

export const SystemDynamicsSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<DynamicItem | null>(null);

  const getIconAndColor = (type: DynamicItem['type']) => {
    switch (type) {
      case 'policy':
        return { icon: <SoundOutlined />, color: '#1890ff', bgColor: '#e6f7ff' };
      case 'success':
        return { icon: <CheckCircleOutlined />, color: '#52c41a', bgColor: '#f6ffed' };
      case 'application':
        return { icon: <ThunderboltOutlined />, color: '#faad14', bgColor: '#fffbe6' };
      case 'system':
        return { icon: <BellOutlined />, color: '#722ed1', bgColor: '#f9f0ff' };
      default:
        return { icon: <BellOutlined />, color: '#8c8c8c', bgColor: '#f5f5f5' };
    }
  };

  // 为了实现无缝滚动，我们将列表复制一份
  const displayItems = [...mockDynamics, ...mockDynamics];

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", fontSize: "16px", fontWeight: 600 }}>
            <SoundOutlined style={{ color: "#faad14", marginRight: "8px" }} />
            实时动态
          </div>
        }
        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '0 20px' }}
        bodyStyle={{ padding: '16px 20px' }}
        className="hover-card"
      >
        <div className="system-dynamics-wrapper">
          <div className="system-dynamics-list">
            {displayItems.map((item, index) => {
              const styleProps = getIconAndColor(item.type);
              return (
                <div 
                  key={`${item.id}-${index}`} 
                  className="system-dynamics-item"
                  onClick={() => setActiveItem(item)}
                >
                  <div 
                    className="system-dynamics-icon" 
                    style={{ color: styleProps.color, backgroundColor: styleProps.bgColor }}
                  >
                    {styleProps.icon}
                  </div>
                  <div className="system-dynamics-content">
                    <div className="system-dynamics-title">
                      {item.title}
                    </div>
                    <div className="system-dynamics-meta">
                      <span>{item.time}</span>
                      {item.type === 'success' && <Tag color="success" style={{ margin: 0 }}>通过</Tag>}
                      {item.type === 'policy' && <Tag color="blue" style={{ margin: 0 }}>新政</Tag>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Modal
        title={activeItem?.type === 'success' ? '喜报' : '动态详情'}
        open={!!activeItem}
        onCancel={() => setActiveItem(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setActiveItem(null)}>
            我知道了
          </Button>
        ]}
      >
        {activeItem && (
          <div style={{ padding: '10px 0' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>{activeItem.title}</h3>
            {activeItem.detail && (
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px', marginBottom: '16px' }}>
                {activeItem.detail}
              </div>
            )}
            <div style={{ color: '#8c8c8c', fontSize: '13px' }}>
              发布时间：{activeItem.time}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
