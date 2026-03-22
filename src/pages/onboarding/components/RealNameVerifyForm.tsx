import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Space, Divider, message, Modal, Typography, Row, Col } from "antd";
import { IdcardOutlined, BankOutlined, PlusOutlined, ScanOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const RealNameVerifyForm: React.FC<{
  initialData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  onSaveDraft: (data: any) => void;
}> = ({ initialData, onNext, onPrev, onSaveDraft }) => {
  const [form] = Form.useForm();
  const [faceModalVisible, setFaceModalVisible] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setFaceVerified(!!initialData.faceVerified);
    }
  }, [initialData, form]);

  const handleFaceScan = () => {
    setFaceModalVisible(true);
    // 模拟人脸活体检测
    setTimeout(() => {
      setFaceVerified(true);
      setFaceModalVisible(false);
      message.success("活体检测与人脸比对成功");
      onSaveDraft({ ...form.getFieldsValue(), faceVerified: true });
    }, 3000);
  };

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
    onSaveDraft({ ...allValues, faceVerified });
  };

  const onFinish = (values: any) => {
    if (!faceVerified) {
      message.error("请先完成人脸识别核验");
      return;
    }
    onNext({ ...values, faceVerified });
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

        <Divider orientation="left">活体人脸核验</Divider>
        <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500 }}>法定代表人本人核验</div>
            <Text type="secondary" style={{ fontSize: 12 }}>需授权调用设备摄像头进行活体检测</Text>
          </div>
          <Button 
            type={faceVerified ? "default" : "primary"} 
            icon={<ScanOutlined />} 
            onClick={handleFaceScan}
            disabled={faceVerified}
          >
            {faceVerified ? "已完成核验" : "开始人脸识别"}
          </Button>
        </div>

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

      <Modal
        title="人脸识别核验"
        open={faceModalVisible}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div className="face-scan-wrapper">
            <div className="face-scan-line" />
            <img src="/api/placeholder/240/240" alt="face scan" style={{ opacity: 0.5 }} />
          </div>
          <Title level={4}>请正对摄像头</Title>
          <Text type="secondary">正在调用公安权威接口比对...</Text>
        </div>
      </Modal>
    </div>
  );
};