import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Typography,
  Space,
  Empty,
  message,
  Radio,
  Checkbox,
  Skeleton,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Statistic,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  BarChartOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  FileTextOutlined as DemandIcon,
} from "@ant-design/icons";
import ServiceMatchCard from "./components/ServiceMatchCard";
import ConnectModal from "./components/ConnectModal";
import ComparisonModal from "./components/ComparisonModal";
import {
  maskCompanyNameSimple as maskCompanyName,
  maskPhone,
  maskBudget,
} from "../../../utils/maskUtils";
import { getPublications } from "../../../services/industryService";

const { Text, Title } = Typography;
const { Option } = Select;

// 企业级配色 - 稳重专业
const ENTERPRISE_THEME = {
  primary: "#1A5FB4",
  textPrimary: "#1A1A1A",
  textSecondary: "#333333",
  textTertiary: "#666666",
  textMuted: "#999999",
  border: "#D9D9D9",
  borderLight: "#E8E8E8",
  background: "#F5F5F5",
  success: "#27AE60",
  warning: "#E67E22",
  error: "#C0392B",
};

const ProcurementHall: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [sortField, setSortField] = useState("match");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<any>(null);

  // 统计数据
  const statistics = {
    totalDemands: 3256,
    todayNew: 28,
    successfulMatches: 1280,
    pendingResponse: 156,
  };

  // API Call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSelectedRowKeys([]);

      try {
        const type = "demand";

        const regionMap: Record<string, string> = {
          beijing: "北京",
          shanghai: "上海",
          guangzhou: "广州",
          shenzhen: "深圳",
          hangzhou: "杭州",
          suzhou: "苏州",
        };
        const region = filters.region ? regionMap[filters.region] : undefined;

        const listData = await getPublications({
          type,
          keyword: searchText,
          region,
        });

        // Map listData with masking
        const mappedData = listData.map((p: any) => ({
          id: p.id,
          // 企业名称打码显示
          name: maskCompanyName(p.publisherName || p.title || "某企业"),
          originalName: p.publisherName || p.title,
          isMasked: true,
          advantageTags: p.tags?.slice(0, 2) || [],
          tags: p.tags || [],
          region: p.region || "未知",
          // 需求描述部分打码
          scope: maskDescription(p.description || "发布了一项服务需求"),
          originalScope: p.description,
          updateTime: p.publishTime ? p.publishTime.split(" ")[0] : "刚刚",
          score: p.rating || 4,
          matchDegree: p.matchScore || Math.floor(Math.random() * 40) + 60,
          qualification: p.isCertified ? "已认证" : "未认证",
          // 预算打码显示为区间
          budget: maskBudget(p.budget ? `${p.budget}${p.budgetUnit || "万"}` : "面议"),
          originalBudget: p.budget,
          quantity: p.details?.quantity
            ? `${p.details.quantity}${p.details.quantityUnit || ""}`
            : "-",
          deadline: p.expiryDate,
          // 联系方式完全打码
          contactPhone: maskPhone(p.contactPhone || ""),
          contactEmail: "***@***.com",
        }));

        // Client-side sorting
        if (sortField === "match") {
          mappedData.sort((a: any, b: any) => b.matchDegree - a.matchDegree);
        } else if (sortField === "time") {
          mappedData.sort(
            (a: any, b: any) =>
              new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
          );
        } else if (sortField === "qual") {
          mappedData.sort((a: any, b: any) => b.score - a.score);
        }

        setData(mappedData);
      } catch (error) {
        console.error("Fetch failed:", error);
        message.error("获取数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText, filters, sortField]);

  // 需求描述打码
  const maskDescription = (desc: string): string => {
    if (!desc) return "发布了一项服务需求，详情请联系查看";
    // 只显示前30个字符，后面打码
    if (desc.length <= 30) return desc;
    return desc.substring(0, 30) + "***";
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCreateClick = () => {
    navigate("/industry/service-match/publish?type=demand");
  };

  const handleMessagesClick = () => {
    navigate("/industry/service-match/messages");
  };

  const handleMyDemandsClick = () => {
    navigate("/industry/service-match/my-services");
  };

  const handleSortChange = (e: any) => {
    setSortField(e.target.value);
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRowKeys(data.map((item) => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
    }
  };

  const handleCompareToggle = (item: any) => {
    const exists = compareList.find((c) => c.id === item.id);
    if (exists) {
      setCompareList((prev) => prev.filter((c) => c.id !== item.id));
    } else {
      if (compareList.length >= 3) {
        message.warning("最多只能对比3家企业");
        return;
      }
      setCompareList((prev) => [...prev, item]);
    }
  };

  const handleBatchConnect = () => {
    const targets = data.filter((d) => selectedRowKeys.includes(d.id));
    setConnectTarget(targets);
    setConnectModalOpen(true);
  };

  const handleConnectClick = (item: any) => {
    setConnectTarget(item);
    setConnectModalOpen(true);
  };

  return (
    <div
      style={{
        background: ENTERPRISE_THEME.background,
        minHeight: "100%",
        paddingBottom: 60,
      }}
    >
      {/* 顶部操作栏 */}
      <div
        style={{
          background: ENTERPRISE_THEME.white,
          borderBottom: `1px solid ${ENTERPRISE_THEME.border}`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Title level={4} style={{ margin: 0, color: ENTERPRISE_THEME.textPrimary, fontWeight: 600 }}>
            需求大厅
          </Title>
          <Text style={{ color: ENTERPRISE_THEME.textTertiary }}>
            企业需求信息发布与对接平台
          </Text>
        </div>
        <Space>
          <Button 
            icon={<MessageOutlined />} 
            onClick={handleMessagesClick}
            style={{ borderRadius: 2 }}
          >
            消息中心
          </Button>
          <Button 
            icon={<DemandIcon />} 
            onClick={handleMyDemandsClick}
            style={{ borderRadius: 2 }}
          >
            我的需求
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateClick}
            style={{ borderRadius: 2, background: ENTERPRISE_THEME.primary }}
          >
            发布需求
          </Button>
        </Space>
      </div>

      <div style={{ padding: "24px" }}>
        {/* 搜索和筛选区域 */}
        <Card
          style={{
            borderRadius: 4,
            border: `1px solid ${ENTERPRISE_THEME.borderLight}`,
            marginBottom: 24,
            boxShadow: "none",
          }}
          bodyStyle={{ padding: "20px 24px" }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col flex="1">
              <Input.Search
                placeholder="搜索需求关键词、服务类型"
                allowClear
                enterButton={<Button type="primary" icon={<SearchOutlined />} style={{ borderRadius: 2, background: ENTERPRISE_THEME.primary }}>搜索</Button>}
                size="large"
                onSearch={handleSearch}
                style={{ width: "100%" }}
              />
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder="所在地区"
                  style={{ width: 140 }}
                  allowClear
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="beijing">北京</Option>
                  <Option value="shanghai">上海</Option>
                  <Option value="guangzhou">广州</Option>
                  <Option value="shenzhen">深圳</Option>
                  <Option value="hangzhou">杭州</Option>
                </Select>
                <Select
                  placeholder="预算区间"
                  style={{ width: 140 }}
                  allowClear
                >
                  <Option value="0-1">1万以下</Option>
                  <Option value="1-5">1-5万</Option>
                  <Option value="5-10">5-10万</Option>
                  <Option value="10-50">10-50万</Option>
                  <Option value="50+">50万以上</Option>
                </Select>
                <Select
                  placeholder="需求类型"
                  style={{ width: 140 }}
                  allowClear
                >
                  <Option value="tech">技术服务</Option>
                  <Option value="product">产品采购</Option>
                  <Option value="cooperation">商务合作</Option>
                  <Option value="consulting">咨询顾问</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 平台数据统计 */}
        <Card
          style={{
            borderRadius: 4,
            border: `1px solid ${ENTERPRISE_THEME.borderLight}`,
            marginBottom: 24,
            boxShadow: "none",
          }}
          bodyStyle={{ padding: "16px 24px" }}
        >
          <Row gutter={[48, 16]}>
            <Col>
              <Statistic
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>总需求数</Text>}
                value={statistics.totalDemands}
                valueStyle={{ color: ENTERPRISE_THEME.textPrimary, fontSize: 20, fontWeight: 600 }}
              />
            </Col>
            <Col>
              <Statistic
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>今日新增</Text>}
                value={statistics.todayNew}
                valueStyle={{ color: ENTERPRISE_THEME.textPrimary, fontSize: 20, fontWeight: 600 }}
              />
            </Col>
            <Col>
              <Statistic
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>成功对接</Text>}
                value={statistics.successfulMatches}
                valueStyle={{ color: ENTERPRISE_THEME.textPrimary, fontSize: 20, fontWeight: 600 }}
              />
            </Col>
            <Col>
              <Statistic
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>待响应</Text>}
                value={statistics.pendingResponse}
                valueStyle={{ color: ENTERPRISE_THEME.textPrimary, fontSize: 20, fontWeight: 600 }}
              />
            </Col>
          </Row>
        </Card>

        {/* 排序和筛选栏 */}
        <Card
          style={{
            borderRadius: 4,
            border: `1px solid ${ENTERPRISE_THEME.borderLight}`,
            marginBottom: 24,
            boxShadow: "none",
          }}
          bodyStyle={{ padding: "12px 20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Checkbox
                checked={data.length > 0 && selectedRowKeys.length === data.length}
                indeterminate={
                  selectedRowKeys.length > 0 && selectedRowKeys.length < data.length
                }
                onChange={handleSelectAll}
              >
                全选
              </Checkbox>
              <Text style={{ color: ENTERPRISE_THEME.textTertiary }}>
                共找到 {data.length} 条需求
              </Text>
              <Tag 
                style={{
                  borderRadius: 2,
                  background: "#FFF7E6",
                  border: `1px solid ${ENTERPRISE_THEME.warning}`,
                  color: ENTERPRISE_THEME.warning,
                  fontSize: 11,
                }}
              >
                信息已脱敏处理
              </Tag>
            </Space>

            <Radio.Group value={sortField} onChange={handleSortChange}>
              <Radio.Button value="match" style={{ borderRadius: "2px 0 0 2px" }}>匹配度</Radio.Button>
              <Radio.Button value="time">发布时间</Radio.Button>
              <Radio.Button value="qual" style={{ borderRadius: "0 2px 2px 0" }}>企业资质</Radio.Button>
            </Radio.Group>
          </div>
        </Card>

        {/* 需求列表 */}
        <Card
          style={{
            borderRadius: 4,
            border: `1px solid ${ENTERPRISE_THEME.borderLight}`,
            boxShadow: "none",
          }}
          bodyStyle={{ padding: "20px 24px" }}
        >
          <div style={{ minHeight: "400px" }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  style={{
                    marginBottom: 16,
                    border: `1px solid ${ENTERPRISE_THEME.border}`,
                  }}
                >
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </Card>
              ))
            ) : data.length > 0 ? (
              <List
                dataSource={data}
                renderItem={(item) => (
                  <ServiceMatchCard
                    item={item}
                    isSelected={selectedRowKeys.includes(item.id)}
                    isComparing={compareList.some((c) => c.id === item.id)}
                    activeTab="procurement"
                    onSelect={handleSelectRow}
                    onCompare={handleCompareToggle}
                    onConnect={handleConnectClick}
                    navigate={navigate}
                  />
                )}
                split={false}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ textAlign: "center" }}>
                    <Text style={{ color: ENTERPRISE_THEME.textSecondary }}>
                      暂无相关需求信息
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        fontSize: 12,
                        marginTop: 8,
                        color: ENTERPRISE_THEME.textMuted,
                      }}
                    >
                      建议放宽筛选条件或尝试其他关键词
                    </Text>
                  </div>
                }
              />
            )}
          </div>
        </Card>
      </div>

      {/* 批量操作栏 */}
      {selectedRowKeys.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: ENTERPRISE_THEME.textPrimary,
            padding: "12px 24px",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#fff",
          }}
        >
          <span>已选择 {selectedRowKeys.length} 项</span>
          <Button type="primary" onClick={handleBatchConnect}>
            批量对接
          </Button>
          <Button type="text" style={{ color: "#fff" }} onClick={() => setSelectedRowKeys([])}>
            取消
          </Button>
        </div>
      )}

      {/* 对比按钮 */}
      {compareList.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 40,
            zIndex: 1000,
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<BarChartOutlined />}
            onClick={() => setComparisonModalOpen(true)}
          >
            开始对比 ({compareList.length})
          </Button>
        </div>
      )}

      {/* 弹窗组件 */}
      <ComparisonModal
        open={comparisonModalOpen}
        items={compareList}
        onCancel={() => setComparisonModalOpen(false)}
      />
      <ConnectModal
        open={connectModalOpen}
        target={connectTarget}
        onCancel={() => {
          setConnectModalOpen(false);
          setSelectedRowKeys([]);
        }}
      />
    </div>
  );
};

export default ProcurementHall;
