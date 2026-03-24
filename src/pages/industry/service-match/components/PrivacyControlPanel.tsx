/**
 * 隐私控制面板组件
 * 创建时间: 2026-03-24
 */

import React from "react";
import {
  Card,
  Switch,
  Typography,
  Tooltip,
  Space,
  Badge,
} from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { THEME } from "../styles";

const { Text, Title } = Typography;

interface PrivacyControlPanelProps {
  showMaskedData: boolean;
  onMaskingToggle: (enabled: boolean) => void;
  compact?: boolean; // 紧凑模式
}

const PrivacyControlPanel: React.FC<PrivacyControlPanelProps> = ({
  showMaskedData,
  onMaskingToggle,
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 12px",
          background: "#f8f9fa",
          borderRadius: "6px",
          border: "1px solid #e9ecef",
        }}
      >
        <Tooltip title="隐私保护开关">
          <Switch
            checked={showMaskedData}
            onChange={onMaskingToggle}
            checkedChildren={<EyeInvisibleOutlined />}
            unCheckedChildren={<EyeOutlined />}
            size="small"
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #e9ecef",
        marginBottom: "16px",
      }}
      styles={{ body: { padding: "20px" } }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={5} style={{ margin: 0, fontSize: "16px" }}>
          <SecurityScanOutlined style={{ color: THEME.primary, marginRight: 8 }} />
          隐私保护设置
        </Title>
        
        <Switch
          checked={showMaskedData}
          onChange={onMaskingToggle}
          checkedChildren="开启"
          unCheckedChildren="关闭"
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {showMaskedData 
            ? "隐私保护已开启，敏感信息将被遮挡显示" 
            : "隐私保护已关闭，所有信息可见"}
        </Text>
      </div>

      {showMaskedData && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            background: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: "6px",
          }}
        >
          <Text style={{ fontSize: "11px", color: "#1890ff" }}>
            <EyeInvisibleOutlined style={{ marginRight: "4px" }} />
            提示：点击服务卡片上的眼睛图标可临时查看完整信息
          </Text>
        </div>
      )}
    </Card>
  );
};

export default PrivacyControlPanel;
