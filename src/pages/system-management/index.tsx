/**
 * 系统管理主页面
 * 创建时间: 2026-01-13
 * 更新时间: 2026-03-24 - 增加权限控制
 * 功能: 提供系统管理各模块的导航入口
 */

import React, { useMemo } from "react";
import { Row, Col } from "antd";
import { PageHeader, ModuleCard } from "./components";
import { getSystemModules } from "./config/systemModules";

const SystemManagement: React.FC = () => {
  // 检查用户是否为管理员
  const isAdmin = useMemo(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo.roleType === "0";
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  // 根据权限获取模块列表
  const modules = useMemo(() => getSystemModules(isAdmin), [isAdmin]);

  return (
    <div style={{ background: "transparent" }}>
      {/* 页面头部 */}
      <PageHeader />

      {/* 功能模块网格 */}
      <Row gutter={[16, 16]}>
        {modules.map((module, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={index}>
            <ModuleCard module={module} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SystemManagement;
