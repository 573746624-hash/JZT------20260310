import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Tag,
  Button,
  Typography,
  Skeleton,
  Space,
  Empty,
  message,
  Rate,
  Radio,
  Checkbox,
  Row,
  Col,
  Divider,
  Input,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  StarFilled,
  ReloadOutlined,
  BarChartOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  MessageOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { COMMON_STYLES } from "./styles";
import ServiceMatchCard from "./components/ServiceMatchCard";
import SupplyServiceCard from "./components/SupplyServiceCard";
import ConnectModal from "./components/ConnectModal";
import ComparisonModal from "./components/ComparisonModal";
import LatestRequirements from "./components/LatestRequirements";
import {
  maskCompanyName,
  maskPhone,
  maskPrice,
  maskSensitiveData,
} from "../../../utils/maskUtils";
import {
  getPublications,
  getRecommendedPublications,
} from "../../../services/industryService";

const { Option } = Select;

// 企业级配色 - 与 ProcurementHall 保持一致
const ENTERPRISE_THEME = {
  primary: "#1A5FB4",
  white: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#333333",
  textTertiary: "#666666",
  textMuted: "#999999",
  border: "#D9D9D9",
  borderLight: "#E8E8E8",
  background: "#F5F5F5",
};

const { Title, Text, Paragraph } = Typography;

