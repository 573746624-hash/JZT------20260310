/**
 * 璟智通企业级设计变量
 * 创建时间: 2026-03-23
 * 用途: 统一全平台视觉风格，符合政务/企业级平台调性
 */

// 主色调 - 稳重深蓝
export const PRIMARY_COLOR = "#1A5FB4";
export const PRIMARY_HOVER = "#154a8c";
export const PRIMARY_LIGHT = "#F0F5FF";

// 功能色
export const SUCCESS_COLOR = "#27AE60";
export const WARNING_COLOR = "#E67E22";
export const ERROR_COLOR = "#C0392B";
export const INFO_COLOR = "#1A5FB4";

// 中性色 - 文字
export const TEXT_PRIMARY = "#1A1A1A";      // 标题、重要文字
export const TEXT_SECONDARY = "#333333";    // 正文
export const TEXT_TERTIARY = "#666666";     // 次要文字
export const TEXT_MUTED = "#999999";        // 辅助文字、占位符

// 中性色 - 边框、背景
export const BORDER_COLOR = "#D9D9D9";      // 边框
export const BORDER_LIGHT = "#E8E8E8";      // 分割线、浅色边框
export const BG_PRIMARY = "#FFFFFF";        // 主背景
export const BG_SECONDARY = "#F5F5F5";      // 次级背景
export const BG_TERTIARY = "#FAFAFA";       // 浅灰背景

// 圆角规范
export const BORDER_RADIUS_SMALL = "2px";   // 按钮、输入框
export const BORDER_RADIUS_MEDIUM = "4px";  // 卡片、标签
export const BORDER_RADIUS_LARGE = "4px";   // 弹窗（最大4px）

// 阴影规范 - 极简
export const SHADOW_NONE = "none";
export const SHADOW_LIGHT = "0 2px 8px rgba(0, 0, 0, 0.08)";
export const SHADOW_MEDIUM = "0 4px 12px rgba(0, 0, 0, 0.1)";
export const SHADOW_HEAVY = "0 8px 24px rgba(0, 0, 0, 0.12)";

// 字体规范
export const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const FONT_SIZE = {
  xs: "12px",      // 辅助文字
  sm: "13px",      // 小字
  md: "14px",      // 正文
  lg: "16px",      // 小标题
  xl: "18px",      // 标题
  xxl: "20px",     // 大标题
  xxxl: "24px",    // 页面标题
};

export const FONT_WEIGHT = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// 间距规范
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl: "24px",
  xxxl: "32px",
};

// 布局规范
export const LAYOUT = {
  sidebarWidth: "256px",
  sidebarCollapsedWidth: "80px",
  headerHeight: "64px",
  contentPadding: "24px",
  cardPadding: "20px",
};

// 图标规范
export const ICON = {
  sizeSmall: "14px",
  sizeMedium: "16px",
  sizeLarge: "20px",
  colorDefault: "#666666",
  colorActive: PRIMARY_COLOR,
  colorDisabled: "#BFBFBF",
};

// 组件通用样式
export const COMPONENT_STYLES = {
  // 卡片
  card: {
    borderRadius: BORDER_RADIUS_MEDIUM,
    border: `1px solid ${BORDER_LIGHT}`,
    boxShadow: SHADOW_NONE,
    boxShadowHover: SHADOW_LIGHT,
    padding: LAYOUT.cardPadding,
  },
  
  // 按钮
  button: {
    borderRadius: BORDER_RADIUS_SMALL,
    height: "32px",
    heightLarge: "40px",
    heightSmall: "24px",
  },
  
  // 输入框
  input: {
    borderRadius: BORDER_RADIUS_SMALL,
    border: `1px solid ${BORDER_COLOR}`,
    borderHover: PRIMARY_COLOR,
    borderFocus: PRIMARY_COLOR,
    height: "32px",
  },
  
  // 标签
  tag: {
    borderRadius: BORDER_RADIUS_SMALL,
    padding: "2px 8px",
    fontSize: FONT_SIZE.xs,
  },
  
  // 头像
  avatar: {
    borderRadius: BORDER_RADIUS_MEDIUM,
    background: BG_SECONDARY,
    color: TEXT_TERTIARY,
  },
  
  // 菜单
  menu: {
    itemHeight: "40px",
    itemSelectedBg: PRIMARY_LIGHT,
    itemSelectedColor: PRIMARY_COLOR,
    itemHoverBg: BG_SECONDARY,
  },
};

