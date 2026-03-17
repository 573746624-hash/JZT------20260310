import React, { useMemo, useState } from "react";
import { Button, Card, Checkbox, Input, Space, Tabs, Tag, Typography, Steps, Alert } from "antd";
import { ClockCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined, FormOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";

type ApplicationStatus = "all" | "draft" | "review" | "approved" | "rejected" | "needs_revision";

type ApplicationItem = {
  id: string;
  projectName: string;
  policyType: string;
  department: string;
  status: ApplicationStatus;
  updatedAt: string;
  currentStep?: number;
  rejectReason?: string;
  deadline?: string;
};

const { Text, Title } = Typography;

const MOCK_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    projectName: "2026年度高新技术企业认定",
    policyType: "认定",
    department: "北京市科委",
    status: "review",
    updatedAt: "2026-03-01",
    currentStep: 2, // 专家评审中
  },
  {
    id: "app-4",
    projectName: "北京市专精特新中小企业申报",
    policyType: "认定",
    department: "北京市经信局",
    status: "needs_revision",
    updatedAt: "2026-03-10",
    currentStep: 1, // 形式审查
    rejectReason: "企业上年度财务审计报告缺失页码，请重新上传清晰扫描件。",
    deadline: "2026-03-25",
  },
  {
    id: "app-2",
    projectName: "科技型中小企业评价",
    policyType: "认定",
    department: "北京市经信局",
    status: "approved",
    updatedAt: "2026-02-18",
    currentStep: 4, // 已通过
  },
  {
    id: "app-3",
    projectName: "首台（套）重大技术装备保险补偿",
    policyType: "补贴",
    department: "北京市发改委",
    status: "draft",
    updatedAt: "2026-03-05",
    currentStep: 0,
  },
];

function getStatusTag(status: ApplicationStatus) {
  switch (status) {
    case "draft":
      return <Tag color="default">草稿</Tag>;
    case "review":
      return <Tag color="processing">审核中</Tag>;
    case "needs_revision":
      return <Tag color="warning">需补正</Tag>;
    case "approved":
      return <Tag color="success">已通过</Tag>;
    case "rejected":
      return <Tag color="error">已驳回</Tag>;
    default:
      return <Tag>全部</Tag>;
  }
}

export default function OptimizedMyApplications() {
  const [status, setStatus] = useState<ApplicationStatus>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return MOCK_APPLICATIONS.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!keyword) return true;
      return (
        item.projectName.toLowerCase().includes(keyword) ||
        item.policyType.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword)
      );
    });
  }, [status, searchText]);

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < filtered.length;

  const tabItems: TabsProps["items"] = [
    { key: "all", label: "全部项目" },
    { key: "draft", label: "我的草稿" },
    { key: "review", label: "审核中" },
    { key: "needs_revision", label: "需补正" },
    { key: "approved", label: "已通过" },
    { key: "rejected", label: "已驳回" },
  ];

  return (
    <Card style={{ borderRadius: 12 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            申报概览
          </Title>
          <Text type="secondary">查看申报进度，支持筛选与搜索</Text>
        </div>

        <Tabs
          activeKey={status}
          onChange={(key) => {
            setStatus(key as ApplicationStatus);
            setSelectedIds([]);
          }}
          items={tabItems}
        />

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Input
            placeholder="搜索项目名称、政策编号、部门"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 360 }}
            allowClear
          />
          <Space>
            <Checkbox
              checked={allSelected}
              indeterminate={indeterminate}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(filtered.map((x) => x.id));
                } else {
                  setSelectedIds([]);
                }
              }}
            >
              全选
            </Checkbox>
            <Button danger disabled={selectedIds.length === 0}>
              批量删除
            </Button>
          </Space>
        </Space>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {filtered.map((item) => (
            <Card
              key={item.id}
              size="small"
              style={{
                borderRadius: 8,
                borderColor: selectedIds.includes(item.id) ? "#1677ff" : "#e8e8e8",
                borderLeft: item.status === "needs_revision" ? "4px solid #faad14" : undefined,
                boxShadow: "0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)"
              }}
              styles={{ body: { padding: "16px 24px" } }}
              hoverable
            >
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <div style={{ paddingTop: 4 }}>
                  <Checkbox 
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((x) => x !== item.id)
                          : [...prev, item.id],
                      );
                    }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <Space size="middle" style={{ marginBottom: 8 }}>
                        <Title level={5} style={{ margin: 0 }}>{item.projectName}</Title>
                        {getStatusTag(item.status)}
                      </Space>
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.department} | {item.policyType} | 最后更新：{item.updatedAt}
                        </Text>
                      </div>
                    </div>
                    <Space>
                      {item.status === "needs_revision" && (
                        <Button type="primary" danger>立即补正</Button>
                      )}
                      {item.status === "draft" && (
                        <Button type="primary">继续填写</Button>
                      )}
                      <Button>查看详情</Button>
                    </Space>
                  </div>

                  {item.status === "needs_revision" && item.rejectReason && (
                    <Alert
                      message={
                        <span>
                          <Text strong type="danger">审核意见：</Text>
                          {item.rejectReason}
                        </span>
                      }
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16, backgroundColor: "#fffbe6", borderColor: "#ffe58f" }}
                      action={
                        item.deadline ? <Text type="danger" style={{ fontSize: 13 }}>请于 {item.deadline} 前完成补正</Text> : null
                      }
                    />
                  )}

                  {/* 进度条展示 */}
                  {item.status !== "draft" && item.currentStep !== undefined && (
                    <div style={{ background: "#fafafa", padding: "16px", borderRadius: "6px" }}>
                      <Steps
                        size="small"
                        current={item.currentStep}
                        status={item.status === "needs_revision" ? "error" : item.status === "rejected" ? "error" : "process"}
                        items={[
                          { title: "草稿" },
                          { title: "形式审查" },
                          { title: "专家评审" },
                          { title: "部门审核" },
                          { title: "结果公示" },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center" }}>
              <Text type="secondary">暂无符合条件的申报记录</Text>
            </div>
          ) : null}
        </div>
      </Space>
    </Card>
  );
}

