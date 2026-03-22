/**
 * 首页企业画像引导与认证模块
 * 创建时间: 2026-03-17
 * 功能:
 * 1. 引导企业用户完善核心画像信息
 * 2. 提供企业认证入口与邀请机制
 * 3. 基于画像提供智能推荐
 */

import React, { useState } from "react";
import { Button, Typography, message } from "antd";
import {
  RightOutlined,
  ExclamationCircleFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCompanyProfileContext } from "../../../context/CompanyProfileContext";
import { EnterpriseCertificationModal } from "./EnterpriseCertificationModal";

const { Title, Text } = Typography;

interface EnterpriseGuideSectionProps {
  loading?: boolean;
}

export const EnterpriseGuideSection: React.FC<EnterpriseGuideSectionProps> = ({
  loading = false,
}) => {
  const navigate = useNavigate();
  const {
    profile,
    updateProfile,
    loading: contextLoading,
  } = useCompanyProfileContext();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editForm, setEditForm] = useState<Partial<CompanyProfile>>({});

  // Certification Modal State
  const [certifyModalVisible, setCertifyModalVisible] = useState(false);

  const handleOpenEdit = () => {
    // Cast context profile to component profile type if needed, or assume they are compatible
    // Since we updated types/index.ts, they should be compatible.
    setEditForm({ ...profile } as unknown as Partial<CompanyProfile>);
    setEditMode(true);
    setCurrentStep(0);
    setModalVisible(true);
  };

  const handleSave = () => {
    updateProfile(editForm as any); // Update context
    setModalVisible(false);
    message.success("企业画像已更新");
  };

  // 如果已认证，整个引导模块隐藏
  if (profile.isVerified) {
    return null;
  }

  return (
    <div
      className="hover-card"
      style={{
        marginBottom: 24,
        display: "flex",
        gap: "16px",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* 仅在未认证时显示认证引导 */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            backgroundColor: "#fff0f6",
            border: "1px solid #ffadd2",
            borderRadius: "8px",
            padding: "16px 24px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div style={{ color: "#eb2f96", fontSize: "24px", lineHeight: 1 }}>
            <SafetyCertificateOutlined />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#a8071a",
                }}
              >
                您尚未完成企业实名认证，请尽快完成认证
              </span>
              <Button
                type="primary"
                danger
                onClick={() => setCertifyModalVisible(true)}
                style={{ borderRadius: "4px", fontWeight: "bold" }}
              >
                立即认证 <RightOutlined />
              </Button>
            </div>
            <div style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.65)" }}>
              完成企业认证后，可解锁全部功能，享受精准服务。您将成为企业<strong>超级管理员</strong>，并可生成专属<strong>邀请码</strong>。
            </div>
          </div>
        </div>
      </div>

      {/* 企业实名认证弹窗 */}
      <EnterpriseCertificationModal
        visible={certifyModalVisible}
        onCancel={() => setCertifyModalVisible(false)}
        onSuccess={() => {
          // 可选的认证成功后的额外逻辑
        }}
      />
    </div>
  );
};
