import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  message,
  Modal,
  QRCode,
} from "antd";
import {
  ArrowLeftOutlined,
  MessageOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  TagsOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { THEME, COMMON_STYLES } from "./styles";

const { Title, Text, Paragraph } = Typography;

const MatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  // 模拟数据 - 与 ServiceMatchHome 列表数据保持一致
  // 实际项目中应该通过API根据ID获取数据
  const detail = {
    id,
    companyName: "中科检测技术有限公司",
    serviceName: "食品安全检测服务",
    matchScore: 92,
    tags: ["食品检测", "CNAS认证", "农药残留", "微生物检测"],
    professionalTags: ["食品检测", "CNAS认证", "农药残留", "微生物检测", "重金属检测"],
    businessScope: "食品检测、环境检测、产品认证",
    region: "北京市海淀区",
    contact: "张经理 400-123-4567",
    description:
      "中科检测技术有限公司是专业的第三方检测机构，拥有CNAS认可实验室，提供全方位食品安全检测服务，包括微生物检测、农药残留检测、重金属检测、添加剂检测等。检测报告具有法律效力，服务涵盖食品生产、流通、餐饮各个环节。",
    requirements:
      "1. 检测服务范围：食品安全检测、环境检测、产品认证\n2. 资质认证：CNAS认可、CMA资质、ISO17025\n3. 服务能力：快速检测、标准检测、定制检测、技术咨询\n4. 服务价格：500-5000元/项",
    serviceDescription: "提供全方位食品安全检测服务，包括微生物检测、农药残留检测、重金属检测、添加剂检测等。拥有CNAS认可实验室，检测报告具有法律效力。",
    certifications: ["CNAS认可", "CMA资质", "ISO17025"],
    capabilities: ["快速检测", "标准检测", "定制检测", "技术咨询"],
    priceRange: "500-5000元/项",
    isVerified: true,
    rating: 4.8,
    completedProjects: 1250,
    responseTime: "2小时内",
    establishedYear: 2008,
    teamSize: "100-500人",
    contactInfo: {
      phone: "400-123-4567",
      email: "service@zktest.com",
      address: "北京市海淀区中关村科技园"
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("联系方式已复制");
  };

  return (
    <div style={COMMON_STYLES.pageContainer}>
      <Space direction="vertical" style={{ width: "100%" }} size={24}>
        {/* Header (Top Nav) */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate(-1)}
            style={{ marginRight: "8px" }}
          />
          <Title level={4} style={{ margin: 0, ...COMMON_STYLES.title }}>
            匹配对象详情
          </Title>
        </div>

        {/* Top: Basic Info */}
        <Card
          style={{
            ...COMMON_STYLES.card,
            borderTop: `4px solid ${THEME.primary}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <div>
              <Title level={3} style={{ marginBottom: "8px" }}>
                {detail.companyName}
              </Title>
              <Text style={{ fontSize: 16, color: THEME.primary, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                {detail.serviceName}
              </Text>
              <Space wrap>
                {detail.tags.map((tag) => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
                {detail.isVerified && <Tag color="green">已认证</Tag>}
              </Space>
            </div>
          </div>

          <Descriptions column={2}>
            <Descriptions.Item
              label={
                <span style={{ color: THEME.textBody }}>
                  <EnvironmentOutlined /> 所在地区
                </span>
              }
            >
              {detail.region}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={{ color: THEME.textBody }}>
                  <TagsOutlined /> 业务范围
                </span>
              }
            >
              {detail.businessScope}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={{ color: THEME.textBody }}>
                  <SafetyCertificateOutlined /> 认证资质
                </span>
              }
            >
              {detail.certifications.join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="联系方式">
              <Space>
                <Text strong>{detail.contact}</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(detail.contact)}
                >
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Middle: Core Content */}
        <Card title="服务详情" bordered={false} style={COMMON_STYLES.card}>
          <Title level={5} style={{ fontSize: "15px", marginTop: 0 }}>
            企业简介
          </Title>
          <Paragraph style={{ color: THEME.textBody, lineHeight: "24px" }}>
            {detail.description}
          </Paragraph>

          <Divider />

          <Title level={5} style={{ fontSize: "15px" }}>
            服务内容
          </Title>
          <Paragraph style={{ color: THEME.textBody, lineHeight: "24px" }}>
            {detail.serviceDescription}
          </Paragraph>

          <Divider />

          <Title level={5} style={{ fontSize: "15px" }}>
            服务能力
          </Title>
          <Paragraph
            style={{
              color: THEME.textBody,
              whiteSpace: "pre-line",
              lineHeight: "24px",
            }}
          >
            {detail.requirements}
          </Paragraph>

          <Divider />

          <Descriptions column={2} size="small">
            <Descriptions.Item label="服务价格">{detail.priceRange}</Descriptions.Item>
            <Descriptions.Item label="响应时间">{detail.responseTime}</Descriptions.Item>
            <Descriptions.Item label="完成项目">{detail.completedProjects} 个</Descriptions.Item>
            <Descriptions.Item label="企业评分">{detail.rating} 分</Descriptions.Item>
            <Descriptions.Item label="成立年份">{detail.establishedYear} 年</Descriptions.Item>
            <Descriptions.Item label="团队规模">{detail.teamSize}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Bottom: Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <Button
            size="large"
            style={{ minWidth: "120px" }}
            onClick={() => navigate(-1)}
          >
            返回列表
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<MessageOutlined />}
            style={{ minWidth: "120px" }}
            onClick={() => setIsContactModalVisible(true)}
          >
            发起私信
          </Button>
        </div>

        <Modal
          title="联系企业负责人"
          open={isContactModalVisible}
          onCancel={() => setIsContactModalVisible(false)}
          footer={null}
          width={360}
          centered
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 0",
              textAlign: "center",
            }}
          >
            <QRCode
              value={`https://example.com/contact/${detail.id}`}
              size={200}
            />
            <Text strong style={{ marginTop: "16px", fontSize: "16px" }}>
              {detail.contact.split(" ")[0]}
            </Text>
            <Text type="secondary" style={{ marginTop: "4px" }}>
              扫码添加企业负责人微信
            </Text>
            <Text
              type="secondary"
              style={{ marginTop: "4px", fontSize: "12px" }}
            >
              {detail.name}
            </Text>
          </div>
        </Modal>
      </Space>
    </div>
  );
};

export default MatchDetail;
