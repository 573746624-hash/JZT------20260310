import React, { useState } from "react";
import {
  Card,
  Tag,
  Button,
  Typography,
  Space,
  Rate,
  Checkbox,
  Avatar,
  Tooltip,
  Badge,
  Progress,
} from "antd";
import {
  ThunderboltOutlined,
  HeartOutlined,
  StarFilled,
  SafetyCertificateFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { THEME, COMMON_STYLES } from "../styles";
// 移除导入，使用父组件传递的遮挡数据

const { Title, Text, Paragraph } = Typography;

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
  userLevel?: string; // 用户等级，决定遮挡程度
  showMaskedData?: boolean; // 是否显示遮挡数据
  maskedData?: SupplyService; // 预处理的遮挡数据
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
  userLevel = "guest",
  showMaskedData = true,
  maskedData,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullData, setShowFullData] = useState(false);

  // 使用预处理的遮挡数据或原始数据
  const displayData = showMaskedData && !showFullData && maskedData ? 
    maskedData : service;

  return (
    <Card
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        marginBottom: "20px",
        borderRadius: "12px",
        border: service.isFeatured ? "2px solid #faad14" : "1px solid #f0f0f0",
        boxShadow: service.isFeatured 
          ? "0 4px 16px rgba(250, 173, 20, 0.15)" 
          : "0 2px 8px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
      styles={{ body: { padding: "24px" } }}
      onClick={() => navigate(`/industry/service-match/detail/${service.id}`)}
    >
      {/* 精选标识 */}
      {service.isFeatured && (
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            background: "linear-gradient(135deg, #faad14, #ffc53d)",
            color: "#fff",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: "bold",
            borderBottomLeftRadius: "8px",
          }}
        >
          <TrophyOutlined style={{ marginRight: "4px" }} />
          精选服务
        </div>
      )}

      {/* 选择框 */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(service.id, e.target.checked)}
        />
      </div>

      {/* 主要内容区域 */}
      <div style={{ marginLeft: "30px" }}>
        {/* 头部信息 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            {/* 企业信息 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Avatar
                src={service.companyLogo}
                icon={<TeamOutlined />}
                size={40}
                style={{ marginRight: "12px" }}
              />
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: THEME.textTitle,
                      marginRight: "8px",
                    }}
                  >
                    {displayData.companyName}
                  </Title>
                  {service.isVerified && (
                    <Tooltip title="已认证企业">
                      <SafetyCertificateFilled
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                    </Tooltip>
                  )}
                  {showMaskedData && (
                    <Tooltip title={showFullData ? "隐藏详细信息" : "显示详细信息"}>
                      <Button
                        type="text"
                        size="small"
                        icon={showFullData ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullData(!showFullData);
                        }}
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          color: THEME.textBody,
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
                <Space size={8} style={{ fontSize: "12px", color: THEME.textBody }}>
                  <span>
                    <EnvironmentOutlined style={{ marginRight: "2px" }} />
                    {service.region}
                  </span>
                  <span>
                    <ClockCircleOutlined style={{ marginRight: "2px" }} />
                    {service.publishTime}
                  </span>
                  <span>
                    <EyeOutlined style={{ marginRight: "2px" }} />
                    {service.viewCount}次浏览
                  </span>
                </Space>
              </div>
            </div>

            {/* 服务标题 */}
            <Title
              level={4}
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                color: THEME.primary,
                fontWeight: "600",
              }}
            >
              {service.serviceName}
            </Title>

            {/* 专业标签 */}
            <div style={{ marginBottom: "12px" }}>
              <Space size={[8, 8]} wrap>
                {service.professionalTags.map((tag, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    style={{
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "11px",
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>

        </div>

        {/* 业务供给描述 */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #e9ecef",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: THEME.primary,
              marginBottom: "8px",
            }}
          >
            业务供给：
          </div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "展开" }}
            style={{
              margin: 0,
              fontSize: "14px",
              color: THEME.textBody,
              lineHeight: "1.6",
            }}
          >
            {service.serviceDescription}
          </Paragraph>
        </div>

        {/* 企业能力展示 */}
        <div style={{ marginBottom: "16px" }}>
          <Text
            strong
            style={{
              fontSize: "13px",
              color: THEME.textTitle,
              marginBottom: "8px",
              display: "block",
            }}
          >
            核心能力：
          </Text>
          <Space size={[6, 6]} wrap>
            {service.capabilities.map((capability, index) => (
              <Tag
                key={index}
                style={{
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #91d5ff",
                  color: "#1890ff",
                  borderRadius: "4px",
                  fontSize: "11px",
                }}
              >
                {capability}
              </Tag>
            ))}
          </Space>
        </div>

        {/* 资质认证 */}
        {service.certifications.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <Text
              strong
              style={{
                fontSize: "13px",
                color: THEME.textTitle,
                marginBottom: "8px",
                display: "block",
              }}
            >
              资质认证：
            </Text>
            <Space size={[6, 6]} wrap>
              {service.certifications.map((cert, index) => (
                <Badge
                  key={index}
                  count={<SafetyCertificateFilled style={{ color: "#52c41a" }} />}
                  offset={[-2, 2]}
                >
                  <Tag
                    style={{
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                      color: "#52c41a",
                      borderRadius: "4px",
                      fontSize: "11px",
                      paddingRight: "12px",
                    }}
                  >
                    {cert}
                  </Tag>
                </Badge>
              ))}
            </Space>
          </div>
        )}

        {/* 底部操作区 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Space size={16}>
            <div style={{ fontSize: "12px", color: THEME.textBody }}>
              <Text strong style={{ color: THEME.textTitle }}>
                {service.completedProjects}
              </Text>{" "}
              个成功项目
            </div>
            <div style={{ fontSize: "12px", color: THEME.textBody }}>
              响应时间：
              <Text strong style={{ color: THEME.primary }}>
                {service.responseTime}
              </Text>
            </div>
            {displayData.priceRange && (
              <div style={{ fontSize: "12px", color: THEME.textBody }}>
                价格：
                <Text strong style={{ color: "#fa8c16" }}>
                  {displayData.priceRange}
                </Text>
              </div>
            )}
          </Space>

          <Space size={8} onClick={(e) => e.stopPropagation()}>
            <Button
              type="primary"
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={() => onConnect(service)}
              style={{
                borderRadius: "6px",
                fontWeight: "500",
                opacity: isHovered ? 1 : 0.8,
                transition: "opacity 0.2s",
              }}
            >
              立即对接
            </Button>
            <Button
              type="text"
              size="small"
              icon={<HeartOutlined />}
              onClick={() => onFavorite(service)}
              style={{ color: THEME.textBody }}
            />
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default SupplyServiceCard;
