import React, { useState, useEffect } from "react";
import { Steps, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { EnterpriseProfileForm } from "./components/EnterpriseProfileForm";
import { RealNameVerifyForm } from "./components/RealNameVerifyForm";
import { ConfirmSubmitForm } from "./components/ConfirmSubmitForm";
import { AuditResultPage } from "./components/AuditResultPage";
import { useCertification } from "../../context/CertificationContext";
import "./styles/onboarding.css";

const DRAFT_KEY = "jzt_onboarding_draft";

export const OnboardingProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [auditStatus, setAuditStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const { submitCertification } = useCertification();
  const navigate = useNavigate();

  // 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed.data || {});
        setCurrentStep(parsed.step || 0);
        if (parsed.auditStatus) {
          setAuditStatus(parsed.auditStatus);
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  const saveDraft = (step: number, data: any, status = auditStatus) => {
    const newDraft = { step, data, auditStatus: status };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
    setFormData(data);
  };

  const next = (stepData: any) => {
    const newData = { ...formData, ...stepData };
    saveDraft(currentStep + 1, newData);
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    saveDraft(currentStep - 1, formData);
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // 模拟提交审核 API
    setTimeout(() => {
      setLoading(false);
      setAuditStatus("pending");
      saveDraft(currentStep, formData, "pending");
      message.success("资料已提交，请等待审核");
    }, 2000);
  };

  const handleRefreshAudit = () => {
    message.loading({ content: "正在查询审核结果...", key: "audit" });
    setTimeout(() => {
      // 模拟 50% 概率通过，50% 概率驳回
      const isApproved = Math.random() > 0.5;
      if (isApproved) {
        message.success({ content: "审核已通过！", key: "audit" });
        setAuditStatus("approved");
        saveDraft(currentStep, formData, "approved");
        // 更新全局认证状态
        submitCertification({
          companyName: formData.name,
          certNumber: formData.unifiedCode,
          legalPerson: formData.legalPersonName,
          certType: "business_license",
        });
      } else {
        message.error({ content: "审核被驳回，请修改资料", key: "audit" });
        setAuditStatus("rejected");
        saveDraft(currentStep, formData, "rejected");
      }
    }, 1500);
  };

  if (auditStatus !== "none") {
    return (
      <div className="onboarding-container">
        <Card className="onboarding-card">
          <AuditResultPage
            status={auditStatus as any}
            onRefresh={handleRefreshAudit}
            onResubmit={() => {
              setAuditStatus("none");
              setCurrentStep(0);
              saveDraft(0, formData, "none");
            }}
          />
        </Card>
      </div>
    );
  }

  const steps = [
    {
      title: "企业基本信息",
      content: <EnterpriseProfileForm initialData={formData} onNext={next} onSaveDraft={(d) => saveDraft(0, { ...formData, ...d })} />,
    },
    {
      title: "实名核验",
      content: <RealNameVerifyForm initialData={formData} onNext={next} onPrev={prev} onSaveDraft={(d) => saveDraft(1, { ...formData, ...d })} />,
    },
    {
      title: "信息确认",
      content: <ConfirmSubmitForm formData={formData} onPrev={prev} onSubmit={handleSubmit} loading={loading} />,
    },
  ];

  return (
    <div className="onboarding-container">
      <Card className="onboarding-card">
        <div style={{ padding: "24px 24px 0" }}>
          <Steps current={currentStep} items={steps.map(item => ({ key: item.title, title: item.title }))} />
        </div>
        <div style={{ marginTop: 24 }}>
          {steps[currentStep].content}
        </div>
      </Card>
    </div>
  );
};
