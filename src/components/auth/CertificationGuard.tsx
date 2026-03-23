import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCertification } from "../../context/CertificationContext";
import { Result, Button, Typography, Space, Alert, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export const CertificationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { certState, submitCertification } = useCertification();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSkipOption, setShowSkipOption] = useState(false);

  // 开发测试模式：允许跳过认证
  const handleSkipCertification = async () => {
    // 自动设置一个测试认证状态
    await submitCertification({
      companyName: "测试企业",
      certNumber: "91110000XXXXXXXX",
      legalPerson: "测试法人",
      certType: "business_license",
    });
    message.success("已使用测试模式进入系统");
    // 刷新页面以应用新状态
    window.location.reload();
  };

  if (certState.status !== "verified") {
    return (
      <Result
        status="403"
        title="需要企业实名认证"
        subTitle={
          <>
            <Paragraph>您尝试访问的功能模块需要完成企业实名认证后才能使用。</Paragraph>
            <Paragraph type="secondary">
              完成企业认证后，可解锁全部功能，享受精准服务，并可生成专属邀请码邀请企业员工。
            </Paragraph>
          </>
        }
        extra={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" onClick={() => navigate("/onboarding/welcome")}>
                去认证
              </Button>
              <Button onClick={() => navigate("/")}>返回首页</Button>
            </Space>
            
            {/* 开发测试选项 */}
            <Button 
              type="link" 
              size="small"
              onClick={() => setShowSkipOption(!showSkipOption)}
              style={{ marginTop: 16 }}
            >
              {showSkipOption ? '隐藏' : '显示'}开发者选项
            </Button>
            
            {showSkipOption && (
              <Alert
                message="开发者模式"
                description={
                  <>
                    <Paragraph style={{ fontSize: 12 }}>
                      此选项仅用于开发和测试，点击后将使用测试数据跳过认证流程。
                    </Paragraph>
                    <Button 
                      size="small" 
                      onClick={handleSkipCertification}
                      style={{ marginTop: 8 }}
                    >
                      跳过认证（测试模式）
                    </Button>
                  </>
                }
                type="warning"
                showIcon
              />
            )}
          </Space>
        }
      />
    );
  }

  return <>{children}</>;
};
