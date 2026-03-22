import React, { useState, useEffect } from "react";
import { Form, Input, Select, Upload, Button, message, Space, Spin, Alert } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export const EnterpriseProfileForm: React.FC<{
  initialData: any;
  onNext: (data: any) => void;
  onSaveDraft: (data: any) => void;
}> = ({ initialData, onNext, onSaveDraft }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      if (initialData.licenseUrl) {
        setFileList([{ uid: '-1', name: '营业执照.jpg', status: 'done', url: initialData.licenseUrl }]);
      }
    }
  }, [initialData, form]);

  const handleUploadChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // 模拟OCR识别并回填
    if (newFileList.length > 0 && newFileList[0].status !== 'done' && !ocrLoading) {
      setOcrLoading(true);
      setTimeout(() => {
        form.setFieldsValue({
          unifiedCode: "91110108MA01K2XXXX",
          name: "北京测试科技有限公司",
          legalPerson: "张测试",
        });
        message.success("营业执照 OCR 识别成功并已回填");
        setOcrLoading(false);
      }, 1500);
    }
  };

  const handleValuesChange = (_: any, allValues: any) => {
    // 实时保存草稿
    onSaveDraft(allValues);
  };

  return (
    <div className="step-form-container">
      <Alert
        message="请上传真实的营业执照原件照片或扫描件，系统将自动识别企业信息"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      <Spin spinning={ocrLoading} tip="正在进行 OCR 智能识别...">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onNext({ ...values, licenseUrl: fileList[0]?.url || 'mock_url' })}
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            label="营业执照上传"
            required
            tooltip="支持JPG/PNG格式，文件大小不超过5MB"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>点击上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="统一社会信用代码"
            name="unifiedCode"
            rules={[{ required: true, pattern: /^[0-9A-Z]{18}$/, message: "请输入18位正确的信用代码" }]}
          >
            <Input placeholder="请输入或上传执照自动识别" maxLength={18} />
          </Form.Item>

          <Form.Item
            label="企业名称"
            name="name"
            rules={[{ required: true, message: "请输入企业名称" }]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              label="所属行业"
              name="industry"
              rules={[{ required: true, message: "请选择所属行业" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择">
                <Option value="IT">软件和信息技术服务业</Option>
                <Option value="Manufacture">制造业</Option>
                <Option value="Finance">金融业</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="企业规模"
              name="scale"
              rules={[{ required: true, message: "请选择企业规模" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择">
                <Option value="micro">微型企业 (20人以下)</Option>
                <Option value="small">小型企业 (20-99人)</Option>
                <Option value="medium">中型企业 (100-299人)</Option>
                <Option value="large">大型企业 (300人以上)</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            label="主营产品/业务"
            name="mainProduct"
            rules={[{ required: true, message: "请输入主营产品或业务简介" }]}
          >
            <TextArea rows={4} placeholder="请简要描述您的主营产品、服务或核心业务方向，有助于为您匹配更精准的政策与服务" />
          </Form.Item>

          <div className="onboarding-footer">
            <Button disabled>上一步</Button>
            <Button type="primary" htmlType="submit">
              保存并下一步
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};
