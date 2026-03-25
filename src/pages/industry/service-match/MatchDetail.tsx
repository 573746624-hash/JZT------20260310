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

  // 模拟数据 - 与业务大厅首页列表数据保持一致（天地科技股份有限公司）
  // 实际项目中应该通过API根据ID获取数据
  const detail = {
    id,
    companyName: "天地科技股份有限公司",
    serviceName: "智能制造数字化转型咨询服务",
    matchScore: 92,
    tags: ["智能制造", "数字化转型", "咨询服务"],
    professionalTags: ["智能制造", "数字化转型", "生产流程优化", "设备联网", "数据分析"],
    businessScope: "智能制造、数字化转型、生产流程优化、设备联网、数据分析、智能决策",
    region: "北京市",
    contact: "李经理 13800138000",
    description:
      "天地科技股份有限公司是专业的智能制造数字化转型服务商，致力于帮助企业实现生产流程优化、设备联网、数据分析等全方位数字化升级。公司拥有丰富的行业经验和专业技术团队，服务涵盖制造业各个领域。",
    requirements:
      "1. 服务类型：数字化转型咨询\n2. 服务范围：生产流程优化、设备联网、数据分析、智能决策\n3. 服务周期：3-6个月\n4. 计价方式：按项目阶段付费，总价20万元起\n5. 最小订单量：1个项目",
    serviceDescription: "提供专业的智能制造数字化转型咨询服务，帮助企业实现生产流程优化、设备联网、数据分析等全方位数字化升级。",
    certifications: ["ISO9001", "高新技术企业", "智能制造服务商认证"],
    capabilities: ["数字化转型咨询", "生产流程优化", "设备联网集成", "数据分析平台", "智能决策系统"],
    priceRange: "20万元起/项目",
    isVerified: true,
    rating: 5.0,
    completedProjects: 156,
    responseTime: "2小时内",
    establishedYear: 2010,
    teamSize: "200-500人",
    contactInfo: {
      phone: "13800138000",
      email: "contact@tianditech.com",
      address: "北京市海淀区中关村科技园区"
    },
    servicePeriod: "3-6个月",
    pricingMethod: "按项目阶段付费，总价20万元起",
    minOrderQuantity: 1,
    stockQuantity: 10,
    quantityUnit: "项目"
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
              {detail.companyName}
            </Text>
          </div>
        </Modal>
      </Space>
    </div>
  );
};

export default MatchDetail;
