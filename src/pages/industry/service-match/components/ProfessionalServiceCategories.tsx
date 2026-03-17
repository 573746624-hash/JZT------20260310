import React from "react";
import { Row, Col, Card, Typography, Badge, Space } from "antd";
import {
  ExperimentOutlined,
  SafetyCertificateFilled,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  BuildOutlined,
  CodeOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { THEME } from "../styles";

const { Text } = Typography;

interface ProfessionalCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  description: string;
  color: string;
  subcategories: string[];
  examples: string[];
}

interface ProfessionalServiceCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string;
}

const ProfessionalServiceCategories: React.FC<ProfessionalServiceCategoriesProps> = ({
  onCategoryClick,
  selectedCategory,
}) => {
  const professionalCategories: ProfessionalCategory[] = [
    {
      id: "testing",
      name: "检测认证",
      icon: <ExperimentOutlined />,
      count: 456,
      description: "专业检测、认证、验证服务",
      color: "#1890ff",
      subcategories: ["食品检测", "环境检测", "产品认证", "体系认证"],
      examples: ["食品安全检测", "CE认证", "ISO认证", "环境监测"],
    },
    {
      id: "safety",
      name: "安全合规",
      icon: <SafetyCertificateFilled />,
      count: 324,
      description: "安全评估、合规咨询服务",
      color: "#52c41a",
      subcategories: ["安全评估", "合规咨询", "风险管控", "应急预案"],
      examples: ["安全生产评估", "消防安全", "职业健康", "应急响应"],
    },
    {
      id: "medical",
      name: "医疗器械",
      icon: <MedicineBoxOutlined />,
      count: 289,
      description: "医疗器械研发、注册、生产",
      color: "#722ed1",
      subcategories: ["产品研发", "注册申报", "生产代工", "质量控制"],
      examples: ["医疗器械研发", "FDA注册", "NMPA申报", "GMP生产"],
    },
    {
      id: "environmental",
      name: "环保工程",
      icon: <EnvironmentOutlined />,
      count: 378,
      description: "环保设备、工程、治理服务",
      color: "#13c2c2",
      subcategories: ["废水处理", "废气治理", "固废处理", "环境修复"],
      examples: ["废水处理设备", "VOCs治理", "土壤修复", "环评服务"],
    },
    {
      id: "manufacturing",
      name: "制造代工",
      icon: <BuildOutlined />,
      count: 567,
      description: "代工生产、制造服务",
      color: "#fa8c16",
      subcategories: ["OEM代工", "ODM设计", "精密加工", "装配服务"],
      examples: ["电子产品代工", "机械加工", "模具制造", "装配生产"],
    },
    {
      id: "technology",
      name: "技术开发",
      icon: <CodeOutlined />,
      count: 445,
      description: "软件开发、技术咨询服务",
      color: "#eb2f96",
      subcategories: ["软件开发", "系统集成", "技术咨询", "数字化转型"],
      examples: ["管理系统开发", "APP开发", "数据分析", "AI解决方案"],
    },
    {
      id: "equipment",
      name: "设备租赁",
      icon: <SettingOutlined />,
      count: 234,
      description: "专业设备租赁、维护服务",
      color: "#faad14",
      subcategories: ["设备租赁", "设备维护", "技术支持", "培训服务"],
      examples: ["检测设备租赁", "生产设备租赁", "实验室设备", "工程机械"],
    },
    {
      id: "supply",
      name: "供应链服务",
      icon: <ShoppingCartOutlined />,
      count: 356,
      description: "采购、物流、供应链管理",
      color: "#f5222d",
      subcategories: ["采购代理", "物流配送", "仓储管理", "供应链优化"],
      examples: ["原材料采购", "跨境物流", "仓储服务", "供应链金融"],
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
          专业服务分类
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
        {professionalCategories.map((category) => (
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
                height: "160px",
              }}
              styles={{
                body: {
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                },
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "28px",
                    color: category.color,
                    marginBottom: "8px",
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
                    marginBottom: "6px",
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
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: THEME.textBody,
                  lineHeight: "1.3",
                  height: "26px",
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

      {/* 选中分类的详细信息 */}
      {selectedCategory && (
        <div style={{ marginTop: "20px" }}>
          {(() => {
            const selected = professionalCategories.find(
              (cat) => cat.id === selectedCategory
            );
            if (!selected) return null;

            return (
              <Card
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${selected.color}`,
                  backgroundColor: `${selected.color}08`,
                }}
                styles={{ body: { padding: "16px" } }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong style={{ color: selected.color, fontSize: "16px" }}>
                      {selected.name} - 细分领域
                    </Text>
                  </div>
                  <Space size={[8, 8]} wrap>
                    {selected.subcategories.map((sub, index) => (
                      <Badge
                        key={index}
                        count={sub}
                        style={{
                          backgroundColor: selected.color,
                          borderRadius: "12px",
                          fontSize: "11px",
                        }}
                      />
                    ))}
                  </Space>
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      典型服务：{selected.examples.join("、")}
                    </Text>
                  </div>
                </Space>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ProfessionalServiceCategories;
