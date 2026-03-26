/**
 * 首次登录引导提示组件
 * 用于引导新用户完善企业信息
 */

import React from 'react';
import { Modal, Button, Typography, Steps, Space, Card } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface ProfileGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * 首次登录引导提示弹窗
 */
const ProfileGuideModal: React.FC<ProfileGuideModalProps> = ({ visible, onClose }) => {
  const navigate = useNavigate();

  // 前往完善信息页面
  const handleGoToProfile = () => {
    onClose();
    navigate('/enterprise/profile/edit');
  };

  // 跳过引导（临时关闭，下次还会提示）
  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      open={visible}
      width={700}
      closable={false}
      maskClosable={false}
      footer={null}
      centered
      className="profile-guide-modal"
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <UserOutlined style={{ fontSize: 40, color: '#fff' }} />
        </div>
        <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
          欢迎使用璟智通
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          完善企业信息，解锁全部功能
        </Text>
      </div>

      <Card
        style={{ marginBottom: 24, background: '#f6ffed', border: '1px solid #b7eb8f' }}
        bodyStyle={{ padding: 16 }}
      >
        <Space align="start">
          <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a', marginTop: 2 }} />
          <div>
            <Text strong style={{ color: '#52c41a' }}>
              您已成功登录系统
            </Text>
            <Paragraph style={{ margin: '4px 0 0 0', color: '#595959' }}>
              为了给您提供更精准的服务推荐，请先完善企业基本信息
            </Paragraph>
          </div>
        </Space>
      </Card>

      <Steps
        direction="vertical"
        current={0}
        style={{ marginBottom: 32 }}
        items={[
          {
            title: '完善企业信息',
            description: '填写企业名称、行业、规模等基本信息',
            icon: <BankOutlined />,
          },
          {
            title: '提交认证审核',
            description: '上传营业执照等资质文件，完成企业认证',
            icon: <SafetyCertificateOutlined />,
          },
          {
            title: '开始使用',
            description: '解锁智能推荐、政策匹配等全部功能',
            icon: <CheckCircleOutlined />,
          },
        ]}
      />

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button type="primary" size="large" onClick={handleGoToProfile}>
          立即完善信息 <ArrowRightOutlined />
        </Button>
        <Button size="large" onClick={handleSkip}>
          稍后再说
        </Button>
      </div>

      <Paragraph
        type="secondary"
        style={{ textAlign: 'center', marginTop: 16, marginBottom: 0, fontSize: 12 }}
      >
        完善信息预计需要 3-5 分钟
      </Paragraph>
    </Modal>
  );
};

export default ProfileGuideModal;
