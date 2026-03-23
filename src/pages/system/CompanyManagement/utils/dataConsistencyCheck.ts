/**
 * 数据一致性校验工具
 * 创建时间: 2026-03-24
 * 功能: 校验企业画像编辑数据与实名认证信息的一致性
 */

import type { CompanyProfile } from "../types";
import type { CertState } from "../../../../context/CertificationContext";

/**
 * 字段校验结果
 */
export interface FieldCheckResult {
  field: string;
  label: string;
  profileValue: string;
  certValue: string;
  isMatch: boolean;
  isCritical: boolean;
  message: string;
}

/**
 * 一致性校验报告
 */
export interface ConsistencyReport {
  isValid: boolean;
  totalFields: number;
  matchedFields: number;
  mismatchedFields: number;
  criticalMismatches: number;
  results: FieldCheckResult[];
  summary: string;
}

/**
 * 核心字段映射配置
 * 定义企业画像字段与实名认证字段的对应关系
 */
const CORE_FIELD_MAPPINGS: {
  field: keyof CompanyProfile;
  certField: keyof CertState;
  label: string;
  isCritical: boolean;
  transform?: (value: any) => string;
}[] = [
  {
    field: "companyName",
    certField: "companyName",
    label: "企业名称",
    isCritical: true,
  },
  {
    field: "creditCode",
    certField: "certNumber",
    label: "统一社会信用代码",
    isCritical: true,
  },
  {
    field: "legalPerson",
    certField: "legalPerson",
    label: "法定代表人",
    isCritical: true,
  },
];

/**
 * 标准化字符串（用于比较）
 * 去除空格、统一大小写、去除特殊字符
 */
function normalizeString(value: string): string {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
}

/**
 * 检查两个值是否匹配
 * 支持模糊匹配和精确匹配
 */
function checkValueMatch(
  profileValue: string,
  certValue: string,
  isCritical: boolean
): { isMatch: boolean; message: string } {
  const normalizedProfile = normalizeString(profileValue);
  const normalizedCert = normalizeString(certValue);

  // 如果都为空，视为匹配
  if (!normalizedProfile && !normalizedCert) {
    return { isMatch: true, message: "双方均为空" };
  }

  // 如果一方为空，视为不匹配
  if (!normalizedProfile || !normalizedCert) {
    return {
      isMatch: false,
      message: isCritical ? "关键信息不能为空" : "建议补充完整信息",
    };
  }

  // 精确匹配
  if (normalizedProfile === normalizedCert) {
    return { isMatch: true, message: "完全一致" };
  }

  // 包含匹配（一方包含另一方）
  if (
    normalizedProfile.includes(normalizedCert) ||
    normalizedCert.includes(normalizedProfile)
  ) {
    return {
      isMatch: false,
      message: "部分匹配，建议核对完整信息",
    };
  }

  // 完全不匹配
  return {
    isMatch: false,
    message: isCritical ? "关键信息不一致，必须修正" : "信息存在差异",
  };
}

/**
 * 执行数据一致性校验
 * @param profileData 企业画像数据
 * @param certData 实名认证数据
 * @returns 一致性校验报告
 */
export function checkDataConsistency(
  profileData: Partial<CompanyProfile>,
  certData: CertState
): ConsistencyReport {
  const results: FieldCheckResult[] = [];
  let matchedCount = 0;
  let mismatchedCount = 0;
  let criticalMismatchCount = 0;

  // 校验核心字段
  for (const mapping of CORE_FIELD_MAPPINGS) {
    const profileValue =
      (profileData[mapping.field] as string) || "";
    const certValue =
      (certData[mapping.certField] as string) || "";

    const { isMatch, message } = checkValueMatch(
      profileValue,
      certValue,
      mapping.isCritical
    );

    const result: FieldCheckResult = {
      field: mapping.field as string,
      label: mapping.label,
      profileValue,
      certValue,
      isMatch,
      isCritical: mapping.isCritical,
      message,
    };

    results.push(result);

    if (isMatch) {
      matchedCount++;
    } else {
      mismatchedCount++;
      if (mapping.isCritical) {
        criticalMismatchCount++;
      }
    }
  }

  // 生成报告
  const isValid = criticalMismatchCount === 0;
  const summary = generateSummary(
    matchedCount,
    mismatchedCount,
    criticalMismatchCount
  );

  return {
    isValid,
    totalFields: results.length,
    matchedFields: matchedCount,
    mismatchedFields: mismatchedCount,
    criticalMismatches: criticalMismatchCount,
    results,
    summary,
  };
}

/**
 * 生成校验报告摘要
 */
function generateSummary(
  matched: number,
  mismatched: number,
  critical: number
): string {
  const total = matched + mismatched;

  if (critical > 0) {
    return `校验未通过：发现 ${critical} 项关键信息不一致，必须修正后才能保存。`;
  }

  if (mismatched > 0) {
    return `校验通过：${matched}/${total} 项信息一致，但有 ${mismatched} 项非关键信息存在差异，建议核对。`;
  }

  return `校验通过：所有 ${total} 项信息均与实名认证数据完全一致。`;
}

/**
 * 获取不一致的关键字段列表
 */
export function getCriticalMismatches(
  report: ConsistencyReport
): FieldCheckResult[] {
  return report.results.filter(
    (r) => r.isCritical && !r.isMatch
  );
}

/**
 * 自动修正企业画像数据
 * 使用实名认证数据覆盖关键字段
 */
export function autoFixWithCertData(
  profileData: Partial<CompanyProfile>,
  certData: CertState
): Partial<CompanyProfile> {
  const fixedData = { ...profileData };

  // 使用实名认证数据覆盖关键字段
  if (certData.companyName) {
    fixedData.companyName = certData.companyName;
  }
  if (certData.certNumber) {
    fixedData.creditCode = certData.certNumber;
  }
  if (certData.legalPerson) {
    fixedData.legalPerson = certData.legalPerson;
  }

  return fixedData;
}

/**
 * 格式化实名认证数据用于显示
 * 对部分敏感信息进行脱敏处理
 */
export function formatCertValue(
  field: string,
  value: string
): string {
  if (!value) return "未设置";

  switch (field) {
    case "certNumber":
      // 统一社会信用代码脱敏：显示前4位和后4位
      return value.replace(
        /^(\d{4})(.*)(\d{4})$/,
        "$1**********$3"
      );
    case "legalPerson":
      // 法定代表人脱敏：显示首尾字符
      if (value.length <= 2) return value;
      return value.replace(/^(.)+(.)$/, "$1*$2");
    default:
      return value;
  }
}
