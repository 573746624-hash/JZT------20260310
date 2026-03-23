/**
 * 申报向导 - 步骤4：确认提交
 * 创建时间: 2026-03-23
 */

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Checkbox,
  Alert,
  Button,
  Row,
  Col,
  Input,
  Tag,
  Divider,
} from 'antd';
import {
  SafetyCertificateOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { Application } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Step4SubmitProps {
  formData: any;
  onChange: (data: any) => void;
  application: Application | null;
}

const Step4Submit: React.FC<Step4SubmitProps> = ({ formData, onChange, application }) => {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [showDeclaration, setShowDeclaration] = useState(false);

  // 申报承诺书内容
  const declarationContent = `
申报承诺书

本单位郑重承诺：

一、本单位对所提交的申报材料的真实性、合法性、有效性负责，如有虚假，愿承担相应的法律责任。

二、本单位已充分了解所申报政策的条件和要求，符合申报资格。

三、本单位同意将申报材料用于政策审核、公示等相关工作。

四、本单位将积极配合审核工作，及时补充完善相关材料。

五、如获得政策支持，本单位将严格按照规定使用资金，并接受监督检查。

特此承诺。
  `;

  return (
    <div>
      <Title level={4}>确认提交</Title>
      <Text type="secondary">请仔细阅读并确认以下信息</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左侧确认区 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* 申报信息确认 */}
            <Card title="申报信息确认" size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">申报项目</Text>
                  <Text strong>{application?.name || '新建申报'}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">申报企业</Text>
                  <Text strong>{formData.basicInfo?.companyName}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">申报资质</Text>
                  <Space>
                    {formData.qualifications?.map((q: string) => (
                      <Tag key={q} color="blue">
                        {q === 'high_tech' ? '高新技术企业认定' :
                         q === 'specialized' ? '专精特新中小企业' :
                         q === 'tech_sme' ? '科技型中小企业' : q}
                      </Tag>
                    ))}
                  </Space>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">申报日期</Text>
                  <Text>{new Date().toLocaleDateString('zh-CN')}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">项目负责人</Text>
                  <Text>{formData.contactInfo?.contactName}</Text>
                </div>
              </Space>
            </Card>

            {/* 电子签章 */}
            <Card title="电子签章" size="small">
              <Alert
                message="请进行电子签章确认"
                description="签章人须为法定代表人或经授权的企业负责人"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <div
                style={{
                  border: '2px dashed #d9d9d9',
                  borderRadius: 8,
                  padding: 48,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: signature ? '#f6ffed' : '#fafafa',
                }}
                onClick={() => setSignature('张三')}
              >
                {signature ? (
                  <Space direction="vertical" size={8}>
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                    <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                      已签章
                    </Text>
                    <Text>签章人：{signature}（法定代表人）</Text>
                    <Text type="secondary">签章时间：{new Date().toLocaleString('zh-CN')}</Text>
                  </Space>
                ) : (
                  <Space direction="vertical" size={8}>
                    <SafetyCertificateOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                    <Text type="secondary">点击此处进行电子签章</Text>
                  </Space>
                )}
              </div>
            </Card>

            {/* 申报承诺书 */}
            <Card
              title="申报承诺书"
              size="small"
              extra={
                <Button type="link" onClick={() => setShowDeclaration(!showDeclaration)}>
                  {showDeclaration ? '收起' : '查看全文'}
                </Button>
              }
            >
              {showDeclaration ? (
                <Paragraph style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
                  {declarationContent}
                </Paragraph>
              ) : (
                <Text type="secondary">点击查看承诺书全文</Text>
              )}
              <Divider />
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              >
                我已阅读并同意《申报承诺书》
              </Checkbox>
            </Card>

            {/* 风险提示 */}
            <Alert
              message="提交前请确认"
              description={
                <ul style={{ paddingLeft: 16, margin: '8px 0 0 0' }}>
                  <li>提交后将进入审核流程，不可修改</li>
                  <li>请确保所有信息真实有效</li>
                  <li>虚假申报将承担法律责任</li>
                </ul>
              }
              type="warning"
              showIcon
            />
          </Space>
        </Col>

        {/* 右侧提示区 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="提交须知" size="small">
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>提交后进入审核流程</li>
                <li>审核期间不可修改</li>
                <li>如需修改可撤回重提</li>
                <li>审核结果将站内信通知</li>
              </ul>
            </Card>

            <Card title="审核周期" size="small">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>形式审查</Text>
                  <Tag color="blue">3-5个工作日</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>实质审核</Text>
                  <Tag color="blue">10-15个工作日</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>结果公示</Text>
                  <Tag color="blue">5个工作日</Tag>
                </div>
              </Space>
            </Card>

            <Card title="需要帮助？" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block>
                  在线客服
                </Button>
                <Button block>
                  查看常见问题
                </Button>
                <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                  客服电话：400-xxx-xxxx
                </Text>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Step4Submit;
