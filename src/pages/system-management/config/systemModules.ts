/**
 * 系统管理模块配置文件
 * 创建时间: 2026-01-13
 * 更新时间: 2026-03-24 - 精简模块，保留核心功能
 */

import React from "react";
import {
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
  BankOutlined,
} from "@ant-design/icons";

export interface SystemModule {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  path: string;
  features: string[];
  color: string;
  adminOnly?: boolean;
}

/**
 * 系统管理模块配置
 * 集中管理所有系统管理相关的模块信息
 */
export const systemModules: SystemModule[] = [
  {
    icon: UserOutlined,
    title: "用户管理",
    description: "管理系统用户信息，包括用户的创建、编辑、删除和权限分配",
    path: "/system/users",
    features: ["用户信息管理", "角色分配", "批量操作", "登录记录"],
    color: "#1890ff",
    adminOnly: true,
  },
  {
    icon: TeamOutlined,
    title: "角色管理",
    description: "配置系统角色，定义角色权限和数据访问范围",
    path: "/system/roles",
    features: ["角色配置", "权限分配", "数据范围", "角色模板"],
    color: "#13c2c2",
    adminOnly: true,
  },
  {
    icon: UserOutlined,
    title: "个人中心",
    description: "管理个人信息、查看操作日志、设置个性化偏好",
    path: "/system/personal-center",
    features: ["个人信息管理", "操作日志查询", "页面布局设置", "通知提醒设置"],
    color: "#52c41a",
    adminOnly: false,
  },
  {
    icon: HeartOutlined,
    title: "我的收藏",
    description: "查看和管理收藏的政策、项目和服务",
    path: "/system/my-favorites",
    features: ["政策收藏", "项目收藏", "服务收藏", "收藏管理"],
    color: "#f5222d",
    adminOnly: false,
  },
  {
    icon: BankOutlined,
    title: "企业管理",
    description: "管理企业信息、组织架构和认证状态",
    path: "/system/company-management",
    features: ["企业信息", "组织架构", "认证管理", "企业设置"],
    color: "#2f54eb",
    adminOnly: false,
  },
];

/**
 * 获取系统管理模块列表
 * @param isAdmin 是否为管理员
 * @returns 根据权限过滤后的模块列表
 */
export function getSystemModules(isAdmin: boolean): SystemModule[] {
  if (isAdmin) {
    return systemModules;
  }
  return systemModules.filter(module => !module.adminOnly);
}
