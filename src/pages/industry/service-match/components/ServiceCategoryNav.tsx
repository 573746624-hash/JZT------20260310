import React from "react";
import { Row, Col, Card, Typography, Badge } from "antd";
import {
  FileTextOutlined,
  BankOutlined,
  ShareAltOutlined,
  CloudOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  description: string;
}

interface ServiceCategoryNavProps {
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string;
}

// 企业级配色 - 统一使用主色
const PRIMARY_COLOR = "#1A5FB4";
const BORDER_COLOR = "#D9D9D9";
const BORDER_LIGHT = "#E8E8E8";
const BG_HOVER = "#F5F5F5";
const BG_SELECTED = "#F0F5FF";

const ServiceCategoryNav: React.FC<ServiceCategoryNavProps> = ({
  onCategoryClick,
  selectedCategory,
}) => {
  const categories: ServiceCategory[] = [
    {
      id: "policy",
      name: "政策申报服务",
      icon: <FileTextOutlined />,
      count: 1250,
      description: "高企认定、专精特新、科技项目申报、资质认证",
    },
    {
      id: "enterprise",
      name: "企业基础服务",
      icon: <BankOutlined />,
      count: 2890,
      description: "工商注册、财税代理、知识产权、法律咨询",
    },
    {
      id: "industry",
      name: "产业对接服务",
      icon: <ShareAltOutlined />,
      count: 760,
      description: "供应链配套、技术合作、产学研对接、投融资",
    },
    {
      id: "digital",
      name: "数字化转型服务",
      icon: <CloudOutlined />,
      count: 650,
      description: "信息化系统、智能制造、数据安全、云服务",
    },
    {
      id: "talent",
      name: "人才服务",
      icon: <TeamOutlined />,
      count: 980,
      description: "招聘猎头、培训认证、劳务派遣、股权激励",
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={category.id}>
              <Card
                hoverable
                onClick={() => onCategoryClick(category.id)}
                style={{
                  borderRadius: 4,
                  border: isSelected
                    ? `1px solid ${PRIMARY_COLOR}`
                    : `1px solid ${BORDER_LIGHT}`,
                  background: isSelected ? BG_SELECTED : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  height: "100%",
                  boxShadow: "none",
                }}
                bodyStyle={{ padding: "16px 20px" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* 图标 - 企业级风格，无背景色块 */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isSelected ? PRIMARY_COLOR : "#666666",
                      fontSize: 20,
                      flexShrink: 0,
                      border: `1px solid ${isSelected ? PRIMARY_COLOR : BORDER_COLOR}`,
                      background: isSelected ? "#fff" : "transparent",
                    }}
                  >
                    {category.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                          color: isSelected ? PRIMARY_COLOR : "#1A1A1A",
                          fontWeight: 600,
                        }}
                      >
                        {category.name}
                      </Text>
                      <Badge
                        count={category.count}
                        style={{
                          backgroundColor: "#F5F5F5",
                          color: "#666666",
                          fontSize: 11,
                          fontWeight: 400,
                        }}
                      />
                    </div>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        lineHeight: "1.5",
                        display: "block",
                      }}
                    >
                      {category.description}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ServiceCategoryNav;
