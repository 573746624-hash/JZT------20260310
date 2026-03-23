/**
 * 法规查询与详情整合模块
 * 创建时间: 2026-03-23
 * 功能: 将法规查询与法规详情功能整合到同一页面，实现无缝切换
 * 特点: 不修改任何现有代码，通过组件组合实现功能整合
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
  Affix,
  Anchor,
  FloatButton,
  Drawer,
} from "antd";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/PageWrapper";
import BreadcrumbNav from "../../../components/common/BreadcrumbNav";
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
  StarFilled,
  EyeOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  FontSizeOutlined,
  ArrowLeftOutlined,
  LinkOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  UpOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  HighlightOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// 启用dayjs插件
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Link: AnchorLink } = Anchor;

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

// 法条接口
interface Article {
  id: string;
  number: string;
  title?: string;
  content: string;
  isCore?: boolean;
  interpretation?: string;
  relatedArticles?: string[];
}

// 章节接口
interface Chapter {
  id: string;
  title: string;
  articles: Article[];
}

// 法规详情接口
interface RegulationDetail {
  id: string;
  title: string;
  publishDate: string;
  effectiveDate: string;
  docNumber: string;
  level: string;
  issuingAuthority: string;
  status: "effective" | "revised" | "abolished";
  category: string;
  tags: string[];
  summary: string;
  chapters: Chapter[];
  relatedRegulations: {
    id: string;
    title: string;
    relation: string;
  }[];
  relatedCases: {
    id: string;
    title: string;
    court: string;
    date: string;
  }[];
}

// 笔记接口
interface Note {
  id: string;
  articleId: string;
  content: string;
  createTime: string;
  tags: string[];
}

// 标注接口
interface Highlight {
  id: string;
  articleId: string;
  startOffset: number;
  endOffset: number;
  color: string;
  note?: string;
}

// 筛选条件接口
interface FilterCriteria {
  keyword: string;
  level: string[];
  field: string[];
  status: string;
  publishOrg: string[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
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
];

// 模拟法规详情数据
const mockRegulationDetails: Record<string, RegulationDetail> = {
  "1": {
    id: "1",
    title: "中华人民共和国公司法（2023修订）",
    publishDate: "2023-12-29",
    effectiveDate: "2024-07-01",
    docNumber: "主席令第十五号",
    level: "法律",
    issuingAuthority: "全国人大常委会",
    status: "effective",
    category: "公司法",
    tags: ["注册资本", "股东权益", "董事会", "监事会", "公司治理"],
    summary:
      "为了规范公司的组织和行为，保护公司、股东、职工和债权人的合法权益，完善中国特色现代企业制度，弘扬企业家精神，维护社会经济秩序，促进社会主义市场经济的发展。",
    chapters: [
      {
        id: "chapter1",
        title: "第一章 总则",
        articles: [
          {
            id: "art1",
            number: "第一条",
            content:
              "为了规范公司的组织和行为，保护公司、股东、职工和债权人的合法权益，完善中国特色现代企业制度，弘扬企业家精神，维护社会经济秩序，促进社会主义市场经济的发展，根据宪法，制定本法。",
            isCore: true,
            interpretation:
              "本条是关于立法目的和立法依据的规定。本次修订增加了'完善中国特色现代企业制度，弘扬企业家精神'的内容。",
          },
          {
            id: "art2",
            number: "第二条",
            content:
              "本法所称公司，是指依照本法在中华人民共和国境内设立的有限责任公司和股份有限公司。",
            interpretation:
              "本条是关于公司类型的规定。我国公司法只调整两种公司形式：有限责任公司和股份有限公司。",
          },
          {
            id: "art3",
            number: "第三条",
            content:
              "公司是企业法人，有独立的法人财产，享有法人财产权。公司以其全部财产对公司的债务承担责任。有限责任公司的股东以其认缴的出资额为限对公司承担责任；股份有限公司的股东以其认购的股份为限对公司承担责任。",
            isCore: true,
            interpretation:
              "本条是关于公司法人地位和股东责任的规定。确立了公司的独立法人地位和股东的有限责任原则。",
            relatedArticles: ["art47", "art48"],
          },
        ],
      },
      {
        id: "chapter2",
        title: "第二章 公司登记",
        articles: [
          {
            id: "art29",
            number: "第二十九条",
            content:
              "设立公司，应当依法向公司登记机关申请设立登记。法律、行政法规规定设立公司必须报经批准的，应当在公司登记前依法办理批准手续。",
            interpretation:
              "本条是关于公司设立登记的规定。确立了公司设立的登记主义原则。",
          },
          {
            id: "art30",
            number: "第三十条",
            content:
              "申请设立公司，应当提交设立登记申请书、公司章程等文件，并对提交材料的真实性、合法性和有效性负责。",
            interpretation:
              "本条是关于公司设立申请材料的规定。申请人需要对材料的真实性负责。",
          },
        ],
      },
      {
        id: "chapter3",
        title: "第三章 有限责任公司的设立和组织机构",
        articles: [
          {
            id: "art47",
            number: "第四十七条",
            content:
              "有限责任公司的注册资本为在公司登记机关登记的全体股东认缴的出资额。全体股东认缴的出资额由股东按照公司章程的规定自公司成立之日起五年内缴足。法律、行政法规以及国务院决定对有限责任公司注册资本实缴、注册资本最低限额、股东出资期限另有规定的，从其规定。",
            isCore: true,
            interpretation:
              "本条是2023年修订的重要条款，确立了有限责任公司注册资本五年实缴制。这是本次修订的重大变化之一。",
            relatedArticles: ["art3", "art48"],
          },
          {
            id: "art48",
            number: "第四十八条",
            content:
              "股东可以用货币出资，也可以用实物、知识产权、土地使用权、股权、债权等可以用货币估价并可以依法转让的非货币财产作价出资；但是，法律、行政法规规定不得作为出资的财产除外。",
            interpretation:
              "本条是关于出资方式的规定。明确了股权、债权等可以作为出资方式。",
            relatedArticles: ["art47"],
          },
        ],
      },
    ],
    relatedRegulations: [
      {
        id: "2",
        title: "中华人民共和国劳动合同法",
        relation: "相关法律",
      },
      {
        id: "3",
        title: "中华人民共和国数据安全法",
        relation: "相关法律",
      },
    ],
    relatedCases: [
      {
        id: "case1",
        title: "某科技公司股东出资纠纷案",
        court: "北京市高级人民法院",
        date: "2023-08-15",
      },
      {
        id: "case2",
        title: "某集团公司公司治理纠纷案",
        court: "上海市第一中级人民法院",
        date: "2023-06-20",
      },
    ],
  },
  "2": {
    id: "2",
    title: "中华人民共和国劳动合同法",
    publishDate: "2012-12-28",
    effectiveDate: "2013-07-01",
    docNumber: "主席令第七十三号",
    level: "法律",
    issuingAuthority: "全国人大常委会",
    status: "effective",
    category: "劳动法",
    tags: ["劳动合同", "试用期", "离职补偿", "社保"],
    summary:
      "为了完善劳动合同制度，明确劳动合同双方当事人的权利和义务，保护劳动者的合法权益，构建和发展和谐稳定的劳动关系。",
    chapters: [
      {
        id: "chapter1",
        title: "第一章 总则",
        articles: [
          {
            id: "art1",
            number: "第一条",
            content:
              "为了完善劳动合同制度，明确劳动合同双方当事人的权利和义务，保护劳动者的合法权益，构建和发展和谐稳定的劳动关系，制定本法。",
            isCore: true,
          },
          {
            id: "art2",
            number: "第二条",
            content:
              "中华人民共和国境内的企业、个体经济组织、民办非企业单位等组织（以下称用人单位）与劳动者建立劳动关系，订立、履行、变更、解除或者终止劳动合同，适用本法。",
          },
        ],
      },
    ],
    relatedRegulations: [
      {
        id: "1",
        title: "中华人民共和国公司法（2023修订）",
        relation: "相关法律",
      },
    ],
    relatedCases: [],
  },
  "3": {
    id: "3",
    title: "中华人民共和国数据安全法",
    publishDate: "2021-06-10",
    effectiveDate: "2021-09-01",
    docNumber: "主席令第八十四号",
    level: "法律",
    issuingAuthority: "全国人大常委会",
    status: "effective",
    category: "网络安全",
    tags: ["数据安全", "数据分类", "风险评估", "应急处置"],
    summary:
      "为了规范数据处理活动，保障数据安全，促进数据开发利用，保护个人、组织的合法权益，维护国家主权、安全和发展利益。",
    chapters: [
      {
        id: "chapter1",
        title: "第一章 总则",
        articles: [
          {
            id: "art1",
            number: "第一条",
            content:
              "为了规范数据处理活动，保障数据安全，促进数据开发利用，保护个人、组织的合法权益，维护国家主权、安全和发展利益，制定本法。",
            isCore: true,
          },
        ],
      },
    ],
    relatedRegulations: [
      {
        id: "4",
        title: "中华人民共和国个人信息保护法",
        relation: "相关法律",
      },
    ],
    relatedCases: [],
  },
  "4": {
    id: "4",
    title: "中华人民共和国个人信息保护法",
    publishDate: "2021-08-20",
    effectiveDate: "2021-11-01",
    docNumber: "主席令第九十一号",
    level: "法律",
    issuingAuthority: "全国人大常委会",
    status: "effective",
    category: "网络安全",
    tags: ["个人信息", "隐私保护", "数据处理", "用户权益"],
    summary:
      "为了保护个人信息权益，规范个人信息处理活动，促进个人信息合理利用。",
    chapters: [
      {
        id: "chapter1",
        title: "第一章 总则",
        articles: [
          {
            id: "art1",
            number: "第一条",
            content:
              "为了保护个人信息权益，规范个人信息处理活动，促进个人信息合理利用，根据宪法，制定本法。",
            isCore: true,
          },
        ],
      },
    ],
    relatedRegulations: [
      {
        id: "3",
        title: "中华人民共和国数据安全法",
        relation: "相关法律",
      },
    ],
    relatedCases: [],
  },
};

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

const RegulationIntegrated: React.FC = () => {
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
  
  // 当前选中的法规ID
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  
  // 法规详情数据
  const [regulationDetail, setRegulationDetail] = useState<RegulationDetail | null>(null);
  
  // 收藏状态
  const [isFavorited, setIsFavorited] = useState(false);
  
  // 字体大小
  const [fontSize, setFontSize] = useState<"small" | "default" | "large">("default");
  
  // 当前阅读章节
  const [activeChapter, setActiveChapter] = useState<string>("");
  
  // 笔记抽屉
  const [noteDrawerVisible, setNoteDrawerVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  // 标注
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [highlightModalVisible, setHighlightModalVisible] = useState(false);
  const [highlightNote, setHighlightNote] = useState("");

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
      case "level":
        const levelOrder = ["法律", "行政法规", "部门规章", "地方性法规", "司法解释"];
        result.sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level));
        break;
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

  // 选择法规
  const selectRegulation = (id: string) => {
    setSelectedRegulationId(id);
    const detail = mockRegulationDetails[id];
    if (detail) {
      setRegulationDetail(detail);
      setActiveChapter(detail.chapters[0]?.id || "");
    }
  };

  // 返回查询页面
  const backToQuery = () => {
    setSelectedRegulationId(null);
    setRegulationDetail(null);
  };

  // 处理收藏
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    message.success(isFavorited ? "已取消收藏" : "收藏成功");
  };

  // 处理添加笔记
  const handleAddNote = () => {
    if (!currentNote.trim() || !selectedArticleId) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      articleId: selectedArticleId,
      content: currentNote,
      createTime: dayjs().format("YYYY-MM-DD HH:mm"),
      tags: [],
    };
    
    setNotes([...notes, newNote]);
    setCurrentNote("");
    message.success("笔记添加成功");
  };

  // 处理添加标注
  const handleAddHighlight = (articleId: string) => {
    setSelectedArticleId(articleId);
    setHighlightModalVisible(true);
  };

  // 保存标注
  const saveHighlight = () => {
    if (!selectedArticleId) return;
    
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      articleId: selectedArticleId,
      startOffset: 0,
      endOffset: 100,
      color: "#ffd591",
      note: highlightNote,
    };
    
    setHighlights([...highlights, newHighlight]);
    setHighlightModalVisible(false);
    setHighlightNote("");
    message.success("标注添加成功");
  };

  // 获取字体大小样式
  const getFontSizeStyle = () => {
    const sizes = {
      small: { fontSize: 14, lineHeight: 1.6 },
      default: { fontSize: 16, lineHeight: 1.8 },
      large: { fontSize: 18, lineHeight: 2 },
    };
    return sizes[fontSize];
  };

  // 渲染法条
  const renderArticle = (article: Article) => (
    <div
      id={article.id}
      className={`article-item ${article.isCore ? "is-core" : ""}`}
      style={{
        padding: "16px",
        marginBottom: "12px",
        background: article.isCore ? "#fff7e6" : "#fafafa",
        borderRadius: "8px",
        border: article.isCore ? "1px solid #ffd591" : "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <Space>
          <Text strong style={{ fontSize: 16 }}>
            {article.number}
          </Text>
          {article.isCore && (
            <Tag color="orange" icon={<StarFilled />}>
              核心条款
            </Tag>
          )}
        </Space>
        <Space>
          <Tooltip title="添加笔记">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedArticleId(article.id);
                setNoteDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="添加标注">
            <Button
              type="text"
              size="small"
              icon={<HighlightOutlined />}
              onClick={() => handleAddHighlight(article.id)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button
              type="text"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(article.content);
                message.success("已复制到剪贴板");
              }}
            />
          </Tooltip>
        </Space>
      </div>

      <Paragraph
        style={{
          ...getFontSizeStyle(),
          marginBottom: article.interpretation ? "12px" : "0",
        }}
      >
        {article.content}
      </Paragraph>

      {article.interpretation && (
        <div
          style={{
            background: "#e6f7ff",
            padding: "12px",
            borderRadius: "6px",
            borderLeft: "3px solid #1890ff",
          }}
        >
          <Text strong style={{ color: "#1890ff" }}>
            <MessageOutlined style={{ marginRight: 4 }} />
            法条解读
          </Text>
          <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
            {article.interpretation}
          </Paragraph>
        </div>
      )}

      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Text type="secondary">
            <LinkOutlined style={{ marginRight: 4 }} />
            相关条款：
            {article.relatedArticles.map((relatedId) => (
              <Button
                key={relatedId}
                type="link"
                size="small"
                onClick={() => {
                  const element = document.getElementById(relatedId);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                第{relatedId.replace("art", "")}条
              </Button>
            ))}
          </Text>
        </div>
      )}

      {/* 显示该条款的笔记 */}
      {notes.filter((n) => n.articleId === article.id).length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Divider style={{ margin: "8px 0" }} />
          <Text type="secondary">
            <PushpinOutlined style={{ marginRight: 4 }} />
            我的笔记：
          </Text>
          {notes
            .filter((n) => n.articleId === article.id)
            .map((note) => (
              <div
                key={note.id}
                style={{
                  background: "#f6ffed",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  marginTop: 8,
                  borderLeft: "3px solid #52c41a",
                }}
              >
                <Text>{note.content}</Text>
                <div style={{ textAlign: "right", marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {note.createTime}
                  </Text>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  // 表格列定义 - 政务简约风格
  const tableColumns: ColumnsType<RegulationItem> = [
    {
      title: "法规名称",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <Tag 
            color={record.level === "法律" ? "blue" : "default"}
            style={{ fontSize: 12 }}
          >
            {record.level}
          </Tag>
        </Space>
      ),
    },
    {
      title: "发布单位",
      dataIndex: "publishOrg",
      key: "publishOrg",
      width: 180,
      render: (text) => <Text style={{ fontSize: 13 }}>{text}</Text>,
    },
    {
      title: "发布日期",
      dataIndex: "publishDate",
      key: "publishDate",
      width: 120,
      sorter: (a, b) => dayjs(a.publishDate).unix() - dayjs(b.publishDate).unix(),
      render: (text) => <Text style={{ fontSize: 13 }}>{text}</Text>,
    },
    {
      title: "法规状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const statusMap = {
          effective: { text: "现行有效", color: "#52c41a" },
          revised: { text: "已修订", color: "#faad14" },
          abolished: { text: "已废止", color: "#bfbfbf" },
        };
        const { text, color } = statusMap[status];
        return <Text style={{ fontSize: 13, color }}>{text}</Text>;
      },
    },
    {
      title: "浏览次数",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      render: (count) => (
        <Text style={{ fontSize: 13 }}>{count.toLocaleString()}次</Text>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => selectRegulation(record.id)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 渲染卡片视图 - 政务简约风格
  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {filteredData.map((item) => (
        <Col xs={24} sm={12} lg={8} key={item.id}>
          <Card
            hoverable
            className="regulation-card"
            onClick={() => selectRegulation(item.id)}
            style={{ height: 220, display: "flex", flexDirection: "column" }}
            bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px" }}
          >
            {/* 头部：法规名称 + 效力层级 */}
            <div style={{ marginBottom: 12 }}>
              <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 8 }}>
                <Text strong style={{ fontSize: 15, lineHeight: 1.4, flex: 1 }}>
                  {item.title}
                </Text>
                <Tag 
                  color={item.level === "法律" ? "blue" : "default"}
                  style={{ fontSize: 12, marginLeft: 8 }}
                >
                  {item.level}
                </Tag>
              </Space>
            </div>
            
            {/* 发布信息 */}
            <div style={{ marginBottom: 12 }}>
              <Space size={16}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  发布单位：{item.publishOrg}
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  发布日期：{item.publishDate}
                </Text>
              </Space>
            </div>
            
            {/* 核心要点 - 一句话概括 */}
            <Paragraph
              ellipsis={{ rows: 1 }}
              type="secondary"
              style={{ fontSize: 13, marginBottom: 12, color: "#666" }}
            >
              {item.summary}
            </Paragraph>
            
            {/* 底部信息 */}
            <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Space size={16}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <EyeOutlined style={{ marginRight: 4 }} />
                    {item.viewCount.toLocaleString()}次浏览
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <DownloadOutlined style={{ marginRight: 4 }} />
                    {item.downloadCount.toLocaleString()}次下载
                  </Text>
                </Space>
                <Button type="link" size="small" style={{ padding: 0 }}>
                  查看详情 →
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // 渲染列表视图 - 政务简约风格
  const renderListView = () => (
    <List
      itemLayout="horizontal"
      dataSource={filteredData}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
          actions={[
            <Button
              type="primary"
              size="small"
              onClick={() => selectRegulation(item.id)}
            >
              查看详情
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 15 }}>
                  {item.title}
                </Text>
                <Tag 
                  color={item.level === "法律" ? "blue" : "default"}
                  style={{ fontSize: 12 }}
                >
                  {item.level}
                </Tag>
              </Space>
            }
            description={
              <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
                <Space size={24}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    发布单位：{item.publishOrg}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    发布日期：{item.publishDate}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    实施日期：{item.effectiveDate}
                  </Text>
                </Space>
                <Paragraph ellipsis={{ rows: 1 }} style={{ fontSize: 13, color: "#666", margin: 0 }}>
                  {item.summary}
                </Paragraph>
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

  // 渲染查询页面
  const renderQueryPage = () => (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
      <BreadcrumbNav />
      
      {/* 页面标题 - 政务简约风格 */}
      <Card style={{ marginBottom: 24, background: "#fafafa" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 8, fontWeight: 500 }}>
            法规查询
          </Title>
          <Text type="secondary">为中小微企业和企事业单位提供权威法规检索服务</Text>
        </div>
        
        {/* 搜索框 */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Input.Search
            placeholder="请输入法规名称、关键词进行搜索..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            enterButton={<Button type="primary">搜索</Button>}
            size="large"
            style={{ marginBottom: 16 }}
          />
        </div>
        
        {/* 快速筛选模板 - 简化样式 */}
        <div style={{ textAlign: "center" }}>
          <Space wrap>
            <Text type="secondary">快速筛选：</Text>
            {filterTemplates.map((template) => (
              <Button
                key={template.id}
                type={activeTemplate === template.id ? "primary" : "default"}
                size="small"
                onClick={() => applyTemplate(template)}
              >
                {template.name}
              </Button>
            ))}
            {activeTemplate && (
              <Button size="small" onClick={resetFilters}>
                清除筛选
              </Button>
            )}
          </Space>
        </div>
      </Card>

      {/* 筛选器和工具栏 - 政务简约风格 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={16}>
            <Space wrap>
              <Select
                mode="multiple"
                placeholder="法规级别"
                style={{ minWidth: 180 }}
                value={filterCriteria.level}
                onChange={(value) =>
                  setFilterCriteria((prev) => ({ ...prev, level: value }))
                }
                maxTagCount={1}
                size="small"
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
                style={{ minWidth: 180 }}
                value={filterCriteria.field}
                onChange={(value) =>
                  setFilterCriteria((prev) => ({ ...prev, field: value }))
                }
                maxTagCount={1}
                size="small"
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
                size="small"
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
                size="small"
              />
            </Space>
          </Col>
          
          <Col xs={24} lg={8} style={{ textAlign: "right" }}>
            <Space>
              <Radio.Group
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
              >
                <Radio.Button value="relevance">相关度</Radio.Button>
                <Radio.Button value="date_desc">最新发布</Radio.Button>
                <Radio.Button value="views">浏览最多</Radio.Button>
              </Radio.Group>
              
              <Radio.Group
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                size="small"
              >
                <Radio.Button value="card">卡片</Radio.Button>
                <Radio.Button value="list">列表</Radio.Button>
                <Radio.Button value="table">表格</Radio.Button>
              </Radio.Group>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 结果统计 - 政务简约风格 */}
      <div style={{ marginBottom: 16, padding: "12px 16px", background: "#f6ffed", borderRadius: "4px", borderLeft: "3px solid #52c41a" }}>
        <Text>
          共找到 <Text strong style={{ color: "#52c41a" }}>{filteredData.length}</Text> 条法规
          {filterCriteria.keyword && (
            <span>，搜索关键词："{filterCriteria.keyword}"</span>
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
  );

  // 渲染详情页面
  const renderDetailPage = () => {
    if (!regulationDetail) {
      return (
        <div style={{ padding: 48, textAlign: "center" }}>
          <Empty description="加载中..." />
        </div>
      );
    }

    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        {/* 面包屑 */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={backToQuery}
            style={{ marginRight: 16 }}
          >
            返回查询
          </Button>
          <Text strong style={{ fontSize: 16 }}>{regulationDetail.title}</Text>
        </div>

        {/* 法规标题卡片 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Space wrap style={{ marginBottom: 12 }}>
                    <Tag color="blue" style={{ fontSize: 14 }}>
                      {regulationDetail.level}
                    </Tag>
                    <Tag color={regulationDetail.status === "effective" ? "success" : "default"}>
                      {regulationDetail.status === "effective" ? "现行有效" : "已废止"}
                    </Tag>
                    {regulationDetail.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                  <Title level={3} style={{ margin: 0 }}>
                    {regulationDetail.title}
                  </Title>
                </div>

                <Paragraph type="secondary">{regulationDetail.summary}</Paragraph>

                <Space wrap size={24}>
                  <Text type="secondary">
                    <BookOutlined style={{ marginRight: 4 }} />
                    发布机关：{regulationDetail.issuingAuthority}
                  </Text>
                  <Text type="secondary">
                    <HistoryOutlined style={{ marginRight: 4 }} />
                    发布日期：{regulationDetail.publishDate}
                  </Text>
                  <Text type="secondary">
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    实施日期：{regulationDetail.effectiveDate}
                  </Text>
                  <Text type="secondary">
                    <FileTextOutlined style={{ marginRight: 4 }} />
                    发文字号：{regulationDetail.docNumber}
                  </Text>
                </Space>
              </Space>
            </Col>

            <Col xs={24} lg={6}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type={isFavorited ? "primary" : "default"}
                  icon={isFavorited ? <StarFilled /> : <StarOutlined />}
                  block
                  onClick={handleFavorite}
                >
                  {isFavorited ? "已收藏" : "收藏法规"}
                </Button>
                <Button icon={<DownloadOutlined />} block>
                  下载全文
                </Button>
                <Button icon={<PrinterOutlined />} block>
                  打印
                </Button>
                <Button icon={<ShareAltOutlined />} block>
                  分享
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* 左侧导航 */}
          <Col xs={24} lg={6}>
            <Affix offsetTop={24}>
              <Card title="法规目录" size="small">
                <Anchor
                  affix={false}
                  onChange={(link) => setActiveChapter(link.replace("#", ""))}
                >
                  {regulationDetail.chapters.map((chapter) => (
                    <AnchorLink
                      key={chapter.id}
                      href={`#${chapter.id}`}
                      title={chapter.title}
                    >
                      {chapter.articles.map((article) => (
                        <AnchorLink
                          key={article.id}
                          href={`#${article.id}`}
                          title={article.number}
                        />
                      ))}
                    </AnchorLink>
                  ))}
                </Anchor>
              </Card>
            </Affix>
          </Col>

          {/* 右侧内容 */}
          <Col xs={24} lg={12}>
            <Card>
              {regulationDetail.chapters.map((chapter) => (
                <div key={chapter.id} id={chapter.id} style={{ marginBottom: 32 }}>
                  <Title level={4} style={{ marginBottom: 16 }}>
                    {chapter.title}
                  </Title>
                  {chapter.articles.map((article) => renderArticle(article))}
                </div>
              ))}
            </Card>
          </Col>

          {/* 右侧信息栏 */}
          <Col xs={24} lg={6}>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              {/* 相关法规 */}
              <Card title="相关法规" size="small">
                <List
                  dataSource={regulationDetail.relatedRegulations}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <a onClick={() => selectRegulation(item.id)}>
                            {item.title}
                          </a>
                        }
                        description={<Tag size="small">{item.relation}</Tag>}
                      />
                    </List.Item>
                  )}
                />
              </Card>

            </Space>
          </Col>
        </Row>

        {/* 笔记抽屉 */}
        <Drawer
          title="我的笔记"
          placement="right"
          width={400}
          open={noteDrawerVisible}
          onClose={() => setNoteDrawerVisible(false)}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <TextArea
              rows={4}
              placeholder="添加新笔记..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
            />
            <Button type="primary" block onClick={handleAddNote}>
              添加笔记
            </Button>

            <Divider />

            <List
              dataSource={notes}
              renderItem={(note) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() =>
                        setNotes(notes.filter((n) => n.id !== note.id))
                      }
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Text strong>
                        第{note.articleId.replace("art", "")}条
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text>{note.content}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {note.createTime}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Space>
        </Drawer>

        {/* 标注弹窗 */}
        <Modal
          title="添加标注"
          open={highlightModalVisible}
          onOk={saveHighlight}
          onCancel={() => setHighlightModalVisible(false)}
        >
          <TextArea
            rows={4}
            placeholder="添加标注说明（可选）..."
            value={highlightNote}
            onChange={(e) => setHighlightNote(e.target.value)}
          />
        </Modal>

        {/* 返回顶部 */}
        <FloatButton.BackTop visibilityHeight={400} />
      </div>
    );
  };

  return (
    <PageWrapper module="legal">
      {selectedRegulationId ? renderDetailPage() : renderQueryPage()}
    </PageWrapper>
  );
};

export default RegulationIntegrated;