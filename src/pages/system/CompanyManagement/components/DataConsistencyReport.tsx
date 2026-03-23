/**
 * 数据一致性报告组件
 * 创建时间: 2026-03-24
 * 功能: 展示企业画像数据与实名认证信息的比对结果
 */

import React from "react";
import {
  Modal,
  Table,
  Tag,
  Button,
  Alert,
  Space,
  Typography,
  Progress,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ConsistencyReport, FieldCheckResult } from "../utils/dataConsistencyCheck";

const { Title, Text } = Typography;

interface DataConsistencyReportProps {
  visible: boolean;
  report: ConsistencyReport | null;
  onClose: () => void;
  onAutoFix: () => void;
  onContinue: () => void;
}

/**
 * 数据一致性报告组件
 */
const DataConsistencyReport: React.FC<DataConsistencyReportProps> = ({
  visible,
  report,
  onClose,
  onAutoFix,
  onContinue,
}) => {
  if (!report) return null;

  // 表格列定义
  const columns = [
    {
      title: "字段名称",
      dataIndex: "label",
      key: "label",
      width: 120,
      render: (text: string, record: FieldCheckResult) => (
        <Space>
          {record.isCritical && <Tag color="red">关键</Tag>}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "企业画像值",
      dataIndex: "profileValue",
      key: "profileValue",
      width: 180,
      render: (value: string, record: FieldCheckResult) => (
        <Text
          type={record.isMatch ? "secondary" : "danger"}
          style={{
            textDecoration: record.isMatch ? "none" : "line-through",
          }}
        >
          {value || "未填写"}
        </Text>
      ),
    },
    {
      title: "实名认证值",
      dataIndex: "certValue",
      key: "certValue",
      width: 180,
      render: (value: string) => (
        <Text type="success" strong>
          {value || "未设置"}
        </Text>
      ),
    },
    {
      title: "校验结果",
      dataIndex: "isMatch",
      key: "isMatch",
      width: 100,
      align: "center" as const,
      render: (isMatch: boolean, record: FieldCheckResult) => (
        <Tag
          icon={
            isMatch ? (
              <CheckCircleOutlined />
            ) : record.isCritical ? (
              <CloseCircleOutlined />
            ) : (
              <WarningOutlined />
            )
          }
          color={isMatch ? "success" : record.isCritical ? "error" : "warning"}
        >
          {isMatch ? "一致" : "不一致"}
        </Tag>
      ),
    },
    {
      title: "说明",
      dataIndex: "message",
      key: "message",
      render: (text: string, record: FieldCheckResult) => (
        <Text type={record.isMatch ? "secondary" : record.isCritical ? "danger" : "warning"}>
          {text}
        </Text>
      ),
    },
  ];

  // 计算匹配率
  const matchRate =
    report.totalFields > 0
      ? Math.round((report.matchedFields / report.totalFields) * 100)
      : 0;

  // 渲染报告头部
  const renderHeader = () => (
    <div style={{ marginBottom: 24 }}>
      <Alert
        message={
          <Space>
            <SafetyCertificateOutlined />
            <span>数据一致性校验报告</span>
          </Space>
        }
        description={report.summary}
        type={report.isValid ? "success" : "error"}
        showIcon
        icon={report.isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      <Row gutter={16}>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="总体匹配率"
              value={matchRate}
              suffix="%"
              valueStyle={{
                color: matchRate === 100 ? "#52c41a" : matchRate >= 80 ? "#faad14" : "#f5222d",
              }}
            />
            <Progress
              percent={matchRate}
              status={matchRate === 100 ? "success" : "active"}
              strokeColor={
                matchRate === 100 ? "#52c41a" : matchRate >= 80 ? "#faad14" : "#f5222d"
              }
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="一致字段"
              value={report.matchedFields}
              valueStyle={{ color: "#52c41a" }}
              suffix={`/ ${report.totalFields}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="关键差异"
              value={report.criticalMismatches}
              valueStyle={{
                color: report.criticalMismatches > 0 ? "#f5222d" : "#52c41a",
              }}
              suffix="项"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染底部按钮
  const renderFooter = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Space>
        {!report.isValid && (
          <Button type="primary" icon={<SafetyCertificateOutlined />} onClick={onAutoFix}>
            使用认证数据自动修正
          </Button>
        )}
      </Space>
      <Space>
        <Button onClick={onClose}>关闭</Button>
        {report.isValid ? (
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={onContinue}>
            确认并继续保存
          </Button>
        ) : (
          <Button type="primary" danger icon={<FileTextOutlined />} onClick={onClose}>
            返回修改
          </Button>
        )}
      </Space>
    </div>
  );

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
          <span>数据一致性校验报告</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={renderFooter()}
      width={900}
      styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
    >
      {renderHeader()}

      <Title level={5}>详细比对结果</Title>
      <Table
        columns={columns}
        dataSource={report.results}
        rowKey="field"
        pagination={false}
        size="small"
        bordered
      />

      <div style={{ marginTop: 16, padding: 12, backgroundColor: "#f6ffed", borderRadius: 4 }}>
        <Text type="secondary">
          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          关键字段（企业名称、统一社会信用代码、法定代表人）必须与实名认证信息完全一致。
          如存在差异，请先完成实名认证信息变更，或使用"自动修正"功能同步数据。
        </Text>
      </div>
    </Modal>
  );
};

export default DataConsistencyReport;
