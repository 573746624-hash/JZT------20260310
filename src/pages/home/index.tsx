/**
 * 首页主组件
 * 创建时间: 2026-01-13
 * 更新时间: 2026-02-26
 * 功能: 首页主入口，整合所有拆分的模块，支持个性化设置和用户体验优化
 */

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Space, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useCompanyProfileContext } from "../../context/CompanyProfileContext";
import {
  PageHeader,
  BannerSection,
  DataOverviewSection,
  PersonalizedRecommendationSection,
  EnterpriseGuideSection,
  QuickActionsSection,
} from "./components/index";
import { useHomeData } from "./hooks/useHomeData";
import {
  ErrorBoundary,
  SimpleErrorBoundary,
} from "../../components/common/ErrorBoundary";
import { RefreshButton } from "../../components/common/RefreshButton";
import {
  usePersonalizationSettings,
} from "../../components/common/PersonalizationPanel";
import "./styles/home.css";

/**
 * 首页主组件
 * 组件创建时间: 2026-01-13
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const { homeData, loading, error, fetchHomeData } = useHomeData();
  const { settings } = usePersonalizationSettings();
  const { profile } = useCompanyProfileContext();

  // 监听错误信息
  React.useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  /**
   * 页面导航处理函数，包含认证拦截逻辑
   */
  const handleNavigate = (path: string) => {
    // 拦截未认证用户访问核心功能
    const corePaths = [
      "/policy-center",
      "/industry/service-match",
      "/supply-chain-finance",
      "/legal-support"
    ];
    
    const isCorePath = corePaths.some(corePath => path.startsWith(corePath));
    
    if (isCorePath && !profile.isVerified) {
      Modal.confirm({
        title: "需要企业认证",
        icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
        content: "完成企业认证后，可解锁全部功能，享受精准服务",
        okText: "立即认证",
        cancelText: "暂不",
        onOk: () => {
          // 跳转到新的 Onboarding 流程
          navigate("/onboarding/welcome");
        }
      });
      return;
    }
    
    navigate(path);
  };

  /**
   * 消息提示处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleMessage = (text: string) => {
    message.info(text);
  };

  /**
   * 数据刷新处理函数
   */
  const handleRefresh = useCallback(async () => {
    await fetchHomeData();
  }, [fetchHomeData]);

  // 显示加载状态
  // if (loading) {
  //   return <HomePageSkeleton />;
  // }

  const gutter = settings.compactMode
    ? [8, 8]
    : [settings.cardSpacing, settings.cardSpacing];

  return (
    <ErrorBoundary>
      <div
        style={{
          background: "transparent",
          padding: settings.compactMode ? "12px 0" : "0",
          minHeight: "100vh",
        }}
      >
        {/* 页面头部 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: settings.compactMode ? "16px" : "24px",
          }}
        >
          <PageHeader username={username} />
          <Space>
            <RefreshButton
              onRefresh={handleRefresh}
              loading={loading}
              autoRefresh={settings.autoRefresh}
              refreshInterval={settings.refreshInterval}
              size="small"
            />
          </Space>
        </div>

        <Row gutter={gutter}>
          {/* 左侧主要内容区 */}
          <Col xs={24} lg={16}>
            {/* 政策申报动态轮播图 */}
            <SimpleErrorBoundary>
              <BannerSection loading={loading} onNavigate={handleNavigate} />
            </SimpleErrorBoundary>

            {/* 个性化推荐区域 (智能推荐) */}
            <div style={{ marginTop: settings.compactMode ? "16px" : "24px" }}>
              <SimpleErrorBoundary>
                <PersonalizedRecommendationSection onNavigate={handleNavigate} />
              </SimpleErrorBoundary>
            </div>
          </Col>

          {/* 右侧辅助内容区 */}
          <Col xs={24} lg={8}>
            {/* 企业画像与认证引导 (未认证时显示在最显眼位置) */}
            <SimpleErrorBoundary>
              <EnterpriseGuideSection loading={loading} />
            </SimpleErrorBoundary>

            {/* 核心业务模块 */}
            <SimpleErrorBoundary>
              <QuickActionsSection
                quickActions={homeData.quickActions}
                onNavigate={handleNavigate}
                loading={loading}
              />
            </SimpleErrorBoundary>

            {/* 数据概览区域 - 移至侧边栏 */}
            <div style={{ marginTop: settings.compactMode ? "16px" : "24px" }}>
              <SimpleErrorBoundary>
                <DataOverviewSection
                  dataOverview={homeData.dataOverview}
                  loading={loading}
                />
              </SimpleErrorBoundary>
            </div>
          </Col>
        </Row>

      </div>
    </ErrorBoundary>
  );
};

export default Home;
