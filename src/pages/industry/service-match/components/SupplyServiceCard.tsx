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

// 企业级配色 - 稳重专业
const ENTERPRISE_THEME = {
  primary: "#1A5FB4",
  textPrimary: "#1A1A1A",
  textSecondary: "#333333",
  textTertiary: "#666666",
  textMuted: "#999999",
  border: "#D9D9D9",
  borderLight: "#E8E8E8",
  background: "#F5F5F5",
  success: "#27AE60",
  warning: "#E67E22",
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
  showMaskedData?: boolean;
  maskedData?: any;
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
        marginBottom: 12,
        borderRadius: 4,
        border: `1px solid ${ENTERPRISE_THEME.borderLight}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "none",
      }}
      bodyStyle={{ padding: "16px 20px" }}
      onClick={() => navigate(`/industry/service-match/detail/${service.id}`)}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {/* 左侧：选择框和企业头像 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
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
            size={56}
            style={{
              backgroundColor: ENTERPRISE_THEME.background,
              color: ENTERPRISE_THEME.textTertiary,
              borderRadius: 4,
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
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Text
              strong
              style={{
                fontSize: 15,
                color: ENTERPRISE_THEME.textPrimary,
                fontWeight: 600,
              }}
            >
              {service.companyName}
            </Text>
            {service.isVerified && (
              <Tag
                style={{
                  margin: 0,
                  fontSize: 11,
                  borderRadius: 2,
                  background: "#F6FFED",
                  border: `1px solid ${ENTERPRISE_THEME.success}`,
                  color: ENTERPRISE_THEME.success,
                  padding: "0 6px",
                }}
              >
                已认证
              </Tag>
            )}
            {service.isFeatured && (
              <Tag
                style={{
                  margin: 0,
                  fontSize: 11,
                  borderRadius: 2,
                  background: "#FFF7E6",
                  border: `1px solid ${ENTERPRISE_THEME.warning}`,
                  color: ENTERPRISE_THEME.warning,
                  padding: "0 6px",
                }}
              >
                精选
              </Tag>
            )}
          </div>

          {/* 第二行：服务名称 */}
          <Title
            level={5}
            style={{
              margin: "0 0 8px 0",
              fontSize: 16,
              color: ENTERPRISE_THEME.primary,
              fontWeight: 600,
            }}
          >
            {service.serviceName}
          </Title>

          {/* 第三行：服务描述 */}
          <Text
            style={{
              color: ENTERPRISE_THEME.textTertiary,
              fontSize: 13,
              lineHeight: "1.5",
              display: "block",
              marginBottom: 10,
            }}
            ellipsis
          >
            {service.serviceDescription}
          </Text>

          {/* 第四行：专业标签 */}
          <div style={{ marginBottom: 10 }}>
            <Space size={[6, 6]} wrap>
              {service.professionalTags.slice(0, 4).map((tag, index) => (
                <Tag
                  key={index}
                  style={{
                    backgroundColor: "#F5F5F5",
                    border: `1px solid ${ENTERPRISE_THEME.border}`,
                    color: ENTERPRISE_THEME.textTertiary,
                    borderRadius: 2,
                    fontSize: 11,
                    padding: "1px 6px",
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>

          {/* 第五行：资质认证 */}
          {service.certifications.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <Space size={[6, 6]} wrap>
                {service.certifications.slice(0, 3).map((cert, index) => (
                  <Tag
                    key={index}
                    style={{
                      backgroundColor: "#F6FFED",
                      border: `1px solid ${ENTERPRISE_THEME.success}`,
                      color: ENTERPRISE_THEME.success,
                      borderRadius: 2,
                      fontSize: 11,
                      padding: "1px 6px",
                    }}
                  >
                    {cert}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {/* 第六行：基础信息 */}
          <Space size={16} style={{ fontSize: 12, color: ENTERPRISE_THEME.textMuted }}>
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
              {service.completedProjects} 个案例
            </span>
            <span>
              <StarFilled style={{ marginRight: 4, color: "#FAAD14" }} />
              {service.rating}
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
            minWidth: 120,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 价格 */}
          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: ENTERPRISE_THEME.textMuted }}>
              价格区间
            </Text>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: ENTERPRISE_THEME.textPrimary,
              }}
            >
              {service.priceRange || "面议"}
            </div>
          </div>

          {/* 操作按钮 */}
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            <Button
              type="primary"
              block
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={() => onConnect(service)}
              style={{ borderRadius: 2, background: ENTERPRISE_THEME.primary }}
            >
              立即对接
            </Button>
            <Space style={{ width: "100%" }}>
              <Button
                size="small"
                style={{ flex: 1, borderRadius: 2 }}
                icon={<HeartOutlined />}
                onClick={() => onFavorite(service)}
              >
                收藏
              </Button>
            </Space>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default SupplyServiceCard;
