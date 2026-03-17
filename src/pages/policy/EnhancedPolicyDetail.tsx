/**
 * 增强版政策详情页
 * 创建时间: 2026-03-04
 * 功能: 完整展示政策详情，包含申报状态、基本信息、竞争力分析、快速申报等模块
 */

import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Skeleton,
  Empty,
  Modal,
  Alert,
  Progress,
  Tooltip,
  Avatar,
  List,
  Descriptions,
  Table,
  Breadcrumb,
  Spin,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  DownloadOutlined,
  EyeOutlined,
  QrcodeOutlined,
  LinkOutlined,
  MessageOutlined,
  VerticalAlignTopOutlined,
  WechatOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

interface PolicyDetailData {
  id: string;
  title: string;
  status: "not_started" | "in_progress" | "ended";
  deadline: string;
  startTime: string;
  department: string;
  region: string;
  funding: string;
  type: string;
  description: string;
  policyBasis: string;
  applicationConditions: string[];
  targetAudience: string;
  materials: Array<{
    name: string;
    required: boolean;
    format: string;
    example?: string;
    note?: string;
  }>;
  process: string[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  currentProgress?: string;
  currentAuditNode?: string;
  remainingDays?: number;
  competitiveness: {
    fundingStrength: number;
    applicationDifficulty: number;
    approvalRate: number;
    competitionLevel: number;
    matchDegree: number;
  };
  applicationTrend: {
    months: string[];
    applicationCount: number[];
    approvalCount: number[];
  };
  expertInfo?: {
    name: string;
    title: string;
    avatar: string;
    expertise: string[];
    responseTime: string;
  };
}

const EnhancedPolicyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState<PolicyDetailData | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [consultModalVisible, setConsultModalVisible] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Mock data
  const mockPolicyData = useMemo<PolicyDetailData>(() => ({
    id: id || "1",
    title: "2024-2025年北京市节能技术改造项目奖励",
    status: "in_progress",
    deadline: "2026-06-30",
    startTime: "2026-01-01",
    department: "北京市发展和改革委员会",
    region: "北京市",
    funding: "最高500万元",
    type: "技术创新",
    description:
      "为推动北京市节能减排工作，鼓励企业实施节能技术改造项目，对符合条件的节能改造项目给予资金奖励。支持企业采用先进节能技术和设备，提升能源利用效率，降低能源消耗，促进绿色低碳发展。",
    policyBasis:
      "《北京市节能减排综合工作方案》《北京市促进节能技术改造专项资金管理办法》",
    targetAudience: "在北京市注册的独立法人企业",
    applicationConditions: [
      "在北京市注册的独立法人企业，具有独立法人资格",
      "完成节能技术改造项目并通过验收，项目符合国家和北京市相关标准",
      "节能量达到100吨标准煤以上，经第三方机构审核认定",
      "项目投资额在50万元以上，有完整的财务凭证",
      "企业无重大安全生产事故和环境违法行为",
      "项目技术方案科学合理，节能效果显著",
    ],
    materials: [
      {
        name: "项目申请表",
        required: true,
        format: "电子版（PDF、DOC、DOCX）",
        example: "点击下载模板",
        note: "需加盖企业公章，填写完整准确",
      },
      {
        name: "营业执照副本",
        required: true,
        format: "扫描件（PDF、JPG）",
        note: "需加盖企业公章，确保清晰可见",
      },
      {
        name: "项目可行性研究报告",
        required: true,
        format: "PDF或Word文档",
        example: "点击下载模板",
        note: "需包含技术方案、投资预算、节能效果分析等内容",
      },
      {
        name: "第三方节能量审核报告",
        required: true,
        format: "PDF文档",
        note: "需由具备资质的第三方机构出具，有效期内",
      },
      {
        name: "项目验收报告",
        required: true,
        format: "PDF文档",
        note: "需由主管部门或第三方机构出具",
      },
      {
        name: "财务审计报告",
        required: false,
        format: "PDF文档",
        note: "近两年财务审计报告，由会计师事务所出具",
      },
    ],
    process: [
      "企业在线提交申报材料，确保材料完整准确",
      "主管部门进行形式审查，审核周期5个工作日",
      "组织专家评审，评估项目技术方案和节能效果",
      "公示评审结果，公示期7个工作日",
      "发放奖励资金，通过银行转账方式拨付",
    ],
    contactPhone: "010-12345678",
    contactEmail: "policy@beijing.gov.cn",
    contactAddress: "北京市朝阳区建国路88号",
    currentProgress: "申报材料准备阶段",
    currentAuditNode: "企业准备材料",
    remainingDays: 118,
    competitiveness: {
      fundingStrength: 85,
      applicationDifficulty: 60,
      approvalRate: 75,
      competitionLevel: 70,
      matchDegree: 90,
    },
    applicationTrend: {
      months: ["1月", "2月", "3月", "4月", "5月", "6月"],
      applicationCount: [45, 52, 38, 65, 58, 72],
      approvalCount: [32, 38, 28, 48, 42, 54],
    },
    expertInfo: {
      name: "王资深",
      title: "资深政策专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Expert",
      expertise: ["节能技术改造", "政策申报辅导", "项目可行性分析"],
      responseTime: "平均5分钟响应",
    },
  }), [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Check if policy data was passed from search results
        const passedPolicyData = location.state?.policyData;

        if (passedPolicyData) {
          // Use data from search results and enhance it with additional details
          const enhancedData = {
            ...mockPolicyData,
            id: passedPolicyData.id,
            title: passedPolicyData.title,
            department: passedPolicyData.department,
            publishDate: passedPolicyData.date,
            industry: passedPolicyData.industry,
            status: passedPolicyData.status,
            type: passedPolicyData.type,
            content: passedPolicyData.content,
          };
          setPolicyData(enhancedData);
        } else {
          // Fallback to mock data if no data was passed
          await new Promise((resolve) => setTimeout(resolve, 800));
          setPolicyData(mockPolicyData);
        }
      } catch (error) {
        message.error("数据加载失败");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state]);

