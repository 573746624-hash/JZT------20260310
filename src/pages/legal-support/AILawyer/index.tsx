/**
 * AI律师(璟小多)页面
 * 创建时间: 2026-01-30
 * 功能: 提供智能法律咨询对话服务
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Tabs,
  Button,
  Input,
  Radio,
  Tag,
  Space,
  Avatar,
  message,
  Modal,
  Breadcrumb,
  Tooltip,
  Layout,
  List,
  Divider,
  Typography,
  Collapse,
  Switch,
} from "antd";
const { Sider, Content } = Layout;
const { Text, Title } = Typography;
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  HistoryOutlined,
  ClearOutlined,
  HomeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  StarOutlined,
  FolderOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AudioOutlined,
  PaperClipOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/PageWrapper";
import { getBreadcrumbItems } from "../../../utils/breadcrumbConfig";

const { TextArea } = Input;

// 对话消息类型
interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
  mode?: "normal" | "deep";
  status?: "sending" | "sent" | "failed";
  references?: Reference[];
}

// 引用来源类型
interface Reference {
  id: string;
  type: "regulation" | "case" | "article";
  title: string;
  content: string;
  url?: string;
}

// 对话分类类型
interface ConversationCategory {
  id: string;
  name: string;
  count: number;
}

// 历史对话记录类型
interface HistoryItem {
  id: string;
  title: string;
  mode: "normal" | "deep";
  timestamp: Date;
  messages: Message[];
  category?: string;
  isFavorite?: boolean;
  tags?: string[];
}

// 快捷问题分类
const quickQuestionCategories = {
  "企业设立类": [
    "注册公司需要什么材料？",
    "注册资本需要实缴吗？",
    "如何选择公司类型？",
  ],
  "劳动用工类": [
    "劳动合同必须包含哪些条款？",
    "试用期最长可以约定多久？",
    "解除劳动合同需要支付经济补偿吗？",
  ],
  "知识产权类": [
    "如何申请专利？",
    "商标注册流程是什么？",
    "软件著作权怎么保护？",
  ],
  "税务合规类": [
    "小微企业有哪些税收优惠？",
    "研发费用加计扣除怎么算？",
    "增值税发票怎么开具？",
  ],
  "合同管理类": [
    "合同必须书面形式吗？",
    "违约金怎么约定才有效？",
    "合同纠纷怎么解决？",
  ],
};

// 热门咨询标签
const hotTags = [
  "夫妻共同财产认定标准",
  "如何申请撤销监护权",
  "合伙企业债务承担规则",
  "劳动合同解除补偿",
  "房产继承纠纷处理",
  "公司股权转让流程",
];

// 常见问题
const frequentQuestions = [
  {
    question: "如何使用AI问答功能？",
    answer: "直接在输入框中描述您的法律问题，选择普通或深度分析模式，点击发送即可获得AI回答。",
  },
  {
    question: "AI回答的准确性如何？",
    answer: "AI基于大量法律数据训练，但回答仅供参考，重要法律事务建议咨询专业律师。",
  },
  {
    question: "如何保存重要的问答记录？",
    answer: "点击回答下方的收藏按钮，或在历史记录中标记为收藏。",
  },
];

// 相关法规推荐
const relatedRegulations = [
  {
    id: "1",
    title: "公司法",
    description: "规范公司设立、运营的基本法律",
    relevance: 95,
  },
  {
    id: "2",
    title: "劳动合同法",
    description: "规范劳动关系的专门法律",
    relevance: 88,
  },
  {
    id: "3",
    title: "民法典",
    description: "民事法律关系的基本准则",
    relevance: 82,
  },
];

/**
 * AI律师主页面组件
 */
