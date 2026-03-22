/**
 * 首页快捷操作组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { QuickActionItem } from "../types/index.ts";

const { Text } = Typography;

interface QuickActionsSectionProps {
  quickActions: QuickActionItem[];
  onNavigate: (path: string) => void;
  loading?: boolean;
}

/**
 * 快捷操作组件
 * 组件创建时间: 2026-01-13
 */
export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  quickActions,
  onNavigate,
  loading = false,
}) => {
  return (
    <Card
      loading={loading}
      title={
        <div style={{ display: "flex", alignItems: "center", fontSize: "16px", fontWeight: 600 }}>
          <TrophyOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
          核心功能
        </div>
      }
      headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '0 24px', minHeight: '56px' }}
      bodyStyle={{ padding: '24px' }}
      style={{ borderRadius: "8px", border: "none", boxShadow: "0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06)" }}
    >
      <Row gutter={[24, 24]}>
        {quickActions.map((action, index) => (
          <Col xs={12} sm={12} md={6} key={index}>
            <Card
              size="small"
              className="hover-card"
              style={{
                cursor: "pointer",
                background: `linear-gradient(145deg, ${action.bgColor} 0%, #ffffff 100%)`,
                border: `1px solid ${action.color}20`,
                height: "140px",
                borderRadius: "12px",
                transition: "all 0.3s ease",
              }}
              onClick={() => onNavigate(action.path)}
              styles={{
                body: {
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "100%",
                },
              }}
            >
              <div style={{ textAlign: "center", width: "100%" }}>
                <div 
                  className="quick-action-icon"
                  style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${action.color}15`,
                    marginBottom: "12px",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {React.cloneElement(action.icon as React.ReactElement, { style: { fontSize: 24, color: action.color } })}
                </div>
                <div style={{ marginBottom: "6px" }}>
                  <Text
                    strong
                    style={{ fontSize: "16px", color: "#333" }}
                  >
                    {action.title}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "13px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {action.description}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