  // 计算剩余天数
  const getRemainingDays = (deadline: string) => {
    const now = dayjs();
    const end = dayjs(deadline);
    return end.diff(now, "day");
  };

  // 获取项目状态
  const getProjectStatus = (data: PolicyDetailData) => {
    const now = dayjs();
    const start = dayjs(data.startTime);
    const end = dayjs(data.deadline);

    if (now.isBefore(start)) return "not_started";
    if (now.isAfter(end)) return "ended";
    return "in_progress";
  };

  // 处理收藏
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    message.success(isFavorited ? "已取消收藏" : "收藏成功");
  };

  // 处理分享
  const handleShare = () => {
    setShareModalVisible(true);
  };

  // 复制链接
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success("链接已复制到剪贴板");
    });
  };

  // 处理立即申报
  const [activeAnchor, setActiveAnchor] = useState("section-content"); // 默认选中申报方向

  // 监听滚动事件，实现锚点联动
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "section-content",     // 申报方向/正文
        "section-status",      // 申报状态
        "section-basic",       // 基本信息
        "section-materials",   // 申报材料
        "section-process",     // 办理流程
        "section-contact",     // 咨询电话
      ];

      // 找到当前在视口中最靠近顶部的部分
      let currentSection = sections[0];
      let minDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          // 获取元素相对于视口的位置
          const rect = element.getBoundingClientRect();
          // 如果元素的顶部在视口上半部分（增加一些偏移量以便提早触发）
          const distance = Math.abs(rect.top - 100); 
          if (distance < minDistance && rect.top < window.innerHeight / 2) {
            minDistance = distance;
            currentSection = section;
          }
        }
      }

      if (currentSection !== activeAnchor) {
        setActiveAnchor(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // 初始执行一次
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeAnchor]);

  const scrollToAnchor = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    if (element) {
      // 减去头部导航的高度作为偏移量
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveAnchor(anchorId);
    }
  };

  const handleApply = () => {
    if (!policyData) return;

    const status = getProjectStatus(policyData);
    if (status === "ended") {
      message.warning("申报已截止");
      return;
    }
    if (status === "not_started") {
      message.warning("申报尚未开始");
      return;
    }

    // 自动关联当前政策信息，跳转到申报向导
    navigate(`/application/apply/${policyData.id}`, {
      state: {
        policyInfo: policyData,
        autoFill: true,
      },
    });
  };

  // 处理在线咨询
  const handleConsult = () => {
    setConsultModalVisible(true);
  };

  // 政策竞争力雷达图配置
  const getRadarChartOption = () => {
    if (!policyData) return {};

    return {
      title: {
        text: "政策竞争力分析",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const indicators = [
            "资金力度",
            "申报难度",
            "获批率",
            "竞争程度",
            "匹配度",
          ];
          const index = params.dataIndex;
          return `${indicators[index]}: ${params.value}`;
        },
      },
      radar: {
        indicator: [
          { name: "资金力度", max: 100 },
          { name: "申报难度", max: 100 },
          { name: "获批率", max: 100 },
          { name: "竞争程度", max: 100 },
          { name: "匹配度", max: 100 },
        ],
        radius: "65%",
        splitNumber: 4,
        axisName: {
          color: "#666",
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(24, 144, 255, 0.05)", "rgba(24, 144, 255, 0.1)"],
          },
        },
      },
      series: [
        {
          name: "政策竞争力",
          type: "radar",
          data: [
            {
              value: [
                policyData.competitiveness.fundingStrength,
                policyData.competitiveness.applicationDifficulty,
                policyData.competitiveness.approvalRate,
                policyData.competitiveness.competitionLevel,
                policyData.competitiveness.matchDegree,
              ],
              name: "当前政策",
              itemStyle: {
                color: "#1890ff",
              },
              areaStyle: {
                color: "rgba(24, 144, 255, 0.3)",
              },
              lineStyle: {
                width: 2,
              },
            },
          ],
        },
      ],
    };
  };

  // 申报趋势折线图配置
  const getTrendChartOption = () => {
    if (!policyData) return {};

    return {
      title: {
        text: "近6个月申报趋势",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((item: any) => {
            result += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ["申报数量", "获批数量"],
        bottom: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: policyData.applicationTrend.months,
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          color: "#666",
        },
      },
      yAxis: {
        type: "value",
        name: "数量",
        nameTextStyle: {
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          color: "#666",
        },
        splitLine: {
          lineStyle: {
            color: "#f0f0f0",
          },
        },
      },
      series: [
        {
          name: "申报数量",
          type: "line",
          data: policyData.applicationTrend.applicationCount,
          smooth: true,
          itemStyle: {
            color: "#1890ff",
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(24, 144, 255, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(24, 144, 255, 0.05)",
                },
              ],
            },
          },
        },
        {
          name: "获批数量",
          type: "line",
          data: policyData.applicationTrend.approvalCount,
          smooth: true,
          itemStyle: {
            color: "#52c41a",
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(82, 196, 26, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(82, 196, 26, 0.05)",
                },
              ],
            },
          },
        },
      ],
    };
  };

  // 材料表格列配置
  const materialColumns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "材料名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.required && <Tag color="red">必填</Tag>}
        </Space>
      ),
    },
    {
      title: "格式要求",
      dataIndex: "format",
      key: "format",
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, record: any) => (
        <Space>
          {record.example && (
            <Button type="link" size="small" icon={<DownloadOutlined />}>
              {record.example}
            </Button>
          )}
          {record.note && (
            <Tooltip title={record.note}>
              <InfoCircleOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </Content>
      </Layout>
    );
  }

  if (!policyData) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Empty description="政策信息不存在" />
          </Card>
        </Content>
      </Layout>
    );
  }

  const status = getProjectStatus(policyData);
  const remainingDays = getRemainingDays(policyData.deadline);
  const isExpired = status === "ended";

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Content
        style={{
          maxWidth: 1600, // 放大布局宽度以适配左右结构
          margin: "24px auto",
          padding: "0 24px",
          width: "100%",
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 左侧：锚点导航 (新版设计) */}
          <Col xs={0} lg={4}>
            <div style={{ position: "sticky", top: 24 }}>
              <div style={{ borderRight: "2px solid #e1251b", paddingRight: 16, textAlign: "right" }}>
                <Title level={5} style={{ color: "#e1251b", marginBottom: 16 }}>事项名称</Title>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#666" }}>
                  <div 
                    style={{ cursor: "pointer", color: activeAnchor === "section-content" ? "#333" : "inherit", fontWeight: activeAnchor === "section-content" ? "bold" : "normal" }}
                    onClick={() => scrollToAnchor("section-content")}
                  >申报方向</div>
                  <div 
                    style={{ cursor: "pointer", color: activeAnchor === "section-status" ? "#333" : "inherit", fontWeight: activeAnchor === "section-status" ? "bold" : "normal" }}
                    onClick={() => scrollToAnchor("section-status")}
                  >申报状态</div>
                  <div 
                    style={{ cursor: "pointer", color: activeAnchor === "section-basic" ? "#333" : "inherit", fontWeight: activeAnchor === "section-basic" ? "bold" : "normal" }}
                    onClick={() => scrollToAnchor("section-basic")}
                  >基本信息</div>
                  <div 
                    style={{ cursor: "pointer", color: activeAnchor === "section-materials" ? "#333" : "inherit", fontWeight: activeAnchor === "section-materials" ? "bold" : "normal" }}
                    onClick={() => scrollToAnchor("section-materials")}
                  >申报材料</div>
                  <div 
                    style={{ cursor: "pointer", color: activeAnchor === "section-process" ? "#333" : "inherit", fontWeight: activeAnchor === "section-process" ? "bold" : "normal" }}
                    onClick={() => scrollToAnchor("section-process")}
                  >办理程序</div>
                  <div 
                    style={{ cursor: "pointer", color: activeAnchor === "section-contact" ? "#333" : "inherit", fontWeight: activeAnchor === "section-contact" ? "bold" : "normal" }}
                    onClick={() => scrollToAnchor("section-contact")}
                  >咨询电话</div>
                </div>
              </div>
            </div>
          </Col>

          {/* 中间主内容区 */}
          <Col xs={24} lg={14}>
            {/* 核心指标卡片 (仿图例设计) */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16
            }}>
              <Title level={3} style={{ margin: 0 }}>{policyData.title}</Title>
            </div>
            
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                border: "1px solid #f0f0f0",
                borderTop: "3px solid #e1251b"
              }}
              styles={{ body: { padding: "16px 24px" } }}
            >
              <Row align="middle" justify="space-between">
                <Col span={5}>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>实施主体</div>
                  <div style={{ color: "#333", fontSize: "14px", fontWeight: "bold" }}>{policyData.department}</div>
                </Col>
                <Col span={5}>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>服务对象</div>
                  <div style={{ color: "#333", fontSize: "14px", fontWeight: "bold" }}>法人 / 企业</div>
                </Col>
                <Col span={5}>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>兑现方式</div>
                  <div style={{ color: "#333", fontSize: "14px", fontWeight: "bold" }}>标准事项</div>
                </Col>
                <Col span={5}>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>扶持金额</div>
                  <div style={{ color: "#e1251b", fontSize: "18px", fontWeight: "bold", fontFamily: "DIN, Roboto Mono, monospace" }}>
                    {policyData.funding}
                  </div>
                </Col>
                <Col span={4} style={{ textAlign: "right", borderLeft: "1px solid #f0f0f0", paddingLeft: 16 }}>
                  <Button 
                    type="primary" 
                    size="large" 
                    style={{ background: "#e1251b", borderColor: "#e1251b", width: "100%" }}
                    onClick={handleApply}
                  >
                    立即申报
                  </Button>
                  <Button size="small" style={{ marginTop: 8, width: "100%" }}>申报材料</Button>
                  <Button size="small" style={{ marginTop: 8, width: "100%" }} icon={<HeartOutlined />}>关注</Button>
                </Col>
              </Row>
            </Card>

            {/* 政策正文 (红头文件样式) */}
            <Card
              id="section-content"
              variant="borderless"
              style={{
                marginBottom: 24,
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderTop: "6px solid #e1251b",
                padding: "20px 40px",
                position: "relative",
                overflow: "hidden",
                background: "#fff url('https://www.transparenttextures.com/patterns/rice-paper.png')", // 添加细微的纸张纹理
              }}
              styles={{ body: { padding: 0 } }}
            >
              {/* 印章水印效果 (如果是已结束状态，显示已截止水印) */}
              {isExpired && (
                <div style={{
                  position: "absolute",
                  top: "20%",
                  right: "10%",
                  width: "150px",
                  height: "150px",
                  border: "4px solid rgba(225, 37, 27, 0.4)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(-30deg)",
                  pointerEvents: "none",
                  zIndex: 0
                }}>
                  <span style={{ 
                    color: "rgba(225, 37, 27, 0.4)", 
                    fontSize: "32px", 
                    fontWeight: "bold",
                    letterSpacing: "4px"
                  }}>申报截止</span>
                </div>
              )}

              <div style={{ textAlign: "center", marginBottom: 30, borderBottom: "2px solid #e1251b", paddingBottom: 20 }}>
                <Title level={2} style={{ color: "#e1251b", marginBottom: 16, fontFamily: "SimSun, '宋体', serif", letterSpacing: "2px" }}>
                  {policyData.department}
                </Title>
                <div style={{ fontSize: "16px", fontFamily: "FangSong, '仿宋', serif", marginBottom: 16 }}>
                  京发改规〔2024〕1号
                </div>
                <Title level={3} style={{ fontFamily: "SimHei, '黑体', sans-serif", margin: "20px 0" }}>
                  {policyData.title}
                </Title>
              </div>

              <div style={{ 
                fontFamily: "FangSong, '仿宋', serif", 
                fontSize: "18px", 
                lineHeight: "2.0", 
                color: "#333",
                textIndent: "2em",
                position: "relative",
                zIndex: 1
              }}>
                <p>各有关单位：</p>
                <p>{policyData.description}</p>
                <p>为全面贯彻落实国家及本市关于节能减排、绿色低碳发展的决策部署，充分发挥财政资金的引导和放大作用，鼓励和引导企业加大节能技术改造投入，进一步提升本市能源利用效率，根据《北京市节能减排综合工作方案》和《北京市促进节能技术改造专项资金管理办法》等有关规定，现就开展2024-2025年北京市节能技术改造项目资金奖励申报工作通知如下：</p>
                
                <h4 style={{ fontWeight: "bold", marginTop: "24px", textIndent: 0 }}>一、 支持范围与标准</h4>
                <p>支持在本市行政区域内实施的，采用先进适用节能技术、产品和设备，对现有生产工艺、设备、设施等进行节能技术改造，并取得显著节能效果的项目。</p>
                
                <h4 style={{ fontWeight: "bold", marginTop: "24px", textIndent: 0 }}>二、 申报主体条件</h4>
                <p>（一）在北京市行政区域内依法登记注册，具有独立法人资格；</p>
                <p>（二）企业经营状况良好，财务管理制度健全；</p>
                <p>（三）近三年内未发生重大安全、环保、质量等事故，无严重失信行为记录。</p>
              </div>

              {/* 模拟落款印章 */}
              <div style={{
                position: "absolute",
                right: "40px",
                bottom: "10px",
                width: "140px",
                height: "140px",
                border: "4px solid #e1251b",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e1251b",
                opacity: 0.85,
                pointerEvents: "none",
                zIndex: 2,
                transform: "rotate(-15deg)",
                background: "radial-gradient(circle, transparent 40%, rgba(225, 37, 27, 0.05) 100%)"
              }}>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <div style={{ fontSize: "16px", marginBottom: "8px" }}>★</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", transform: "scale(0.9)", letterSpacing: "1px" }}>{policyData.department}</div>
                </div>
              </div>

              <div style={{ 
                marginTop: 60, 
                textAlign: "right", 
                fontFamily: "FangSong, '仿宋', serif", 
                fontSize: "18px",
                position: "relative",
                paddingRight: "60px",
                zIndex: 1
              }}>
                <div style={{ marginBottom: 10 }}>{policyData.department}</div>
                <div>{dayjs().format('YYYY年MM月DD日')}</div>
              </div>
            </Card>

            {/* 申报状态提醒 */}
            <Card
              id="section-status"
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: `2px solid ${isExpired ? "#ff4d4f" : "#1890ff"}`,
              }}
              styles={{
                header: {
                  backgroundColor: isExpired ? "#fff1f0" : "#e6f7ff",
                  borderBottom: `2px solid ${isExpired ? "#ff4d4f" : "#1890ff"}`,
                },
              }}
              title={
                <Space>
                  <CalendarOutlined
                    style={{
                      fontSize: 18,
                      color: isExpired ? "#ff4d4f" : "#1890ff",
                    }}
                  />
                  <Text strong style={{ fontSize: 16 }}>
                    申报状态提醒
                  </Text>
                  {isExpired && <Tag color="error">已截止</Tag>}
                  {status === "in_progress" && (
                    <Tag color="processing">申报中</Tag>
                  )}
                  {status === "not_started" && (
                    <Tag color="default">未开始</Tag>
                  )}
                </Space>
              }
            >
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Row gutter={24}>
                  <Col span={8}>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">截止时间</Text>
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          color: isExpired ? "#ff4d4f" : "#000",
                        }}
                      >
                        {policyData.deadline}
                      </Text>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">剩余天数</Text>
                      <Text
                        strong
                        style={{
                          fontSize: 20,
                          color: isExpired
                            ? "#ff4d4f"
                            : remainingDays <= 7
                              ? "#faad14"
                              : "#52c41a",
                        }}
                      >
                        {isExpired ? "已截止" : `${remainingDays} 天`}
                      </Text>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">当前审核节点</Text>
                      <Text strong style={{ fontSize: 14 }}>
                        {policyData.currentAuditNode || "企业准备材料"}
                      </Text>
                    </Space>
                  </Col>
                </Row>

                <div>
                  <Text
                    type="secondary"
                    style={{ marginBottom: 8, display: "block" }}
                  >
                    申报进度
                  </Text>
                  <Progress
                    percent={
                      isExpired ? 100 : status === "in_progress" ? 50 : 0
                    }
                    status={isExpired ? "exception" : "active"}
                    strokeColor={isExpired ? "#ff4d4f" : "#1890ff"}
                  />
                </div>

                {status === "in_progress" && (
                  <Alert
                    message="当前审核节点"
                    description={
                      policyData.currentProgress ||
                      "政策申报材料准备阶段，请及时提交申报材料"
                    }
                    type="info"
                    showIcon
                    icon={<ClockCircleOutlined />}
                  />
                )}

                {isExpired && (
                  <Alert
                    message="申报已截止"
                    description="该政策申报时间已结束，请关注其他可申报政策"
                    type="error"
                    showIcon
                  />
                )}
              </Space>
            </Card>

            {/* 基本信息 */}
            <Card
              id="section-basic"
              title={
                <Space>
                  <SafetyOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    基本信息
                  </Text>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  onClick={() => message.info("展开更多内容")}
                >
                  查看详情
                </Button>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="实施主体单位" span={2}>
                  <Text strong>{policyData.department}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="申报对象">
                  {policyData.targetAudience}
                </Descriptions.Item>
                <Descriptions.Item label="项目类别">
                  <Tag color="blue">{policyData.type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="补贴金额">
                  <Text strong style={{ color: "#faad14", fontSize: 16 }}>
                    {policyData.funding}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="申报时间">
                  {policyData.startTime} 至 {policyData.deadline}
                </Descriptions.Item>
                <Descriptions.Item label="政策依据" span={2}>
                  {policyData.policyBasis}
                </Descriptions.Item>
                <Descriptions.Item label="申报条件" span={2}>
                  <List
                    size="small"
                    dataSource={policyData.applicationConditions}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Text>
                          {index + 1}. {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 申报材料清单 */}
            <Card
              id="section-materials"
              title={
                <Space>
                  <FileTextOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    申报材料清单
                  </Text>
                </Space>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Alert
                message="申报注意事项"
                description="请确保所有必填材料准备齐全，材料格式符合要求。支持在线预览和编辑部分材料。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Table
                columns={materialColumns}
                dataSource={policyData.materials}
                pagination={false}
                rowKey="name"
                size="small"
              />
            </Card>

            {/* 办理流程 */}
            <Card
              id="section-process"
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    办理流程
                  </Text>
                </Space>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <List
                dataSource={policyData.process}
                renderItem={(item, index) => (
                  <List.Item>
                    <Space>
                      <Avatar
                        style={{ backgroundColor: "#1890ff" }}
                        size="small"
                      >
                        {index + 1}
                      </Avatar>
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            {/* 联系方式 */}
            <Card
              id="section-contact"
              title={
                <Space>
                  <PhoneOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    联系方式
                  </Text>
                </Space>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="咨询电话">
                  <Text copyable>{policyData.contactPhone}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="电子邮箱">
                  <Text copyable>{policyData.contactEmail}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="办公地址">
                  {policyData.contactAddress}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* 右侧：操作与辅助功能区 (新版设计) */}
          <Col xs={24} lg={6}>
            <div style={{ position: "sticky", top: 24 }}>
              {/* 微信下载与分享 */}
              <Card
                style={{
                  marginBottom: 16,
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #f0f0f0"
                }}
                styles={{ body: { padding: "0" } }}
              >
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", fontSize: "14px", fontWeight: "bold" }}>微信下载与分享</div>
                <div style={{ padding: "16px 20px" }}>
                  <Space style={{ width: "100%", justifyContent: "center", gap: "24px" }}>
                    <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => message.info("开始下载")}>
                      <div style={{ width: 40, height: 40, background: "#f0f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <DownloadOutlined style={{ fontSize: 18, color: "#1890ff" }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#666" }}>下载至本地</span>
                    </div>
                    <div style={{ textAlign: "center", cursor: "pointer" }} onClick={handleShare}>
                      <div style={{ width: 40, height: 40, background: "#f6ffed", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <WechatOutlined style={{ fontSize: 18, color: "#52c41a" }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#666" }}>分享至微信</span>
                    </div>
                  </Space>
                  <Divider style={{ margin: "16px 0" }} />
                  <Button type="link" block icon={<ShareAltOutlined />} style={{ color: "#666" }}>
                    对申报政策评价
                  </Button>
                </div>
              </Card>
              
              {/* 悬浮侧边栏工具 (联系客服等) */}
              <div style={{
                position: "absolute",
                right: "-60px",
                top: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                background: "#fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <Tooltip placement="left" title="项目进度">
                  <div style={{ padding: "12px", cursor: "pointer", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                    <ClockCircleOutlined style={{ fontSize: 18, color: "#666" }} />
                  </div>
                </Tooltip>
                <Tooltip placement="left" title="我要提问">
                  <div style={{ padding: "12px", cursor: "pointer", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                    <QuestionCircleOutlined style={{ fontSize: 18, color: "#666" }} />
                  </div>
                </Tooltip>
                <Tooltip placement="left" title="诉求响应">
                  <div style={{ padding: "12px", cursor: "pointer", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                    <MessageOutlined style={{ fontSize: 18, color: "#666" }} />
                  </div>
                </Tooltip>
                <Tooltip placement="left" title="技术支持">
                  <div style={{ padding: "12px", cursor: "pointer", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                    <PhoneOutlined style={{ fontSize: 18, color: "#666" }} />
                  </div>
                </Tooltip>
                <Tooltip placement="left" title="返回顶部">
                  <div 
                    style={{ padding: "12px", cursor: "pointer", textAlign: "center" }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <VerticalAlignTopOutlined style={{ fontSize: 18, color: "#666" }} />
                  </div>
                </Tooltip>
              </div>
            </div>
          </Col>
        </Row>
      </Content>

      {/* 分享弹窗 */}
      <Modal
        title="分享政策"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div
            style={{
              textAlign: "center",
              padding: 24,
              background: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <QrcodeOutlined style={{ fontSize: 120, color: "#1890ff" }} />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">扫描二维码分享</Text>
            </div>
          </div>
          <Button block icon={<LinkOutlined />} onClick={handleCopyLink}>
            复制链接
          </Button>
        </Space>
      </Modal>

      {/* 咨询弹窗 */}
      <Modal
        title="在线咨询"
        open={consultModalVisible}
        onCancel={() => setConsultModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Alert
            message="咨询服务"
            description="专家将在5分钟内响应您的咨询，请耐心等待"
            type="info"
            showIcon
          />
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary">正在连接咨询师...</Text>
          </div>
        </Space>
      </Modal>
    </Layout>
  );
};

export default EnhancedPolicyDetail;
