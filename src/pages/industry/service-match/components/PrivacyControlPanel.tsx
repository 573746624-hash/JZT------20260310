import React from "react";
import {
  Card,
  Switch,
  Select,
  Space,
  Typography,
  Tooltip,
  Badge,
  Divider,
} from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SecurityScanOutlined,
  CrownOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { THEME } from "../styles";

const { Text, Title } = Typography;
const { Option } = Select;

interface PrivacyControlPanelProps {
  userLevel: string;
  showMaskedData: boolean;
  onUserLevelChange: (level: string) => void;
  onMaskingToggle: (enabled: boolean) => void;
  compact?: boolean; // 紧凑模式
}

const PrivacyControlPanel: React.FC<PrivacyControlPanelProps> = ({
  userLevel,
  showMaskedData,
  onUserLevelChange,
  onMaskingToggle,
  compact = false,
}) => {
  const userLevelConfig = {
    guest: {
      label: "访客",
      icon: <UserOutlined />,
      color: "#999",
      description: "基础信息查看",
      maskedFields: ["企业名称", "联系电话", "邮箱地址", "详细地址", "价格信息", "项目案例"],
    },
    member: {
      label: "会员",
      icon: <TeamOutlined />,
      color: "#1890ff",
      description: "部分信息可见",
      maskedFields: ["联系电话", "邮箱地址", "详细地址", "价格信息"],
    },
    vip: {
      label: "VIP会员",
      icon: <CrownOutlined />,
      color: "#faad14",
      description: "高级信息访问",
      maskedFields: ["联系电话", "邮箱地址"],
    },
    admin: {
      label: "管理员",
      icon: <SecurityScanOutlined />,
      color: "#52c41a",
      description: "完整信息访问",
      maskedFields: [],
    },
  };

  const currentConfig = userLevelConfig[userLevel as keyof typeof userLevelConfig];

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
        
        <Select
          value={userLevel}
          onChange={onUserLevelChange}
          size="small"
          style={{ width: 100 }}
        >
          {Object.entries(userLevelConfig).map(([key, config]) => (
            <Option key={key} value={key}>
              <Space size={4}>
                <span style={{ color: config.color }}>{config.icon}</span>
                <span>{config.label}</span>
              </Space>
            </Option>
          ))}
        </Select>

        <Badge
          count={currentConfig.maskedFields.length}
          style={{ backgroundColor: currentConfig.color }}
          title={`${currentConfig.maskedFields.length}项信息被遮挡`}
        />
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

      <div style={{ marginBottom: "16px" }}>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}>
          用户等级（影响可见信息范围）
        </Text>
        <Select
          value={userLevel}
          onChange={onUserLevelChange}
          style={{ width: "100%" }}
          placeholder="选择用户等级"
        >
          {Object.entries(userLevelConfig).map(([key, config]) => (
            <Option key={key} value={key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <span style={{ color: config.color }}>{config.icon}</span>
                  <span>{config.label}</span>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {config.description}
                  </Text>
                </Space>
                <Badge
                  count={config.maskedFields.length}
                  style={{ backgroundColor: config.color }}
                />
              </div>
            </Option>
          ))}
        </Select>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <div>
        <Text strong style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}>
          当前等级：
          <span style={{ color: currentConfig.color, marginLeft: "8px" }}>
            {currentConfig.icon} {currentConfig.label}
          </span>
        </Text>
        
        {showMaskedData && currentConfig.maskedFields.length > 0 ? (
          <div>
            <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "8px" }}>
              以下信息将被遮挡显示：
            </Text>
            <Space size={[6, 6]} wrap>
              {currentConfig.maskedFields.map((field) => (
                <Badge
                  key={field}
                  count={field}
                  style={{
                    backgroundColor: "#ff4d4f",
                    fontSize: "10px",
                    height: "18px",
                    lineHeight: "18px",
                    borderRadius: "9px",
                  }}
                />
              ))}
            </Space>
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {showMaskedData ? "所有信息完全可见" : "隐私保护已关闭，所有信息可见"}
          </Text>
        )}
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
