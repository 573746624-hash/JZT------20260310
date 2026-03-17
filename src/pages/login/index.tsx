/**
 * 登录页面主组件
 * 创建时间: 2026-01-13
 * 功能: 用户登录页面，支持密码登录和验证码登录
 */

import React, { useEffect } from "react";
import { Form, Button, Tabs, Input } from "antd";
import {
  MobileOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useLogin } from "./hooks/useLogin.ts";
import { LoginLeft } from "./components/LoginLeft.tsx";
import { phoneRules, passwordRules, codeRules } from "./config/formConfig.ts";
import "./styles/login.css";

/**
 * 登录页面组件
 * 组件创建时间: 2026-01-13
 */
const Login: React.FC = () => {
  const {
    loginType,
    setLoginType,
    loading,
    countdown,
    form,
    handleSendCode,
    handleLogin,
  } = useLogin();

  // 检查登录状态
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <LoginLeft />
        <div className="login-right">
          <div className="login-header">
            <h2>欢迎登录</h2>
            <p>登录您的门户账号，开启企业服务之旅</p>
          </div>
          <Form 
            form={form} 
            onFinish={handleLogin} 
            size="large"
          >
            <Tabs
              activeKey={loginType}
              onChange={(key) => {
                setLoginType(key as "password" | "sms");
                form.resetFields(["password", "code"]);
              }}
              items={[
                { key: "password", label: "密码登录" },
                { key: "sms", label: "验证码登录" },
              ]}
              centered
            />
            <Form.Item name="phone" rules={phoneRules}>
              <Input
                prefix={<MobileOutlined />}
                placeholder="请输入手机号"
                maxLength={11}
                size="large"
                autoComplete="tel"
              />
            </Form.Item>

            {loginType === "password" ? (
              <>
                <Form.Item name="password" rules={passwordRules}>
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    size="large"
                    autoComplete="current-password"
                  />
                </Form.Item>
                <div className="forgot-pwd">
                  <a href="/reset-password">忘记密码?</a>
                </div>
              </>
            ) : (
              <>
                <Form.Item name="code" rules={codeRules}>
                  <Input
                    prefix={<SafetyOutlined />}
                    placeholder="请输入验证码"
                    maxLength={6}
                    size="large"
                    suffix={
                      <Button
                        type="link"
                        disabled={countdown > 0}
                        onClick={handleSendCode}
                        style={{ padding: 0 }}
                      >
                        {countdown > 0 ? `${countdown}s后重发` : "获取验证码"}
                      </Button>
                    }
                  />
                </Form.Item>
                <div className="forgot-pwd" style={{ visibility: "hidden" }}>
                  <span>占位</span>
                </div>
              </>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                登 录
              </Button>
            </Form.Item>
          </Form>
          <div className="login-footer">
            还没有账号？<a href="/register">立即注册</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
