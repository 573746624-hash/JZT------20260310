import React, { useState } from "react";
import {
  Card,
  Button,
  Progress,
  List,
  Tag,
  Typography,
  Avatar,
  Tooltip,
  Empty,
  Spin,
  AutoComplete,
  Input,
  message,
  Space,
  Modal,
} from "antd";
import {
  RobotOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EmptyStateOptimized from "../../../components/policy/EmptyStateOptimized";

const { Title, Text, Paragraph } = Typography;

const ASSOCIATED_COMPANIES = [
  "北京智行科技有限公司",
  "北京创新软件有限公司",
  "北京数字未来科技有限公司",
  "北京高新智能技术有限公司",
  "北京未来产业发展有限公司",
];

const MOCK_COMPANY_INFO_MAP: Record<string, any> = {
  北京智行科技有限公司: {
    name: "北京智行科技有限公司",
    industry: "软件和信息技术服务业",
    region: "北京市海淀区",
    size: "小型企业",
    qualification: ["高新技术企业", "专精特新中小企业"],
    completeness: 85,
  },
  北京创新软件有限公司: {
    name: "北京创新软件有限公司",
    industry: "信息传输、软件和信息技术服务业",
    region: "北京市朝阳区",
    size: "中型企业",
    qualification: ["科技型中小企业"],
    completeness: 60,
  },
  北京数字未来科技有限公司: {
    name: "北京数字未来科技有限公司",
    industry: "科学研究和技术服务业",
    region: "北京市丰台区",
    size: "小型企业",
    qualification: ["高新技术企业"],
    completeness: 95,
  },
};

const MOCK_MATCH_RESULTS = [
  {
    id: "match-1",
    title: "北京市高精尖产业发展资金",
    matchScore: 98,
    matchReason: [
      "符合重点支持产业方向",
      "企业注册地符合要求",
      "具有高新技术企业资质",
    ],
    maxAmount: "500万元",
    deadline: "2026-06-30",
  },
  {
    id: "match-2",
    title: "海淀区中小微企业研发补贴",
    matchScore: 92,
    matchReason: ["注册在海淀区", "上一年度研发投入占比>5%"],
    maxAmount: "50万元",
    deadline: "2026-05-15",
  },
  {
    id: "match-3",
    title:
      "北京市首台（套）重大技术装备统筹联席会议办公室关于征集2026年度首台（套）重大技术装备申报项目的通知",
    matchScore: 85,
    matchReason: ["属于高端装备制造领域", "拥有自主知识产权"],
    maxAmount: "200万元",
    deadline: "2026-04-20",
  },
];

const SmartPolicyMatch: React.FC = () => {
  const navigate = useNavigate();
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isUnrecordedModalVisible, setIsUnrecordedModalVisible] = useState(false);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setOptions([]);
      return;
    }
    const filtered = ASSOCIATED_COMPANIES.filter((company) =>
      company.includes(value),
    ).map((company) => ({ value: company }));
    setOptions(filtered);
  };

  const handleSelect = (value: string) => {
    setSearchValue(value);
    const companyInfo = MOCK_COMPANY_INFO_MAP[value];
    if (companyInfo) {
      setSelectedCompany(companyInfo);
      setMatched(false);
    } else {
      // 标记为未收录企业
      setSelectedCompany({
        name: value,
        isUnrecorded: true, // 新增标识
        industry: "未知行业",
        region: "未知区域",
        size: "未知规模",
        qualification: [],
        completeness: 0, // 未收录企业完整度为0
      });
      setMatched(false);
    }
  };

  const startMatching = () => {
    if (!selectedCompany) {
      // 允许输入任意企业名称进行匹配
      if (searchValue.trim()) {
        handleSelect(searchValue.trim());
        setMatching(true);
        setTimeout(() => {
          setMatching(false);
          setMatched(true);
          // 如果是未收录企业，直接弹出遮罩和提示
          if (!MOCK_COMPANY_INFO_MAP[searchValue.trim()]) {
            setIsUnrecordedModalVisible(true);
          }
        }, 2000);
      } else {
        message.warning("请先输入要匹配的企业名称");
      }
      return;
    }
    
    setMatching(true);
    setTimeout(() => {
      setMatching(false);
      setMatched(true);
      // 如果是未收录企业，直接弹出遮罩和提示
      if (selectedCompany.isUnrecorded) {
        setIsUnrecordedModalVisible(true);
      }
    }, 2000);
  };

  return (
    <div className="smart-policy-match">
      {/* Enterprise Input Section */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <AutoComplete
            style={{ width: "100%" }}
            options={options}
            onSelect={handleSelect}
            onSearch={handleSearch}
            value={searchValue}
            placeholder="请输入企业名称"
          >
            <Input
              size="large"
              style={{ height: 50, borderRadius: 8 }}
              prefix={<SearchOutlined style={{ color: "#ccc" }} />}
            />
          </AutoComplete>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={startMatching}
            loading={matching}
            style={{
              height: 50,
              borderRadius: 8,
              padding: "0 32px",
              fontSize: 16,
            }}
          >
            {matched ? "重新匹配" : "立即匹配"}
          </Button>
        </div>
      </div>

      {/* Company Profile Bar */}
      {selectedCompany && !selectedCompany.isUnrecorded && (
        <div
          style={{
            marginBottom: 40,
            padding: "16px 24px",
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space size={16}>
            {selectedCompany.qualification.map((q: string) => (
              <Tag key={q}>{q}</Tag>
            ))}
            <Tag>{selectedCompany.size}</Tag>
            <Tag>{selectedCompany.industry}</Tag>
          </Space>

          <Space size={16} align="center">
            <span style={{ color: "#666" }}>
              信息完整度：
              <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                {selectedCompany.completeness}%
              </span>
              （近三年营收数据）
            </span>
            <Button size="small" onClick={() => navigate("/system/company-management")}>完善信息</Button>
          </Space>
        </div>
      )}

      {/* Matching Results */}
      {matching ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" tip="AI 正在分析您的企业画像..." />
          <div style={{ marginTop: 16, color: "#666" }}>
            正在比对 10,000+ 条政策条款...
          </div>
        </div>
      ) : matched ? (
        <>
          {/* 为了配合弹窗遮罩，我们在背景依然渲染假数据或者不渲染 */}
          <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                filter: selectedCompany?.isUnrecorded ? "blur(4px)" : "none",
                pointerEvents: selectedCompany?.isUnrecorded ? "none" : "auto",
                opacity: selectedCompany?.isUnrecorded ? 0.6 : 1,
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                <RobotOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                为您匹配到 {MOCK_MATCH_RESULTS.length} 条高匹配度政策
              </Title>
            </div>

          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={MOCK_MATCH_RESULTS}
            style={{
              filter: selectedCompany?.isUnrecorded ? "blur(4px)" : "none",
              pointerEvents: selectedCompany?.isUnrecorded ? "none" : "auto",
              opacity: selectedCompany?.isUnrecorded ? 0.6 : 1,
            }}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{
                    borderRadius: 8,
                    borderLeft: `4px solid ${item.matchScore > 90 ? "#52c41a" : "#1890ff"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Tag
                          color={item.matchScore > 90 ? "#52c41a" : "#1890ff"}
                          style={{
                            marginRight: 12,
                            fontSize: 14,
                            padding: "4px 8px",
                          }}
                        >
                          匹配度 {item.matchScore}%
                        </Tag>
                        <Title level={5} style={{ margin: 0 }}>
                          {item.title}
                        </Title>
                      </div>

                      <div
                        style={{
                          background: "#f9f9f9",
                          padding: "12px",
                          borderRadius: 6,
                          marginBottom: 12,
                        }}
                      >
                        <Text
                          strong
                          style={{ display: "block", marginBottom: 4 }}
                        >
                          匹配原因：
                        </Text>
                        <ul
                          style={{ margin: 0, paddingLeft: 20, color: "#666" }}
                        >
                          {item.matchReason.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: "flex", gap: 24, color: "#888" }}>
                        <span>
                          最高支持：
                          <Text type="danger" strong>
                            {item.maxAmount}
                          </Text>
                        </span>
                        <span>申报截止：{item.deadline}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={() =>
                          navigate(`/policy-center/detail/${item.id}`, { state: { policyData: item } })
                        }
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <SearchOutlined
            style={{
              fontSize: 48,
              color: "#1890ff",
              marginBottom: 16,
              opacity: 0.5,
            }}
          />
          <div style={{ color: "#888" }}>请输入关键词进行搜索</div>
        </div>
      )}

      {/* 未收录企业弹窗遮罩 */}
      <Modal
        open={isUnrecordedModalVisible}
        footer={null}
        closable={false}
        maskClosable={false}
        centered
        width={480}
        styles={{ body: { textAlign: "center", padding: "32px 24px" } }}
      >
        <LockOutlined style={{ fontSize: 48, color: "#faad14", marginBottom: 16 }} />
        <Title level={4} style={{ marginBottom: 16 }}>
          企业未收录
        </Title>
        <Paragraph style={{ color: "#666", marginBottom: 24 }}>
          您查询的企业 <Text strong>【{selectedCompany?.name || searchValue}】</Text> 暂未收录在系统中。
          <br />
          为了给您提供精准的政策匹配服务，请联系平台管理员进行企业信息入库。
        </Paragraph>
        
        {/* 多种联系方式区域 */}
        <div style={{ 
          background: "#f9f9f9", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "24px",
          textAlign: "left"
        }}>
          <Title level={5} style={{ marginBottom: 16, fontSize: 14 }}>您可以选择以下方式联系我们：</Title>
          
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {/* 方式一：微信 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: "50%", background: "#e6f7ff", 
                display: "flex", alignItems: "center", justifyContent: "center", color: "#1890ff" 
              }}>
                <WechatOutlined style={{ fontSize: 18 }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text strong>添加专属客服微信</Text>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>微信号：JZT_Service_01</div>
                <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }} onClick={() => message.success("微信号已复制")}>复制微信号</Button>
              </div>
              <img 
                src="/qrcode-zhangbo.png" 
                alt="管理员微信" 
                style={{ width: 64, height: 64, objectFit: "contain", borderRadius: "4px", border: "1px solid #eee" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64.png?text=%E5%BE%AE%E4%BF%A1";
                }}
              />
            </div>
            
            <div style={{ height: 1, background: "#eee", width: "100%" }}></div>

            {/* 方式二：电话 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: "50%", background: "#f6ffed", 
                display: "flex", alignItems: "center", justifyContent: "center", color: "#52c41a" 
              }}>
                <PhoneOutlined style={{ fontSize: 18 }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text strong>拨打服务热线</Text>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>400-888-8888 (工作日 9:00-18:00)</div>
              </div>
            </div>

            <div style={{ height: 1, background: "#eee", width: "100%" }}></div>

            {/* 方式三：邮件 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: "50%", background: "#fff0f6", 
                display: "flex", alignItems: "center", justifyContent: "center", color: "#eb2f96" 
              }}>
                <MailOutlined style={{ fontSize: 18 }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text strong>发送邮件申请入库</Text>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>support@jzt.com</div>
              </div>
              <Button type="link" size="small" onClick={() => message.success("邮箱地址已复制")}>复制</Button>
            </div>
          </Space>
        </div>
        
        <div>
          <Button 
            type="primary" 
            size="large"
            style={{ width: "100%", maxWidth: 200 }}
            onClick={() => {
              setIsUnrecordedModalVisible(false);
              setMatched(false); // 重置匹配状态
            }}
          >
            我知道了，稍后联系
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SmartPolicyMatch;
