import React, { useState, useEffect } from "react";
import { Card, Typography, Tag, Space, Button, Carousel } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { THEME } from "../styles";

const { Text, Title } = Typography;

interface Requirement {
  id: string;
  title: string;
  budget: string;
  region: string;
  publishTime: string;
  category: string;
  urgency: "urgent" | "normal" | "longTerm";
  viewCount: number;
  description: string;
}

interface LatestRequirementsProps {
  onRequirementClick: (id: string) => void;
  onViewAllClick: () => void;
}

const LatestRequirements: React.FC<LatestRequirementsProps> = ({
  onRequirementClick,
  onViewAllClick,
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // 模拟数据
  useEffect(() => {
    const mockRequirements: Requirement[] = [
      {
        id: "req-001",
        title: "寻找专业的食品安全检测服务商",
        budget: "5-10万",
        region: "北京市",
        publishTime: "2小时前",
        category: "技术服务",
        urgency: "urgent",
        viewCount: 128,
        description: "需要对新产品进行全面的食品安全检测，包括微生物、重金属、农药残留等项目",
      },
      {
        id: "req-002",
        title: "医疗器械CE认证咨询服务",
        budget: "3-5万",
        region: "上海市",
        publishTime: "4小时前",
        category: "法律服务",
        urgency: "normal",
        viewCount: 89,
        description: "医疗设备需要通过CE认证，寻找有经验的认证咨询机构",
      },
      {
        id: "req-003",
        title: "废水处理设备租赁及运维",
        budget: "面议",
        region: "广州市",
        publishTime: "6小时前",
        category: "环保服务",
        urgency: "longTerm",
        viewCount: 156,
        description: "工厂需要租赁废水处理设备，并提供长期运维服务",
      },
      {
        id: "req-004",
        title: "企业财税合规性审计",
        budget: "2-3万",
        region: "深圳市",
        publishTime: "8小时前",
        category: "财税服务",
        urgency: "normal",
        viewCount: 67,
        description: "年度财税合规性审计，需要有资质的会计师事务所",
      },
      {
        id: "req-005",
        title: "软件系统开发外包",
        budget: "20-30万",
        region: "杭州市",
        publishTime: "10小时前",
        category: "技术服务",
        urgency: "urgent",
        viewCount: 203,
        description: "企业管理系统开发，包括前端、后端及数据库设计",
      },
      {
        id: "req-006",
        title: "知识产权保护咨询",
        budget: "1-2万",
        region: "苏州市",
        publishTime: "12小时前",
        category: "知识产权",
        urgency: "normal",
        viewCount: 45,
        description: "新产品专利申请及商标注册服务",
      },
    ];
    setRequirements(mockRequirements);
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "#ff4d4f";
      case "normal":
        return "#1890ff";
      case "longTerm":
        return "#52c41a";
      default:
        return "#666";
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "急需";
      case "normal":
        return "常规";
      case "longTerm":
        return "长期";
      default:
        return "常规";
    }
  };

  // 将需求分组，每组3个
  const groupedRequirements = [];
  for (let i = 0; i < requirements.length; i += 3) {
    groupedRequirements.push(requirements.slice(i, i + 3));
  }

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
          最新需求
        </Text>
        <Button type="link" onClick={onViewAllClick}>
          查看全部 →
        </Button>
      </div>

      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        styles={{ body: { padding: "20px" } }}
      >
        <Carousel
          autoplay
          autoplaySpeed={4000}
          dots={{ className: "custom-dots" }}
          style={{ minHeight: "200px" }}
        >
          {groupedRequirements.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  padding: "8px",
                }}
              >
                {group.map((req) => (
                  <Card
                    key={req.id}
                    hoverable
                    size="small"
                    onClick={() => onRequirementClick(req.id)}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                      cursor: "pointer",
                    }}
                    styles={{ body: { padding: "16px" } }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: "14px",
                          color: THEME.textTitle,
                          flex: 1,
                          marginRight: "8px",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {req.title}
                      </Text>
                      <Tag
                        color={getUrgencyColor(req.urgency)}
                        style={{ fontSize: "10px", padding: "0 6px" }}
                      >
                        {getUrgencyText(req.urgency)}
                      </Tag>
                    </div>

                    <Text
                      type="secondary"
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "12px",
                        lineHeight: "1.4",
                        height: "32px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {req.description}
                    </Text>

                    <Space
                      size={12}
                      style={{
                        fontSize: "11px",
                        color: THEME.textBody,
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Space size={8}>
                        <span>
                          <DollarOutlined style={{ marginRight: "2px" }} />
                          {req.budget}
                        </span>
                        <span>
                          <EnvironmentOutlined style={{ marginRight: "2px" }} />
                          {req.region}
                        </span>
                      </Space>
                      <Space size={8}>
                        <span>
                          <EyeOutlined style={{ marginRight: "2px" }} />
                          {req.viewCount}
                        </span>
                        <span>
                          <ClockCircleOutlined style={{ marginRight: "2px" }} />
                          {req.publishTime}
                        </span>
                      </Space>
                    </Space>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      </Card>

      <style>{`
        .custom-dots .slick-dots {
          bottom: -40px;
        }
        .custom-dots .slick-dots li button {
          background: ${THEME.primary};
          opacity: 0.3;
        }
        .custom-dots .slick-dots li.slick-active button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default LatestRequirements;
