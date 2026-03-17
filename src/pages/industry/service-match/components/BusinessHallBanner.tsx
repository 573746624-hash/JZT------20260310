import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Typography,
  Space,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  ScheduleOutlined,
  MessageOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { THEME, COMMON_STYLES } from "../styles";

const { Title, Text } = Typography;

interface BusinessHallBannerProps {
  onPublishClick: () => void;
  onMyServicesClick: () => void;
  onMessagesClick: () => void;
  statistics?: {
    totalCompanies: number;
    totalServices: number;
    successfulMatches: number;
  };
}

const BusinessHallBanner: React.FC<BusinessHallBannerProps> = ({
  onPublishClick,
  onMyServicesClick,
  onMessagesClick,
  statistics = {
    totalCompanies: 12580,
    totalServices: 8960,
    successfulMatches: 3420,
  },
}) => {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${THEME.primary} 0%, #4c9aff 100%)`,
        padding: "40px 20px",
        marginBottom: "24px",
        borderRadius: "12px",
        color: "#fff",
      }}
    >
      <Row gutter={[24, 24]} align="middle">
        {/* 左侧欢迎区域 */}
        <Col xs={24} md={12}>
          <div>
            <Title
              level={2}
              style={{
                color: "#fff",
                marginBottom: "8px",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              企业服务中心
            </Title>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "16px",
                display: "block",
                marginBottom: "24px",
              }}
            >
              一站式企业服务平台，连接优质服务商与企业需求
            </Text>

            {/* 统计数据 */}
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {statistics.totalCompanies.toLocaleString()}+
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    <TeamOutlined style={{ marginRight: "4px" }} />
                    入驻企业
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {statistics.totalServices.toLocaleString()}+
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    <AppstoreOutlined style={{ marginRight: "4px" }} />
                    发布服务
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {statistics.successfulMatches.toLocaleString()}+
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    <CheckCircleOutlined style={{ marginRight: "4px" }} />
                    成功对接
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        {/* 右侧快捷操作 */}
        <Col xs={24} md={12}>
          <div style={{ textAlign: "center" }}>
            <Title
              level={4}
              style={{
                color: "#fff",
                marginBottom: "20px",
                fontSize: "18px",
              }}
            >
              快捷操作
            </Title>
            <Space size="large" direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={onPublishClick}
                style={{
                  width: "200px",
                  height: "48px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  fontWeight: "500",
                  fontSize: "16px",
                }}
                ghost
              >
                发布业务需求
              </Button>
              <Space size="middle">
                <Button
                  type="text"
                  icon={<ScheduleOutlined />}
                  onClick={onMyServicesClick}
                  style={{
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "6px",
                    padding: "8px 16px",
                  }}
                >
                  我的服务
                </Button>
                <Button
                  type="text"
                  icon={<MessageOutlined />}
                  onClick={onMessagesClick}
                  style={{
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "6px",
                    padding: "8px 16px",
                  }}
                >
                  消息中心
                </Button>
              </Space>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BusinessHallBanner;
