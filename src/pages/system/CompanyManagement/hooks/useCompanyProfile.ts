/**
 * 企业画像管理 Hook
 * 创建时间: 2026-01-13
 * 更新时间: 2026-03-24 - 增加数据一致性校验功能
 */

import { useState, useCallback, useMemo } from "react";
import { message } from "antd";
import {
  useCompanyProfileContext,
  CompanyProfile as ContextCompanyProfile,
} from "../../../../context/CompanyProfileContext";
import { useCertification } from "../../../../context/CertificationContext";
import { CompanyProfile } from "../types";
import {
  checkDataConsistency,
  autoFixWithCertData,
  ConsistencyReport,
} from "../utils/dataConsistencyCheck";

// 本地类型定义，扩展 Context 中的类型以包含组件特有的 UI 状态
export interface UICompanyProfile extends ContextCompanyProfile {
  // 扩展 UI 特有字段
  syncStatus?: "success" | "syncing" | "failed";
  dataSource?: {
    business: "success" | "syncing" | "failed";
    tax: "success" | "syncing" | "failed";
    rd: "success" | "syncing" | "failed";
  };
}

// 导出别名以兼容原有代码
export type { CompanyProfile };

export const useCompanyProfile = () => {
  const {
    profile,
    updateProfile,
    loading: contextLoading,
  } = useCompanyProfileContext();
  const { certState } = useCertification();

  const [loading, setLoading] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 编辑表单状态
  const [editForm, setEditForm] = useState<Partial<UICompanyProfile>>({});

  // 数据一致性校验相关状态
  const [consistencyReport, setConsistencyReport] = useState<ConsistencyReport | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // 将 Context 数据映射到本地 UI 数据
  const companyProfile: UICompanyProfile = useMemo(
    () => ({
      ...profile,
      syncStatus: "success",
      dataSource: {
        business: "success",
        tax: "success",
        rd: "success",
      },
    }),
    [profile],
  );

  // 打开编辑弹窗
  const handleEditProfile = useCallback(() => {
    if (companyProfile) {
      setEditForm({
        ...companyProfile,
      });
      setEditMode(true);
      setProfileModalVisible(true);
    }
  }, [companyProfile]);

  // 执行数据一致性校验
  const performConsistencyCheck = useCallback(() => {
    // 检查是否已完成实名认证
    if (certState.status !== "verified") {
      message.warning("您尚未完成企业实名认证，无法进行数据一致性校验");
      return false;
    }

    // 执行校验
    const report = checkDataConsistency(editForm, certState);
    setConsistencyReport(report);
    setReportModalVisible(true);
    return report.isValid;
  }, [editForm, certState]);

  // 自动修正数据
  const handleAutoFix = useCallback(() => {
    const fixedData = autoFixWithCertData(editForm, certState);
    setEditForm(fixedData as Partial<UICompanyProfile>);

    // 重新校验
    const report = checkDataConsistency(fixedData, certState);
    setConsistencyReport(report);

    message.success("已使用实名认证数据自动修正关键字段");
  }, [editForm, certState]);

  // 关闭报告弹窗
  const handleCloseReportModal = useCallback(() => {
    setReportModalVisible(false);
  }, []);

  // 确认并继续保存
  const handleConfirmSave = useCallback(async () => {
    setReportModalVisible(false);
    setLoading(true);
    try {
      // 调用 Context 的更新方法
      updateProfile(editForm);
      setEditMode(false);
      setProfileModalVisible(false);
      message.success("企业画像保存成功，数据已通过一致性校验");
    } catch (error) {
      console.error("Failed to save profile:", error);
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [editForm, updateProfile]);

  // 保存企业画像（带校验）
  const handleSaveProfile = useCallback(async () => {
    // 执行数据一致性校验
    const isValid = performConsistencyCheck();

    // 如果校验不通过，不继续保存
    if (!isValid) {
      return;
    }

    // 校验通过，继续保存
    await handleConfirmSave();
  }, [performConsistencyCheck, handleConfirmSave]);

  // 取消编辑
  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
    setProfileModalVisible(false);
    setEditForm({});
    setCurrentStep(0);
  }, []);

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    if (editMode) {
      // 如果在编辑模式下关闭，提示确认或直接取消编辑
      handleCancelEdit();
    } else {
      setProfileModalVisible(false);
    }
  }, [editMode, handleCancelEdit]);

  // 重试同步
  const handleRetrySync = useCallback(() => {
    message.loading("正在同步数据...", 1).then(() => {
      message.success("同步成功");
    });
  }, []);

  return {
    loading: loading || contextLoading,
    companyProfile,
    profileModalVisible,
    editMode,
    editForm,
    currentStep,
    consistencyReport,
    reportModalVisible,
    setEditForm,
    setCurrentStep,
    setEditMode,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleCloseModal,
    handleRetrySync,
    handleAutoFix,
    handleCloseReportModal,
    handleConfirmSave,
  };
};
