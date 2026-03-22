/**
 * 企业管理页面主组件
 * 创建时间: 2026-01-13
 * 功能: 企业管理页面主入口，整合所有拆分的模块
 */

import React, { useState } from "react";
import { Row, Col, Typography, Button, Card, Descriptions, Tag, Space, Modal } from "antd";
import BreadcrumbNav from "../../../components/common/BreadcrumbNav";
import { EditOutlined, BankOutlined, SafetyCertificateOutlined, AlertOutlined } from "@ant-design/icons";
import { ProfileOverviewCard, ProfileEditModal } from "./components/index.ts";
import {
  useCompanyProfile,
  UICompanyProfile,
  CompanyProfile,
} from "./hooks/useCompanyProfile.ts";
import { useCertification } from "../../../context/CertificationContext";
import { EnterpriseCertificationModal } from "../../home/components/EnterpriseCertificationModal";

const { Title, Text } = Typography;

/**
 * 企业管理页面组件
 * 组件创建时间: 2026-01-13
 */
const CompanyManagement: React.FC = () => {
  const {
    loading,
    companyProfile,
    profileModalVisible,
    editMode,
    editForm,
    currentStep,
    setEditForm,
    setCurrentStep,
    setEditMode,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleCloseModal,
    handleRetrySync,
  } = useCompanyProfile();

  const { certState, upgradeLevel, checkExpiry } = useCertification();
  const [certModalVisible, setCertModalVisible] = useState(false);

  React.useEffect(() => {
    checkExpiry();
  }, []);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
      {/* 面包屑导航 */}
      <BreadcrumbNav />

      {/* 页面头部 */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              marginBottom: "8px",
              color: "#262626",
              fontSize: "24px",
              fontWeight: 500,
            }}
          >
            <BankOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            企业管理
          </Title>
          <Text
            type="secondary"
            style={{
              color: "#8c8c8c",
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            管理企业画像与认证信息
          </Text>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
            >
              编辑企业画像
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 企业实名认证卡片 */}
      <Card
        style={{ marginBottom: "24px", borderColor: certState.status === "verified" ? "#b7eb8f" : "#ffa39e" }}
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: certState.status === "verified" ? "#52c41a" : "#f5222d" }} />
            <span>实名认证信息</span>
          </Space>
        }
        extra={
          certState.status === "unverified" ? (
            <Button type="primary" danger onClick={() => setCertModalVisible(true)}>
              立即认证
            </Button>
          ) : certState.status === "expired" ? (
            <Button type="primary" danger onClick={() => setCertModalVisible(true)}>
              重新认证
            </Button>
          ) : (
            <Space>
              {certState.level === "basic" && (
                <Button type="primary" onClick={() => upgradeLevel("advanced")}>
                  升级高级认证
                </Button>
              )}
            </Space>
          )
        }
      >
        {certState.status === "unverified" ? (
          <div style={{ padding: "24px", textAlign: "center" }}>
            <AlertOutlined style={{ fontSize: 48, color: "#faad14", marginBottom: 16 }} />
            <Title level={4}>您尚未完成企业实名认证</Title>
            <Text type="secondary">完成认证后，可解锁全部功能，享受精准服务，并可生成专属邀请码邀请企业员工。</Text>
          </div>
        ) : (
          <Descriptions column={3}>
            <Descriptions.Item label="认证状态">
              {certState.status === "verified" ? <Tag color="success">已认证</Tag> : <Tag color="error">已过期</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="认证等级">
              {certState.level === "advanced" ? <Tag color="purple">高级认证</Tag> : <Tag color="blue">基础认证</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="认证类型">
              {certState.certType === "business_license" ? "营业执照" : "其他"}
            </Descriptions.Item>
            <Descriptions.Item label="企业名称">{certState.companyName}</Descriptions.Item>
            <Descriptions.Item label="证件号码">{certState.certNumber?.replace(/^(.{4})(.*)(.{4})$/, "$1**********$3")}</Descriptions.Item>
            <Descriptions.Item label="法定代表人">{certState.legalPerson?.replace(/^(.).*(.)$/, "$1*$2")}</Descriptions.Item>
            <Descriptions.Item label="认证时间">{certState.certTime}</Descriptions.Item>
            <Descriptions.Item label="到期时间">{certState.expireTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* 企业画像概览卡片 */}
      <ProfileOverviewCard
        companyProfile={companyProfile}
        onRetrySync={handleRetrySync}
      />

      {/* 企业画像编辑弹窗 */}
      <ProfileEditModal
        visible={profileModalVisible}
        editMode={editMode}
        loading={loading}
        companyProfile={companyProfile as unknown as CompanyProfile}
        editForm={editForm as Partial<CompanyProfile>}
        currentStep={currentStep}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
        onCancelEdit={handleCancelEdit}
        onEditModeChange={setEditMode}
        onStepChange={setCurrentStep}
        onFormChange={(form) => setEditForm(form as Partial<UICompanyProfile>)}
      />

      {/* 企业实名认证弹窗 */}
      <EnterpriseCertificationModal
        visible={certModalVisible}
        onCancel={() => setCertModalVisible(false)}
        onSuccess={() => setCertModalVisible(false)}
      />
    </div>
  );
};

export default CompanyManagement;
