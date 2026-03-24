/**
 * 法规查询模块 - 优化版
 * 创建时间: 2026-03-23
 * 功能: 提供多维度法规检索、智能排序、多视图展示
 * 优化点: 简化筛选器、增加视图切换、智能排序、筛选模板
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Typography,
  Tooltip,
  Modal,
  message,
  Radio,
  Empty,
  Tabs,
  List,
  Badge,
  Divider,
  Dropdown,
  Menu,
  Checkbox,
  DatePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/PageWrapper";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  SearchOutlined,
  DownloadOutlined,
  FileTextOutlined,
  BookOutlined,
  HistoryOutlined,
  RocketOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  TableOutlined,
  FilterOutlined,
  SaveOutlined,
  DeleteOutlined,
  StarOutlined,
  EyeOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import SafeECharts from "../../../components/SafeECharts";
import type { EChartsOption } from "echarts";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 视图类型
type ViewType = "card" | "list" | "table";

// 排序类型
type SortType = "relevance" | "date_desc" | "date_asc" | "level" | "views";

// 法规数据接口
interface RegulationItem {
  id: string;
  title: string;
  level: string;
  field: string;
  scenario: string;
  publishOrg: string;
  publishDate: string;
  effectiveDate: string;
  status: "effective" | "revised" | "abolished";
  tags: string[];
  summary: string;
  keyArticles: string[];
  viewCount: number;
  downloadCount: number;
  matchScore?: number;
  isNew?: boolean;
  isHot?: boolean;
}

// 筛选条件接口
interface FilterCriteria {
  keyword: string;
  level: string[];
  field: string[];
  status: string;
  publishOrg: string[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  scenario?: string;
}

// 筛选模板
interface FilterTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  criteria: Partial<FilterCriteria>;
}

// 模拟法规数据
const mockRegulations: RegulationItem[] = [
  {
    id: "1",
    title: "中华人民共和国公司法（2023修订）",
    level: "法律",
    field: "公司法",
    scenario: "公司治理",
    publishOrg: "全国人大常委会",
    publishDate: "2023-12-29",
    effectiveDate: "2024-07-01",
    status: "effective",
    tags: ["注册资本", "股东权益", "董事会", "监事会"],
    summary: "规范公司的组织和行为，保护公司、股东、职工和债权人的合法权益。",
    keyArticles: [
      "第四十七条：有限责任公司的注册资本为在公司登记机关登记的全体股东认缴的出资额。",
      "第五十一条：有限责任公司设监事会，本法第六十九条、第八十三条另有规定的除外。",
    ],
    viewCount: 125680,
    downloadCount: 45600,
    isNew: true,
    isHot: true,
  },
  {
    id: "2",
    title: "中华人民共和国劳动合同法",
    level: "法律",
    field: "劳动法",
    scenario: "用工合规",
    publishOrg: "全国人大常委会",
    publishDate: "2012-12-28",
    effectiveDate: "2013-07-01",
    status: "effective",
    tags: ["劳动合同", "试用期", "离职补偿", "社保"],
    summary: "规范劳动合同制度，保护劳动者合法权益，构建和谐劳动关系。",
    keyArticles: [
      "第十条：建立劳动关系，应当订立书面劳动合同。",
      "第十九条：劳动合同期限三个月以上不满一年的，试用期不得超过一个月。",
    ],
    viewCount: 98750,
    downloadCount: 32100,
    isHot: true,
  },
  {
    id: "3",
    title: "中华人民共和国数据安全法",
    level: "法律",
    field: "网络安全",
    scenario: "数据合规",
    publishOrg: "全国人大常委会",
    publishDate: "2021-06-10",
    effectiveDate: "2021-09-01",
    status: "effective",
    tags: ["数据安全", "数据分类", "风险评估", "应急处置"],
    summary: "规范数据处理活动，保障数据安全，促进数据开发利用。",
    keyArticles: [
      "第二十一条：国家建立数据分类分级保护制度。",
      "第三十条：重要数据的处理者应当按照规定对其数据处理活动定期开展风险评估。",
    ],
    viewCount: 76500,
    downloadCount: 28900,
    isNew: true,
  },
  {
    id: "4",
    title: "中华人民共和国个人信息保护法",
    level: "法律",
    field: "网络安全",
    scenario: "数据合规",
    publishOrg: "全国人大常委会",
    publishDate: "2021-08-20",
    effectiveDate: "2021-11-01",
    status: "effective",
    tags: ["个人信息", "隐私保护", "数据处理", "用户权益"],
    summary: "保护个人信息权益，规范个人信息处理活动，促进个人信息合理利用。",
    keyArticles: [
      "第十三条：符合下列情形之一的，个人信息处理者方可处理个人信息。",
      "第五十一条：个人信息处理者应当根据个人信息的处理目的、处理方式、个人信息的种类以及对个人权益的影响、可能存在的安全风险等，采取措施确保个人信息处理活动符合法律、行政法规的规定。",
    ],
    viewCount: 82300,
    downloadCount: 31200,
    isHot: true,
  },
  {
    id: "5",
    title: "中华人民共和国电子商务法",
    level: "法律",
    field: "商法",
    scenario: "电商维权",
    publishOrg: "全国人大常委会",
    publishDate: "2018-08-31",
    effectiveDate: "2019-01-01",
    status: "effective",
    tags: ["电商平台", "消费者权益", "电子合同", "数据电文"],
    summary: "保障电子商务各方主体的合法权益，规范电子商务行为，维护市场秩序。",
    keyArticles: [
      "第九条：电子商务经营者应当在其首页显著位置，持续公示营业执照信息。",
      "第四十九条：电子商务经营者发布的商品或者服务信息符合要约条件的，用户选择该商品或者服务并提交订单成功，合同成立。",
    ],
    viewCount: 65400,
    downloadCount: 21800,
  },
  {
    id: "6",
    title: "中华人民共和国专利法（2020修正）",
    level: "法律",
    field: "知识产权",
    scenario: "知识产权保护",
    publishOrg: "全国人大常委会",
    publishDate: "2020-10-17",
    effectiveDate: "2021-06-01",
    status: "effective",
    tags: ["专利申请", "专利保护", "侵权赔偿", "外观设计"],
    summary: "保护专利权人的合法权益，鼓励发明创造，推动发明创造的应用。",
    keyArticles: [
      "第十一条：发明和实用新型专利权被授予后，除本法另有规定的以外，任何单位或者个人未经专利权人许可，都不得实施其专利。",
      "第七十一条：侵犯专利权的赔偿数额按照权利人因被侵权所受到的实际损失或者侵权人因侵权所获得的利益确定。",
    ],
    viewCount: 45600,
    downloadCount: 15600,
  },
  {
    id: "7",
    title: "中华人民共和国企业所得税法实施条例",
    level: "行政法规",
    field: "财税法",
    scenario: "税务合规",
    publishOrg: "国务院",
    publishDate: "2019-04-23",
    effectiveDate: "2019-04-23",
    status: "effective",
    tags: ["企业所得税", "税收优惠", "税前扣除", "纳税申报"],
    summary: "根据《中华人民共和国企业所得税法》的规定，制定本条例。",
    keyArticles: [
      "第九条：企业应纳税所得额的计算，以权责发生制为原则。",
      "第四十条：企业发生的职工福利费支出，不超过工资、薪金总额14%的部分，准予扣除。",
    ],
    viewCount: 78900,
    downloadCount: 26700,
  },
  {
    id: "8",
    title: "保障中小企业款项支付条例",
    level: "行政法规",
    field: "商法",
    scenario: "合同履约",
    publishOrg: "国务院",
    publishDate: "2020-07-05",
    effectiveDate: "2020-09-01",
    status: "effective",
    tags: ["中小企业", "款项支付", "合同履行", "权益保护"],
    summary: "促进机关、事业单位和大型企业及时支付中小企业款项，维护中小企业合法权益。",
    keyArticles: [
      "第八条：机关、事业单位从中小企业采购货物、工程、服务，应当自货物、工程、服务交付之日起30日内支付款项。",
      "第十五条：机关、事业单位和大型企业迟延支付中小企业款项的，应当支付逾期利息。",
    ],
    viewCount: 52300,
    downloadCount: 18900,
    isNew: true,
  },
];

// 预设筛选模板
const filterTemplates: FilterTemplate[] = [
  {
    id: "labor",
    name: "劳动用工",
    icon: <BookOutlined style={{ color: "#1890ff" }} />,
    criteria: { field: ["劳动法"], scenario: "用工合规" },
  },
  {
    id: "data",
    name: "数据合规",
    icon: <BookOutlined style={{ color: "#722ed1" }} />,
    criteria: { field: ["网络安全"], scenario: "数据合规" },
  },
  {
    id: "tax",
    name: "财税税务",
    icon: <BookOutlined style={{ color: "#52c41a" }} />,
    criteria: { field: ["财税法"], scenario: "税务合规" },
  },
  {
    id: "ip",
    name: "知识产权",
    icon: <BookOutlined style={{ color: "#fa8c16" }} />,
    criteria: { field: ["知识产权"], scenario: "知识产权保护" },
  },
  {
    id: "corporate",
    name: "公司治理",
    icon: <BookOutlined style={{ color: "#eb2f96" }} />,
    criteria: { field: ["公司法"], scenario: "公司治理" },
  },
];

// 筛选选项
const filterOptions = {
  levels: ["法律", "行政法规", "部门规章", "地方性法规", "司法解释"],
  fields: ["劳动法", "公司法", "财税法", "知识产权", "网络安全", "商法"],
  statuses: [
    { label: "全部", value: "all" },
    { label: "现行有效", value: "effective" },
    { label: "已修订", value: "revised" },
    { label: "已废止", value: "abolished" },
  ],
  publishOrgs: ["全国人大常委会", "国务院", "最高人民法院", "各部委"],
};

const RegulationQueryEnhanced: React.FC = () => {
  const navigate = useNavigate();
  
  // 视图状态
  const [viewType, setViewType] = useState<ViewType>("card");
  const [sortBy, setSortBy] = useState<SortType>("relevance");
  
  // 筛选状态
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(({
    keyword: "",
    level: [],
    field: [],
    status: "all",
    publishOrg: [],
    dateRange: null,
  }));
  
  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 当前选中模板
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  // 根据筛选条件过滤数据
  const filteredData = useMemo(() => {
    let result = [...mockRegulations];
    
    // 关键词搜索
    if (filterCriteria.keyword) {
      const keyword = filterCriteria.keyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.summary.toLowerCase().includes(keyword) ||
          item.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }
    
    // 效力层级筛选
    if (filterCriteria.level.length > 0) {
      result = result.filter((item) => filterCriteria.level.includes(item.level));
    }
    
    // 业务领域筛选
    if (filterCriteria.field.length > 0) {
      result = result.filter((item) => filterCriteria.field.includes(item.field));
    }
    
    // 法规状态筛选
    if (filterCriteria.status !== "all") {
      result = result.filter((item) => item.status === filterCriteria.status);
    }
    
    // 发布机关筛选
    if (filterCriteria.publishOrg.length > 0) {
      result = result.filter((item) =>
        filterCriteria.publishOrg.includes(item.publishOrg)
      );
    }
    
    // 日期范围筛选
    if (filterCriteria.dateRange) {
      const [start, end] = filterCriteria.dateRange;
      result = result.filter((item) => {
        const itemDate = dayjs(item.publishDate);
        return itemDate.isAfter(start) && itemDate.isBefore(end);
      });
    }
    
    // 排序
    switch (sortBy) {
      case "date_desc":
        result.sort((a, b) => dayjs(b.publishDate).unix() - dayjs(a.publishDate).unix());
        break;
      case "date_asc":
        result.sort((a, b) => dayjs(a.publishDate).unix() - dayjs(b.publishDate).unix());
        break;
      case "views":
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "level": {
        const levelOrder = ["法律", "行政法规", "部门规章", "地方性法规", "司法解释"];
        result.sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level));
        break;
      }
      default:
        // 相关性排序（默认）
        break;
    }
    
    return result;
  }, [filterCriteria, sortBy]);

  // 应用筛选模板
  const applyTemplate = (template: FilterTemplate) => {
    setActiveTemplate(template.id);
    setFilterCriteria((prev) => ({
      ...prev,
      ...template.criteria,
    }));
    message.success(`已应用筛选模板：${template.name}`);
  };

  // 重置筛选
  const resetFilters = () => {
    setActiveTemplate(null);
    setFilterCriteria({
      keyword: "",
      level: [],
      field: [],
      status: "all",
      publishOrg: [],
      dateRange: null,
    });
    setSearchKeyword("");
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setFilterCriteria((prev) => ({ ...prev, keyword: value }));
  };

  // 表格列定义
  const tableColumns: ColumnsType<RegulationItem> = [
    {
      title: "法规名称",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Space size={8}>
            <Tag color="blue">{record.level}</Tag>
            <Tag color="green">{record.field}</Tag>
            {record.isNew && <Tag color="red">NEW</Tag>}
            {record.isHot && <Tag color="orange">HOT</Tag>}
          </Space>
        </Space>
      ),
    },
    {
      title: "发布机关",
      dataIndex: "publishOrg",
      key: "publishOrg",
      width: 150,
    },
    {
      title: "发布日期",
      dataIndex: "publishDate",
      key: "publishDate",
      width: 120,
      sorter: (a, b) => dayjs(a.publishDate).unix() - dayjs(b.publishDate).unix(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const statusMap = {
          effective: { color: "success", text: "现行有效" },
          revised: { color: "warning", text: "已修订" },
          abolished: { color: "error", text: "已废止" },
        };
        const { color, text } = statusMap[status];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "浏览",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      render: (count) => (
        <Space>
          <EyeOutlined />
          {count.toLocaleString()}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => navigate(`/legal-support/regulation-detail/${record.id}`)}
          >
            查看
          </Button>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.success("开始下载")}
          >
            下载
          </Button>
        </Space>
      ),
    },
  ];

  // 渲染卡片视图
  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {filteredData.map((item) => (
        <Col xs={24} sm={12} lg={8} key={item.id}>
          <Card
            hoverable
            className="regulation-card"
            onClick={() => navigate(`/legal-support/regulation-detail/${item.id}`)}
          >
            <div style={{ marginBottom: 12 }}>
              <Space wrap>
                <Tag color="blue">{item.level}</Tag>
                <Tag color="green">{item.field}</Tag>
                {item.isNew && <Tag color="red">NEW</Tag>}
                {item.isHot && <Tag color="orange">HOT</Tag>}
              </Space>
            </div>
            
            <Title level={5} style={{ marginBottom: 12, minHeight: 48 }}>
              {item.title}
            </Title>
            
            <Paragraph
              ellipsis={{ rows: 2 }}
              type="secondary"
              style={{ marginBottom: 12, minHeight: 40 }}
            >
              {item.summary}
            </Paragraph>
            
            <div style={{ marginBottom: 12 }}>
              <Space wrap size={4}>
                {item.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
            
            <Divider style={{ margin: "12px 0" }} />
            
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <HistoryOutlined /> {item.publishDate}
              </Text>
              <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <EyeOutlined /> {item.viewCount.toLocaleString()}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <DownloadOutlined /> {item.downloadCount.toLocaleString()}
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // 渲染列表视图
  const renderListView = () => (
    <List
      itemLayout="vertical"
      dataSource={filteredData}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/legal-support/regulation-detail/${item.id}`)}
            >
              查看全文
            </Button>,
            <Button icon={<DownloadOutlined />}>下载</Button>,
            <Button icon={<StarOutlined />}>收藏</Button>,
          ]}
        >
          <List.Item.Meta
            title={
              <Space>
                <Text strong style={{ fontSize: 16 }}>
                  {item.title}
                </Text>
                <Tag color="blue">{item.level}</Tag>
                {item.isNew && <Tag color="red">NEW</Tag>}
                {item.isHot && <Tag color="orange">HOT</Tag>}
              </Space>
            }
            description={
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                  <Text type="secondary">
                    <BookOutlined /> {item.publishOrg}
                  </Text>
                  <Text type="secondary">
                    <HistoryOutlined /> 发布：{item.publishDate}
                  </Text>
                  <Text type="secondary">
                    <RocketOutlined /> 实施：{item.effectiveDate}
                  </Text>
                </Space>
                <Paragraph ellipsis={{ rows: 2 }}>{item.summary}</Paragraph>
                <Space wrap>
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );

  // 渲染表格视图
  const renderTableView = () => (
    <Table
      columns={tableColumns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
    />
  );

  return (
    <PageWrapper module="legal">
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        {/* 页面标题 */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            <SearchOutlined style={{ marginRight: 8 }} />
            智能法规查询
          </Title>
          
          {/* 搜索框 */}
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Input.Search
              placeholder="请输入法规名称、关键词或标签进行搜索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
              size="large"
              style={{ marginBottom: 16 }}
            />
          </div>
          
          {/* 快速筛选模板 */}
          <div style={{ textAlign: "center" }}>
            <Space wrap>
              <Text type="secondary">快速筛选：</Text>
              {filterTemplates.map((template) => (
                <Button
                  key={template.id}
                  type={activeTemplate === template.id ? "primary" : "default"}
                  icon={template.icon}
                  onClick={() => applyTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
              {activeTemplate && (
                <Button icon={<DeleteOutlined />} onClick={resetFilters}>
                  清除筛选
                </Button>
              )}
            </Space>
          </div>
        </Card>

        {/* 筛选器和工具栏 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={16}>
              <Space wrap>
                <Select
                  mode="multiple"
                  placeholder="效力层级"
                  style={{ minWidth: 200 }}
                  value={filterCriteria.level}
                  onChange={(value) =>
                    setFilterCriteria((prev) => ({ ...prev, level: value }))
                  }
                  maxTagCount={2}
                >
                  {filterOptions.levels.map((level) => (
                    <Option key={level} value={level}>
                      {level}
                    </Option>
                  ))}
                </Select>
                
                <Select
                  mode="multiple"
                  placeholder="业务领域"
                  style={{ minWidth: 200 }}
                  value={filterCriteria.field}
                  onChange={(value) =>
                    setFilterCriteria((prev) => ({ ...prev, field: value }))
                  }
                  maxTagCount={2}
                >
                  {filterOptions.fields.map((field) => (
                    <Option key={field} value={field}>
                      {field}
                    </Option>
                  ))}
                </Select>
                
                <Select
                  placeholder="法规状态"
                  style={{ width: 120 }}
                  value={filterCriteria.status}
                  onChange={(value) =>
                    setFilterCriteria((prev) => ({ ...prev, status: value }))
                  }
                >
                  {filterOptions.statuses.map((status) => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
                
                <RangePicker
                  placeholder={["开始日期", "结束日期"]}
                  value={filterCriteria.dateRange}
                  onChange={(dates) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs],
                    }))
                  }
                />
              </Space>
            </Col>
            
            <Col xs={24} lg={8} style={{ textAlign: "right" }}>
              <Space>
                <Radio.Group
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="relevance">相关度</Radio.Button>
                  <Radio.Button value="date_desc">
                    <ArrowDownOutlined /> 最新
                  </Radio.Button>
                  <Radio.Button value="views">
                    <BarChartOutlined /> 热度
                  </Radio.Button>
                </Radio.Group>
                
                <Radio.Group
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="card">
                    <AppstoreOutlined />
                  </Radio.Button>
                  <Radio.Button value="list">
                    <UnorderedListOutlined />
                  </Radio.Button>
                  <Radio.Button value="table">
                    <TableOutlined />
                  </Radio.Button>
                </Radio.Group>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 结果统计 */}
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            共找到 <Text strong>{filteredData.length}</Text> 条法规
            {filterCriteria.keyword && (
              <span>，关键词："{filterCriteria.keyword}"</span>
            )}
          </Text>
        </div>

        {/* 结果展示 */}
        <Card>
          {filteredData.length > 0 ? (
            <>
              {viewType === "card" && renderCardView()}
              {viewType === "list" && renderListView()}
              {viewType === "table" && renderTableView()}
            </>
          ) : (
            <Empty
              description="未找到符合条件的法规"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={resetFilters}>
                重置筛选条件
              </Button>
            </Empty>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};

export default RegulationQueryEnhanced;
