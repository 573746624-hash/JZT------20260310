// 数据遮挡工具函数

/**
 * 企业名称遮挡
 * @param companyName 企业名称
 * @param showLength 显示的字符数量
 * @returns 遮挡后的企业名称
 */
export const maskCompanyName = (companyName: string, showLength: number = 2): string => {
  if (!companyName || companyName.length <= showLength) {
    return companyName;
  }
  
  const visiblePart = companyName.substring(0, showLength);
  const maskedLength = Math.min(companyName.length - showLength, 6); // 最多遮挡6个字符
  const maskedPart = '*'.repeat(maskedLength);
  
  // 如果原名称很长，保留后缀（如"有限公司"）
  if (companyName.length > 8) {
    const suffix = companyName.includes('有限公司') ? '有限公司' : 
                  companyName.includes('股份') ? '股份公司' :
                  companyName.includes('集团') ? '集团' : '';
    if (suffix) {
      return `${visiblePart}${maskedPart}${suffix}`;
    }
  }
  
  return `${visiblePart}${maskedPart}`;
};

/**
 * 联系电话遮挡
 * @param phone 电话号码
 * @returns 遮挡后的电话号码
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return phone;
  
  // 手机号遮挡 (138****8888)
  if (phone.length === 11 && /^1[3-9]\d{9}$/.test(phone)) {
    return `${phone.substring(0, 3)}****${phone.substring(7)}`;
  }
  
  // 400电话遮挡 (400-***-4567)
  if (phone.includes('400')) {
    const parts = phone.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-***-${parts[2]}`;
    }
  }
  
  // 其他电话号码遮挡
  if (phone.length > 6) {
    const start = phone.substring(0, 3);
    const end = phone.substring(phone.length - 4);
    const middle = '*'.repeat(Math.min(phone.length - 7, 4));
    return `${start}${middle}${end}`;
  }
  
  return phone;
};

/**
 * 邮箱地址遮挡
 * @param email 邮箱地址
 * @returns 遮挡后的邮箱地址
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  
  const visibleStart = localPart.substring(0, 2);
  const visibleEnd = localPart.length > 4 ? localPart.substring(localPart.length - 1) : '';
  const maskedLength = Math.min(localPart.length - 2 - visibleEnd.length, 4);
  const maskedPart = '*'.repeat(maskedLength);
  
  return `${visibleStart}${maskedPart}${visibleEnd}@${domain}`;
};

/**
 * 地址遮挡
 * @param address 详细地址
 * @returns 遮挡后的地址
 */
export const maskAddress = (address: string): string => {
  if (!address) return address;
  
  // 保留省市信息，遮挡详细地址
  const cityRegex = /(.*?[省市区县])(.*)/;
  const match = address.match(cityRegex);
  
  if (match && match[2]) {
    const cityPart = match[1];
    const detailPart = match[2];
    const maskedDetail = detailPart.length > 6 ? 
      `${detailPart.substring(0, 2)}${'*'.repeat(Math.min(detailPart.length - 4, 6))}${detailPart.substring(detailPart.length - 2)}` :
      '*'.repeat(detailPart.length);
    return `${cityPart}${maskedDetail}`;
  }
  
  // 如果没有匹配到标准格式，简单遮挡中间部分
  if (address.length > 8) {
    const start = address.substring(0, 4);
    const end = address.substring(address.length - 4);
    const middle = '*'.repeat(Math.min(address.length - 8, 6));
    return `${start}${middle}${end}`;
  }
  
  return address;
};

/**
 * 服务价格遮挡
 * @param price 价格信息
 * @param showRange 是否显示价格区间
 * @returns 遮挡后的价格信息
 */
export const maskPrice = (price: string, showRange: boolean = false): string => {
  if (!price || price === '面议' || price === '待定') {
    return price;
  }
  
  if (showRange) {
    // 显示价格区间但遮挡具体数字
    if (price.includes('-')) {
      return price.replace(/\d+/g, '***');
    }
    return '***元起';
  }
  
  return '面议';
};

/**
 * 项目案例遮挡
 * @param caseTitle 案例标题
 * @param clientName 客户名称
 * @returns 遮挡后的案例信息
 */
export const maskCaseStudy = (caseTitle: string, clientName: string) => {
  const maskedClient = clientName ? maskCompanyName(clientName, 1) : '某知名企业';
  const maskedTitle = caseTitle.replace(/[某]\w+[企业公司集团]/g, maskedClient);
  
  return {
    title: maskedTitle,
    client: maskedClient
  };
};

/**
 * 根据用户权限和设置决定是否需要遮挡
 * @param userLevel 用户等级 (guest, member, vip, admin)
 * @param dataType 数据类型
 * @returns 是否需要遮挡
 */
export const shouldMaskData = (userLevel: string, dataType: string): boolean => {
  const maskingRules = {
    guest: ['companyName', 'phone', 'email', 'address', 'price', 'cases'],
    member: ['phone', 'email', 'address', 'price'],
    vip: ['phone', 'email'],
    admin: []
  };
  
  const rulesToMask = maskingRules[userLevel as keyof typeof maskingRules] || maskingRules.guest;
  return rulesToMask.includes(dataType);
};

/**
 * 综合数据遮挡函数
 * @param data 原始数据
 * @param userLevel 用户等级
 * @returns 遮挡后的数据
 */
export const maskSensitiveData = (data: any, userLevel: string = 'guest') => {
  return {
    ...data,
    companyName: shouldMaskData(userLevel, 'companyName') ? 
      maskCompanyName(data.companyName) : data.companyName,
    contactInfo: {
      ...data.contactInfo,
      phone: shouldMaskData(userLevel, 'phone') ? 
        maskPhone(data.contactInfo?.phone) : data.contactInfo?.phone,
      email: shouldMaskData(userLevel, 'email') ? 
        maskEmail(data.contactInfo?.email) : data.contactInfo?.email,
      address: shouldMaskData(userLevel, 'address') ? 
        maskAddress(data.contactInfo?.address) : data.contactInfo?.address,
    },
    priceRange: shouldMaskData(userLevel, 'price') ? 
      maskPrice(data.priceRange) : data.priceRange,
    caseStudies: shouldMaskData(userLevel, 'cases') && data.caseStudies ? 
      data.caseStudies.map((case: any) => {
        const masked = maskCaseStudy(case.title, case.client);
        return {
          ...case,
          title: masked.title,
          client: masked.client
        };
      }) : data.caseStudies,
  };
};
