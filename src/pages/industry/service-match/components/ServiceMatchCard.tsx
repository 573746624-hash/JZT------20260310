import React from "react";
import {
  Card,
  Tag,
  Button,
  Typography,
  Rate,
  Checkbox,
  Space,
  Avatar,
} from "antd";
import {
  ThunderboltOutlined,
  HeartOutlined,
  StarFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SafetyCertificateFilled,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// 企业级配色 - 统一使用designTokens规范
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
  error: "#C0392B",
};

interface ServiceMatchCardProps {
  item: any;
  isSelected: boolean;
  isComparing: boolean;
  activeTab: string; // 'business' or 'procurement'
  onSelect: (id: string, checked: boolean) => void;
  onCompare: (item: any) => void;
  onConnect: (item: any) => void;
  navigate: any;
}

const ServiceMatchCard: React.FC<ServiceMatchCardProps> = ({
  item,
  isSelected,
  isComparing,
  activeTab,
  onSelect,
  onCompare,
  onConnect,
  navigate,
}) => {
  const isProcurement = activeTab === "procurement";

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
      onClick={() => navigate(`/industry/service-match/detail/${item.id}`)}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {/* 左侧：选择框和企业头像 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(item.id, e.target.checked);
            }}
          />
          <Avatar
            size={56}
            style={{
              backgroundColor: ENTERPRISE_THEME.background,
              color: ENTERPRISE_THEME.textTertiary,
              borderRadius: 4,
            }}
          >
            {item.name ? item.name.charAt(0) : "企"}
          </Avatar>
        </div>

        {/* 中间：主要内容 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 第一行：企业名称和标签 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              flexWrap: "wrap",
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
              {item.name}
            </Text>
            {item.qualification === "已认证" && (
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
            {item.isRecommend && (
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
                推荐
              </Tag>
            )}
            {item.advantageTags &&
              item.advantageTags.map((tag: string) => (
                <Tag
                  key={tag}
                  style={{
                    margin: 0,
                    fontSize: 11,
                    borderRadius: 2,
                    background: "#F5F5F5",
                    border: `1px solid ${ENTERPRISE_THEME.border}`,
                    color: ENTERPRISE_THEME.textTertiary,
                    padding: "0 6px",
                  }}
                >
                  {tag}
                </Tag>
              ))}
            <Text style={{ fontSize: 12, color: ENTERPRISE_THEME.textMuted, marginLeft: "auto" }}>
              {item.updateTime}
            </Text>
          </div>

          {/* 第二行：需求/服务名称 */}
          <Title
            level={5}
            style={{
              margin: "0 0 8px 0",
              fontSize: 16,
              color: ENTERPRISE_THEME.primary,
              fontWeight: 600,
            }}
          >
            {isProcurement ? "采购需求" : "服务供给"}
          </Title>

          {/* 第三行：描述内容 */}
          <Text
            style={{
              color: ENTERPRISE_THEME.textTertiary,
              fontSize: 13,
              lineHeight: "1.5",
              display: "block",
              marginBottom: 10,
            }}
            ellipsis={{ rows: 2 }}
          >
            {item.scope}
          </Text>

          {/* 第四行：标签组 */}
          {item.tags && item.tags.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <Space size={[6, 6]} wrap>
                {item.tags.slice(0, 4).map((tag: string, index: number) => (
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
          )}

          {/* 第五行：元信息 */}
          <Space size={16} style={{ fontSize: 12, color: ENTERPRISE_THEME.textMuted }}>
            <span>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {item.region}
            </span>
            {isProcurement && item.budget && (
              <span>
                预算：<Text strong style={{ color: ENTERPRISE_THEME.textSecondary }}>{item.budget}</Text>
              </span>
            )}
            {isProcurement && item.quantity && (
              <span>
                数量：<Text strong style={{ color: ENTERPRISE_THEME.textSecondary }}>{item.quantity}</Text>
              </span>
            )}
            {isProcurement && item.deadline && (
              <span>
                截止：<Text strong style={{ color: ENTERPRISE_THEME.error }}>{item.deadline}</Text>
              </span>
            )}
            <span>
              <StarFilled style={{ marginRight: 4, color: "#FAAD14" }} />
              {item.score}
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
          {/* 评分 */}
          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <Rate
              disabled
              defaultValue={item.score}
              character={<StarFilled style={{ fontSize: "12px" }} />}
              style={{
                color: "#FAAD14",
                fontSize: "12px",
              }}
            />
          </div>

          {/* 操作按钮 */}
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            <Button
              type="primary"
              block
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={() => onConnect(item)}
              style={{ borderRadius: 2, background: ENTERPRISE_THEME.primary }}
            >
              立即对接
            </Button>
            <Space style={{ width: "100%" }}>
              <Button
                size="small"
                style={{ flex: 1, borderRadius: 2 }}
                icon={<HeartOutlined />}
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

export default ServiceMatchCard;
