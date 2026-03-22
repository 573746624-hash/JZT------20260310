import React from "react";
import { Result, Button, Typography, Space, Steps, Card } from "antd";
import { useNavigate } from "react-router-dom";
import {
  SafetyCertificateOutlined,
  IdcardOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import "./styles/onboarding.css";

const { Title, Paragraph, Text } = Typography;

export const WelcomeGuidePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container">
      <Card className="onboarding-card welcome-card">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Title level={2}>欢迎来到璟智通</Title>
          <Paragraph type="secondary" style={{ fontSize: 16 }}>
            为了给您提供更精准的政策匹配、供需对接与金融服务，请先完成企业画像完善与实名认证。
          </Paragraph>
        </div>

        <div className="steps-container">
          <Steps
            direction="vertical"
            current={0}
            items={[
              {
                title: "第一步：完善企业画像",
                description: "填写企业基础信息、行业类型、规模及主营产品，上传营业执照以获取智能推荐。",
                icon: <ProfileOutlined />,
              },
              {
                title: "第二步：法定代表人/经办人实名认证",
                description: "提供身份证正反面、人脸识别及银行卡四要素验证，确保账户安全。",
                icon: <IdcardOutlined />,
              },
              {
                title: "第三步：提交审核",
                description: "确认信息无误后提交，审核通过即可解锁全部平台功能。",
                icon: <SafetyCertificateOutlined />,
              },
            ]}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Button
            type="primary"
            size="large"
            className="start-btn"
            onClick={() => navigate("/onboarding/profile")}
          >
            开始完善信息
          </Button>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              点击即代表您同意 <a href="#">《隐私政策》</a> 与 <a href="#">《用户授权书》</a>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};
