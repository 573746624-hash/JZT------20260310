// 供给侧业务服务数据模型和模拟数据

export interface SupplyService {
  id: string;
  companyName: string;
  companyLogo?: string;
  serviceName: string;
  serviceDescription: string;
  serviceCategories: string[];
  professionalTags: string[];
  region: string;
  publishTime: string;
  rating: number;
  completedProjects: number;
  responseTime: string;
  certifications: string[];
  capabilities: string[];
  priceRange?: string;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  successRate: number;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  businessScope: string;
  establishedYear: number;
  teamSize: string;
  caseStudies?: {
    title: string;
    description: string;
    client: string;
    duration: string;
    result: string;
  }[];
}

// 模拟供给侧服务数据
export const mockSupplyServices: SupplyService[] = [
  {
    id: "supply-001",
    companyName: "中科检测技术有限公司",
    serviceName: "食品安全检测服务",
    serviceDescription: "提供全方位食品安全检测服务，包括微生物检测、农药残留检测、重金属检测、添加剂检测等。拥有CNAS认可实验室，检测报告具有法律效力。服务涵盖食品生产、流通、餐饮各个环节，为企业提供从原料到成品的全链条检测解决方案。",
    serviceCategories: ["检测认证"],
    professionalTags: ["食品检测", "CNAS认证", "农药残留", "微生物检测", "重金属检测"],
    region: "北京市",
    publishTime: "2小时前",
    rating: 4.8,
    completedProjects: 1250,
    responseTime: "2小时内",
    certifications: ["CNAS认可", "CMA资质", "ISO17025"],
    capabilities: ["快速检测", "标准检测", "定制检测", "技术咨询"],
    priceRange: "500-5000元/项",
    isVerified: true,
    isFeatured: true,
    viewCount: 2340,
    successRate: 98,
    contactInfo: {
      phone: "400-123-4567",
      email: "service@zktest.com",
      address: "北京市海淀区中关村科技园"
    },
    businessScope: "食品检测、环境检测、产品认证",
    establishedYear: 2008,
    teamSize: "100-500人",
    caseStudies: [
      {
        title: "某大型食品企业全产业链检测服务",
        description: "为知名食品企业提供从原料到成品的全链条检测服务",
        client: "某知名食品集团",
        duration: "长期合作3年",
        result: "零食品安全事故，通过多项国际认证"
      }
    ]
  },
  {
    id: "supply-002",
    companyName: "华安认证咨询集团",
    serviceName: "CE认证咨询服务",
    serviceDescription: "专业提供CE认证、FDA认证、ISO认证等国际认证服务。拥有欧盟授权代表资质，可为医疗器械、机械设备、电子产品等提供一站式认证解决方案。服务包括产品评估、技术文件编制、测试安排、证书申请等全流程服务。",
    serviceCategories: ["安全合规"],
    professionalTags: ["CE认证", "FDA认证", "医疗器械", "欧盟授权代表", "ISO认证"],
    region: "上海市",
    publishTime: "4小时前",
    rating: 4.9,
    completedProjects: 890,
    responseTime: "1小时内",
    certifications: ["欧盟授权代表", "ISO9001", "IATF16949"],
    capabilities: ["认证咨询", "技术文件", "测试安排", "法规解读"],
    priceRange: "1万-10万元",
    isVerified: true,
    isFeatured: false,
    viewCount: 1876,
    successRate: 96,
    contactInfo: {
      phone: "021-6789-0123",
      email: "info@huaan-cert.com",
      address: "上海市浦东新区张江高科技园区"
    },
    businessScope: "国际认证、合规咨询、技术服务",
    establishedYear: 2012,
    teamSize: "50-100人"
  },
  {
    id: "supply-003",
    companyName: "博医器械研发中心",
    serviceName: "医疗器械研发外包服务",
    serviceDescription: "专业从事医疗器械产品研发、设计、测试、注册申报等全流程外包服务。团队由资深医疗器械工程师、法规专家组成，具备丰富的二类、三类医疗器械研发经验。可提供从概念设计到产品上市的一站式解决方案。",
    serviceCategories: ["医疗器械"],
    professionalTags: ["医疗器械研发", "NMPA注册", "临床试验", "产品设计", "法规咨询"],
    region: "深圳市",
    publishTime: "6小时前",
    rating: 4.7,
    completedProjects: 156,
    responseTime: "4小时内",
    certifications: ["ISO13485", "GMP认证", "NMPA备案"],
    capabilities: ["产品研发", "注册申报", "临床试验", "质量管理"],
    priceRange: "10万-100万元",
    isVerified: true,
    isFeatured: true,
    viewCount: 987,
    successRate: 94,
    contactInfo: {
      phone: "0755-8888-9999",
      email: "rd@boyimedical.com",
      address: "深圳市南山区高新技术产业园"
    },
    businessScope: "医疗器械研发、注册申报、技术咨询",
    establishedYear: 2015,
    teamSize: "20-50人"
  },
  {
    id: "supply-004",
    companyName: "绿源环保工程有限公司",
    serviceName: "废水处理设备租赁及运维",
    serviceDescription: "提供工业废水处理设备租赁、安装、调试、运维等一体化服务。拥有多种处理工艺的成套设备，可根据不同行业废水特点提供定制化解决方案。服务包括设备租赁、现场安装、操作培训、日常维护、达标保证等。",
    serviceCategories: ["环保工程"],
    professionalTags: ["废水处理", "设备租赁", "环保设备", "达标排放", "运维服务"],
    region: "江苏省苏州市",
    publishTime: "8小时前",
    rating: 4.6,
    completedProjects: 234,
    responseTime: "6小时内",
    certifications: ["环保工程资质", "ISO14001", "安全生产许可证"],
    capabilities: ["设备租赁", "工程安装", "运维服务", "达标保证"],
    priceRange: "5万-50万元/年",
    isVerified: true,
    isFeatured: false,
    viewCount: 1456,
    successRate: 92,
    contactInfo: {
      phone: "0512-6666-7777",
      email: "service@lyhb.com",
      address: "江苏省苏州市工业园区"
    },
    businessScope: "环保设备、工程服务、技术咨询",
    establishedYear: 2010,
    teamSize: "50-100人"
  },
  {
    id: "supply-005",
    companyName: "精工制造科技股份",
    serviceName: "精密零件代工生产",
    serviceDescription: "专业提供精密机械零件、电子产品外壳、模具制造等代工生产服务。拥有先进的CNC加工中心、注塑设备、表面处理生产线。可承接从样品制作到批量生产的全流程服务，质量稳定，交期准确。",
    serviceCategories: ["制造代工"],
    professionalTags: ["精密加工", "CNC加工", "注塑成型", "模具制造", "OEM代工"],
    region: "广东省东莞市",
    publishTime: "10小时前",
    rating: 4.5,
    completedProjects: 567,
    responseTime: "8小时内",
    certifications: ["ISO9001", "IATF16949", "RoHS认证"],
    capabilities: ["精密加工", "模具制造", "批量生产", "质量控制"],
    priceRange: "按工件复杂度报价",
    isVerified: true,
    isFeatured: false,
    viewCount: 2134,
    successRate: 95,
    contactInfo: {
      phone: "0769-8888-6666",
      email: "sales@jgzz.com",
      address: "广东省东莞市长安镇工业区"
    },
    businessScope: "精密制造、模具开发、代工生产",
    establishedYear: 2006,
    teamSize: "200-500人"
  },
  {
    id: "supply-006",
    companyName: "云智科技发展有限公司",
    serviceName: "企业管理系统开发",
    serviceDescription: "专业提供企业ERP、CRM、OA等管理系统的定制开发服务。采用先进的云原生架构，支持微服务部署，具备高并发、高可用、易扩展等特点。提供从需求分析到系统上线的全流程服务，并提供长期技术支持。",
    serviceCategories: ["技术开发"],
    professionalTags: ["ERP开发", "CRM系统", "云原生", "微服务", "数字化转型"],
    region: "浙江省杭州市",
    publishTime: "12小时前",
    rating: 4.8,
    completedProjects: 89,
    responseTime: "2小时内",
    certifications: ["软件企业认证", "ISO27001", "CMMI3级"],
    capabilities: ["系统开发", "架构设计", "数据分析", "技术支持"],
    priceRange: "20万-200万元",
    isVerified: true,
    isFeatured: true,
    viewCount: 1678,
    successRate: 97,
    contactInfo: {
      phone: "0571-8888-5555",
      email: "tech@yunzhi.com",
      address: "浙江省杭州市西湖区文三路"
    },
    businessScope: "软件开发、系统集成、技术咨询",
    establishedYear: 2018,
    teamSize: "50-100人"
  }
];

