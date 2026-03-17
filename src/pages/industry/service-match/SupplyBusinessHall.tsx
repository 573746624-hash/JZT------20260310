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
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  StarFilled,
  ReloadOutlined,
  BarChartOutlined,
  TrophyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { THEME, COMMON_STYLES } from "./styles";
import HallHeader from "./components/HallHeader";
import SupplyServiceCard from "./components/SupplyServiceCard";
import ConnectModal from "./components/ConnectModal";
import ComparisonModal from "./components/ComparisonModal";
import BusinessHallBanner from "./components/BusinessHallBanner";
import ProfessionalServiceCategories from "./components/ProfessionalServiceCategories";
import LatestRequirements from "./components/LatestRequirements";
import { mockSupplyServices, SupplyService } from "./data/supplyServiceData";

const { Title, Text } = Typography;

const SupplyBusinessHall: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SupplyService[]>([]);
  const [featuredServices, setFeaturedServices] = useState<SupplyService[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortField, setSortField] = useState("featured"); // featured | rating | projects | response
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<SupplyService[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<string>("guest"); // 用户等级
  const [showMaskedData, setShowMaskedData] = useState<boolean>(true); // 是否显示遮挡数据

  // 统计数据
  const [statistics, setStatistics] = useState({
    totalCompanies: 12580,
    totalServices: 8960,
    successfulMatches: 3420,
    featuredServices: 156,
    verifiedCompanies: 8945,
    averageRating: 4.7,
  });

  // 模拟数据加载
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSelectedRowKeys([]);
      setCompareList([]);

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));

        let filteredData = [...mockSupplyServices];

        // 应用搜索过滤
        if (searchText) {
          filteredData = filteredData.filter(
            (service) =>
              service.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
              service.serviceName.toLowerCase().includes(searchText.toLowerCase()) ||
              service.serviceDescription.toLowerCase().includes(searchText.toLowerCase()) ||
              service.professionalTags.some(tag => 
                tag.toLowerCase().includes(searchText.toLowerCase())
              )
          );
        }

        // 应用分类过滤
        if (selectedCategory) {
          filteredData = filteredData.filter(
            (service) => service.serviceCategories.includes(selectedCategory)
          );
        }

        // 应用其他筛选条件
        if (filters.region) {
          filteredData = filteredData.filter(
            (service) => service.region.includes(filters.region)
          );
        }

        // 排序
        switch (sortField) {
          case "featured":
            filteredData.sort((a, b) => {
              if (a.isFeatured && !b.isFeatured) return -1;
              if (!a.isFeatured && b.isFeatured) return 1;
              return b.rating - a.rating;
            });
            break;
          case "rating":
            filteredData.sort((a, b) => b.rating - a.rating);
            break;
          case "projects":
            filteredData.sort((a, b) => b.completedProjects - a.completedProjects);
            break;
          case "response":
            filteredData.sort((a, b) => {
              const aTime = parseInt(a.responseTime);
              const bTime = parseInt(b.responseTime);
              return aTime - bTime;
            });
            break;
        }

        setData(filteredData);

        // 设置精选服务
        const featured = mockSupplyServices
          .filter(service => service.isFeatured)
          .slice(0, 3);
        setFeaturedServices(featured);

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
    setSelectedCategory(categoryId);
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

  const handleRefreshFeatured = () => {
    message.success("已刷新精选服务");
    // 重新获取精选服务
    const featured = mockSupplyServices
      .filter(service => service.isFeatured)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setFeaturedServices(featured);
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

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100%", paddingBottom: 60 }}>
      {/* 增强的头部Banner */}
      <div style={{ padding: "20px 20px 0" }}>
        <BusinessHallBanner
          onPublishClick={handleCreateClick}
          onMyServicesClick={handleMyServicesClick}
          onMessagesClick={handleMessagesClick}
          statistics={statistics}
        />
      </div>

      {/* 搜索头部 */}
      <div style={{ 
        padding: "0 20px", 
        background: "#fff", 
        margin: "0 20px", 
        borderRadius: "12px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)" 
      }}>
        <HallHeader
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onCreateClick={handleCreateClick}
          isProcurement={false}
        />
      </div>

      <div style={{ padding: "20px" }}>
        {/* 专业服务分类导航 */}
        <ProfessionalServiceCategories
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />

        {/* 数据统计展示 */}
        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "none",
            marginBottom: "24px",
          }}
          styles={{ body: { padding: "20px" } }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="精选服务"
                value={statistics.featuredServices}
                prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="认证企业"
                value={statistics.verifiedCompanies}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="平均评分"
                value={statistics.averageRating}
                precision={1}
                prefix={<StarFilled style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="成功对接"
                value={statistics.successfulMatches}
                prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
          </Row>
        </Card>

        {/* 排序和批量操作栏 */}
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
              checked={data.length > 0 && selectedRowKeys.length === data.length}
              indeterminate={
                selectedRowKeys.length > 0 && selectedRowKeys.length < data.length
              }
              onChange={handleSelectAll}
            >
              全选
            </Checkbox>
            <Text type="secondary">共找到 {data.length} 个专业服务</Text>
          </Space>

          <Radio.Group
            value={sortField}
            onChange={handleSortChange}
            buttonStyle="solid"
          >
            <Radio.Button value="featured">精选推荐</Radio.Button>
            <Radio.Button value="rating">评分最高</Radio.Button>
            <Radio.Button value="projects">项目最多</Radio.Button>
            <Radio.Button value="response">响应最快</Radio.Button>
          </Radio.Group>
        </div>

        {/* 服务列表区域 */}
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
              专业服务供给列表
            </Text>
          </div>

          <div style={{ minHeight: "400px" }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  style={{ marginBottom: "20px" }}
                >
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
                    showMaskedData={showMaskedData}
                  />
                )}
                split={false}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ textAlign: "center" }}>
                    <Text type="secondary">暂无相关专业服务</Text>
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

        {/* 最新需求区域 */}
        <LatestRequirements
          onRequirementClick={handleRequirementClick}
          onViewAllClick={handleViewAllRequirements}
        />

        {/* 精选服务推荐 */}
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
                <TrophyOutlined style={{ color: "#faad14", marginRight: 8 }} />
                精选服务推荐
              </Title>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={handleRefreshFeatured}
              >
                换一批
              </Button>
            </div>
            <Row gutter={16}>
              {featuredServices.map((service) => (
                <Col span={8} key={service.id}>
                  <Card
                    hoverable
                    size="small"
                    style={{
                      border: "1px solid #faad14",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(250, 173, 20, 0.15)",
                    }}
                    onClick={() =>
                      navigate(`/industry/service-match/detail/${service.id}`)
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Text strong style={{ fontSize: 14 }}>
                        {service.companyName}
                      </Text>
                      <TrophyOutlined style={{ color: "#faad14" }} />
                    </div>
                    <Text
                      style={{
                        fontSize: 13,
                        color: THEME.primary,
                        fontWeight: "600",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      {service.serviceName}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <Space>
                        <Text type="secondary">{service.region}</Text>
                        <Text type="secondary">{service.completedProjects}个项目</Text>
                      </Space>
                      <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
                        {service.successRate}%成功率
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </div>

      {/* 批量操作浮动栏 */}
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
          <span>已选择 {selectedRowKeys.length} 个服务</span>
          <Button type="primary" shape="round" onClick={handleBatchConnect}>
            批量对接
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

      {/* 对比浮动按钮 */}
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
            style={{
              backgroundColor: "#faad14",
              borderColor: "#faad14",
            }}
          >
            服务对比 ({compareList.length})
          </Button>
        </div>
      )}

      {/* 对比弹窗 */}
      <ComparisonModal
        open={comparisonModalOpen}
        items={compareList}
        onCancel={() => setComparisonModalOpen(false)}
      />

      {/* 对接弹窗 */}
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
