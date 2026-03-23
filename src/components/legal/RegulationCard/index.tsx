/**
 * 法规卡片组件
 * 用于法规信息的结构化展示
 */
import React from "react";
import { Card, Tag, Space, Typography, Button, Tooltip } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

// 法规数据接口
export interface RegulationItem {
  id: string;
  title: string;
  level: string;
  field: string;
  scenario: string;
  publishOrg: string;
  publishDate: string;
  effectiveDate: string;
  status: "effective" | "revised" | "abolished";
  tags: string[];
  summary: string;
  keyArticles: string[];
  viewCount: number;
  downloadCount: number;
  matchScore?: number;
  isNew?: boolean;
  isHot?: boolean;
}

// 组件属性接口
interface RegulationCardProps {
  data: RegulationItem;
  layout?: "vertical" | "horizontal";
  showActions?: boolean;
  isFavorited?: boolean;
  onClick?: (id: string) => void;
  onFavorite?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

// 法规级别颜色映射
const levelColorMap: Record<string, string> = {
  法律: "blue",
  行政法规: "cyan",
  部门规章: "geekblue",
  地方性法规: "purple",
  规范性文件: "default",
  司法解释: "orange",
};

// 状态标签映射
const statusTagMap: Record<string, { text: string; color: string }> = {
  effective: { text: "现行有效", color: "#52c41a" },
  revised: { text: "已修订", color: "#faad14" },
  abolished: { text: "已废止", color: "#bfbfbf" },
};

export const RegulationCard: React.FC<RegulationCardProps> = ({
  data,
  layout = "vertical",
  showActions = true,
  isFavorited = false,
  onClick,
  onFavorite,
  className,
  style,
}) => {
  // 处理卡片点击
  const handleCardClick = () => {
    onClick?.(data.id);
  };

  // 处理收藏点击
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(data.id);
  };

  // 渲染标签区域
  const renderTags = () => (
    <Space wrap size={4}>
      <Tag color={levelColorMap[data.level] || "default"} style={{ fontSize: 12 }}>
        {data.level}
      </Tag>
      <Tag color={statusTagMap[data.status]?.color || "default"} style={{ fontSize: 12 }}>
        {statusTagMap[data.status]?.text || data.status}
      </Tag>
      {data.isNew && (
        <Tag color="red" style={{ fontSize: 12 }}>
          NEW
        </Tag>
      )}
      {data.isHot && (
        <Tag color="orange" style={{ fontSize: 12 }}>
          HOT
        </Tag>
      )}
    </Space>
  );

  // 渲染元信息区域
  const renderMeta = () => (
    <Space size={16}>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {data.publishOrg}
      </Text>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {data.publishDate}
      </Text>
    </Space>
  );

  // 渲染统计信息
  const renderStats = () => (
    <Space size={16}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        <EyeOutlined style={{ marginRight: 4 }} />
        {data.viewCount.toLocaleString()}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        <DownloadOutlined style={{ marginRight: 4 }} />
        {data.downloadCount.toLocaleString()}
      </Text>
    </Space>
  );

  // 渲染操作按钮
  const renderActions = () => (
    <Space>
      <Tooltip title={isFavorited ? "取消收藏" : "收藏"}>
        <Button
          type="text"
          size="small"
          icon={isFavorited ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
          onClick={handleFavoriteClick}
        />
      </Tooltip>
      <Button type="link" size="small" style={{ padding: 0 }}>
        查看详情 →
      </Button>
    </Space>
  );

  // 垂直布局（默认）
  if (layout === "vertical") {
    return (
      <Card
        hoverable
        className={`regulation-card regulation-card-vertical ${className || ""}`}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          ...style,
        }}
        bodyStyle={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
        onClick={handleCardClick}
      >
        {/* 标签区域 */}
        <div style={{ marginBottom: 12 }}>{renderTags()}</div>

        {/* 标题 */}
        <Text
          strong
          style={{
            fontSize: 16,
            marginBottom: 8,
            display: "block",
            lineHeight: 1.5,
          }}
          ellipsis={{ rows: 2, tooltip: data.title }}
        >
          {data.title}
        </Text>

        {/* 摘要 */}
        <Paragraph
          type="secondary"
          style={{ fontSize: 13, color: "#666", flex: 1, marginBottom: 12 }}
          ellipsis={{ rows: 2, tooltip: data.summary }}
        >
          {data.summary}
        </Paragraph>

        {/* 元信息 */}
        <div style={{ marginBottom: 12 }}>{renderMeta()}</div>

        {/* 底部：统计 + 操作 */}
        {showActions && (
          <div
            style={{
              marginTop: "auto",
              paddingTop: 12,
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {renderStats()}
            {renderActions()}
          </div>
        )}
      </Card>
    );
  }

  // 水平布局
  return (
    <Card
      hoverable
      className={`regulation-card regulation-card-horizontal ${className || ""}`}
      style={{
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        ...style,
      }}
      bodyStyle={{ padding: 16 }}
      onClick={handleCardClick}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {/* 左侧：标签和标题 */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>{renderTags()}</div>
          <Text
            strong
            style={{ fontSize: 16, display: "block", marginBottom: 8 }}
            ellipsis={{ tooltip: data.title }}
          >
            {data.title}
          </Text>
          <Paragraph
            type="secondary"
            style={{ fontSize: 13, color: "#666", margin: 0 }}
            ellipsis={{ rows: 1, tooltip: data.summary }}
          >
            {data.summary}
          </Paragraph>
        </div>

        {/* 右侧：元信息和操作 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            minWidth: 180,
          }}
        >
          {renderMeta()}
          {showActions && (
            <Space style={{ marginTop: 8 }}>
              {renderStats()}
              {renderActions()}
            </Space>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RegulationCard;