const ServiceMatchHome: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [recommendData, setRecommendData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortField, setSortField] = useState("match"); // match | time | qual
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<string>("guest"); // 用户等级
  const [showMaskedData, setShowMaskedData] = useState<boolean>(true); // 是否显示遮挡数据

  // API Call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Reset selection and compare on refresh
      setSelectedRowKeys([]);
      setCompareList([]);

      try {
        const type = "supply"; // Always supply for Business Hall

        // Map filters
        const regionMap: Record<string, string> = {
          beijing: "北京",
          shanghai: "上海",
          guangzhou: "广州",
          shenzhen: "深圳",
          hangzhou: "杭州",
          suzhou: "苏州",
        };
        const region = filters.region ? regionMap[filters.region] : undefined;

        // Parallel fetch
        const [listData, recommendList] = await Promise.all([
          getPublications({
            type,
            keyword: searchText,
            region,
          }),
          getRecommendedPublications(3),
        ]);

        // Map listData to SupplyService format
        const mappedData = listData.map((p: any) => ({
          id: p.id,
          companyName: p.publisherName || "某科技公司",
          serviceName: p.title || "专业服务",
          serviceDescription: p.description || "提供专业的企业服务解决方案",
          serviceCategories: p.tags?.slice(0, 1) || ["技术服务"],
          professionalTags: p.tags || ["专业服务", "技术支持"],
          region: p.region || "未知",
          publishTime: p.publishTime ? p.publishTime.split(" ")[0] : "刚刚",
          rating: p.rating || 4,
          completedProjects: Math.floor(Math.random() * 500) + 50,
          responseTime: "2小时内",
          certifications: ["ISO9001", "高新技术企业"],
          capabilities: ["专业服务", "技术支持", "项目管理"],
          priceRange: p.budget ? `${p.budget}${p.budgetUnit || "万"}` : "面议",
          isVerified: p.isCertified || true,
          isFeatured: Math.random() > 0.7,
          viewCount: Math.floor(Math.random() * 1000) + 100,
          successRate: Math.floor(Math.random() * 20) + 80,
          contactInfo: {
            phone: "400-123-4567",
            email: "service@company.com",
            address: `${p.region || "北京市"}科技园区`
          },
          businessScope: "专业企业服务",
          establishedYear: 2015,
          teamSize: "50-100人"
        }));

        // Client-side sorting
        if (sortField === "match") {
          mappedData.sort((a, b) => b.rating - a.rating);
        } else if (sortField === "qual") {
          mappedData.sort((a, b) => b.rating - a.rating);
        }

        setData(mappedData);

        // Map recommend data
        setRecommendData(
          recommendList.map((p: any) => ({
            id: p.id,
            name: p.publisherName || p.title,
            scope: p.description,
            score: p.rating || 5,
            matchDegree: p.matchScore || Math.floor(Math.random() * 10) + 90,
            isRecommend: true,
            tags: p.tags || [],
            region: p.region || "未知",
          })),
        );
      } catch (error) {
        console.error("Fetch failed:", error);
        message.error("获取数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText, filters, sortField]);

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
    setSelectedCategory(categoryId);
    setFilters((prev: any) => ({ ...prev, category: categoryId }));
  };

  const handleRequirementClick = (requirementId: string) => {
    navigate(`/industry/service-match/requirement/${requirementId}`);
  };

  const handleViewAllRequirements = () => {
    navigate("/industry/service-match/procurement-hall");
  };

  const handleSortChange = (e: any) => {
    setSortField(e.target.value);
    message.loading("正在重新排序...", 0.5);
  };

  const handleRefreshRecommend = () => {
    message.success("已刷新推荐列表");
    // Mock refresh logic - just shuffle or keep same
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

  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) return;

    message.loading({ content: "正在导出数据...", key: "export" });

    try {
      const targets = data.filter((d) => selectedRowKeys.includes(d.id));

      // Generate CSV
      const headers = [
        "企业/需求名称",
        "所在地区",
        "匹配度",
        "业务标签",
        "需求/业务描述",
        "更新时间",
        "质量评分",
      ];
      const csvContent = [
        headers.join(","),
        ...targets.map((t) =>
          [
            `"${t.name}"`,
            `"${t.region}"`,
            `${t.matchDegree}%`,
            `"${t.tags.join(";")}"`,
            `"${t.scope.replace(/"/g, '""')}"`, // Escape quotes
            t.updateTime,
            t.score,
          ].join(","),
        ),
      ].join("\n");

      // Trigger download
      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `企服大厅_批量导出_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        message.success({
          content: `成功导出 ${targets.length} 条数据`,
          key: "export",
        });
      }, 800);
    } catch (e) {
      console.error(e);
      message.error({ content: "导出失败", key: "export" });
    }
  };

  const handleMessagesClick = () => {
    navigate("/industry/service-match/messages");
  };

  const handleMyServicesClick = () => {
    navigate("/industry/service-match/my-services");
  };

  return (
    <div style={{ background: ENTERPRISE_THEME.background, minHeight: "100%", paddingBottom: 60 }}>
      {/* 顶部操作栏 - 与 ProcurementHall 保持一致 */}
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
            企服大厅
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
            发布业务
          </Button>
        </Space>
      </div>

      <div style={{ padding: "24px" }}>
        {/* 搜索和筛选区域 - 与 ProcurementHall 保持一致 */}
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
                placeholder="搜索企业名称 / 业务类型 / 产品名称"
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
                  onChange={(val) => handleFilterChange({ region: val })}
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
                  onChange={(val) => handleFilterChange({ budget: val })}
                >
                  <Option value="0-1">1万以下</Option>
                  <Option value="1-5">1-5万</Option>
                  <Option value="5-10">5-10万</Option>
                  <Option value="10-50">10-50万</Option>
                  <Option value="50+">50万以上</Option>
                </Select>
                <Select
                  placeholder="服务类型"
                  style={{ width: 140 }}
                  allowClear
                  onChange={(val) => handleFilterChange({ category: val })}
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
        {/* Sorting & Batch Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Space>
            <Checkbox
              checked={
                data.length > 0 && selectedRowKeys.length === data.length
              }
              indeterminate={
                selectedRowKeys.length > 0 &&
                selectedRowKeys.length < data.length
              }
              onChange={handleSelectAll}
            >
              全选
            </Checkbox>
            <Text type="secondary">共找到 {data.length} 条结果</Text>
          </Space>

          <Radio.Group
            value={sortField}
            onChange={handleSortChange}
            buttonStyle="solid"
          >
          </Radio.Group>
        </div>

        {/* Service List Section */}
        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "none",
          }}
          styles={{ body: { padding: "24px" } }}
        >
          <div
            style={{
              marginBottom: "20px",
              borderLeft: "4px solid #165DFF",
              paddingLeft: "12px",
            }}
          >
            <Text strong style={{ fontSize: "18px" }}>
              企业服务列表
            </Text>
          </div>
          
        <div style={{ minHeight: "400px" }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                style={{ ...COMMON_STYLES.card, marginBottom: "15px" }}
              >
                <Skeleton active avatar paragraph={{ rows: 2 }} />
              </Card>
            ))
          ) : data.length > 0 ? (
            <List
              dataSource={data}
              renderItem={(service) => {
                const maskedService = showMaskedData ? maskSensitiveData(service, userLevel) : service;
                return (
                  <SupplyServiceCard
                    service={service}
                    isSelected={selectedRowKeys.includes(service.id)}
                    isComparing={compareList.some((c) => c.id === service.id)}
                    onSelect={handleSelectRow}
                    onCompare={handleCompareToggle}
                    onConnect={handleConnectClick}
                    onFavorite={(service) => message.success(`已收藏 ${service.serviceName}`)}
                    navigate={navigate}
                    userLevel={userLevel}
                    showMaskedData={showMaskedData}
                    maskedData={maskedService}
                  />
                );
              }}
              split={false}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ textAlign: "center" }}>
                  <Text type="secondary">暂无相关企业信息</Text>
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginTop: "4px",
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

        {/* Latest Requirements Section */}
        <LatestRequirements
          onRequirementClick={handleRequirementClick}
          onViewAllClick={handleViewAllRequirements}
        />

        {/* Recommendation Section */}
        <div style={{ marginTop: 40, marginBottom: 24 }}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "none",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Title level={5} style={{ margin: 0, fontSize: "18px" }}>
                <StarFilled style={{ color: "#faad14", marginRight: 8 }} />
                智能推荐
              </Title>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={handleRefreshRecommend}
              >
                换一批
              </Button>
            </div>
            <Row gutter={16}>
              {recommendData.map((item) => (
                <Col span={8} key={item.id}>
                  <Card
                    hoverable
                    size="small"
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onClick={() =>
                      navigate(`/industry/service-match/detail/${item.id}`)
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text strong style={{ fontSize: 14 }}>
                        {item.name}
                      </Text>
                      <Tag color="gold">推荐</Tag>
                    </div>
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{
                        fontSize: 12,
                        marginTop: 8,
                        color: "#666",
                        marginBottom: 8,
                      }}
                    >
                      {item.scope}
                    </Paragraph>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Rate
                        disabled
                        defaultValue={item.score}
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </div>

      {/* Batch Action Bar (Fixed Bottom) */}
      {selectedRowKeys.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            padding: "12px 24px",
            borderRadius: 30,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#fff",
          }}
        >
          <span>已选择 {selectedRowKeys.length} 项</span>
          <Button type="primary" shape="round" onClick={handleBatchConnect}>
            批量对接
          </Button>
          <Button ghost shape="round" onClick={handleBatchExport}>
            批量导出
          </Button>
          <Button
            type="text"
            style={{ color: "#fff" }}
            onClick={() => setSelectedRowKeys([])}
          >
            取消
          </Button>
        </div>
      )}

      {/* Comparison Floating Button */}
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

      <ComparisonModal
        open={comparisonModalOpen}
        items={compareList}
        onCancel={() => setComparisonModalOpen(false)}
      />

      {/* Connect Modal - Enhanced */}
      <ConnectModal
        open={connectModalOpen}
        target={connectTarget}
        onCancel={() => {
          setConnectModalOpen(false);
          setSelectedRowKeys([]); // Clear selection on close if it was batch
        }}
      />
    </div>
  );
};

export default ServiceMatchHome;
