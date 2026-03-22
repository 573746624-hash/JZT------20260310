/**
 * 首页重要提醒组件
 * 创建时间: 2026-01-13
 * 功能: 渲染首页的重要提醒和待办事项
 */

import React from "react";
import { Card, List, Typography, Button, Tag, Space } from "antd";
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  RightOutlined
} from "@ant-design/icons";
import { ImportantReminderItem } from "../types/index.ts";

const { Text, Paragraph } = Typography;

interface ImportantRemindersSectionProps {
  importantReminders: ImportantReminderItem[];
  onNavigate: (path: string) => void;
  onMessage: (text: string) => void;
  loading?: boolean;
}

/**
 * 重要提醒组件
 * 组件创建时间: 2026-01-13 13:50:00
 */
export const ImportantRemindersSection: React.FC<
  ImportantRemindersSectionProps
> = ({ importantReminders, onNavigate, onMessage, loading = false }) => {
  
  const getIcon = (urgency: string, type: string) => {
    if (urgency === "high") {
      return <WarningOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />;
    }
    if (type === "deadline") {
      return <ClockCircleOutlined style={{ color: '#fa8c16', fontSize: '20px' }} />;
    }
    return <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />;
  };

  const getTagColor = (urgency: string) => {
    return urgency === "high" ? "error" : "processing";
  };

  return (
    <Card
      loading={loading}
      title={
        <div style={{ display: "flex", alignItems: "center", fontSize: "16px", fontWeight: 600 }}>
          <ExclamationCircleOutlined
            style={{ color: "#fa8c16", marginRight: "8px" }}
          />
          我的待办与重要提醒
          <Tag color="error" style={{ marginLeft: '12px', borderRadius: '10px' }}>
            {importantReminders.filter(r => r.urgency === 'high').length} 项紧急
          </Tag>
        </div>
      }
      extra={
        <Button type="link" onClick={() => onNavigate("/policy-center/application-management")}>
          进入工作台 <RightOutlined />
        </Button>
      }
      headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '0 20px' }}
      bodyStyle={{ padding: '0' }}
    >
      <List
        itemLayout="horizontal"
        dataSource={importantReminders}
        renderItem={(reminder) => (
          <List.Item
            style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: reminder.urgency === 'high' ? '#fff1f033' : '#ffffff',
              transition: 'background-color 0.3s'
            }}
            actions={[
              <Button
                type={reminder.urgency === "high" ? "primary" : "default"}
                danger={reminder.urgency === "high"}
                onClick={() => {
                  if (reminder.type === "deadline") {
                    onNavigate("/policy-center/application-management");
                  } else if (reminder.type === "recommendation") {
                    onNavigate("/policy-center/main");
                  } else {
                    onMessage("功能开发中...");
                  }
                }}
              >
                {reminder.action}
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '8px', 
                  backgroundColor: reminder.urgency === 'high' ? '#fff1f0' : '#e6f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getIcon(reminder.urgency, reminder.type)}
                </div>
              }
              title={
                <Space>
                  <Text strong style={{ fontSize: '15px' }}>{reminder.title}</Text>
                  <Tag color={getTagColor(reminder.urgency)}>
                    {reminder.urgency === "high" ? "紧急" : "提醒"}
                  </Tag>
                </Space>
              }
              description={
                <Paragraph style={{ margin: "4px 0 0 0", fontSize: "13px", color: '#666' }}>
                  {reminder.content}
                </Paragraph>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
