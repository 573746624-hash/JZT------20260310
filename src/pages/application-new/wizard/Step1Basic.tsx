/**
 * 申报向导 - 步骤1：资质信息填写
 * 创建时间: 2026-03-23
 */

import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Button,
  Alert,
} from 'antd';
import {
  InfoCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Application } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Step1BasicProps {
  formData: any;
  onChange: (data: any) => void;
  application: Application | null;
}

// 资质选项
const qualificationOptions = [
  {
    category: '企业认定',
    options: [
      { value: 'high_tech', label: '高新技术企业认定', description: '国家高新技术企业资质认定' },
      { value: 'specialized', label: '专精特新中小企业', description: '专业化、精细化、特色化、创新能力突出的中小企业' },
      { value: 'tech_sme', label: '科技型中小企业', description: '科技型中小企业评价入库' },
      { value: 'little_giant', label: '专精特新"小巨人"', description: '国家级专精特新小巨人企业' },
    ],
  },
  {
    category: '税收优惠',
    options: [
      { value: 'rd_expense', label: '研发费用加计扣除', description: '企业所得税研发费用加计扣除优惠' },
      { value: 'tech_income', label: '技术转让所得税减免', description: '技术转让所得企业所得税减免' },
    ],
  },
  {
    category: '资金支持',
    options: [
      { value: 'innovation_fund', label: '创新基金', description: '科技创新基金支持项目' },
      { value: 'industry_upgrade', label: '产业升级补贴', description: '产业转型升级专项资金' },
    ],
  },
];

const Step1Basic: React.FC<Step1BasicProps> = ({ formData, onChange, application }) => {
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues: any, allValues: any) => {
    onChange({ basicInfo: allValues });
  };

  const handleQualificationChange = (values: string[]) => {
    onChange({ qualifications: values });
  };

  return (
    <div>
      <Title level={4}>资质信息填写</Title>
      <Text type="secondary">请填写企业基础信息并选择申报资质</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左侧表单区 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* 企业基础信息 */}
            <Card title="企业基础信息" size="small">
              <Alert
                message="以下信息自动从企业画像获取，如有变更请修改"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Form
                form={form}
                layout="vertical"
                initialValues={formData.basicInfo}
                onValuesChange={handleValuesChange}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="企业名称" name="companyName">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="统一社会信用代码" name="creditCode">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="法定代表人" name="legalPerson">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="注册资本" name="registeredCapital">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="成立日期" name="establishDate">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="所属行业" name="industry">
                      <Select placeholder="请选择">
                        <Option value="software">软件和信息技术服务业</Option>
                        <Option value="manufacturing">制造业</Option>
                        <Option value="biotech">生物医药</Option>
                        <Option value="new_energy">新能源</Option>
                        <Option value="other">其他</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="企业规模" name="scale">
                      <Select placeholder="请选择">
                        <Option value="large">大型企业</Option>
                        <Option value="medium">中型企业</Option>
                        <Option value="small">小型企业</Option>
                        <Option value="micro">微型企业</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="注册地址" name="address">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="经营范围" name="businessScope">
                  <TextArea rows={3} />
                </Form.Item>
              </Form>
            </Card>

            {/* 申报资质选择 */}
            <Card title="申报资质选择" size="small">
              <Alert
                message="请选择要申报的资质类型，支持多选"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Select
                mode="multiple"
                placeholder="请选择申报资质"
                style={{ width: '100%' }}
                value={formData.qualifications}
                onChange={handleQualificationChange}
                optionLabelProp="label"
              >
                {qualificationOptions.map((category) => (
                  <Select.OptGroup key={category.category} label={category.category}>
                    {category.options.map((opt) => (
                      <Option key={opt.value} value={opt.value} label={opt.label}>
                        <div>
                          <div>{opt.label}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>{opt.description}</div>
                        </div>
                      </Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>

              {/* 已选资质展示 */}
              {formData.qualifications?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">已选资质：</Text>
                  <div style={{ marginTop: 8 }}>
                    {formData.qualifications.map((q: string) => {
                      const qual = qualificationOptions
                        .flatMap(c => c.options)
                        .find(o => o.value === q);
                      return (
                        <Tag key={q} color="blue" style={{ marginBottom: 8 }}>
                          {qual?.label || q}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>

            {/* 联系人信息 */}
            <Card title="联系人信息" size="small">
              <Form
                layout="vertical"
                initialValues={formData.contactInfo}
                onValuesChange={(changed, all) => onChange({ contactInfo: all })}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="项目负责人"
                      name="contactName"
                      rules={[{ required: true, message: '请输入负责人姓名' }]}
                    >
                      <Input placeholder="请输入负责人姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="联系电话"
                      name="contactPhone"
                      rules={[{ required: true, message: '请输入联系电话' }]}
                    >
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="电子邮箱"
                      name="contactEmail"
                      rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
                    >
                      <Input placeholder="请输入电子邮箱" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="所属部门" name="department">
                      <Input placeholder="请输入所属部门" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Space>
        </Col>

        {/* 右侧提示区 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="填写说明" size="small">
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>企业信息自动从企业画像获取</li>
                <li>带 * 号为必填项</li>
                <li>请确保信息真实有效</li>
                <li>支持选择多个申报资质</li>
              </ul>
            </Card>

            <Card title="智能推荐" size="small">
              <Text type="secondary">根据您的企业画像，推荐申报：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="green">高新技术企业认定</Tag>
                <Tag color="green">科技型中小企业</Tag>
              </div>
              <Button type="link" size="small" style={{ padding: 0, marginTop: 8 }}>
                查看推荐理由
              </Button>
            </Card>

            <Card title="常见问题" size="small">
              <Space direction="vertical" size={8}>
                <Text style={{ fontSize: 13 }}>Q: 如何选择合适的资质？</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  A: 系统会根据企业画像智能推荐，也可咨询客服。
                </Text>
                <Text style={{ fontSize: 13 }}>Q: 信息填写错误怎么办？</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  A: 提交前可随时修改，提交后需撤回重填。
                </Text>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Step1Basic;
