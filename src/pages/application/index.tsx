/**
 * 优化版申报管理模块 - UI深度优化
 * 创建时间: 2026-02-26
 * 功能: 政务类产品专业、简洁、规整的申报管理页面
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Select,
  Button,
  Tag,
  Space,
  Pagination,
  Empty,
  Typography,
  message,
  Skeleton,
  Cascader,
  Input,
  Modal,
  FloatButton,
  Divider,
  Badge,
  Avatar,
  List,
  Progress,
  DatePicker,
  Popconfirm,
  ConfigProvider,
} from "antd";
import {
  FileTextOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FormOutlined,
  UpOutlined,
  DownOutlined,
  SearchOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  VerticalAlignTopOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  SendOutlined,
  StopOutlined,
  BankOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import ApplyButton from "../../components/common/ApplyButton";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { DESIGN_TOKENS } from "./config/designTokens";
import OptimizedMyApplications from "./OptimizedMyApplications";
import HighlightText from "../../components/common/HighlightText";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const mockProjects: ProjectItem[] = Array.from({ length: 45 }, (_, i) => {
  const districts = [
    "海淀区",
    "朝阳区",
    "丰台区",
    "西城区",
    "东城区",
    "石景山区",
    "通州区",
    "昌平区",
    "大兴区",
    "顺义区",
  ];
  const policyTypes = [
    "高新技术企业认定",
    "专精特新企业认定",
    "科技创新补贴",
    "人才引进支持",
    "产业升级补贴",
    "绿色发展支持",
    "数字化转型补贴",
    "创新创业支持",
    "研发费用补贴",
    "知识产权支持",
  ];
  const departments = [
    "科技委员会",
    "发改委",
    "经信局",
    "人社局",
    "财政局",
    "商务局",
    "文化委",
    "环保局",
    "交通委",
    "建委",
  ];
  const industries = [
    "高新技术",
    "人工智能",
    "生物医药",
    "新能源",
    "新材料",
    "电子信息",
    "文化创意",
    "现代服务",
    "金融科技",
    "环保技术",
  ];
  const targetAudiences = [
    "中小企业",
    "初创企业",
    "高新技术企业",
    "科技型企业",
    "成长型企业",
    "创新型企业",
    "专精特新企业",
    "高层次人才",
    "技术人才",
    "创业团队",
  ];
  const types = [
    "技术创新",
    "人才引进",
    "产业升级",
    "绿色发展",
    "数字化转型",
    "创新创业",
    "知识产权",
    "其他",
  ];
  const statuses = ["in_progress", "not_started", "ended"];
  const fundingAmounts = [
    "10万元",
    "20万元",
    "30万元",
    "50万元",
    "80万元",
    "100万元",
    "150万元",
    "200万元",
    "300万元",
    "500万元",
  ];

  const district = districts[i % districts.length];
  const policyType = policyTypes[i % policyTypes.length];
  const department = departments[i % departments.length];
  const industry = industries[i % industries.length];
  const targetAudience = targetAudiences[i % targetAudiences.length];
  const type = types[i % types.length];
  const status = statuses[i % statuses.length] as
    | "in_progress"
    | "not_started"
    | "ended";
  const funding = fundingAmounts[i % fundingAmounts.length];

  const year = i < 15 ? "2026" : i < 30 ? "2025" : "2024";
  const month = String((i % 12) + 1).padStart(2, "0");
  const day = String((i % 28) + 1).padStart(2, "0");

  return {
    id: String(i + 1),
    title: `${district}${policyType}项目（${year}年第${Math.floor(i / 10) + 1}批）`,
    description: `面向${targetAudience}的${policyType}支持项目，旨在促进${industry}领域的技术创新和产业升级，提升企业核心竞争力和市场占有率。通过资金支持、政策指导和服务保障，全面推动企业高质量发展。`,
    type,
    region: district,
    funding: `最高${funding}`,
    deadline: `${year}-${month}-${day}`,
    status,
    startTime: `${parseInt(year) - 1}-${month}-01`,
    department: `${district}${department}`,
    industry,
    targetAudience,
    year,
    viewCount: Math.floor(Math.random() * 2000) + 100,
    applyCount: Math.floor(Math.random() * 200) + 10,
    isApplied: Math.random() > 0.8,
  };
});

// 类型定义
interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: string;
  region: string;
  funding: string;
  deadline: string;
  status: "not_started" | "in_progress" | "ended";
  startTime: string;
  department: string;
  industry: string;
  targetAudience: string;
  year: string;
  viewCount: number;
  applyCount: number;
  isApplied?: boolean;
}

interface FilterState {
  policyLevel: (string | number)[][];
  status: string[];
  department: string[];
  industry: string[];
  targetAudience: string[];
  year: string[];
  projectType: string[];
}

type ViewType = "management" | "list" | "status" | "statistics";

// 导入管理仪表盘组件
import ApplicationManagementDashboard from "./ApplicationManagementDashboard";

const OptimizedApplicationManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const view = searchParams.get("view");
    return (view as ViewType) || "management";
  });

  useEffect(() => {
    const view = searchParams.get("view");
    if (view && view !== currentView) {
      setCurrentView(view as ViewType);
    } else if (location.pathname === "/policy-center/my-applications" && currentView !== "status") {
      // 如果是直接访问我的申报路由，强制切换到 status 视图
      setCurrentView("status");
    }
  }, [searchParams, location.pathname]); // Removed currentView to avoid infinite loop warning

  const [filterExpanded, setFilterExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterState>({
    policyLevel: [],
    status: [],
    department: [],
    industry: [],
    targetAudience: [],
    year: [],
    projectType: [],
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [jumpPage, setJumpPage] = useState("");
  const [searchText, setSearchText] = useState("");

  // 模拟数据

  // 筛选选项配置
  const filterOptions = {
    policyLevel: [
      {
        value: "beijing",
        label: "北京市",
        children: [
          { value: "haidian", label: "海淀区" },
          { value: "chaoyang", label: "朝阳区" },
          { value: "fengtai", label: "丰台区" },
          { value: "dongcheng", label: "东城区" },
          { value: "xicheng", label: "西城区" },
        ],
      },
      {
        value: "shanghai",
        label: "上海市",
        children: [
          { value: "huangpu", label: "黄浦区" },
          { value: "xuhui", label: "徐汇区" },
        ],
      },
    ],
    status: [
      { value: "not_started", label: "未开始" },
      { value: "in_progress", label: "申报中" },
      { value: "ended", label: "已截止" },
    ],
    department: [
      { value: "tech_committee", label: "北京市科技委员会" },
      { value: "talent_office", label: "海淀区人才办" },
      { value: "culture_committee", label: "朝阳区文化委" },
      { value: "fengtai_tech", label: "丰台区科委" },
    ],
    industry: [
      { value: "high_tech", label: "高新技术" },
      { value: "talent_service", label: "人才服务" },
      { value: "culture_creative", label: "文化创意" },
      { value: "tech_service", label: "科技服务" },
    ],
    targetAudience: [
      { value: "sme", label: "中小企业" },
      { value: "high_talent", label: "高层次人才" },
      { value: "culture_enterprise", label: "文创企业" },
      { value: "tech_enterprise", label: "科技型企业" },
    ],
    year: [
      { value: "2026", label: "2026年" },
      { value: "2025", label: "2025年" },
      { value: "2024", label: "2024年" },
    ],
    projectType: [
      { value: "技术创新", label: "技术创新" },
      { value: "人才引进", label: "人才引进" },
      { value: "其他", label: "其他" },
    ],
  };

  // 获取项目状态
  const getProjectStatus = (project: ProjectItem) => {
    const now = new Date();
    const startTime = new Date(project.startTime);
    const endTime = new Date(project.deadline);

    if (now < startTime) return "not_started";
    if (now > endTime) return "ended";
    return "in_progress";
  };

  // 计算倒计时天数
  const getCountdownDays = (deadline: string) => {
    const now = new Date();
    const endTime = new Date(deadline);
    const diffTime = endTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      not_started: { color: "default", text: "未开始" },
      in_progress: { color: "processing", text: "申报中" },
      ended: { color: "error", text: "已截止" },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取类型标签样式
  const getTypeTagStyle = (type: string) => {
    const styleMap = {
      技术创新: DESIGN_TOKENS.colors.tag.tech,
      人才引进: DESIGN_TOKENS.colors.tag.tech,
      其他: DESIGN_TOKENS.colors.tag.funding,
    };
    return (
      styleMap[type as keyof typeof styleMap] || DESIGN_TOKENS.colors.tag.tech
    );
  };

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      let filteredProjects = [...mockProjects];

      if (filters.status && filters.status.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filters.status.includes(getProjectStatus(project)),
        );
      }

      if (filters.projectType && filters.projectType.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filters.projectType.includes(project.type),
        );
      }

      if (filters.year && filters.year.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filters.year.includes(project.year),
        );
      }

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

      setProjects(paginatedProjects);
      setPagination((prev) => ({
        ...prev,
        total: filteredProjects.length,
      }));
    } catch (error) {
      message.error("数据加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]); // 修复依赖项

  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      policyLevel: [],
      status: [],
      department: [],
      industry: [],
      targetAudience: [],
      year: [],
      projectType: [],
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 模拟获取最新项目信息（模拟后端接口）
  const fetchProjectLatestInfo = async (
    id: string,
  ): Promise<ProjectItem | null> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
    // 这里应该是API调用，暂时从mock数据获取
    const project = mockProjects.find((p) => p.id === id);
    return project ? { ...project } : null;
  };

  // 统一的项目操作处理（确保详情与申报逻辑一致）
  const handleProjectAction = async (
    project: ProjectItem,
    action: "view" | "apply",
  ) => {
    const hideLoading = message.loading("正在同步项目数据...", 0);

    try {
      // 1. 再次拉取最新数据做二次确认
      const latestProject = await fetchProjectLatestInfo(project.id);
      hideLoading();

      if (!latestProject) {
        message.error("项目不存在或已被删除");
        loadData(); // 刷新列表
        return;
      }

      // 计算实时状态
      const latestStatus = getProjectStatus(latestProject);
      const currentStatus = getProjectStatus(project);

      // 2. 一致性校验：检查状态是否变更
      if (
        latestStatus !== currentStatus ||
        latestProject.isApplied !== project.isApplied
      ) {
        message.warning("项目状态发生变更，已为您自动刷新");
        loadData(); // 重新加载列表
        return;
      }

      // 3. 统一参数与权限校验
      if (action === "apply") {
        if (latestStatus !== "in_progress") {
          message.warning("当前项目不在申报期内");
          return;
        }

        // 跳转申报页 (移除 isApplied 判断，允许重新申报)
        navigate(`/application/apply/${latestProject.id}`, {
          state: {
            projectInfo: latestProject,
            fromList: true,
            isLoggedIn: isLoggedIn,
          },
        });
      } else {
        // 跳转详情页（传递相同的数据源）
        navigate(`/application/detail/${latestProject.id}`, {
          state: {
            filters,
            pagination,
            scrollPosition: window.scrollY,
            projectInfo: latestProject, // 确保详情页使用最新同步的数据
          },
        });
      }
    } catch (error) {
      hideLoading();
      message.error("数据同步失败，请检查网络");
    }
  };

  // 处理申报按钮点击
  const handleApplyClick = (project: ProjectItem) => {
    handleProjectAction(project, "apply");
  };

  // 处理查看详情
  const handleViewDetail = (project: ProjectItem) => {
    handleProjectAction(project, "view");
  };

  // 跳转页面处理
  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (
      page &&
      page > 0 &&
      page <= Math.ceil(pagination.total / pagination.pageSize)
    ) {
      setPagination((prev) => ({ ...prev, current: page }));
      setJumpPage("");
    } else {
      message.warning("请输入有效的页码");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filters]);

  // 渲染筛选区域
  const renderFilterSection = () => {
    return null; // 完全移除筛选区域
  };

  // 渲染项目卡片
  const renderProjectCard = (project: ProjectItem) => {
    const status = getProjectStatus(project);
    const canApply =
      isLoggedIn && status === "in_progress" && !project.isApplied;
    const countdownDays =
      status === "in_progress" ? getCountdownDays(project.deadline) : 0;
    const typeStyle = getTypeTagStyle(project.type);
    const isExpired = status === "ended";

    return (
      <Card
        key={project.id}
        hoverable={!isExpired}
        size="small"
        style={{
          marginBottom: 16,
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
          boxShadow: "0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease",
          cursor: isExpired ? "default" : "pointer",
          opacity: isExpired ? 0.8 : 1,
        }}
        styles={{ body: { padding: "16px 24px" } }}
        onClick={(e) => {
          if (isExpired) return;
          const target = e.target as HTMLElement;
          if (target.closest("button")) {
            return;
          }
          handleViewDetail(project);
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* 左侧主要信息 */}
          <div style={{ flex: 1, paddingRight: 24 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12, gap: 12 }}>
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#262626",
                  lineHeight: "24px",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                <HighlightText
                  text={project.title}
                  keywords={searchText || ""}
                />
              </Title>
              {isExpired ? (
                <Tag color="default" style={{ margin: 0 }}>已截止</Tag>
              ) : countdownDays <= 7 ? (
                <Badge count={`仅剩${countdownDays}天`} style={{ backgroundColor: '#ff4d4f' }} />
              ) : (
                <Tag color="processing" style={{ margin: 0 }}>申报中</Tag>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <Space split={<Divider type="vertical" />} size={4} style={{ color: "#595959", fontSize: "13px" }}>
                <span><BankOutlined style={{ marginRight: 4 }} />{project.department}</span>
                <span><AppstoreOutlined style={{ marginRight: 4 }} />{project.type}</span>
                <span><EnvironmentOutlined style={{ marginRight: 4 }} />{project.region}</span>
              </Space>
            </div>
            
            <div style={{ color: "#8c8c8c", fontSize: "13px" }}>
              <HighlightText
                text={project.description}
                keywords={searchText || ""}
              />
            </div>
          </div>

          {/* 右侧操作区 */}
          <div style={{ 
            width: "200px", 
            borderLeft: "1px solid #f0f0f0", 
            paddingLeft: 24, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}>
            <div style={{ textAlign: "right", width: "100%", marginBottom: 16 }}>
              <div style={{ color: "#8c8c8c", fontSize: "12px", marginBottom: 4 }}>扶持金额</div>
              <div style={{ color: "#faad14", fontSize: "18px", fontWeight: "bold", fontFamily: "DIN, Roboto Mono, monospace" }}>
                {project.funding}
              </div>
            </div>

            <div style={{ textAlign: "right", width: "100%", marginBottom: 16 }}>
              <div style={{ color: "#8c8c8c", fontSize: "12px", marginBottom: 4 }}>截止日期</div>
              <div style={{ color: isExpired ? "#ff4d4f" : "#333", fontSize: "14px", fontWeight: 500 }}>
                {project.deadline}
              </div>
            </div>

            <Space>
              <Button size="middle" onClick={() => handleViewDetail(project)}>
                查看详情
              </Button>
              {!isExpired && (
                <Button type="primary" size="middle" onClick={() => handleApplyClick(project)}>
                  立即申报
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  // 渲染项目列表
  const renderProjectList = () => {
    if (loading) {
      return (
        <div>
          {renderFilterSection()}
          <Row gutter={[16, 16]}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Col xs={24} key={index}>
                <Card
                  variant="borderless"
                  style={{
                    height: "140px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                  }}
                >
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div>
          {renderFilterSection()}
          <Empty
            image={
              <FileTextOutlined
                style={{
                  fontSize: "64px",
                  color: DESIGN_TOKENS.colors.text.disabled,
                }}
              />
            }
            description={
              <div style={{ textAlign: "center" }}>
                <Text
                  strong
                  style={{
                    fontSize: DESIGN_TOKENS.fontSize.lg,
                    color: DESIGN_TOKENS.colors.text.primary,
                    fontFamily: "Microsoft YaHei",
                  }}
                >
                  暂无申报项目
                </Text>
                <br />
                <Text
                  style={{
                    fontSize: DESIGN_TOKENS.fontSize.md,
                    color: DESIGN_TOKENS.colors.text.secondary,
                    fontFamily: "Microsoft YaHei",
                  }}
                >
                  您可调整筛选条件或关注最新政策
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              onClick={resetFilters}
              style={{
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
                fontFamily: "Microsoft YaHei",
              }}
            >
              重置筛选
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <div>
        {renderFilterSection()}

        {/* 项目统计 */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: "14px",
              color: "#595959",
            }}
          >
            共找到 <Text strong>{pagination.total}</Text> 个符合条件的项目
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col key={project.id} xs={24}>
              {renderProjectCard(project)}
            </Col>
          ))}
        </Row>

        {/* 分页区布局优化 - 居中对齐 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
            padding: "24px 0",
            borderTop: "1px solid #e8e8e8",
          }}
        >
          <Space size="large" align="center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => (
                <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  共 {total} 条项目，当前显示 {range[0]}-{range[1]} 条
                </Text>
              )}
              pageSizeOptions={["8", "16", "24"]}
              onChange={(page, pageSize) => {
                setPagination((prev) => ({ ...prev, current: page, pageSize }));
              }}
            />
          </Space>
        </div>
      </div>
    );
  };

  // 渲染数据统计
  const renderStatistics = () => {
    const pieChartOption = {
      color: [
        DESIGN_TOKENS.colors.primary,
        DESIGN_TOKENS.colors.success,
        DESIGN_TOKENS.colors.warning,
        DESIGN_TOKENS.colors.tag.funding,
        DESIGN_TOKENS.colors.tag.tech,
      ],
      title: {
        text: "申报项目类型分布",
        left: "center",
        textStyle: {
          fontFamily: "Microsoft YaHei",
          color: DESIGN_TOKENS.colors.text.primary,
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "horizontal",
        bottom: "bottom",
        textStyle: {
          fontFamily: "Microsoft YaHei",
        },
      },
      series: [
        {
          name: "项目类型",
          type: "pie",
          radius: "50%",
          data: [
            { value: 45, name: "技术创新" },
            { value: 30, name: "人才引进" },
            { value: 25, name: "其他" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    const barChartOption = {
      color: [DESIGN_TOKENS.colors.primary],
      title: {
        text: "月度申报趋势",
        left: "center",
        textStyle: {
          fontFamily: "Microsoft YaHei",
          color: DESIGN_TOKENS.colors.text.primary,
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "申报数",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 150, 80, 70, 110, 130],
        },
      ],
    };

    return (
      <div style={{ padding: DESIGN_TOKENS.spacing.md }}>
        <Title
          level={3}
          style={{
            fontFamily: "Microsoft YaHei",
            color: DESIGN_TOKENS.colors.text.primary,
            marginBottom: DESIGN_TOKENS.spacing.md,
          }}
        >
          数据统计
        </Title>
        <Row gutter={[DESIGN_TOKENS.spacing.md, DESIGN_TOKENS.spacing.md]}>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: DESIGN_TOKENS.colors.primary,
                  fontFamily: "Microsoft YaHei",
                }}
              >
                156
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                项目总数
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: DESIGN_TOKENS.colors.success,
                  fontFamily: "Microsoft YaHei",
                }}
              >
                1247
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                申报总数
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: DESIGN_TOKENS.colors.warning,
                  fontFamily: "Microsoft YaHei",
                }}
              >
                892
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                成功申报
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#722ed1",
                  fontFamily: "Microsoft YaHei",
                }}
              >
                71.5%
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                平均成功率
              </Text>
            </Card>
          </Col>

          <Col span={12}>
            <Card style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <ReactECharts
                option={pieChartOption}
                style={{ height: "350px" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <ReactECharts
                option={barChartOption}
                style={{ height: "350px" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染当前视图内容
  const renderCurrentView = () => {
    switch (currentView) {
      case "management":
        return <ApplicationManagementDashboard />;
      case "list":
        return renderProjectList();
      case "status":
        return <OptimizedMyApplications />;
      case "statistics":
        return renderStatistics();
      default:
        return <ApplicationManagementDashboard />;
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: DESIGN_TOKENS.colors.background,
      }}
    >
      {/* 主内容区 */}
      <Layout>
        <Content style={{ backgroundColor: DESIGN_TOKENS.colors.background }}>
          {/* 内容区域 */}
          <div
            style={{
              padding: DESIGN_TOKENS.spacing.md,
              minHeight: "100vh",
              backgroundColor: DESIGN_TOKENS.colors.background,
            }}
          >
            {renderCurrentView()}
          </div>
        </Content>
      </Layout>

      {/* 悬浮按钮组 */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton
          icon={<BookOutlined />}
          tooltip="申报指引"
          onClick={() => message.info("申报指引")}
        />
        <FloatButton
          icon={<CustomerServiceOutlined />}
          tooltip="客服支持"
          onClick={() => message.info("客服支持")}
        />
        <FloatButton
          icon={<VerticalAlignTopOutlined />}
          tooltip="返回顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </FloatButton.Group>

      {/* 登录弹窗 */}
      <Modal
        title={<span style={{ fontFamily: "Microsoft YaHei" }}>用户登录</span>}
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setLoginModalVisible(false)}
            style={{ fontFamily: "Microsoft YaHei" }}
          >
            取消
          </Button>,
          <Button
            key="login"
            type="primary"
            onClick={() => {
              setIsLoggedIn(true);
              setLoginModalVisible(false);
              message.success("登录成功");
            }}
            style={{ fontFamily: "Microsoft YaHei" }}
          >
            登录
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <UserOutlined
            style={{
              fontSize: "48px",
              color: DESIGN_TOKENS.colors.primary,
              marginBottom: DESIGN_TOKENS.spacing.sm,
            }}
          />
          <p
            style={{
              fontFamily: "Microsoft YaHei",
              color: DESIGN_TOKENS.colors.text.secondary,
            }}
          >
            请登录后继续申报操作
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default OptimizedApplicationManagement;
