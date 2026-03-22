import React from "react";
import { Descriptions, Button, Divider, Tag, Checkbox } from "antd";

export const ConfirmSubmitForm: React.FC<{
  formData: any;
  onPrev: () => void;
  onSubmit: () => void;
  loading: boolean;
}> = ({ formData, onPrev, onSubmit, loading }) => {
  const [agreement, setAgreement] = React.useState(false);

  return (
    <div className="step-form-container">
      <Divider orientation="left">企业基础信息</Divider>
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="企业名称" span={2}>{formData.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="统一信用代码">{formData.unifiedCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="所属行业">{formData.industry || '-'}</Descriptions.Item>
        <Descriptions.Item label="企业规模">{formData.scale || '-'}</Descriptions.Item>
        <Descriptions.Item label="主营产品/业务" span={2}>{formData.mainProduct || '-'}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 32 }}>实名认证信息</Divider>
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="法定代表人姓名">{formData.legalPersonName || '-'}</Descriptions.Item>
        <Descriptions.Item label="身份证号">{formData.idNo?.replace(/^(.{4})(.*)(.{4})$/, "$1**********$3") || '-'}</Descriptions.Item>
        <Descriptions.Item label="对公银行卡号">{formData.bankCardNo?.replace(/^(.{4})(.*)(.{4})$/, "$1********$3") || '-'}</Descriptions.Item>
        <Descriptions.Item label="预留手机号">{formData.mobile?.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") || '-'}</Descriptions.Item>
        <Descriptions.Item label="活体核验状态">
          {formData.faceVerified ? <Tag color="success">已通过公安接口核验</Tag> : <Tag color="error">未核验</Tag>}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 32, textAlign: "center", padding: "16px", background: "#f5f5f5", borderRadius: 8 }}>
        <Checkbox checked={agreement} onChange={e => setAgreement(e.target.checked)}>
          本人承诺所填信息及上传材料真实、准确、合法、有效，并同意授权璟智通平台通过国家权威机构对以上信息进行核验。
        </Checkbox>
      </div>

      <div className="onboarding-footer">
        <Button onClick={onPrev} disabled={loading}>返回修改</Button>
        <Button type="primary" onClick={onSubmit} loading={loading} disabled={!agreement || !formData.faceVerified}>
          确认提交审核
        </Button>
      </div>
    </div>
  );
};
