import React, { useEffect } from "react";
import { Form, Input, Button, Upload, Space, Divider, message, Typography, Row, Col } from "antd";
import { IdcardOutlined, BankOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const RealNameVerifyForm: React.FC<{
  initialData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  onSaveDraft: (data: any) => void;
}> = ({ initialData, onNext, onPrev, onSaveDraft }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const handleBankVerify = () => {
    const values = form.getFieldsValue(['bankCardNo', 'mobile', 'legalPersonName', 'idNo']);
    if (!values.bankCardNo || !values.mobile) {
      message.error("请先填写完整的银行卡号与预留手机号");
      return;
    }
    // 模拟四要素验证
    message.loading({ content: "正在调用银联接口进行四要素核验...", key: 'bankVerify' });
    setTimeout(() => {
      message.success({ content: "四要素核验一致", key: 'bankVerify' });
    }, 1500);
  };

  const handleValuesChange = (_: any, allValues: any) => {
    onSaveDraft(allValues);
  };

  const onFinish = (values: any) => {
    onNext(values);
  };

  return (
    <div className="step-form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        <Divider orientation="left">身份证件上传</Divider>
        <Space size="large" style={{ marginBottom: 24 }}>
          <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
            <div>
              <IdcardOutlined style={{ fontSize: 24 }} />
              <div style={{ marginTop: 8 }}>人像面上传</div>
            </div>
          </Upload>
          <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
            <div>
              <IdcardOutlined style={{ fontSize: 24 }} />
              <div style={{ marginTop: 8 }}>国徽面上传</div>
            </div>
          </Upload>
        </Space>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="法定代表人姓名" name="legalPersonName" rules={[{ required: true }]}>
              <Input placeholder="与营业执照保持一致" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="身份证号码" name="idNo" rules={[{ required: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ }]}>
              <Input placeholder="请输入18位身份证号" maxLength={18} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">对公账户/个人银行卡四要素核验</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="银行卡号" name="bankCardNo" rules={[{ required: true }]}>
              <Input prefix={<BankOutlined />} placeholder="请输入银行卡号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="银行预留手机号" name="mobile" rules={[{ required: true }]}>
              <Space.Compact style={{ width: '100%' }}>
                <Input placeholder="请输入手机号" />
                <Button onClick={handleBankVerify}>验证</Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <div className="onboarding-footer">
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" htmlType="submit">
            保存并下一步
          </Button>
        </div>
      </Form>

    </div>
  );
};