// 专业服务标签库
export const professionalServiceTags = {
  testing: ["食品检测", "环境检测", "产品检测", "CNAS认证", "CMA资质", "快速检测", "标准检测"],
  safety: ["CE认证", "FDA认证", "ISO认证", "安全评估", "合规咨询", "风险管控", "应急预案"],
  medical: ["医疗器械研发", "NMPA注册", "FDA注册", "临床试验", "GMP生产", "质量管理", "法规咨询"],
  environmental: ["废水处理", "废气治理", "固废处理", "环境修复", "环评服务", "达标排放", "清洁生产"],
  manufacturing: ["OEM代工", "ODM设计", "精密加工", "模具制造", "装配生产", "质量控制", "供应链管理"],
  technology: ["软件开发", "系统集成", "数字化转型", "云计算", "大数据", "人工智能", "物联网"],
  equipment: ["设备租赁", "设备维护", "技术支持", "培训服务", "备件供应", "远程监控", "预防性维护"],
  supply: ["采购代理", "物流配送", "仓储管理", "供应链优化", "跨境贸易", "供应链金融", "库存管理"]
};

// 企业资质认证库
export const certificationLibrary = [
  "CNAS认可", "CMA资质", "ISO9001", "ISO14001", "ISO45001", "ISO27001", "ISO13485",
  "IATF16949", "CE认证", "FDA认证", "NMPA注册", "GMP认证", "欧盟授权代表",
  "环保工程资质", "安全生产许可证", "软件企业认证", "高新技术企业", "CMMI认证",
  "RoHS认证", "FCC认证", "UL认证", "TUV认证", "SGS认证"
];

// 服务能力标签库
export const capabilityTags = [
  "快速响应", "7x24服务", "现场服务", "远程支持", "技术培训", "方案设计",
  "项目管理", "质量保证", "成本控制", "风险管控", "合规保证", "创新研发",
  "标准化服务", "定制化服务", "一站式服务", "全生命周期服务"
];
