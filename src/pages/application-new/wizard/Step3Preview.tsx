/**
 * 申报向导 - 步骤3：申报信息预览
 * 创建时间: 2026-03-23
 */

import React from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Space,
  Alert,
  Button,
  List,
  Row,
  Col,
  Result,
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { Application } from '../types';

const { Title, Text } = Typography;

interface Step3PreviewProps {
  formData: any;
  onChange: (data: any) => void;
  application: Application | null;
}

const Step3Preview: React.FC<Step3PreviewProps> = ({ formData, onChange, application }) => {
  // 检查完整性
  const checkCompleteness = () => {
    const checks = [];

    // 基础信息检查
    if (formData.basicInfo?.companyName && formData.basicInfo?.creditCode) {
      checks.push({ item: '企业基础信息', status: 'pass' });
    } else {
      checks.push({ item: '企业基础信息', status: 'fail', message: '信息不完整' });
    }

    // 资质选择检查
    if (formData.qualifications?.length > 0) {
      checks.push({ item: '申报资质选择', status: 'pass' });
    } else {
      checks.push({ item: '申报资质选择', status: 'fail', message: '未选择申报资质' });
    }

    // 联系人检查
    if (formData.contactInfo?.contactName && formData.contactInfo?.contactPhone) {
      checks.push({ item: '联系人信息', status: 'pass' });
    } else {
      checks.push({ item: '联系人信息', status: 'fail', message: '联系人信息不完整' });
    }

    // 材料上传检查
    const uploadedCount = formData.materials?.filter((m: any) => m.status === 'uploaded').length || 0;
    if (uploadedCount >= 3) {
      checks.push({ item: '证明材料上传', status: 'pass' });
    } else {
      checks.push({ item: '证明材料上传', status: 'warning', message: `已上传 ${uploadedCount} 项材料` });
    }

    return checks;
  };

  const completenessChecks = checkCompleteness();
  const allPassed = completenessChecks.every(c => c.status === 'pass');
  const hasWarnings = completenessChecks.some(c => c.status === 'warning');

  // 获取资质标签
  const getQualificationLabel = (value: string) => {
    const map: Record<string, string> = {
      high_tech: '高新技术企业认定',
      specialized: '专精特新中小企业',
      tech_sme: '科技型中小企业',
      little_giant: '专精特新"小巨人"',
      rd_expense: '研发费用加计扣除',
      tech_income: '技术转让所得税减免',
      innovation_fund: '创新基金',
      industry_upgrade: '产业升级补贴',
    };
    return map[value] || value;
  };

  return (
    <div>
      <Title level={4}>申报信息预览</Title>
      <Text type="secondary">请仔细核对申报信息，确认无误后提交</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左侧预览区 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* 完整性检查结果 */}
            <Card size="small">
              {allPassed ? (
                <Result
                  status="success"
                  title="完整性检查通过"
                  subTitle="所有必填项已完成，可以提交申报"
                  icon={<CheckCircleOutlined />}
                />
              ) : (
                <Alert
                  message="完整性检查"
                  description={
                    <List
                      dataSource={completenessChecks}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            {item.status === 'pass' ? (
                              <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            ) : item.status === 'warning' ? (
                              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                            ) : (
                              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                            )}
                            <Text>{item.item}</Text>
                            {item.message && (
                              <Text type={item.status === 'fail' ? 'danger' : 'warning'}>
                                ({item.message})
                              </Text>
                            )}
                          </Space>
                        </List.Item>
                      )}
                    />
                  }
                  type={hasWarnings ? 'warning' : 'error'}
                  showIcon
                />
              )}
            </Card>

            {/* 企业基础信息 */}
            <Card
              title="企业基础信息"
              size="small"
              extra={<Button type="link" icon={<EditOutlined />}>修改</Button>}
            >
              <Descriptions column={2} size="small">
                <Descriptions.Item label="企业名称">
                  {formData.basicInfo?.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="统一信用代码">
                  {formData.basicInfo?.creditCode}
                </Descriptions.Item>
                <Descriptions.Item label="法定代表人">
                  {formData.basicInfo?.legalPerson}
                </Descriptions.Item>
                <Descriptions.Item label="注册资本">
                  {formData.basicInfo?.registeredCapital}
                </Descriptions.Item>
                <Descriptions.Item label="成立日期">
                  {formData.basicInfo?.establishDate}
                </Descriptions.Item>
                <Descriptions.Item label="所属行业">
                  {formData.basicInfo?.industry}
                </Descriptions.Item>
                <Descriptions.Item label="企业规模">
                  {formData.basicInfo?.scale}
                </Descriptions.Item>
                <Descriptions.Item label="注册地址">
                  {formData.basicInfo?.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 申报资质 */}
            <Card
              title="申报资质"
              size="small"
              extra={<Button type="link" icon={<EditOutlined />}>修改</Button>}
            >
              <Space wrap>
                {formData.qualifications?.map((q: string) => (
                  <Tag key={q} color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                    {getQualificationLabel(q)}
                  </Tag>
                ))}
              </Space>
            </Card>

            {/* 已上传材料 */}
            <Card
              title="已上传材料"
              size="small"
              extra={<Button type="link" icon={<EditOutlined />}>修改</Button>}
            >
              <List
                dataSource={formData.materials?.filter((m: any) => m.status === 'uploaded')}
                renderItem={(item: any) => (
                  <List.Item>
                    <Space>
                      <FileTextOutlined />
                      <Text>{item.fileName}</Text>
                      <Tag color="success">已上传</Tag>
                    </Space>
                  </List.Item>
                )}
                locale={{ emptyText: '暂无已上传材料' }}
              />
            </Card>

            {/* 联系人信息 */}
            <Card
              title="联系人信息"
              size="small"
              extra={<Button type="link" icon={<EditOutlined />}>修改</Button>}
            >
              <Descriptions column={2} size="small">
                <Descriptions.Item label="项目负责人">
                  {formData.contactInfo?.contactName}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {formData.contactInfo?.contactPhone}
                </Descriptions.Item>
                <Descriptions.Item label="电子邮箱">
                  {formData.contactInfo?.contactEmail}
                </Descriptions.Item>
                <Descriptions.Item label="所属部门">
                  {formData.contactInfo?.department || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>

        {/* 右侧提示区 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="提交须知" size="small">
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>提交后不可修改申报内容</li>
                <li>审核周期一般为 15-30 个工作日</li>
                <li>审核结果将通过站内信通知</li>
                <li>如需修改可撤回后重新提交</li>
              </ul>
            </Card>

            <Card title="风险提示" size="small">
              <Alert
                message="请仔细核对以下信息"
                description={
                  <ul style={{ paddingLeft: 16, margin: '8px 0 0 0' }}>
                    <li>企业信息是否准确</li>
                    <li>资质选择是否正确</li>
                    <li>材料是否完整清晰</li>
                    <li>联系人信息是否有效</li>
                  </ul>
                }
                type="warning"
                showIcon
              />
            </Card>

            <Card title="审核流程" size="small">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</div>
                  <Text>形式审查（3-5个工作日）</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>2</div>
                  <Text>实质审核（10-15个工作日）</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>3</div>
                  <Text>结果公示（5个工作日）</Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Step3Preview;
