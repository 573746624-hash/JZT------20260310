/**
 * 法规模拟数据生成器
 * 生成100条法规数据用于测试和展示
 */

import type { RegulationItem } from "../../../components/legal/RegulationCard";

// 法规标题模板
const regulationTitles = [
  "中华人民共和国{field}法",
  "中华人民共和国{field}法（{year}修订）",
  "{field}管理条例",
  "{field}实施细则",
  "{field}暂行办法",
  "关于{field}的若干规定",
  "{field}监督管理办法",
  "{field}暂行条例",
  "{field}管理办法（试行）",
  "{field}规范指引",
];

// 法律领域
const lawFields = [
  "公司", "合同", "劳动", "知识产权", "数据安全", "个人信息保护",
  "反垄断", "税收", "环境保护", "安全生产", "消费者权益", "产品质量",
  "广告", "网络安全", "电子商务", "金融", "证券", "保险",
  "房地产", "建筑", "招投标", "政府采购", "对外贸易", "海关",
  "外汇管理", "商标", "专利", "著作权", "商业秘密", "不正当竞争",
];

// 发布机关
const publishOrgs = [
  "全国人大常委会",
  "国务院",
  "最高人民法院",
  "最高人民检察院",
  "国家市场监督管理总局",
  "人力资源和社会保障部",
  "生态环境部",
  "国家税务总局",
  "国家知识产权局",
  "工业和信息化部",
  "商务部",
  "住房和城乡建设部",
  "交通运输部",
  "应急管理部",
  "中国人民银行",
  "中国银保监会",
  "中国证监会",
  "国家网信办",
];

// 法规级别
const levels = ["法律", "行政法规", "部门规章", "地方性法规", "规范性文件"];

// 法规状态
const statuses: ("effective" | "revised" | "abolished")[] = ["effective", "effective", "effective", "revised", "abolished"];

// 标签库
const tagLibrary = [
  "企业设立", "股权变更", "合同签订", "劳动用工", "社保缴纳",
  "知识产权保护", "商标注册", "专利申请", "数据合规", "隐私保护",
  "反垄断", "公平竞争", "税收优惠", "纳税申报", "环保合规",
  "安全生产", "消防安全", "产品质量", "消费者权益", "广告合规",
  "网络安全", "信息安全", "电子商务", "跨境贸易", "外汇管理",
  "融资贷款", "投资理财", "保险购买", "房地产交易", "工程建设",
];

// 摘要模板
const summaryTemplates = [
  "规范{field}行为，保护相关主体合法权益，维护市场秩序。",
  "加强{field}管理，防范{field}风险，促进{field}健康发展。",
  "明确{field}各方权利义务，规范{field}活动程序。",
  "完善{field}制度，提高{field}效率，保障{field}安全。",
  "促进{field}公平竞争，保护{field}参与者合法权益。",
];

// 生成随机日期
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split("T")[0];
}

// 生成随机整数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机数组元素
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成随机标签
function randomTags(count: number): string[] {
  const shuffled = [...tagLibrary].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 生成单条法规数据
function generateRegulation(id: number): RegulationItem {
  const field = randomItem(lawFields);
  const year = randomInt(2015, 2024);
  const titleTemplate = randomItem(regulationTitles);
  const title = titleTemplate
    .replace("{field}", field)
    .replace("{year}", year.toString());

  const level = randomItem(levels);
  const status = randomItem(statuses);
  const publishDate = randomDate(new Date(2015, 0, 1), new Date(2024, 11, 31));
  const effectiveDate = randomDate(new Date(publishDate), new Date(2025, 11, 31));

  // 根据级别确定发布机关
  let publishOrg: string;
  if (level === "法律") {
    publishOrg = "全国人大常委会";
  } else if (level === "行政法规") {
    publishOrg = "国务院";
  } else {
    publishOrg = randomItem(publishOrgs);
  }

  // 生成摘要
  const summary = randomItem(summaryTemplates).replace(/{field}/g, field);

  // 生成浏览和下载数据
  const viewCount = randomInt(1000, 200000);
  const downloadCount = Math.floor(viewCount * randomInt(10, 40) / 100);

  return {
    id: id.toString(),
    title,
    level,
    field,
    scenario: field + "合规",
    publishOrg,
    publishDate,
    effectiveDate,
    status,
    tags: randomTags(randomInt(2, 5)),
    summary,
    keyArticles: [],
    viewCount,
    downloadCount,
    isNew: year >= 2023 && status === "effective",
    isHot: viewCount > 100000,
  };
}

// 生成100条法规数据
export function generateMockRegulations(count: number = 100): RegulationItem[] {
  const regulations: RegulationItem[] = [];

  // 保留原有的4条重要法规
  const baseRegulations: RegulationItem[] = [
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

  regulations.push(...baseRegulations);

  // 生成剩余的法规数据
  for (let i = 5; i <= count; i++) {
    regulations.push(generateRegulation(i));
  }

  return regulations;
}

// 导出100条法规数据
export const mockRegulations100 = generateMockRegulations(100);
