import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Typography,
  Skeleton,
  Space,
  Empty,
  message,
  Radio,
  Checkbox,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Tag,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  StarFilled,
  ReloadOutlined,
  BarChartOutlined,
  TrophyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  MessageOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import HallHeader from "./components/HallHeader";
import SupplyServiceCard from "./components/SupplyServiceCard";
import ConnectModal from "./components/ConnectModal";
import ComparisonModal from "./components/ComparisonModal";

import { mockSupplyServices, SupplyService } from "./data/supplyServiceData";

const { Title, Text } = Typography;
const { Option } = Select;

// 企业级配色方案 - 稳重专业
const ENTERPRISE_THEME = {
  primary: "#1A5FB4",
  secondary: "#2C3E50",
  textPrimary: "#1A1A1A",
  textSecondary: "#333333",
  textTertiary: "#666666",
  textMuted: "#999999",
  border: "#D9D9D9",
  borderLight: "#E8E8E8",
  background: "#F5F5F5",
  white: "#FFFFFF",
  success: "#27AE60",
  warning: "#E67E22",
  error: "#C0392B",
};

const SupplyBusinessHall: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SupplyService[]>([]);
  const [featuredServices, setFeaturedServices] = useState<SupplyService[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortField, setSortField] = useState("featured");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<SupplyService[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<string>("guest");

  // 统计数据
  const statistics = {
    totalCompanies: 12580,
    totalServices: 8960,
    successfulMatches: 3420,
    featuredServices: 156,
    verifiedCompanies: 8945,
    averageRating: 4.7,
  };

  // 模拟数据加载
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSelectedRowKeys([]);
      setCompareList([]);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        let filteredData = [...mockSupplyServices];

        // 应用搜索过滤
        if (searchText) {
          filteredData = filteredData.filter(
            (service) =>
              service.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
              service.serviceName.toLowerCase().includes(searchText.toLowerCase()) ||
              service.serviceDescription.toLowerCase().includes(searchText.toLowerCase()) ||
              service.professionalTags.some((tag) =>
                tag.toLowerCase().includes(searchText.toLowerCase())
              )
          );
        }

        // 应用分类过滤
        if (selectedCategory) {
          filteredData = filteredData.filter((service) =>
            service.serviceCategories.includes(selectedCategory)
          );
        }

        // 应用排序
        if (sortField === "rating") {
          filteredData.sort((a, b) => b.rating - a.rating);
        } else if (sortField === "projects") {
          filteredData.sort((a, b) => b.completedProjects - a.completedProjects);
        }

        setData(filteredData);
        setFeaturedServices(filteredData.slice(0, 3));
      } catch (error) {
        console.error("Fetch failed:", error);
        message.error("获取数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText, filters, selectedCategory, sortField]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCreateClick = () => {
    navigate("/industry/service-match/publish?type=supply");
  };

  const handleMyServicesClick = () => {
    navigate("/industry/service-match/my-services");
  };

  const handleMessagesClick = () => {
    navigate("/industry/service-match/my-messages");
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
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

  const handleCompareToggle = (service: SupplyService) => {
    const exists = compareList.find((c) => c.id === service.id);
    if (exists) {
      setCompareList((prev) => prev.filter((c) => c.id !== service.id));
    } else {
      if (compareList.length >= 3) {
        message.warning("最多只能对比3家服务商");
        return;
      }
      setCompareList((prev) => [...prev, service]);
    }
  };

  const handleBatchConnect = () => {
    const targets = data.filter((d) => selectedRowKeys.includes(d.id));
    setConnectTarget(targets);
    setConnectModalOpen(true);
  };

  const handleConnectClick = (service: SupplyService) => {
    setConnectTarget(service);
    setConnectModalOpen(true);
  };

  const handleFavoriteClick = (service: SupplyService) => {
    message.success(`已收藏 ${service.serviceName}`);
  };

  const handleRefreshFeatured = () => {
    message.success("已刷新推荐列表");
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
            业务大厅
          </Title>
          <Text style={{ color: ENTERPRISE_THEME.textTertiary }}>
            为企业提供专业服务对接
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
            icon={<ShopOutlined />} 
            onClick={handleMyServicesClick}
            style={{ borderRadius: 2 }}
          >
            我的服务
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateClick}
            style={{ borderRadius: 2, background: ENTERPRISE_THEME.primary }}
          >
            发布服务
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
                placeholder="搜索服务名称、企业名称或关键词"
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
                  placeholder="价格区间"
                  style={{ width: 140 }}
                  allowClear
                >
                  <Option value="0-1">1万以下</Option>
                  <Option value="1-5">1-5万</Option>
                  <Option value="5-10">5-10万</Option>
                  <Option value="10+">10万以上</Option>
                  <Option value="negotiable">面议</Option>
                </Select>
                <Select
                  placeholder="认证状态"
                  style={{ width: 140 }}
                  allowClear
                >
                  <Option value="verified">已认证</Option>
                  <Option value="unverified">未认证</Option>
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
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>入驻企业</Text>}
                value={statistics.totalCompanies}
                valueStyle={{ color: ENTERPRISE_THEME.textPrimary, fontSize: 20, fontWeight: 600 }}
              />
            </Col>
            <Col>
              <Statistic
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>服务数量</Text>}
                value={statistics.totalServices}
                valueStyle={{ color: ENTERPRISE_THEME.textPrimary, fontSize: 20, fontWeight: 600 }}
              />
            </Col>
            <Col>
              <Statistic
                title={<Text style={{ color: ENTERPRISE_THEME.textTertiary, fontSize: 12 }}>认证企业</Text>}
                value={statistics.verifiedCompanies}
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
          </Row>
        </Card>

        {/* 服务列表区域 */}
        <Card
          style={{
            borderRadius: 4,
            border: `1px solid ${ENTERPRISE_THEME.borderLight}`,
            boxShadow: "none",
          }}
          bodyStyle={{ padding: "20px 24px" }}
          title={
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
                  共找到 {data.length} 个服务
                </Text>
              </Space>
              <Radio.Group value={sortField} onChange={handleSortChange}>
                <Radio.Button value="featured" style={{ borderRadius: "2px 0 0 2px" }}>综合排序</Radio.Button>
                <Radio.Button value="rating">评分最高</Radio.Button>
                <Radio.Button value="projects" style={{ borderRadius: "0 2px 2px 0" }}>项目最多</Radio.Button>
              </Radio.Group>
            </div>
          }
        >
          <div style={{ minHeight: "400px" }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} style={{ marginBottom: 16, border: `1px solid ${ENTERPRISE_THEME.border}` }}>
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              ))
            ) : data.length > 0 ? (
              <List
                dataSource={data}
                renderItem={(service) => (
                  <SupplyServiceCard
                    service={service}
                    isSelected={selectedRowKeys.includes(service.id)}
                    isComparing={compareList.some((c) => c.id === service.id)}
                    onSelect={handleSelectRow}
                    onCompare={handleCompareToggle}
                    onConnect={handleConnectClick}
                    onFavorite={handleFavoriteClick}
                    navigate={navigate}
                    userLevel={userLevel}
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
                      暂无相关服务
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
            backgroundColor: ENTERPRISE_THEME.secondary,
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
          <span>已选择 {selectedRowKeys.length} 个服务</span>
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
            服务对比 ({compareList.length})
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

export default SupplyBusinessHall;
