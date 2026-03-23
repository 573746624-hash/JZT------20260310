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
  color: string;
}

interface ServiceCategoryNavProps {
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string;
}

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
      color: "#165DFF",
    },
    {
      id: "enterprise",
      name: "企业基础服务",
      icon: <BankOutlined />,
      count: 2890,
      description: "工商注册、财税代理、知识产权、法律咨询",
      color: "#2F7A3E",
    },
    {
      id: "industry",
      name: "产业对接服务",
      icon: <ShareAltOutlined />,
      count: 760,
      description: "供应链配套、技术合作、产学研对接、投融资",
      color: "#D46B08",
    },
    {
      id: "digital",
      name: "数字化转型服务",
      icon: <CloudOutlined />,
      count: 650,
      description: "信息化系统、智能制造、数据安全、云服务",
      color: "#0958D9",
    },
    {
      id: "talent",
      name: "人才服务",
      icon: <TeamOutlined />,
      count: 980,
      description: "招聘猎头、培训认证、劳务派遣、股权激励",
      color: "#531DAB",
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={category.id}>
            <Card
              hoverable
              onClick={() => onCategoryClick(category.id)}
              style={{
                borderRadius: 4,
                border:
                  selectedCategory === category.id
                    ? `2px solid ${category.color}`
                    : "1px solid #E4E7ED",
                background: selectedCategory === category.id ? "#F5F7FA" : "#fff",
                cursor: "pointer",
                transition: "all 0.3s",
                height: "100%",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 4,
                    background: category.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 24,
                    flexShrink: 0,
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
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: 16,
                        color: "#1A1A1A",
                      }}
                    >
                      {category.name}
                    </Text>
                    <Badge
                      count={category.count}
                      style={{
                        backgroundColor: "#F2F3F5",
                        color: "#666",
                        fontSize: 12,
                      }}
                    />
                  </div>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#666",
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
        ))}
      </Row>
    </div>
  );
};

export default ServiceCategoryNav;
