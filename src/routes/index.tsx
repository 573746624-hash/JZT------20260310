/**
 * 路由配置聚合文件
 * 嵌入操作完成日期：2026/1/13
 */
import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import * as Pages from "./lazyComponents";
import { CertificationGuard } from "../components/auth/CertificationGuard";
/**
 * 政策中心路由配置
 * 更新时间: 2026-03-10 - 新增增强版政策搜索页面
 */
export const policyRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    <Route
      path="/policy-center"
      element={<Navigate to="/policy-center/main" replace />}
    />
    <Route path="/policy-center/main" element={<Pages.AIPolicySearchV2 />} />
    <Route path="/policy/search" element={<Pages.EnhancedPolicySearch />} />
    <Route path="/policy/ai-search" element={<Pages.AIPolicySearchV2 />} />
    <Route
      path="/policy-center/detail/:id"
      element={<Pages.EnhancedPolicyDetail />}
    />
    <Route path="/policy/detail/:id" element={<Pages.EnhancedPolicyDetail />} />
    <Route
      path="/policy-center/approved-list"
      element={<Pages.PolicyApprovedList />}
    />
    <Route
      path="/policy-center/my-applications"
      element={<Pages.NewApplicationManagement />}
    />
  </Route>
);

/**
 * 新申报管理模块路由配置 - 2026-02-26
 */
export const newApplicationRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    <Route path="/application" element={<Pages.NewApplicationManagement />} />
    <Route
      path="/application/detail/:id"
      element={<Pages.ApplicationPolicyDetail />}
    />
    <Route
      path="/application/apply/:id"
      element={<Pages.ApplicationApplyWizard />}
    />
    <Route
      path="/application/success/:id"
      element={<Pages.ApplicationApplySuccess />}
    />
  </Route>
);

/**
 * 重构版申报管理模块路由配置 - 2026-03-23
 * 企业级申报管理 + 个人级我的申报 + 5步骤申报向导
 */
export const applicationNewRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    {/* 企业级 - 申报管理 */}
    <Route path="/application-new/management" element={<Pages.ApplicationManagementDashboard />} />
    <Route path="/application-new/management/list" element={<Pages.ApplicationManagementList />} />
    
    {/* 个人级 - 我的申报 */}
    <Route path="/application-new/my" element={<Pages.MyApplicationsNew />} />
    
    {/* 申报向导 */}
    <Route path="/application-new/wizard" element={<Pages.ApplyWizardNew />} />
    <Route path="/application-new/wizard/:id" element={<Pages.ApplyWizardNew />} />
  </Route>
);

/**
 * 法律护航路由配置
 */
export const legalRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    <Route path="/legal-support" element={<Pages.LegalSupport />} />
    <Route
      path="/legal-support/regulation-query"
      element={<Pages.RegulationQuery />}
    />
    <Route
      path="/legal-support/regulation-detail/:id"
      element={<Pages.RegulationDetail />}
    />
    <Route
      path="/legal-support/regulation-query/detail/:id"
      element={<Pages.RegulationDetail />}
    />
    <Route path="/legal-support/ai-lawyer" element={<Pages.AILawyer />} />
    <Route path="/legal-support/regulation-integrated" element={<Pages.RegulationIntegrated />} />
  </Route>
);

/**
 * 企服管理路由配置
 */
export const industryRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    <Route
      path="/industry/service-match/workbench"
      element={<Pages.ServiceMatchWorkbench />}
    />
    <Route
      path="/industry/service-match/business-hall"
      element={<Pages.BusinessHall />}
    />
    <Route
      path="/industry/service-match/requirement-hall"
      element={<Pages.ProcurementHall />}
    />
    <Route
      path="/industry/service-match/my-services"
      element={<Pages.MyServices />}
    />
    <Route
      path="/industry/service-match/publish"
      element={<Pages.ServiceMatchPublish />}
    />
    <Route
      path="/industry/service-match/detail/:id"
      element={<Pages.ServiceMatchDetail />}
    />
    <Route
      path="/industry/service-match/my-matches"
      element={<Pages.ServiceMatchMyMatches />}
    />
    <Route
      path="/industry/service-match/my-messages"
      element={<Pages.ServiceMatchMyMessages />}
    />
  </Route>
);

/**
 * 金融服务路由配置
 */
export const financeRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    <Route
      path="/supply-chain-finance"
      element={<Pages.SupplyChainFinance />}
    />
    <Route
      path="/supply-chain-finance/financing-diagnosis"
      element={<Pages.FinancingDiagnosis />}
    />
    <Route
      path="/supply-chain-finance/financing-diagnosis-result"
      element={<Pages.FinancingDiagnosisResult />}
    />
    <Route
      path="/supply-chain-finance/diagnosis-report"
      element={<Pages.FinancingDiagnosisResult />}
    />
    <Route
      path="/supply-chain-finance/financing-option-detail/:id"
      element={<Pages.FinancingOptionDetail />}
    />
    <Route
      path="/supply-chain-finance/application-success"
      element={<Pages.FinancingApplicationSuccess />}
    />
    <Route
      path="/supply-chain-finance/diagnosis-analysis"
      element={<Pages.DiagnosisAnalysis />}
    />
    <Route
      path="/supply-chain-finance/risk-assessment"
      element={<Pages.RiskAssessment />}
    />
  </Route>
);

/**
 * 系统管理路由配置
 */
export const systemRoutes = (
  <>
    <Route path="/system" element={<Pages.SystemManagement />} />
    <Route path="/system/users" element={<Pages.UserManagement />} />
    <Route path="/system/personal-center" element={<Pages.PersonalCenter />} />
    <Route path="/system/my-favorites" element={<Pages.MyFavorites />} />
    <Route
      path="/system/company-management"
      element={<Pages.CompanyManagement />}
    />
  </>
);

/**
 * 企业认证后信息展示系统路由配置 - 2026-03-23
 */
export const enterprisePortalRoutes = (
  <Route element={<CertificationGuard><Outlet /></CertificationGuard>}>
    <Route path="/enterprise" element={<Pages.CertifiedHome />} />
    <Route path="/enterprise/home" element={<Pages.CertifiedHome />} />
    <Route path="/enterprise/profile" element={<Pages.EnterpriseProfilePage />} />
    <Route path="/enterprise/audit-logs" element={<Pages.AuditLogsPage />} />
  </Route>
);

/**
 * 公开路由配置（无需登录）
 */
export const publicRoutes = (
  <>
    <Route path="/login" element={<Pages.Login />} />
    <Route path="/register" element={<Pages.Register />} />
    <Route path="/reset-password" element={<Pages.ResetPassword />} />
  </>
);

/**
 * Onboarding 路由配置
 */
export const onboardingRoutes = (
  <>
    <Route path="/onboarding/welcome" element={<Pages.WelcomeGuidePage />} />
    <Route path="/onboarding/profile" element={<Pages.OnboardingProfilePage />} />
  </>
);

/**
 * 首页路由
 */
export const homeRoute = <Route path="/" element={<Pages.Home />} />;
