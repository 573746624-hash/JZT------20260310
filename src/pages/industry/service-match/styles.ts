/**
 * 产业对接模块样式配置
 * 统一使用企业级配色方案
 */

// 企业级配色方案 - 稳重专业
export const THEME = {
  primary: "#1A5FB4",
  primaryHover: "#154a8c",
  danger: "#C0392B",
  success: "#27AE60",
  warning: "#E67E22",
  textTitle: "#1A1A1A",
  textBody: "#333333",
  textSecondary: "#666666",
  textHint: "#999999",
  bgLight: "#F5F5F5",
  white: "#FFFFFF",
  border: "#D9D9D9",
  borderLight: "#E8E8E8",
  borderRadius: "4px",
  cardBorderRadius: "4px",
};

// 通用样式
export const COMMON_STYLES = {
  pageContainer: {
    padding: "20px",
    background: "#fff",
    minHeight: "100%",
  },
  card: {
    background: THEME.white,
    borderRadius: THEME.cardBorderRadius,
    border: `1px solid ${THEME.borderLight}`,
    padding: "16px 20px",
    marginBottom: "12px",
    boxShadow: "none",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: THEME.textTitle,
  },
  body: {
    fontSize: "14px",
    color: THEME.textBody,
  },
  hint: {
    fontSize: "12px",
    color: THEME.textHint,
  },
  primaryBtn: {
    background: THEME.primary,
    borderColor: THEME.primary,
    borderRadius: "2px",
    height: "32px",
    fontSize: "14px",
    fontWeight: 500,
  },
  defaultBtn: {
    borderRadius: "2px",
    height: "32px",
    fontSize: "14px",
  },
  tag: {
    backgroundColor: "#F5F5F5",
    border: `1px solid ${THEME.border}`,
    color: THEME.textSecondary,
    borderRadius: "2px",
    fontSize: "11px",
    padding: "1px 6px",
  },
  successTag: {
    backgroundColor: "#F6FFED",
    border: `1px solid ${THEME.success}`,
    color: THEME.success,
    borderRadius: "2px",
    fontSize: "11px",
    padding: "1px 6px",
  },
  warningTag: {
    backgroundColor: "#FFF7E6",
    border: `1px solid ${THEME.warning}`,
    color: THEME.warning,
    borderRadius: "2px",
    fontSize: "11px",
    padding: "1px 6px",
  },
  // 已废弃，请使用tag
  advantageTag: {
    color: "#fff",
    backgroundColor: THEME.danger,
    borderRadius: "2px",
    padding: "1px 6px",
    fontSize: "11px",
    marginRight: "8px",
    border: "none",
  },
};

// 企业级主题（别名，用于兼容）
export const ENTERPRISE_THEME = THEME;
