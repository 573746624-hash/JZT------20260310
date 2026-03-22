/**
 * 首页企业画像引导与认证模块
 * 创建时间: 2026-03-17
 * 功能:
 * 1. 引导企业用户完善核心画像信息
 * 2. 提供企业认证入口与邀请机制
 * 3. 基于画像提供智能推荐
 */

import React from "react";
import { Button, Alert } from "antd";
import {
  RightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCompanyProfileContext } from "../../../context/CompanyProfileContext";

interface EnterpriseGuideSectionProps {
  loading?: boolean;
}

export const EnterpriseGuideSection: React.FC<EnterpriseGuideSectionProps> = ({
  loading = false,
}) => {
  const navigate = useNavigate();
  const { profile } = useCompanyProfileContext();

  // 如果已认证，整个引导模块隐藏
  if (profile?.isVerified) {
    return null;
  }

  return (
    <Alert
      message={<span style={{ fontSize: "16px", fontWeight: 600 }}>您尚未完成企业实名认证</span>}
      description="完成企业认证后，可解锁智能政策匹配、一键申报与精准推荐服务。您将成为企业超级管理员，并可生成专属邀请码。"
      type="warning"
      showIcon
      icon={<SafetyCertificateOutlined style={{ fontSize: "24px", marginTop: "4px" }} />}
      action={
        <Button type="primary" danger onClick={() => navigate("/onboarding/welcome")} style={{ marginTop: "8px", fontWeight: "bold" }}>
          立即去认证 <RightOutlined />
        </Button>
      }
      style={{
        borderRadius: "8px",
        border: "1px solid #ffadd2",
        backgroundColor: "#fff0f6",
        padding: "16px 24px",
        boxShadow: "0 2px 8px rgba(255, 77, 79, 0.15)"
      }}
    />
  );
};