const AILawyer: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [consultMode, setConsultMode] = useState<"normal" | "deep">("normal");
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [rightSiderCollapsed, setRightSiderCollapsed] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [draftContent, setDraftContent] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [dailyQuestionCount, setDailyQuestionCount] = useState<number>(0);
  const [userType, setUserType] = useState<"guest" | "regular" | "enterprise" | "vip">("regular");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([
    {
      id: "1",
      title: "夫妻共同财产认定标准",
      mode: "normal",
      timestamp: new Date("2026-01-28 19:23"),
      messages: [],
    },
    {
      id: "2",
      title: "如何申请撤销监护权",
      mode: "deep",
      timestamp: new Date("2026-01-27 14:15"),
      messages: [],
    },
    {
      id: "3",
      title: "合伙企业债务承担规则",
      mode: "normal",
      timestamp: new Date("2026-01-26 10:30"),
      messages: [],
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 面包屑配置
  const breadcrumbItems = getBreadcrumbItems("/legal-support/ai-lawyer");

  // 滚动到消息底部
  const scrollToBottom = () => {
    // 只有当消息区域确实有滚动条且不在底部时才滚动
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      // 使用 setTimeout 确保 DOM 更新后再滚动
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isTyping]);

  // 检查使用限制
  const checkUsageLimit = (): boolean => {
    const limits = {
      guest: 5,
      regular: 20,
      enterprise: 100,
      vip: Infinity
    };
    
    const dailyLimit = limits[userType];
    if (dailyQuestionCount >= dailyLimit) {
      Modal.confirm({
        title: "使用次数已达上限",
        content: (
          <div>
            <p>您今日的提问次数已达上限（{dailyLimit}次）。</p>
            <p>升级账户可获得更多使用次数：</p>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>企业用户：100次/日</li>
              <li>VIP用户：无限制</li>
            </ul>
          </div>
        ),
        okText: "了解",
        cancelText: "取消",
        onOk: () => {
          // 跳转到升级页面或联系客服
        },
      });
      return false;
    }
    return true;
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      message.warning("请输入您的法律问题");
      return;
    }

    // 检查使用限制
    if (!checkUsageLimit()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      mode: consultMode,
      status: "sending",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);
    
    // 模拟发送状态更新
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: "sent" }
            : msg
        )
      );
    }, 500);

    // 更新或创建历史记录
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      setCurrentChatId(chatId);
      // 创建新历史记录
      const newHistoryItem: HistoryItem = {
        id: chatId,
        title:
          inputValue.substring(0, 20) + (inputValue.length > 20 ? "..." : ""),
        mode: consultMode,
        timestamp: new Date(),
        messages: newMessages,
      };
      setHistoryList((prev) => [newHistoryItem, ...prev]);
    } else {
      // 更新现有历史记录
      setHistoryList((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                messages: newMessages,
                timestamp: new Date(),
              }
            : item,
        ),
      );
    }

    // 更新使用次数
    setDailyQuestionCount(prev => prev + 1);

    // 模拟AI回复
    setTimeout(() => {
      const { content, references } = generateAIResponse(inputValue, consultMode);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content,
        timestamp: new Date(),
        mode: consultMode,
        references,
      };

      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg.id === userMessage.id && msg.status === "sending"
            ? { ...msg, status: "sent" }
            : msg
        );
        return [...updatedMessages, aiMessage];
      });
      setIsTyping(false);

      // 更新历史记录中的 AI 回复
      setHistoryList((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                messages: [...item.messages, aiMessage],
                timestamp: new Date(),
              }
            : item,
        ),
      );
    }, 1500);
  };

  // 生成AI回复（模拟）
  const generateAIResponse = (
    question: string,
    mode: "normal" | "deep",
  ): { content: string; references: Reference[] } => {
    // 模拟生成引用来源
    const generateReferences = (): Reference[] => {
      const allReferences = [
        {
          id: "ref1",
          type: "regulation" as const,
          title: "中华人民共和国公司法",
          content: "第三条 公司是企业法人，有独立的法人财产，享有法人财产权。公司以其全部财产对公司的债务承担责任。",
          url: "/legal-support/regulation-detail/company-law",
        },
        {
          id: "ref2",
          type: "regulation" as const,
          title: "中华人民共和国劳动合同法",
          content: "第十条 建立劳动关系，应当订立书面劳动合同。已建立劳动关系，未同时订立书面劳动合同的，应当自用工之日起一个月内订立书面劳动合同。",
          url: "/legal-support/regulation-detail/labor-contract-law",
        },
        {
          id: "ref3",
          type: "case" as const,
          title: "某公司劳动争议案例",
          content: "本案中，法院认定用人单位未按规定支付加班费，应当承担相应的法律责任。此案例对类似纠纷具有重要参考价值。",
          url: "/legal-support/case-detail/labor-dispute-001",
        },
      ];
      
      // 根据问题内容随机返回1-2个相关引用
      const shuffled = allReferences.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.random() > 0.5 ? 2 : 1);
    };

    const references = generateReferences();

    if (mode === "deep") {
      return {
        content: `针对您的问题"${question}"，我为您提供深度分析：

## 📋 直接回答
根据相关法律法规，您的问题涉及多个重要法律条款和实务操作要点。

## 📚 法律依据
• 主要适用法律：相关法律法规第X条规定...
• 配套规定：实施细则第Y条明确...
• 司法解释：最高法院相关解释...

## 🔍 详细解释
1. **适用条件**：需要满足以下条件...
2. **操作流程**：具体步骤包括...
3. **注意事项**：特别需要关注...

## 📋 操作指引
**第一步**：准备相关材料
**第二步**：提交申请或办理手续
**第三步**：等待审核结果
**第四步**：后续跟进处理

## ⚠️ 风险提示
• 可能存在的法律风险...
• 需要特别注意的时效问题...
• 建议采取的预防措施...

## 🔗 延伸阅读
您可能还关心：
• 相关问题的处理方式
• 类似案例的参考价值
• 最新政策变化影响

**免责声明**：以上回答仅供参考，不构成正式法律意见。重要法律事务建议咨询专业律师。`,
        references,
      };
    } else {
      return {
        content: `您好！关于您提到的"${question}"问题，我为您提供以下解答：

## 📋 简要回答
根据相关法律规定，您可以采取以下措施：

**1. 协商解决**
• 首先尝试与相关方进行友好协商
• 明确各方权利义务关系

**2. 证据收集**
• 收集相关证据材料
• 保存重要文件和记录

**3. 寻求帮助**
• 必要时寻求法律援助
• 咨询专业律师意见

## 💡 建议
如需更详细的法律指导，建议您：
• 选择"深度分析"模式获得更全面的解答
• 咨询专业律师获得个性化建议

**免责声明**：此回答仅供参考，不构成正式法律意见。`,
        references,
      };
    }
  };

  // 新对话
  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setCurrentChatId(""); // 重置当前会话ID
  };

  // 清空历史记录
  const handleClearHistory = () => {
    Modal.confirm({
      title: "确认清空",
      content: "确定要清空所有历史对话记录吗？此操作不可恢复。",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        setHistoryList([]);
        message.success("历史记录已清空");
      },
    });
  };

  // 加载历史对话
  const loadHistory = (historyItem: HistoryItem) => {
    setMessages(historyItem.messages);
    setConsultMode(historyItem.mode);
    setCurrentChatId(historyItem.id); // 设置当前会话ID
    setActiveTab("chat");
  };

  // 删除单个历史记录
  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这条对话记录吗？此操作不可恢复。",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        setHistoryList((prev) => prev.filter((item) => item.id !== id));
        message.success("记录已删除");
      },
    });
  };

  // 点击热门标签
  const handleTagClick = (tag: string) => {
    setInputValue(tag);
    setDraftContent(tag); // 同步草稿
  };

  // 草稿保存
  const saveDraft = () => {
    if (inputValue.trim()) {
      setDraftContent(inputValue);
      localStorage.setItem('ai-lawyer-draft', inputValue);
      message.success('草稿已保存');
    }
  };

  // 加载草稿
  const loadDraft = () => {
    const draft = localStorage.getItem('ai-lawyer-draft');
    if (draft) {
      setInputValue(draft);
      setDraftContent(draft);
      message.success('草稿已加载');
    } else {
      message.info('暂无草稿');
    }
  };

  // 语音输入
  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      message.success('语音输入结束');
      // 这里应该集成语音识别API
    } else {
      setIsRecording(true);
      message.info('开始语音输入...');
      // 模拟语音输入
      setTimeout(() => {
        setIsRecording(false);
        const mockVoiceText = '这是模拟的语音输入内容';
        setInputValue(prev => prev + mockVoiceText);
        message.success('语音输入完成');
      }, 3000);
    }
  };

  // 附件上传
  const handleFileUpload = (file: File) => {
    if (attachments.length >= 3) {
      message.warning('最多只能上传3个附件');
      return false;
    }
    setAttachments(prev => [...prev, file]);
    message.success(`已添加附件：${file.name}`);
    return false; // 阻止默认上传行为
  };

  // 删除附件
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    message.success('附件已删除');
  };

  // 输入框变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      setInputValue(value);
      // 自动保存草稿
      if (value.trim()) {
        setDraftContent(value);
        localStorage.setItem('ai-lawyer-draft', value);
      }
    } else {
      message.warning('输入内容不能超过2000字符');
    }
  };

  const items = [
    {
      key: "chat",
      label: "智能咨询",
    },
    {
      key: "history",
      label: "历史记录",
    },
  ];

  return (
    <PageWrapper module="legal">
      {/* 三栏布局容器 */}
      <Layout
        style={{
          margin: "0 24px 24px 24px",
          height: "calc(100vh - 140px)",
          background: "transparent",
        }}
      >
        {/* 左侧边栏 - 导航菜单 */}
        <Sider
          width={240}
          style={{
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            marginRight: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "16px 0",
            }}
          >
          {/* Logo 区域 */}
          <div
            style={{
              padding: "0 20px 20px 20px",
              borderBottom: "1px solid #f0f0f0",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#1890ff",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <RobotOutlined style={{ fontSize: "20px" }} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#262626",
              }}
            >
              AI 璟小多
            </h3>
          </div>

          {/* 菜单区域 */}
          <div
            style={{
              padding: "0 12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: activeTab === "chat" ? "#e6f7ff" : "transparent",
                color: activeTab === "chat" ? "#1890ff" : "#666",
                fontWeight: activeTab === "chat" ? 500 : "normal",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveTab("chat")}
            >
              <SendOutlined />
              智能咨询
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: activeTab === "history" ? "#e6f7ff" : "transparent",
                color: activeTab === "history" ? "#1890ff" : "#666",
                fontWeight: activeTab === "history" ? 500 : "normal",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveTab("history")}
            >
              <HistoryOutlined />
              历史记录
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: activeTab === "favorites" ? "#e6f7ff" : "transparent",
                color: activeTab === "favorites" ? "#1890ff" : "#666",
                fontWeight: activeTab === "favorites" ? 500 : "normal",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveTab("favorites")}
            >
              <StarOutlined />
              收藏夹
            </div>
          </div>

          {/* 搜索和分类区域 */}
          {(activeTab === "history" || activeTab === "favorites") && (
            <div style={{ padding: "16px 12px", borderTop: "1px solid #f0f0f0" }}>
              {/* 搜索框 */}
              <Input
                placeholder="搜索对话记录..."
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ marginBottom: "12px" }}
                size="small"
              />
              
              {/* 分类筛选 */}
              <div style={{ marginBottom: "8px" }}>
                <Text style={{ fontSize: "12px", color: "#999" }}>分类筛选</Text>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <Tag.CheckableTag
                  checked={selectedCategory === ""}
                  onChange={() => setSelectedCategory("")}
                  style={{ fontSize: "11px", padding: "2px 8px" }}
                >
                  全部
                </Tag.CheckableTag>
                {Object.keys(quickQuestionCategories).map((category) => (
                  <Tag.CheckableTag
                    key={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                    style={{ fontSize: "11px", padding: "2px 8px" }}
                  >
                    {category.replace("类", "")}
                  </Tag.CheckableTag>
                ))}
              </div>
            </div>
          )}
        </div>
        </Sider>

        {/* 中间主内容区域 */}
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginRight: rightSiderCollapsed ? "0" : "16px",
          }}
        >
          {/* 头部区域 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: "1px solid #f0f0f0",
              height: "64px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "14px", color: "#666" }}>
                DeepSeek-V3.2
              </span>
              <Tag color="green" style={{ margin: 0 }}>
                已在线
              </Tag>
              {/* 使用次数显示 */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#999" }}>
                  今日已提问: {dailyQuestionCount}/
                  {userType === "guest" ? "5" : 
                   userType === "regular" ? "20" : 
                   userType === "enterprise" ? "100" : "无限"}
                </span>
                {dailyQuestionCount >= (userType === "guest" ? 5 : userType === "regular" ? 20 : userType === "enterprise" ? 100 : Infinity) && (
                  <Tag color="orange" size="small">
                    已达上限
                  </Tag>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* 用户类型显示 */}
              <Tag color={userType === "vip" ? "gold" : userType === "enterprise" ? "blue" : "default"}>
                {userType === "guest" ? "游客" : 
                 userType === "regular" ? "普通用户" : 
                 userType === "enterprise" ? "企业用户" : "VIP用户"}
              </Tag>
              {activeTab === "chat" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleNewChat}
                  style={{ borderRadius: "6px" }}
                >
                  新对话
                </Button>
              )}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {activeTab === "chat" ? (
              // 聊天视图
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        maxWidth: "600px",
                        padding: "0 24px",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "#f0f5ff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 24px",
                          color: "#1890ff",
                        }}
                      >
                        <RobotOutlined style={{ fontSize: "32px" }} />
                      </div>
                      <h3
                        style={{
                          color: "#333",
                          marginBottom: "16px",
                          fontSize: "20px",
                        }}
                      >
                        您好，我是您的智能法律顾问"璟小多"
                      </h3>
                      <p style={{ color: "#666", marginBottom: "16px" }}>
                        我可以为您解答法律疑问、分析案件风险、提供专业建议。请直接在下方输入您的问题。
                      </p>
                      
                      {/* 免责声明 */}
                      <div
                        style={{
                          background: "#fff7e6",
                          border: "1px solid #ffd591",
                          borderRadius: "6px",
                          padding: "12px",
                          marginBottom: "24px",
                          fontSize: "12px",
                          color: "#d46b08",
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                          ⚠️ 免责声明
                        </div>
                        <div>
                          AI回答仅供参考，不构成正式法律意见。重要法律事务请咨询专业律师。
                          本系统不承担因使用AI建议而产生的任何法律后果。
                        </div>
                      </div>

                      <div style={{ textAlign: "left" }}>
                        {/* 快捷问题分类展示 */}
                        <div style={{ marginBottom: "24px" }}>
                          <div
                            style={{
                              marginBottom: "12px",
                              color: "#999",
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            快捷问题：
                            <Button
                              type="link"
                              size="small"
                              style={{ fontSize: "11px", padding: 0 }}
                              onClick={() => {
                                // 展开所有分类
                                const allQuestions = Object.values(quickQuestionCategories).flat();
                                const randomQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
                                setInputValue(randomQuestions[0]);
                              }}
                            >
                              随机推荐
                            </Button>
                          </div>
                          
                          <Collapse
                            ghost
                            size="small"
                            items={Object.entries(quickQuestionCategories).map(([category, questions]) => ({
                              key: category,
                              label: (
                                <span style={{ fontSize: "13px", fontWeight: 500 }}>
                                  {category} ({questions.length})
                                </span>
                              ),
                              children: (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  {questions.map((question) => (
                                    <div
                                      key={question}
                                      style={{
                                        padding: "8px 12px",
                                        background: "#f8f9fa",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        lineHeight: "1.4",
                                        transition: "all 0.2s",
                                        border: "1px solid transparent",
                                      }}
                                      onClick={() => handleTagClick(question)}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#e6f7ff";
                                        e.currentTarget.style.borderColor = "#1890ff";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#f8f9fa";
                                        e.currentTarget.style.borderColor = "transparent";
                                      }}
                                    >
                                      {question}
                                    </div>
                                  ))}
                                </div>
                              ),
                            }))}
                          />
                        </div>

                        {/* 热门咨询标签 */}
                        <div>
                          <div
                            style={{
                              marginBottom: "12px",
                              color: "#999",
                              fontSize: "12px",
                            }}
                          >
                            热门咨询：
                          </div>
                          <Space wrap>
                            {hotTags.map((tag) => (
                              <Tag
                                key={tag}
                                style={{
                                  cursor: "pointer",
                                  padding: "4px 12px",
                                  height: "28px",
                                  lineHeight: "20px",
                                  background: "#f5f5f5",
                                  border: "none",
                                  borderRadius: "4px",
                                  marginBottom: "8px",
                                  fontSize: "13px",
                                }}
                                onClick={() => handleTagClick(tag)}
                              >
                                {tag}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "24px",
                      background: "#fff",
                    }}
                  >
                    {messages.map((message) => (
                      <div key={message.id} style={{ marginBottom: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              message.type === "user"
                                ? "flex-end"
                                : "flex-start",
                            alignItems: "flex-start",
                            gap: "12px",
                          }}
                        >
                          {message.type === "ai" && (
                            <Avatar
                              icon={<RobotOutlined />}
                              style={{
                                backgroundColor: "#1890ff",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div
                            style={{
                              maxWidth: "75%",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            {/* 主要消息内容 */}
                            <div
                              style={{
                                padding: "12px 16px",
                                borderRadius:
                                  message.type === "user"
                                    ? "12px 0 12px 12px"
                                    : "0 12px 12px 12px",
                                background:
                                  message.type === "user" ? "#1890ff" : "#f5f7fa",
                                color: message.type === "user" ? "#fff" : "#333",
                                lineHeight: "1.6",
                                position: "relative",
                              }}
                            >
                              <div style={{ whiteSpace: "pre-line" }}>
                                {message.content}
                              </div>
                              
                              {/* 消息状态指示 */}
                              {message.type === "user" && message.status && (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "-20px",
                                    right: "0",
                                    fontSize: "11px",
                                    color: "#999",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  {message.status === "sending" && (
                                    <>
                                      <div className="loading-dot" />
                                      发送中...
                                    </>
                                  )}
                                  {message.status === "sent" && (
                                    <>
                                      ✓ 已发送
                                    </>
                                  )}
                                  {message.status === "failed" && (
                                    <>
                                      ✗ 发送失败
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* 引用卡片 */}
                            {message.references && message.references.length > 0 && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {message.references.map((ref) => (
                                  <Card
                                    key={ref.id}
                                    size="small"
                                    style={{
                                      borderRadius: "8px",
                                      border: "1px solid #e6f7ff",
                                      background: "#f6ffed",
                                      cursor: "pointer",
                                      transition: "all 0.2s",
                                    }}
                                    hoverable
                                    onClick={() => {
                                      if (ref.url) {
                                        window.open(ref.url, '_blank');
                                      }
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                      <div
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: "4px",
                                          background: "#52c41a",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          flexShrink: 0,
                                        }}
                                      >
                                        <BookOutlined style={{ fontSize: "12px", color: "#fff" }} />
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "13px",
                                            marginBottom: "4px",
                                            color: "#262626",
                                          }}
                                        >
                                          {ref.title}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            lineHeight: "1.4",
                                            overflow: "hidden",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                          }}
                                        >
                                          {ref.content}
                                        </div>
                                        <Tag
                                          size="small"
                                          color={ref.type === "regulation" ? "blue" : ref.type === "case" ? "green" : "orange"}
                                          style={{ marginTop: "4px" }}
                                        >
                                          {ref.type === "regulation" ? "法规" : ref.type === "case" ? "案例" : "文章"}
                                        </Tag>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}

                            {/* AI消息操作按钮 */}
                            {message.type === "ai" && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  alignItems: "center",
                                  marginTop: "4px",
                                }}
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<StarOutlined />}
                                  style={{ fontSize: "12px", height: "24px" }}
                                  onClick={() => {
                                    message.success("已收藏此回答");
                                  }}
                                >
                                  收藏
                                </Button>
                                <Button
                                  type="text"
                                  size="small"
                                  style={{ fontSize: "12px", height: "24px" }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(message.content);
                                    message.success("已复制到剪贴板");
                                  }}
                                >
                                  复制
                                </Button>
                                <Button
                                  type="text"
                                  size="small"
                                  style={{ fontSize: "12px", height: "24px" }}
                                  onClick={() => {
                                    // 生成分享链接逻辑
                                    message.success("分享链接已生成");
                                  }}
                                >
                                  分享
                                </Button>
                                <div style={{ fontSize: "11px", color: "#999", marginLeft: "auto" }}>
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            )}
                          </div>
                          {message.type === "user" && (
                            <Avatar
                              icon={<UserOutlined />}
                              style={{
                                backgroundColor: "#87d068",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Avatar
                          icon={<RobotOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                        <div
                          style={{
                            padding: "12px 16px",
                            background: "#f5f7fa",
                            borderRadius: "0 12px 12px 12px",
                            color: "#666",
                          }}
                        >
                          正在思考中...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* 输入区域 */}
                <div
                  style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", background: "#fff" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{ fontSize: "14px", color: "#666" }}>
                            咨询模式：
                          </span>
                          <span style={{ fontSize: "13px", color: consultMode === "normal" ? "#1890ff" : "#999" }}>
                            普通咨询
                          </span>
                          <Switch
                            checked={consultMode === "deep"}
                            onChange={(checked) => setConsultMode(checked ? "deep" : "normal")}
                            size="small"
                          />
                          <span style={{ fontSize: "13px", color: consultMode === "deep" ? "#1890ff" : "#999" }}>
                            深度分析
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: inputValue.length > 1800 ? "#ff4d4f" : "#999" }}>
                            {inputValue.length}/2000
                          </span>
                          <Button
                            type="text"
                            size="small"
                            icon={<SaveOutlined />}
                            onClick={saveDraft}
                            disabled={!inputValue.trim()}
                            title="保存草稿"
                          />
                          <Button
                            type="text"
                            size="small"
                            onClick={loadDraft}
                            title="加载草稿"
                          >
                            草稿
                          </Button>
                        </div>
                      </div>
                      
                      {/* 附件显示 */}
                      {attachments.length > 0 && (
                        <div style={{ marginBottom: "8px" }}>
                          <Space wrap>
                            {attachments.map((file, index) => (
                              <Tag
                                key={index}
                                closable
                                onClose={() => removeAttachment(index)}
                                style={{ marginBottom: "4px" }}
                              >
                                <PaperClipOutlined style={{ marginRight: "4px" }} />
                                {file.name}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                      
                      <TextArea
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="请详细描述您的法律问题..."
                        rows={3}
                        style={{
                          borderRadius: "8px",
                          resize: "none",
                        }}
                        onPressEnter={(e) => {
                          if (e.shiftKey) {
                            return;
                          }
                          e.preventDefault();
                          handleSendMessage();
                        }}
                      />
                      
                      {/* 输入工具栏 */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            type="text"
                            size="small"
                            icon={<AudioOutlined />}
                            onClick={handleVoiceInput}
                            loading={isRecording}
                            style={{
                              color: isRecording ? "#ff4d4f" : "#666",
                            }}
                          >
                            {isRecording ? "录音中..." : "语音输入"}
                          </Button>
                          <Button
                            type="text"
                            size="small"
                            icon={<PaperClipOutlined />}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = '.pdf,.doc,.docx,.txt,.jpg,.png';
                              input.onchange = (e) => {
                                const files = (e.target as HTMLInputElement).files;
                                if (files) {
                                  Array.from(files).forEach(file => {
                                    handleFileUpload(file);
                                  });
                                }
                              };
                              input.click();
                            }}
                          >
                            附件 ({attachments.length}/3)
                          </Button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                          <div style={{ fontSize: "11px", color: "#999" }}>
                            Shift + Enter 换行，Enter 发送
                          </div>
                          {userType === "guest" && (
                            <div style={{ fontSize: "10px", color: "#ff4d4f" }}>
                              游客用户每日仅可提问5次
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      loading={isTyping}
                      style={{ borderRadius: "6px", padding: "0 24px" }}
                    >
                      发送
                    </Button>
                  </div>
                </div>
              </div>
            ) : activeTab === "history" ? (
              // 历史记录视图
              <div
                style={{ padding: "24px", overflowY: "auto", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>历史咨询记录</h3>
                  <Button
                    icon={<ClearOutlined />}
                    onClick={handleClearHistory}
                    disabled={historyList.length === 0}
                  >
                    清空历史
                  </Button>
                </div>

                {(() => {
                  // 过滤历史记录
                  const filteredHistory = historyList.filter((item) => {
                    const matchesSearch = !searchValue || 
                      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                      item.messages.some(msg => msg.content.toLowerCase().includes(searchValue.toLowerCase()));
                    const matchesCategory = !selectedCategory || item.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  });

                  return filteredHistory.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 0",
                        color: "#999",
                      }}
                    >
                      {searchValue || selectedCategory ? "未找到匹配的记录" : "暂无历史记录"}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="group"
                        style={{ position: "relative" }}
                      >
                        <Card
                          hoverable
                          style={{ borderRadius: "8px" }}
                          onClick={() => loadHistory(item)}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ display: "flex", gap: "8px" }}>
                              <Tag
                                color={item.mode === "deep" ? "blue" : "green"}
                              >
                                {item.mode === "deep" ? "深度分析" : "普通咨询"}
                              </Tag>
                              {item.isFavorite && (
                                <Tag color="gold" icon={<StarOutlined />}>
                                  收藏
                                </Tag>
                              )}
                            </div>
                            <span style={{ color: "#999", fontSize: "12px" }}>
                              {item.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <h4
                            style={{
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginBottom: "8px",
                              paddingRight: "24px",
                            }}
                          >
                            {item.title}
                          </h4>
                          <div
                            style={{
                              color: "#666",
                              fontSize: "13px",
                              height: "40px",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item.messages[0]?.content || "无内容"}
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div style={{ marginTop: "8px" }}>
                              {item.tags.map((tag) => (
                                <Tag key={tag} size="small" style={{ marginBottom: "4px" }}>
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          )}
                        </Card>

                        <div
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "8px",
                            display: "flex",
                            gap: "4px",
                            opacity: 0,
                            transition: "opacity 0.2s",
                          }}
                          className="action-buttons"
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<StarOutlined />}
                            style={{
                              background: "rgba(255,255,255,0.9)",
                              color: item.isFavorite ? "#faad14" : "#666",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryList(prev => 
                                prev.map(h => 
                                  h.id === item.id 
                                    ? { ...h, isFavorite: !h.isFavorite }
                                    : h
                                )
                              );
                            }}
                          />
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            style={{
                              background: "rgba(255,255,255,0.9)",
                            }}
                            onClick={(e) => handleDeleteHistory(e, item.id)}
                          />
                        </div>
                      </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              // 收藏夹视图
              <div
                style={{ padding: "24px", overflowY: "auto", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>我的收藏</h3>
                  <Button
                    icon={<ClearOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: "确认清空",
                        content: "确定要清空所有收藏记录吗？此操作不可恢复。",
                        okText: "确定",
                        cancelText: "取消",
                        onOk: () => {
                          setHistoryList(prev => prev.map(item => ({ ...item, isFavorite: false })));
                          message.success("收藏已清空");
                        },
                      });
                    }}
                    disabled={!historyList.some(item => item.isFavorite)}
                  >
                    清空收藏
                  </Button>
                </div>

                {(() => {
                  // 过滤收藏记录
                  const favoriteItems = historyList.filter((item) => {
                    const isFavorite = item.isFavorite;
                    const matchesSearch = !searchValue || 
                      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                      item.messages.some(msg => msg.content.toLowerCase().includes(searchValue.toLowerCase()));
                    const matchesCategory = !selectedCategory || item.category === selectedCategory;
                    return isFavorite && matchesSearch && matchesCategory;
                  });

                  return favoriteItems.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 0",
                        color: "#999",
                      }}
                    >
                      <StarOutlined style={{ fontSize: "48px", marginBottom: "16px", display: "block" }} />
                      {searchValue || selectedCategory ? "未找到匹配的收藏" : "暂无收藏记录"}
                      <div style={{ marginTop: "8px", fontSize: "12px" }}>
                        在对话记录中点击星标按钮即可收藏
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {favoriteItems.map((item) => (
                        <div
                          key={item.id}
                          className="group"
                          style={{ position: "relative" }}
                        >
                          <Card
                            hoverable
                            style={{ borderRadius: "8px", border: "2px solid #faad14" }}
                            onClick={() => loadHistory(item)}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "12px",
                              }}
                            >
                              <div style={{ display: "flex", gap: "8px" }}>
                                <Tag
                                  color={item.mode === "deep" ? "blue" : "green"}
                                >
                                  {item.mode === "deep" ? "深度分析" : "普通咨询"}
                                </Tag>
                                <Tag color="gold" icon={<StarOutlined />}>
                                  收藏
                                </Tag>
                              </div>
                              <span style={{ color: "#999", fontSize: "12px" }}>
                                {item.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <h4
                              style={{
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginBottom: "8px",
                                paddingRight: "24px",
                              }}
                            >
                              {item.title}
                            </h4>
                            <div
                              style={{
                                color: "#666",
                                fontSize: "13px",
                                height: "40px",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.messages[0]?.content || "无内容"}
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div style={{ marginTop: "8px" }}>
                                {item.tags.map((tag) => (
                                  <Tag key={tag} size="small" style={{ marginBottom: "4px" }}>
                                    {tag}
                                  </Tag>
                                ))}
                              </div>
                            )}
                          </Card>

                          <Button
                            type="text"
                            size="small"
                            icon={<StarOutlined />}
                            style={{
                              position: "absolute",
                              right: "8px",
                              top: "8px",
                              background: "rgba(255,255,255,0.9)",
                              color: "#faad14",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryList(prev => 
                                prev.map(h => 
                                  h.id === item.id 
                                    ? { ...h, isFavorite: false }
                                    : h
                                )
                              );
                              message.success("已取消收藏");
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </Content>

        {/* 右侧边栏 - 功能辅助区域 */}
        {!rightSiderCollapsed && (
          <Sider
            width={280}
            style={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "16px 0",
              }}
            >
              {/* 折叠按钮 */}
              <div
                style={{
                  padding: "0 16px 16px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  marginBottom: "16px",
                }}
              >
                <Button
                  type="text"
                  icon={<MenuFoldOutlined />}
                  onClick={() => setRightSiderCollapsed(true)}
                  style={{ float: "right" }}
                />
                <div style={{ clear: "both" }} />
              </div>

              {/* 相关法规推荐 */}
              <div style={{ padding: "0 16px", marginBottom: "24px" }}>
                <Title level={5} style={{ marginBottom: "12px" }}>
                  <BookOutlined style={{ marginRight: "8px" }} />
                  相关法规
                </Title>
                <List
                  size="small"
                  dataSource={relatedRegulations}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: "8px 0",
                        cursor: "pointer",
                        borderRadius: "4px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 500,
                            marginBottom: "4px",
                            fontSize: "13px",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: "12px",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.description}
                        </div>
                        <div style={{ marginTop: "4px" }}>
                          <Tag size="small" color="blue">
                            相关度 {item.relevance}%
                          </Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>

              {/* 常见问题 */}
              <div style={{ padding: "0 16px", marginBottom: "24px" }}>
                <Title level={5} style={{ marginBottom: "12px" }}>
                  <QuestionCircleOutlined style={{ marginRight: "8px" }} />
                  常见问题
                </Title>
                <Collapse
                  ghost
                  size="small"
                  items={frequentQuestions.map((item, index) => ({
                    key: index.toString(),
                    label: (
                      <span style={{ fontSize: "13px" }}>{item.question}</span>
                    ),
                    children: (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {item.answer}
                      </div>
                    ),
                  }))}
                />
              </div>

              {/* 使用指南 */}
              <div style={{ padding: "0 16px", flex: 1 }}>
                <Title level={5} style={{ marginBottom: "12px" }}>
                  <InfoCircleOutlined style={{ marginRight: "8px" }} />
                  使用指南
                </Title>
                <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.6" }}>
                  <div style={{ marginBottom: "8px" }}>
                    • 详细描述您的法律问题，AI会提供更准确的回答
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    • 选择"深度分析"模式获得更专业的法律建议
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    • 点击回答中的法规引用可查看完整条文
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    • 重要回答可收藏保存，方便后续查看
                  </div>
                  <Divider style={{ margin: "12px 0" }} />
                  <div style={{ color: "#ff4d4f", fontSize: "11px" }}>
                    ⚠️ 免责声明：AI回答仅供参考，不构成正式法律意见。重要法律事务请咨询专业律师。
                  </div>
                </div>
              </div>
            </div>
          </Sider>
        )}

        {/* 右侧边栏折叠时的展开按钮 */}
        {rightSiderCollapsed && (
          <div
            style={{
              position: "fixed",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1000,
            }}
          >
            <Button
              type="primary"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setRightSiderCollapsed(false)}
              style={{
                borderRadius: "4px 0 0 4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}
      </Layout>
    </PageWrapper>
  );
};

export default AILawyer;
