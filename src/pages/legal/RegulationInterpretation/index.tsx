/**
 * 法规解读与合规建议模块
 * 创建时间: 2026-03-23
 * 功能: 提供法规条款深度解读、行业合规要点分析、定制化合规建议
 */

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  List,
  Tag,
  Button,
  Space,
  Select,
  Input,
  Collapse,
  Badge,
  Avatar,
  Divider,
  Alert,
  Steps,
  Result,
  Modal,
  Form,
  message,
} from "antd";
import {
  BookOutlined,
  SafetyOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BulbOutlined,
  TeamOutlined,
  BankOutlined,
  ArrowRightOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  StarOutlined,
  MessageOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import PageWrapper from "../../../components/PageWrapper";
import BreadcrumbNav from "../../../components/common/BreadcrumbNav";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

// 法规解读数据接口
interface RegulationInterpretation {
  id: string;
  regulationId: string;
  regulationTitle: string;
  articleNumber: string;
  articleContent: string;
  interpretation: string;
  keyPoints: string[];
  businessScenarios: BusinessScenario[];
  riskWarnings: RiskWarning[];
  complianceSuggestions: ComplianceSuggestion[];
  expert: {
    name: string;
    title: string;
    avatar: string;
    organization: string;
  };
  updateTime: string;
  viewCount: number;
  isRecommended: boolean;
}

// 业务场景接口
interface BusinessScenario {
  id: string;
  title: string;
  description: string;
  applicableIndustries: string[];
  caseExample: string;
  handlingSuggestion: string;
}

// 风险提示接口
interface RiskWarning {
  id: string;
  level: "high" | "medium" | "low";
  title: string;
  description: string;
  legalConsequences: string;
  preventionMeasures: string[];
}

// 合规建议接口
interface ComplianceSuggestion {
  id: string;
  category: string;
  priority: "urgent" | "high" | "medium" | "low";
  title: string;
  description: string;
  implementationSteps: string[];
  responsibleDept: string;
  estimatedCost: string;
  timeline: string;
}

// 行业类型
const industries = [
  { value: "manufacturing", label: "制造业", icon: <BankOutlined /> },
  { value: "technology", label: "科技/互联网", icon: <RobotOutlined /> },
  { value: "finance", label: "金融/保险", icon: <BankOutlined /> },
  { value: "retail", label: "零售/电商", icon: <BookOutlined /> },
  { value: "healthcare", label: "医疗健康", icon: <TeamOutlined /> },
  { value: "education", label: "教育培训", icon: <BookOutlined /> },
  { value: "realestate", label: "房地产/建筑", icon: <BankOutlined /> },
  { value: "logistics", label: "物流/运输", icon: <BookOutlined /> },
];

// 企业规模
const companySizes = [
  { value: "startup", label: "初创企业（<50人）" },
  { value: "small", label: "小型企业（50-100人）" },
  { value: "medium", label: "中型企业（100-500人）" },
  { value: "large", label: "大型企业（500-1000人）" },
  { value: "enterprise", label: "集团企业（>1000人）" },
];

// 模拟法规解读数据
const mockInterpretations: RegulationInterpretation[] = [
  {
    id: "interp1",
    regulationId: "company-law-2023",
    regulationTitle: "中华人民共和国公司法（2023修订）",
    articleNumber: "第四十七条",
    articleContent:
      "有限责任公司的注册资本为在公司登记机关登记的全体股东认缴的出资额。全体股东认缴的出资额由股东按照公司章程的规定自公司成立之日起五年内缴足。",
    interpretation:
      "这是2023年公司法修订的核心条款之一，确立了有限责任公司注册资本五年实缴制。该规定旨在解决长期以来注册资本认缴制导致的'认而不缴'问题，强化股东出资责任，保护债权人利益。",
    keyPoints: [
      "五年实缴期限：自公司成立之日起计算",
      "全体股东共同责任：所有股东需在期限内完成出资",
      "章程约定优先：具体出资时间和方式由章程规定",
      "存量公司适用：新法实施后存量公司有过渡期安排",
    ],
    businessScenarios: [
      {
        id: "scene1",
        title: "新设公司注册资本规划",
        description: "新设立有限责任公司时，如何合理确定注册资本金额和出资期限",
        applicableIndustries: ["制造业", "科技/互联网", "零售/电商"],
        caseExample:
          "某科技公司计划注册资本1000万元，股东三人。根据新法，需在5年内缴足。建议根据业务发展需要分阶段出资。",
        handlingSuggestion:
          "建议根据实际经营需要和股东出资能力确定注册资本，避免过高导致出资压力，也避免过低影响业务开展。",
      },
      {
        id: "scene2",
        title: "存量公司减资操作",
        description: "已设立公司注册资本过高，需要减资以适应新法要求",
        applicableIndustries: ["制造业", "房地产/建筑"],
        caseExample:
          "某制造企业注册资本5000万元，但实缴仅500万元。新法实施后，股东难以在5年内缴足剩余出资。",
        handlingSuggestion:
          "可通过法定程序进行减资，需编制资产负债表和财产清单，通知债权人并公告，办理工商变更登记。",
      },
    ],
    riskWarnings: [
      {
        id: "risk1",
        level: "high",
        title: "虚假出资风险",
        description: "股东未按期足额缴纳出资，可能面临行政处罚和民事责任",
        legalConsequences: "公司登记机关可处以虚假出资金额5%-15%的罚款；给公司造成损失的需承担赔偿责任",
        preventionMeasures: [
          "制定合理的出资计划",
          "建立出资提醒机制",
          "定期检查出资进度",
          "必要时依法减资",
        ],
      },
      {
        id: "risk2",
        level: "medium",
        title: "出资期限约定不明",
        description: "公司章程未明确约定出资期限，可能导致争议",
        legalConsequences: "可能被视为立即到期，股东需立即履行出资义务",
        preventionMeasures: [
          "章程中明确约定出资期限",
          "确保不超过法定5年期限",
          "股东会决议明确出资安排",
        ],
      },
    ],
    complianceSuggestions: [
      {
        id: "sugg1",
        category: "制度建设",
        priority: "urgent",
        title: "修订公司章程",
        description: "根据新法要求，明确股东出资期限和方式",
        implementationSteps: [
          "召开股东会讨论出资方案",
          "修改公司章程相关条款",
          "办理工商变更登记",
          "更新股东出资记录",
        ],
        responsibleDept: "法务部/董事会秘书",
        estimatedCost: "5000-10000元（含工商变更费用）",
        timeline: "1-2个月",
      },
      {
        id: "sugg2",
        category: "流程优化",
        priority: "high",
        title: "建立出资管理机制",
        description: "建立股东出资提醒、跟踪和管理机制",
        implementationSteps: [
          "制定出资计划时间表",
          "建立出资提醒系统",
          "定期向股东发送出资通知",
          "建立出资记录台账",
        ],
        responsibleDept: "财务部",
        estimatedCost: "2000-5000元",
        timeline: "2-4周",
      },
    ],
    expert: {
      name: "张律师",
      title: "高级合伙人",
      avatar: "",
      organization: "某某律师事务所",
    },
    updateTime: "2024-03-15",
    viewCount: 12580,
    isRecommended: true,
  },
  {
    id: "interp2",
    regulationId: "labor-contract-law",
    regulationTitle: "中华人民共和国劳动合同法",
    articleNumber: "第十九条",
    articleContent:
      "劳动合同期限三个月以上不满一年的，试用期不得超过一个月；劳动合同期限一年以上不满三年的，试用期不得超过二个月；三年以上固定期限和无固定期限的劳动合同，试用期不得超过六个月。",
    interpretation:
      "本条是关于试用期期限的规定，旨在保护劳动者权益，防止用人单位滥用试用期。根据合同期限的不同，设置了不同的试用期上限。",
    keyPoints: [
      "试用期与合同期限挂钩",
      "同一用人单位与同一劳动者只能约定一次试用期",
      "试用期包含在劳动合同期限内",
      "试用期工资不得低于法定标准",
    ],
    businessScenarios: [
      {
        id: "scene3",
        title: "试用期员工管理",
        description: "如何合法合规地管理试用期员工，避免违法风险",
        applicableIndustries: ["科技/互联网", "零售/电商", "教育培训"],
        caseExample:
          "某互联网公司招聘技术人员，签订2年劳动合同，约定3个月试用期。员工在试用期第2个月被辞退。",
        handlingSuggestion:
          "辞退试用期员工需证明其不符合录用条件，否则可能构成违法解除，需支付赔偿金。",
      },
    ],
    riskWarnings: [
      {
        id: "risk3",
        level: "high",
        title: "试用期约定违法",
        description: "试用期期限超过法定上限或重复约定试用期",
        legalConsequences: "劳动行政部门责令改正；违法约定的试用期已经履行的，按满月工资赔偿",
        preventionMeasures: [
          "严格按照法定期限约定试用期",
          "建立试用期管理制度",
          "明确录用条件和考核标准",
        ],
      },
    ],
    complianceSuggestions: [
      {
        id: "sugg3",
        category: "制度建设",
        priority: "urgent",
        title: "完善试用期管理制度",
        description: "建立规范的试用期考核和解除机制",
        implementationSteps: [
          "制定试用期考核标准",
          "建立试用期考核流程",
          "规范试用期解除程序",
          "保存试用期考核记录",
        ],
        responsibleDept: "人力资源部",
        estimatedCost: "3000-8000元",
        timeline: "1个月",
      },
    ],
    expert: {
      name: "李律师",
      title: "劳动法律师",
      avatar: "",
      organization: "某某律师事务所",
    },
    updateTime: "2024-02-20",
    viewCount: 8920,
    isRecommended: true,
  },
];

const RegulationInterpretationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("interpretation");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [complianceModalVisible, setComplianceModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [selectedInterpretation, setSelectedInterpretation] = useState<RegulationInterpretation | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 开始合规评估
  const startAssessment = () => {
    if (!selectedIndustry || !selectedSize) {
      message.warning("请选择行业类型和企业规模");
      return;
    }
    setComplianceModalVisible(true);
    setCurrentStep(0);
    setAssessmentResult(null);
  };

  // 完成评估
  const completeAssessment = () => {
    setCurrentStep(2);
    // 模拟评估结果
    setAssessmentResult({
      score: 78,
      level: "良好",
      risks: [
        { name: "劳动用工", level: "medium", count: 3 },
        { name: "数据合规", level: "high", count: 2 },
        { name: "知识产权", level: "low", count: 1 },
      ],
      suggestions: [
        "建议完善劳动合同管理制度",
        "建议建立数据安全保护机制",
        "建议加强知识产权保护",
      ],
    });
  };

  // 查看解读详情
  const viewInterpretationDetail = (interpretation: RegulationInterpretation) => {
    setSelectedInterpretation(interpretation);
    setDetailModalVisible(true);
  };

  // 获取风险等级颜色
  const getRiskLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      high: "red",
      medium: "orange",
      low: "green",
    };
    return colors[level] || "default";
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "red",
      high: "orange",
      medium: "blue",
      low: "default",
    };
    return colors[priority] || "default";
  };

  return (
    <PageWrapper module="legal">
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        <BreadcrumbNav />

        {/* 页面标题 */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
            <BookOutlined style={{ marginRight: 8 }} />
            法规解读与合规建议
          </Title>
          <Paragraph type="secondary" style={{ textAlign: "center" }}>
            专业法条深度解读，行业合规要点分析，定制化合规建议
          </Paragraph>
        </Card>

        {/* 企业信息选择 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>所属行业</Text>
              </div>
              <Select
                placeholder="请选择所属行业"
                style={{ width: "100%" }}
                value={selectedIndustry}
                onChange={setSelectedIndustry}
              >
                {industries.map((ind) => (
                  <Option key={ind.value} value={ind.value}>
                    {ind.icon} {ind.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>企业规模</Text>
              </div>
              <Select
                placeholder="请选择企业规模"
                style={{ width: "100%" }}
                value={selectedSize}
                onChange={setSelectedSize}
              >
                {companySizes.map((size) => (
                  <Option key={size.value} value={size.value}>
                    {size.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>操作</Text>
              </div>
              <Button
                type="primary"
                icon={<SafetyOutlined />}
                size="large"
                block
                onClick={startAssessment}
              >
                获取定制化合规建议
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 主要内容区 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 法规解读 */}
          <TabPane
            tab={
              <span>
                <BookOutlined /> 法规解读
              </span>
            }
            key="interpretation"
          >
            <List
              grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              dataSource={mockInterpretations}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => viewInterpretationDetail(item)}
                    title={
                      <Space>
                        <Text strong>{item.regulationTitle}</Text>
                        {item.isRecommended && (
                          <Badge count="推荐" style={{ backgroundColor: "#52c41a" }} />
                        )}
                      </Space>
                    }
                    extra={<Tag color="blue">{item.articleNumber}</Tag>}
                  >
                    <Paragraph ellipsis={{ rows: 3 }}>
                      {item.interpretation}
                    </Paragraph>
                    <div style={{ marginBottom: 12 }}>
                      <Space wrap>
                        {item.keyPoints.slice(0, 3).map((point, idx) => (
                          <Tag key={idx} size="small">
                            {point}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          <Text type="secondary">{item.expert.name}</Text>
                        </Space>
                      </Col>
                      <Col>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          更新于 {item.updateTime}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          {/* 业务场景 */}
          <TabPane
            tab={
              <span>
                <BulbOutlined /> 业务场景
              </span>
            }
            key="scenarios"
          >
            <Collapse accordion>
              {mockInterpretations.flatMap((interp) =>
                interp.businessScenarios.map((scenario) => (
                  <Panel
                    key={scenario.id}
                    header={
                      <Space>
                        <Text strong>{scenario.title}</Text>
                        <Space wrap>
                          {scenario.applicableIndustries.map((ind) => (
                            <Tag key={ind} size="small">
                              {ind}
                            </Tag>
                          ))}
                        </Space>
                      </Space>
                    }
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div>
                        <Text strong>场景描述：</Text>
                        <Paragraph>{scenario.description}</Paragraph>
                      </div>
                      <div>
                        <Text strong>案例示例：</Text>
                        <Alert
                          message={scenario.caseExample}
                          type="info"
                          showIcon
                        />
                      </div>
                      <div>
                        <Text strong>处理建议：</Text>
                        <Paragraph>{scenario.handlingSuggestion}</Paragraph>
                      </div>
                    </Space>
                  </Panel>
                ))
              )}
            </Collapse>
          </TabPane>

          {/* 风险提示 */}
          <TabPane
            tab={
              <span>
                <WarningOutlined /> 风险提示
              </span>
            }
            key="risks"
          >
            <List
              dataSource={mockInterpretations.flatMap((i) => i.riskWarnings)}
              renderItem={(risk) => (
                <List.Item>
                  <Card style={{ width: "100%" }}>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{risk.title}</Text>
                          <Tag color={getRiskLevelColor(risk.level)}>
                            {risk.level === "high"
                              ? "高风险"
                              : risk.level === "medium"
                              ? "中风险"
                              : "低风险"}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
                          <Paragraph>{risk.description}</Paragraph>
                          <Alert
                            message="法律后果"
                            description={risk.legalConsequences}
                            type="error"
                            showIcon
                          />
                          <div>
                            <Text strong>防范措施：</Text>
                            <ul>
                              {risk.preventionMeasures.map((measure, idx) => (
                                <li key={idx}>{measure}</li>
                              ))}
                            </ul>
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          {/* 合规建议 */}
          <TabPane
            tab={
              <span>
                <CheckCircleOutlined /> 合规建议
              </span>
            }
            key="suggestions"
          >
            <List
              dataSource={mockInterpretations.flatMap((i) => i.complianceSuggestions)}
              renderItem={(sugg) => (
                <List.Item>
                  <Card style={{ width: "100%" }}>
                    <Row gutter={[24, 16]}>
                      <Col xs={24} md={18}>
                        <List.Item.Meta
                          title={
                            <Space>
                              <Text strong>{sugg.title}</Text>
                              <Tag color={getPriorityColor(sugg.priority)}>
                                {sugg.priority === "urgent"
                                  ? "紧急"
                                  : sugg.priority === "high"
                                  ? "高"
                                  : sugg.priority === "medium"
                                  ? "中"
                                  : "低"}
                              </Tag>
                              <Tag>{sugg.category}</Tag>
                            </Space>
                          }
                          description={
                            <Space
                              direction="vertical"
                              style={{ width: "100%", marginTop: 8 }}
                            >
                              <Paragraph>{sugg.description}</Paragraph>
                              <div>
                                <Text strong>实施步骤：</Text>
                                <ol>
                                  {sugg.implementationSteps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            </Space>
                          }
                        />
                      </Col>
                      <Col xs={24} md={6}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div>
                            <Text type="secondary">责任部门</Text>
                            <div>
                              <Text strong>{sugg.responsibleDept}</Text>
                            </div>
                          </div>
                          <div>
                            <Text type="secondary">预计成本</Text>
                            <div>
                              <Text strong>{sugg.estimatedCost}</Text>
                            </div>
                          </div>
                          <div>
                            <Text type="secondary">预计周期</Text>
                            <div>
                              <Text strong>{sugg.timeline}</Text>
                            </div>
                          </div>
                          <Button type="primary" icon={<DownloadOutlined />} block>
                            下载实施方案
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>

        {/* 合规评估弹窗 */}
        <Modal
          title="企业合规评估"
          open={complianceModalVisible}
          onCancel={() => setComplianceModalVisible(false)}
          width={800}
          footer={null}
        >
          <Steps current={currentStep} style={{ marginBottom: 24 }}>
            <Step title="选择评估范围" />
            <Step title="填写企业信息" />
            <Step title="查看评估结果" />
          </Steps>

          {currentStep === 0 && (
            <div>
              <Alert
                message="请选择需要评估的合规领域"
                description="根据您的行业特点，我们推荐以下评估领域"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </div>
          )}
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default RegulationInterpretation;