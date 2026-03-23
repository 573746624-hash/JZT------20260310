import React from "react";
import {
  Card,
  Tag,
  Button,
  Typography,
  Space,
  Rate,
  Checkbox,
  Avatar,
  Divider,
} from "antd";
import {
  ThunderboltOutlined,
  HeartOutlined,
  StarFilled,
  SafetyCertificateFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// 企业级配色
const ENTERPRISE_THEME = {
  primary: "#165DFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#E4E7ED",
  background: "#F5F7FA",
  success: "#2F7A3E",
  warning: "#D46B08",
};

interface SupplyService {
  id: string;
  companyName: string;
  companyLogo?: string;
  serviceName: string;
  serviceDescription: string;
  serviceCategories: string[];
  professionalTags: string[];
  region: string;
  publishTime: string;
  rating: number;
  completedProjects: number;
  responseTime: string;
  certifications: string[];
  capabilities: string[];
  priceRange?: string;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  successRate: number;
  contactInfo?: {
    phone: string;
    email: string;
  };
}

interface SupplyServiceCardProps {
  service: SupplyService;
  isSelected: boolean;
  isComparing: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onCompare: (service: SupplyService) => void;
  onConnect: (service: SupplyService) => void;
  onFavorite: (service: SupplyService) => void;
  navigate: any;
  userLevel?: string;
}

const SupplyServiceCard: React.FC<SupplyServiceCardProps> = ({
  service,
  isSelected,
  isComparing,
  onSelect,
  onCompare,
  onConnect,
  onFavorite,
  navigate,
}) => {
  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 4,
        border: `1px solid ${ENTERPRISE_THEME.border}`,
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      bodyStyle={{ padding: "20px 24px" }}
      onClick={() => navigate(`/industry/service-match/detail/${service.id}`)}
    >
      <div style={{ display: "flex", gap: 20 }}>
        {/* 左侧：选择框和企业头像 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(service.id, e.target.checked);
            }}
          />
          <Avatar
            src={service.companyLogo}
            icon={<TeamOutlined />}
            size={64}
            style={{
              backgroundColor: ENTERPRISE_THEME.background,
              color: ENTERPRISE_THEME.textSecondary,
            }}
          />
        </div>

        {/* 中间：主要内容 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 第一行：企业名称和认证状态 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <Text
              strong
              style={{
                fontSize: 16,
                color: ENTERPRISE_THEME.textPrimary,
              }}
            >
              {service.companyName}
            </Text>
            {service.isVerified && (
              <Tag
                icon={<SafetyCertificateFilled />}
                color="success"
                style={{ margin: 0, fontSize: 12 }}
              >
                已认证
              </Tag>
            )}
            {service.isFeatured && (
              <Tag
                icon={<StarFilled />}
                color="warning"
                style={{ margin: 0, fontSize: 12 }}
              >
                精选
              </Tag>
            )}
          </div>

          {/* 第二行：服务名称 */}
          <Title
            level={5}
            style={{
              margin: "0 0 12px 0",
              fontSize: 18,
              color: ENTERPRISE_THEME.primary,
              fontWeight: 600,
            }}
          >
            {service.serviceName}
          </Title>

          {/* 第三行：服务描述 */}
          <Text
            style={{
              color: ENTERPRISE_THEME.textSecondary,
              fontSize: 14,
              lineHeight: "1.6",
              display: "block",
              marginBottom: 12,
            }}
            ellipsis={{ rows: 2 }}
          >
            {service.serviceDescription}
          </Text>

          {/* 第四行：专业标签 */}
          <div style={{ marginBottom: 12 }}>
            <Space size={[8, 8]} wrap>
              {service.professionalTags.slice(0, 4).map((tag, index) => (
                <Tag
                  key={index}
                  style={{
                    backgroundColor: "#F0F5FF",
                    border: `1px solid ${ENTERPRISE_THEME.primary}`,
                    color: ENTERPRISE_THEME.primary,
                    borderRadius: 4,
                    fontSize: 12,
                    padding: "2px 8px",
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>

          {/* 第五行：资质认证 */}
          {service.certifications.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Space size={[8, 8]} wrap>
                {service.certifications.slice(0, 3).map((cert, index) => (
                  <Tag
                    key={index}
                    icon={<CheckCircleOutlined />}
                    style={{
                      backgroundColor: "#F6FFED",
                      border: `1px solid ${ENTERPRISE_THEME.success}`,
                      color: ENTERPRISE_THEME.success,
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {cert}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {/* 第六行：基础信息 */}
          <Space size={24} style={{ fontSize: 13, color: ENTERPRISE_THEME.textMuted }}>
            <span>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {service.region}
            </span>
            <span>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {service.publishTime}
            </span>
            <span>
              <TeamOutlined style={{ marginRight: 4 }} />
              {service.completedProjects} 个成功案例
            </span>
            <span>
              <StarFilled style={{ marginRight: 4, color: "#FAAD14" }} />
              {service.rating} 分
            </span>
          </Space>
        </div>

        {/* 右侧：操作区域 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            minWidth: 140,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 价格 */}
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: ENTERPRISE_THEME.textMuted }}>
              价格区间
            </Text>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: ENTERPRISE_THEME.warning,
              }}
            >
              {service.priceRange || "面议"}
            </div>
          </div>

          {/* 操作按钮 */}
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Button
              type="primary"
              block
              icon={<ThunderboltOutlined />}
              onClick={() => onConnect(service)}
            >
              立即对接
            </Button>
            <Space style={{ width: "100%" }}>
              <Button
                style={{ flex: 1 }}
                icon={<HeartOutlined />}
                onClick={() => onFavorite(service)}
              >
                收藏
              </Button>
              <Button
                style={{ flex: 1 }}
                type={isComparing ? "primary" : "default"}
                onClick={() => onCompare(service)}
              >
                {isComparing ? "已对比" : "对比"}
              </Button>
            </Space>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default SupplyServiceCard;
