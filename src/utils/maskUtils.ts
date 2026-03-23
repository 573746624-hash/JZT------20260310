/**
 * 数据掩码工具函数
 * 用于对企业敏感信息进行脱敏处理
 */

/**
 * 企业名称打码
 * @param name 企业名称
 * @param showLength 显示长度（可选）
 * @returns 打码后的企业名称
 */
export const maskCompanyName = (name: string, showLength: number = 2): string => {
  if (!name || name.length <= showLength) {
    return name;
  }

  const visiblePart = name.substring(0, showLength);
  const maskedLength = Math.min(name.length - showLength, 6);
  const maskedPart = '*'.repeat(maskedLength);

  // 保留常见企业后缀
  if (name.length > 8) {
    const suffix = name.includes('有限公司') ? '有限公司' :
                  name.includes('股份公司') ? '股份公司' :
                  name.includes('集团') ? '集团' : '';
    if (suffix) {
      return `${visiblePart}${maskedPart}${suffix}`;
    }
  }

  return `${visiblePart}${maskedPart}`;
};

/**
 * 手机号打码
 * @param phone 手机号
 * @returns 打码后的手机号
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return phone;

  // 标准手机号格式
  if (phone.length === 11 && /^1[3-9]\d{9}$/.test(phone)) {
    return `${phone.substring(0, 3)}****${phone.substring(7)}`;
  }

  // 400电话
  if (phone.includes('400')) {
    const parts = phone.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-***-${parts[2]}`;
    }
  }

  // 其他电话号码
  if (phone.length > 6) {
    const start = phone.substring(0, 3);
    const end = phone.substring(phone.length - 4);
    const middle = '*'.repeat(Math.min(phone.length - 7, 4));
    return `${start}${middle}${end}`;
  }

  return '***';
};

/**
 * 价格/预算打码
 * @param price 价格字符串
 * @returns 打码后的价格
 */
export const maskPrice = (price: string): string => {
  if (!price || price === '面议' || price === '待定') {
    return price;
  }
  return '面议';
};

/**
 * 预算金额转换为区间
 * @param budget 预算金额
 * @returns 预算区间字符串
 */
export const maskBudget = (budget: string): string => {
  if (!budget || budget === "面议") return budget;

  const num = parseFloat(budget);
  if (isNaN(num)) return budget;

  if (num < 1) return "1万以下";
  if (num < 5) return "1-5万";
  if (num < 10) return "5-10万";
  if (num < 50) return "10-50万";
  return "50万以上";
};

/**
 * 判断是否应该打码数据
 * @param userLevel 用户级别
 * @param dataType 数据类型
 * @returns 是否打码
 */
export const shouldMaskData = (userLevel: string, dataType: string): boolean => {
  const maskingRules: Record<string, string[]> = {
    guest: ['companyName', 'phone', 'email', 'address', 'price'],
    member: ['phone', 'email', 'address', 'price'],
    vip: ['phone', 'email'],
    admin: []
  };

  const rulesToMask = maskingRules[userLevel] || maskingRules.guest;
  return rulesToMask.includes(dataType);
};

/**
 * 对数据进行敏感信息打码
 * @param data 原始数据
 * @param userLevel 用户级别
 * @returns 打码后的数据
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
    },
    priceRange: shouldMaskData(userLevel, 'price') ?
      maskPrice(data.priceRange) : data.priceRange,
  };
};

/**
 * 简单企业名称打码（备用方案）
 * @param name 企业名称
 * @returns 打码后的企业名称
 */
export const maskCompanyNameSimple = (name: string): string => {
  if (!name || name.length <= 2) return name;
  const firstChar = name.charAt(0);
  const lastChar = name.charAt(name.length - 1);
  const middle = "*".repeat(Math.min(name.length - 2, 4));
  return `${firstChar}${middle}${lastChar}`;
};
