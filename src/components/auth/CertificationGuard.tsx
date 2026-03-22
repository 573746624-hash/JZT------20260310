import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCertification } from "../../context/CertificationContext";
import { Result, Button, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export const CertificationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { certState } = useCertification();
  const location = useLocation();
  const navigate = useNavigate();

  if (certState.status !== "verified") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Result
          status="403"
          title="需要企业实名认证"
          subTitle={
            <div style={{ marginTop: 16 }}>
              <Paragraph>您尝试访问的功能模块需要完成企业实名认证后才能使用。</Paragraph>
              <Paragraph type="secondary">
                完成企业认证后，可解锁全部功能，享受精准服务，并可生成专属邀请码邀请企业员工。
              </Paragraph>
            </div>
          }
          extra={
            <Space>
              <Button type="primary" onClick={() => navigate("/onboarding/welcome")}>
                去认证
              </Button>
              <Button onClick={() => navigate("/")}>返回首页</Button>
            </Space>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
