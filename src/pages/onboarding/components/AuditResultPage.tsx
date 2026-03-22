import React from "react";
import { Result, Button, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Paragraph, Text } = Typography;

export const AuditResultPage: React.FC<{
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  onResubmit?: () => void;
  onRefresh?: () => void;
}> = ({ status, rejectReason, onResubmit, onRefresh }) => {
  const navigate = useNavigate();

  if (status === "pending") {
    return (
      <Result
        status="info"
        title="资料已提交，审核中..."
        subTitle="预计需要 1-3 个工作日完成审核，审核结果将通过短信通知您。"
        extra={[
          <Button type="primary" key="refresh" onClick={onRefresh}>
            刷新审核状态
          </Button>,
          <Button key="home" onClick={() => navigate("/")}>
            返回首页体验部分功能
          </Button>,
        ]}
      />
    );
  }

  if (status === "rejected") {
    return (
      <Result
        status="error"
        title="企业实名认证被驳回"
        subTitle="非常抱歉，您的认证申请未能通过审核，请修改后重新提交。"
        extra={[
          <Button type="primary" key="resubmit" onClick={onResubmit}>
            修改并重新提交
          </Button>,
        ]}
      >
        <div style={{ background: "#fafafa", padding: "24px", borderRadius: "8px" }}>
          <Text strong style={{ fontSize: 16 }}>驳回原因：</Text>
          <Paragraph type="danger" style={{ marginTop: 8 }}>
            {rejectReason || "上传的营业执照照片不清晰或存在篡改痕迹，请重新上传原件清晰照片。"}
          </Paragraph>
        </div>
      </Result>
    );
  }

  return (
    <Result
      status="success"
      title="恭喜！企业实名认证已通过"
      subTitle="您已成功解锁璟智通平台全部功能权限。"
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          立即进入系统
        </Button>,
      ]}
    />
  );
};
