import React from "react";
import { Row, Col, Card, Typography, Badge } from "antd";
import {
  ToolOutlined,
  SafetyOutlined,
  DollarOutlined,
  TeamOutlined,
  BookOutlined,
  SoundOutlined,
  BankOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { THEME } from "../styles";

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
      id: "tech",
      name: "技术服务",
      icon: <ToolOutlined />,
      count: 1250,
      description: "技术开发、技术咨询、技术转让",
      color: "#1890ff",
    },
    {
      id: "legal",
      name: "法律服务",
      icon: <SafetyOutlined />,
      count: 890,
      description: "法律咨询、合同审核、诉讼代理",
      color: "#722ed1",
    },
    {
      id: "finance",
      name: "财税服务",
      icon: <DollarOutlined />,
      count: 1120,
      description: "财务代理、税务筹划、审计服务",
      color: "#52c41a",
    },
    {
      id: "hr",
      name: "人力资源",
      icon: <TeamOutlined />,
      count: 760,
      description: "招聘服务、培训服务、劳务派遣",
      color: "#fa8c16",
    },
    {
      id: "ip",
      name: "知识产权",
      icon: <BookOutlined />,
      count: 650,
      description: "专利申请、商标注册、版权登记",
      color: "#eb2f96",
    },
    {
      id: "marketing",
      name: "市场推广",
      icon: <SoundOutlined />,
      count: 980,
      description: "品牌推广、营销策划、广告投放",
      color: "#13c2c2",
    },
    {
      id: "office",
      name: "办公服务",
      icon: <BankOutlined />,
      count: 540,
      description: "办公租赁、设备采购、物业服务",
      color: "#faad14",
    },
    {
      id: "financial",
      name: "金融服务",
      icon: <FundOutlined />,
      count: 420,
      description: "融资服务、贷款咨询、保险服务",
      color: "#f5222d",
    },
  ];

  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          strong
          style={{
            fontSize: "18px",
            color: THEME.textTitle,
            borderLeft: `4px solid ${THEME.primary}`,
            paddingLeft: "12px",
          }}
        >
          服务分类
        </Text>
        <Text
          type="secondary"
          style={{ fontSize: "14px", cursor: "pointer" }}
          onClick={() => onCategoryClick("")}
        >
          查看全部 →
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col xs={12} sm={8} md={6} lg={3} key={category.id}>
            <Card
              hoverable
              onClick={() => onCategoryClick(category.id)}
              style={{
                borderRadius: "12px",
                border:
                  selectedCategory === category.id
                    ? `2px solid ${category.color}`
                    : "1px solid #f0f0f0",
                boxShadow:
                  selectedCategory === category.id
                    ? `0 4px 12px ${category.color}20`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              styles={{
                body: {
                  padding: "20px 16px",
                  textAlign: "center",
                },
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  color: category.color,
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {category.icon}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "8px",
                  color: THEME.textTitle,
                }}
              >
                {category.name}
              </div>
              <Badge
                count={category.count}
                style={{
                  backgroundColor: category.color,
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: THEME.textBody,
                  lineHeight: "1.4",
                  height: "32px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {category.description}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ServiceCategoryNav;
