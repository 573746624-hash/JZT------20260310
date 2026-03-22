/**
 * 首页主组件
 * 创建时间: 2026-01-13
 * 更新时间: 2026-02-26
 * 功能: 首页主入口，整合所有拆分的模块，支持个性化设置和用户体验优化
 */

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Divider, FloatButton, Space, Modal } from "antd";
import { SettingOutlined, QuestionCircleOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useCompanyProfileContext } from "../../context/CompanyProfileContext";
import {
  PageHeader,
  BannerSection,
  DataOverviewSection,
  SmartDashboardSection,
  ImportantRemindersSection,
  PersonalizedRecommendationSection,
  QuickToolsSection,
  EnterpriseGuideSection,
  WeatherCalendarSection,
  QuickActionsSection,
} from "./components/index";
import { useHomeData } from "./hooks/useHomeData";
import {
  ErrorBoundary,
  SimpleErrorBoundary,
} from "../../components/common/ErrorBoundary";
import { HomePageSkeleton } from "../../components/common/SkeletonLoader";
import { RefreshButton } from "../../components/common/RefreshButton";
import {
  PersonalizationPanel,
  usePersonalizationSettings,
} from "../../components/common/PersonalizationPanel";
import {
  useKeyboardShortcuts,
  getHomePageShortcuts,
} from "../../hooks/useKeyboardShortcuts";
import "./styles/home.css";

/**
 * 首页主组件
 * 组件创建时间: 2026-01-13
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const { homeData, loading, error, fetchHomeData } = useHomeData();
  const { settings, updateSettings } = usePersonalizationSettings();
  const { profile } = useCompanyProfileContext();
  const [settingsPanelVisible, setSettingsPanelVisible] = useState(false);

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
          // 这里可以唤起认证弹窗或跳转到认证页面
          navigate("/system/company-management");
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

  /**
   * 切换设置面板
   */
  const toggleSettingsPanel = useCallback(() => {
    setSettingsPanelVisible((prev) => !prev);
  }, []);

  /**
   * 显示快捷键帮助
   */
  const showShortcutsHelp = useCallback(() => {
    message.info({
      content: (
        <div style={{ textAlign: "left" }}>
          <strong>键盘快捷键：</strong>
          <br />
          F5 / Ctrl+R: 刷新数据
          <br />
          Ctrl+,: 打开设置面板
          <br />
          Shift+?: 显示帮助
          <br />
        </div>
      ),
      duration: 5,
    });
  }, []);

  // 设置键盘快捷键
  const shortcuts = getHomePageShortcuts({
    refresh: handleRefresh,
    toggleSettings: toggleSettingsPanel,
    showHelp: showShortcutsHelp,
  });

  useKeyboardShortcuts({ shortcuts });

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

        {/* 数据概览区域 - 恢复显示 */}
        <SimpleErrorBoundary>
          <DataOverviewSection
            dataOverview={homeData.dataOverview}
            loading={loading}
          />
        </SimpleErrorBoundary>

        <Row gutter={gutter}>
          {/* 左侧主要内容区 */}
          <Col xs={24} lg={16}>
            {/* 政策申报动态轮播图 */}
            <SimpleErrorBoundary>
              <BannerSection loading={loading} onNavigate={handleNavigate} />
            </SimpleErrorBoundary>

            {/* 核心业务模块 */}
            <div style={{ marginTop: settings.compactMode ? "16px" : "24px" }}>
              <SimpleErrorBoundary>
                <QuickActionsSection
                  quickActions={homeData.quickActions}
                  onNavigate={handleNavigate}
                  loading={loading}
                />
              </SimpleErrorBoundary>
            </div>

            {/* 智能数据看板 - 恢复显示 */}
            <div style={{ marginTop: settings.compactMode ? "16px" : "24px" }}>
              <SimpleErrorBoundary>
                <SmartDashboardSection loading={loading} />
              </SimpleErrorBoundary>
            </div>
          </Col>

          {/* 右侧辅助内容区 */}
          <Col xs={24} lg={8}>
            {/* 天气与日历组件 - 恢复显示 */}
            <SimpleErrorBoundary>
              <WeatherCalendarSection />
            </SimpleErrorBoundary>

            {/* 企业画像与认证引导 */}
            <SimpleErrorBoundary>
              <EnterpriseGuideSection loading={loading} />
            </SimpleErrorBoundary>

            {/* 重要提醒模块 */}
            <SimpleErrorBoundary>
              <ImportantRemindersSection
                importantReminders={homeData.importantReminders}
                onNavigate={handleNavigate}
                onMessage={handleMessage}
                loading={loading}
              />
            </SimpleErrorBoundary>
          </Col>
        </Row>

        {/* 个性化推荐区域 (保持全宽) */}
        <SimpleErrorBoundary>
          <PersonalizedRecommendationSection onNavigate={handleNavigate} />
        </SimpleErrorBoundary>

        {/* 快捷工具区域 (保持全宽) */}
        {settings.showQuickTools && (
          <div style={{ marginTop: settings.compactMode ? "16px" : "24px" }}>
            <SimpleErrorBoundary>
              <QuickToolsSection />
            </SimpleErrorBoundary>
          </div>
        )}

        {/* 浮动按钮 */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24 }}
          icon={<SettingOutlined />}
        >
          <FloatButton
            icon={<SettingOutlined />}
            tooltip="个性化设置"
            onClick={toggleSettingsPanel}
          />
          <FloatButton
            icon={<QuestionCircleOutlined />}
            tooltip="快捷键帮助"
            onClick={showShortcutsHelp}
          />
        </FloatButton.Group>

        {/* 个性化设置面板 */}
        <PersonalizationPanel
          visible={settingsPanelVisible}
          onClose={() => setSettingsPanelVisible(false)}
          currentSettings={settings}
          onSettingsChange={updateSettings}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Home;
