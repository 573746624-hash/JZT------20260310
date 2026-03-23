/**
 * 法规详情模块 - 优化版
 * 创建时间: 2026-03-23
 * 功能: 提供法规全文展示、条款导航、关联推荐、标注笔记
 * 优化点: 精准导航、法条关联、标注笔记、阅读进度
 */

import React, { useState, useEffect, useRef } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Typography,
  Space,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Tabs,
  List,
  Tooltip,
  Affix,
  Divider,
  Breadcrumb,
  Anchor,
  Badge,
  Empty,
  Input,
  Modal,
  message,
  Popover,
  FloatButton,
  Drawer,
} from "antd";
import {
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
  DownloadOutlined,
  PrinterOutlined,
  FontSizeOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  FileTextOutlined,
  LinkOutlined,
  EditOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  UpOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  HighlightOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import PageWrapper from "../../../components/PageWrapper";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Link: AnchorLink } = Anchor;

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

// 模拟法规数据
const mockRegulationDetail: RegulationDetail = {
  id: "company-law-2023",
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
        {
          id: "art51",
          number: "第五十一条",
          content:
            "有限责任公司设监事会，本法第六十九条、第八十三条另有规定的除外。监事会成员为三人以上。监事会应当包括股东代表和适当比例的公司职工代表，其中职工代表的比例不得低于三分之一，具体比例由公司章程规定。监事会中的职工代表由公司职工通过职工代表大会、职工大会或者其他形式民主选举产生。",
          isCore: true,
          interpretation:
            "本条是关于有限责任公司监事会的规定。明确了监事会的组成和职工代表比例要求。",
        },
      ],
    },
  ],
  relatedRegulations: [
    {
      id: "company-law-2018",
      title: "中华人民共和国公司法（2018修正）",
      relation: "历史版本",
    },
    {
      id: "company-registration-regulation",
      title: "中华人民共和国公司登记管理条例",
      relation: "配套法规",
    },
    {
      id: "securities-law",
      title: "中华人民共和国证券法",
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
};

const RegulationDetailEnhanced: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 法规数据
  const [regulation, setRegulation] = useState<RegulationDetail | null>(null);
  
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

  // 加载数据
  useEffect(() => {
    // 模拟API调用
    setRegulation(mockRegulationDetail);
    setActiveChapter(mockRegulationDetail.chapters[0]?.id || "");
  }, [id]);

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

  if (!regulation) {
    return (
      <PageWrapper module="legal">
        <div style={{ padding: 48, textAlign: "center" }}>
          <Empty description="加载中..." />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper module="legal">
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        {/* 面包屑 */}
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <a onClick={() => navigate("/legal-support/regulation-query")}>
              法规查询
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{regulation.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* 法规标题卡片 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Space wrap style={{ marginBottom: 12 }}>
                    <Tag color="blue" style={{ fontSize: 14 }}>
                      {regulation.level}
                    </Tag>
                    <Tag color={regulation.status === "effective" ? "success" : "default"}>
                      {regulation.status === "effective" ? "现行有效" : "已废止"}
                    </Tag>
                    {regulation.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                  <Title level={3} style={{ margin: 0 }}>
                    {regulation.title}
                  </Title>
                </div>

                <Paragraph type="secondary">{regulation.summary}</Paragraph>

                <Space wrap size={24}>
                  <Text type="secondary">
                    <BookOutlined style={{ marginRight: 4 }} />
                    发布机关：{regulation.issuingAuthority}
                  </Text>
                  <Text type="secondary">
                    <HistoryOutlined style={{ marginRight: 4 }} />
                    发布日期：{regulation.publishDate}
                  </Text>
                  <Text type="secondary">
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    实施日期：{regulation.effectiveDate}
                  </Text>
                  <Text type="secondary">
                    <FileTextOutlined style={{ marginRight: 4 }} />
                    发文字号：{regulation.docNumber}
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

        {/* 工具栏 */}
        <Card style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Text>字体大小：</Text>
                <Radio.Group
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="small">小</Radio.Button>
                  <Radio.Button value="default">中</Radio.Button>
                  <Radio.Button value="large">大</Radio.Button>
                </Radio.Group>
              </Space>
            </Col>
            <Col>
              <Button
                icon={<EditOutlined />}
                onClick={() => setNoteDrawerVisible(true)}
              >
                我的笔记 ({notes.length})
              </Button>
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
                  {regulation.chapters.map((chapter) => (
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
              {regulation.chapters.map((chapter) => (
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
                  dataSource={regulation.relatedRegulations}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <a
                            onClick={() =>
                              navigate(`/legal-support/regulation-detail/${item.id}`)
                            }
                          >
                            {item.title}
                          </a>
                        }
                        description={<Tag size="small">{item.relation}</Tag>}
                      />
                    </List.Item>
                  )}
                />
              </Card>

              {/* 相关案例 */}
              <Card title="相关案例" size="small">
                <List
                  dataSource={regulation.relatedCases}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <a onClick={() => message.info("查看案例详情")}>
                            {item.title}
                          </a>
                        }
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{item.court}</Text>
                            <Text type="secondary">{item.date}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>

              {/* 快捷操作 */}
              <Card title="快捷操作" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button icon={<QuestionCircleOutlined />} block>
                    咨询AI律师
                  </Button>
                  <Button icon={<ExclamationCircleOutlined />} block>
                    合规建议
                  </Button>
                  <Button icon={<HistoryOutlined />} block>
                    查看修订历史
                  </Button>
                </Space>
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
    </PageWrapper>
  );
};

export default RegulationDetailEnhanced;
