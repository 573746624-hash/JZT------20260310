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
  ImportantRemindersSection,
  QuickToolsSection,
  SystemDynamicsSection,
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
    ? [16, 16] // 基于8px网格: 16px
    : [24, 24]; // 默认使用24px间距

  return (
    <ErrorBoundary>
      <div
        style={{
          background: "transparent",
          padding: settings.compactMode ? "16px" : "24px",
          minHeight: "100vh",
          maxWidth: "1600px",
          margin: "0 auto",
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

        <Row gutter={gutter as [number, number]}>
          {/* 左侧：核心工作台与数据区 */}
          <Col xs={24} lg={16} xl={17}>
            {/* 1. 待办/重要提醒提至最高优位置 (P0) */}
            {profile.isVerified && (
              <>
                <SimpleErrorBoundary>
                  <ImportantRemindersSection
                    importantReminders={homeData.importantReminders}
                    onNavigate={handleNavigate}
                    onMessage={handleMessage}
                    loading={loading}
                  />
                </SimpleErrorBoundary>
                <div style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />
              </>
            )}

            {/* 2. 核心业务模块 (高频操作移至左侧核心区) */}
            <SimpleErrorBoundary>
              <QuickActionsSection
                quickActions={homeData.quickActions}
                onNavigate={handleNavigate}
                loading={loading}
              />
            </SimpleErrorBoundary>

            <div style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />

            {/* 4. 个性化推荐区域 (智能推荐) - 包含未认证占位符 */}
            <SimpleErrorBoundary>
              <PersonalizedRecommendationSection onNavigate={handleNavigate} />
            </SimpleErrorBoundary>
          </Col>

          {/* 右侧：辅助信息与推荐区 */}
          <Col xs={24} lg={8} xl={7}>
            {/* 1. 企业画像与认证引导 (身份信息锚点) */}
            {!profile.isVerified && (
              <>
                <SimpleErrorBoundary>
                  <EnterpriseGuideSection loading={loading} />
                </SimpleErrorBoundary>
                <div style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />
              </>
            )}

            {/* 2. 快捷工具 */}
            {settings.showQuickTools && profile.isVerified && (
              <>
                <SimpleErrorBoundary>
                  <QuickToolsSection />
                </SimpleErrorBoundary>
                <div style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />
              </>
            )}

            {/* 3. 最近活动/政策申报动态轮播图 (降级为辅助展示) */}
            <SimpleErrorBoundary>
              <BannerSection loading={loading} onNavigate={handleNavigate} />
            </SimpleErrorBoundary>

            <div style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />

            {/* 4. 实时动态 (填补右侧底部空白) */}
            {profile.isVerified && (
              <SimpleErrorBoundary>
                <SystemDynamicsSection />
              </SimpleErrorBoundary>
            )}
          </Col>
        </Row>

      </div>
    </ErrorBoundary>
  );
};

export default Home;
