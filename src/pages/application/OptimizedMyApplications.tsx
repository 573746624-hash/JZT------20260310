import React, { useMemo, useState } from "react";
import { Button, Card, Checkbox, Input, Space, Tabs, Tag, Typography } from "antd";
import type { TabsProps } from "antd";

type ApplicationStatus = "all" | "draft" | "review" | "approved" | "rejected";

type ApplicationItem = {
  id: string;
  projectName: string;
  policyType: string;
  department: string;
  status: ApplicationStatus;
  updatedAt: string;
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
  },
  {
    id: "app-2",
    projectName: "科技型中小企业评价",
    policyType: "认定",
    department: "北京市经信局",
    status: "approved",
    updatedAt: "2026-02-18",
  },
  {
    id: "app-3",
    projectName: "首台（套）重大技术装备保险补偿",
    policyType: "补贴",
    department: "北京市发改委",
    status: "draft",
    updatedAt: "2026-03-05",
  },
];

function getStatusTag(status: ApplicationStatus) {
  switch (status) {
    case "draft":
      return <Tag color="default">草稿</Tag>;
    case "review":
      return <Tag color="processing">审核中</Tag>;
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          {filtered.map((item) => (
            <Card
              key={item.id}
              size="small"
              style={{
                borderRadius: 10,
                borderColor: selectedIds.includes(item.id) ? "#1677ff" : undefined,
              }}
              onClick={() => {
                setSelectedIds((prev) =>
                  prev.includes(item.id)
                    ? prev.filter((x) => x !== item.id)
                    : [...prev, item.id],
                );
              }}
              hoverable
            >
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <Text strong>{item.projectName}</Text>
                  {getStatusTag(item.status)}
                </Space>
                <Text type="secondary">
                  {item.department} · {item.policyType} · 更新于 {item.updatedAt}
                </Text>
              </Space>
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