// 状态色
export const STATUS_COLORS = {
  success: {
    bg: "#F6FFED",
    border: "#B7EB8F",
    text: SUCCESS_COLOR,
  },
  warning: {
    bg: "#FFF7E6",
    border: "#FFD591",
    text: WARNING_COLOR,
  },
  error: {
    bg: "#FFF1F0",
    border: "#FFA39E",
    text: ERROR_COLOR,
  },
  info: {
    bg: PRIMARY_LIGHT,
    border: "#91D5FF",
    text: PRIMARY_COLOR,
  },
  default: {
    bg: BG_SECONDARY,
    border: BORDER_LIGHT,
    text: TEXT_TERTIARY,
  },
};

// 法规级别色
export const REGULATION_LEVEL_COLORS = {
  national: {
    bg: "#FFF1F0",
    border: "#FFA39E",
    text: "#CF1322",
  },
  provincial: {
    bg: "#FFF7E6",
    border: "#FFD591",
    text: "#D46B08",
  },
  municipal: {
    bg: "#F6FFED",
    border: "#B7EB8F",
    text: "#389E0D",
  },
  district: {
    bg: "#F0F5FF",
    border: "#91D5FF",
    text: PRIMARY_COLOR,
  },
};

// 导出完整主题对象（供Ant Design ConfigProvider使用）
export const enterpriseTheme = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorSuccess: SUCCESS_COLOR,
    colorWarning: WARNING_COLOR,
    colorError: ERROR_COLOR,
    colorInfo: INFO_COLOR,
    colorTextBase: TEXT_SECONDARY,
    colorText: TEXT_SECONDARY,
    colorTextSecondary: TEXT_TERTIARY,
    colorBorder: BORDER_COLOR,
    colorBorderSecondary: BORDER_LIGHT,
    colorBgContainer: BG_PRIMARY,
    colorBgLayout: BG_SECONDARY,
    borderRadius: 4,
    borderRadiusSM: 2,
    borderRadiusLG: 4,
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
  },
  components: {
    Card: {
      borderRadius: 4,
      borderRadiusLG: 4,
      boxShadow: SHADOW_NONE,
      boxShadowTertiary: SHADOW_NONE,
    },
    Button: {
      borderRadius: 2,
      borderRadiusSM: 2,
      borderRadiusLG: 2,
    },
    Tag: {
      borderRadius: 2,
    },
    Input: {
      borderRadius: 2,
    },
    Select: {
      borderRadius: 2,
    },
    Menu: {
      borderRadius: 0,
      itemHeight: 40,
      itemSelectedBg: PRIMARY_LIGHT,
      itemHoverBg: BG_SECONDARY,
    },
    Avatar: {
      borderRadius: 4,
    },
    Modal: {
      borderRadius: 4,
    },
    Drawer: {
      borderRadius: 0,
    },
  },
};

export default {
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  ERROR_COLOR,
  INFO_COLOR,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  TEXT_MUTED,
  BORDER_COLOR,
  BORDER_LIGHT,
  BG_PRIMARY,
  BG_SECONDARY,
  BG_TERTIARY,
  BORDER_RADIUS_SMALL,
  BORDER_RADIUS_MEDIUM,
  BORDER_RADIUS_LARGE,
  SHADOW_NONE,
  SHADOW_LIGHT,
  SHADOW_MEDIUM,
  SHADOW_HEAVY,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  LAYOUT,
  ICON,
  COMPONENT_STYLES,
  STATUS_COLORS,
  REGULATION_LEVEL_COLORS,
  enterpriseTheme,
};
