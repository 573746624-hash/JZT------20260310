/**
 * 申报向导主页面
 * 创建时间: 2026-03-23
 * 功能: 5步骤引导式申报流程
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Steps,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Alert,
  Modal,
} from 'antd';
import {
  LeftOutlined,
  SaveOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useApplications } from '../hooks/useApplications';
import Step1Basic from './Step1Basic';
import Step2Material from './Step2Material';
import Step3Preview from './Step3Preview';
import Step4Submit from './Step4Submit';
import Step5Tracking from './Step5Tracking';
import type { Application } from '../types';

const { Step } = Steps;
const { Title, Text } = Typography;

const steps = [
  {
    title: '资质填写',
    description: '填写企业信息和选择资质',
    component: Step1Basic,
  },
  {
    title: '材料上传',
    description: '上传申报所需材料',
    component: Step2Material,
  },
  {
    title: '预览确认',
    description: '检查申报信息完整性',
    component: Step3Preview,
  },
  {
    title: '确认提交',
    description: '提交申报进入审核',
    component: Step4Submit,
  },
  {
    title: '审核跟踪',
    description: '查看审核进度',
    component: Step5Tracking,
  },
];

const ApplyWizard: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    getApplication,
    createApplication,
    updateApplication,
    submitApplication,
  } = useApplications();

  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isDirty, setIsDirty] = useState(false);

  // 加载申报数据
  useEffect(() => {
    const loadApplication = async () => {
      if (id) {
        setLoading(true);
        const app = getApplication(id);
        if (app) {
          setApplication(app);
          setCurrentStep(app.currentStep - 1);
          setFormData({
            basicInfo: app.basicInfo,
            qualifications: app.qualifications,
            materials: app.materials,
            contactInfo: app.contactInfo,
          });
        } else {
          message.error('申报项目不存在');
          navigate('/application-new/my');
        }
        setLoading(false);
      } else {
        // 新建申报，默认第一步
        setCurrentStep(0);
        setFormData({
          basicInfo: {
            companyName: '深圳市创新科技有限公司',
            creditCode: '91440300MA5GXXXXXX',
            legalPerson: '张三',
            registeredCapital: '1000万元',
            establishDate: '2020-03-15',
            industry: '软件和信息技术服务业',
            scale: '中型企业',
            address: '深圳市南山区科技园',
            businessScope: '软件开发、技术咨询',
          },
          qualifications: [],
          materials: [],
          contactInfo: {
            contactName: '张三',
            contactPhone: '13800138000',
            contactEmail: 'zhangsan@example.com',
          },
        });
      }
    };
    loadApplication();
  }, [id, getApplication, navigate]);

  // 自动保存草稿
  useEffect(() => {
    if (isDirty && application) {
      const timer = setTimeout(() => {
        handleSaveDraft();
      }, 30000); // 30秒自动保存
      return () => clearTimeout(timer);
    }
  }, [isDirty, formData, application]);

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!application && !id) {
      // 首次保存，创建新申报
      const newApp = await createApplication({
        name: formData.basicInfo?.companyName + '的申报',
        basicInfo: formData.basicInfo,
        qualifications: formData.qualifications,
        contactInfo: formData.contactInfo,
      });
      setApplication(newApp);
      message.success('草稿已保存');
      setIsDirty(false);
      // 更新URL
      navigate(`/application-new/wizard/${newApp.id}`, { replace: true });
    } else if (application) {
      // 更新现有申报
      updateApplication(application.id, {
        basicInfo: formData.basicInfo,
        qualifications: formData.qualifications,
        materials: formData.materials,
        contactInfo: formData.contactInfo,
        currentStep: currentStep + 1,
        progress: Math.round(((currentStep + 1) / steps.length) * 100),
      });
      message.success('草稿已保存');
      setIsDirty(false);
    }
  };

  // 下一步
  const handleNext = async () => {
    // 验证当前步骤
    const currentStepComponent = steps[currentStep].component;
    // 这里可以调用子组件的验证方法

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsDirty(true);
    }
  };

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // 提交申报
  const handleSubmit = async () => {
    Modal.confirm({
      title: '确认提交申报',
      content: '提交后将进入审核流程，是否确认？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        if (application) {
          submitApplication(application.id);
          message.success('申报提交成功');
          setCurrentStep(4); // 跳转到审核跟踪
        }
      },
    });
  };

  // 表单数据更新
  const handleFormChange = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setIsDirty(true);
  };

  // 渲染当前步骤组件
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate('/application-new/my')}
          style={{ marginBottom: 16 }}
        >
          返回我的申报
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          {application ? '继续申报' : '新建申报'}
        </Title>
        <Text type="secondary">
          {application?.name || '请按照步骤完成申报信息填写'}
        </Text>
      </div>

      <Spin spinning={loading}>
        {/* 步骤条 */}
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Steps
            current={currentStep}
            status={application?.status === 'rejected' ? 'error' : 'process'}
            responsive
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
              />
            ))}
          </Steps>
        </Card>

        {/* 步骤内容 */}
        <Card
          style={{ borderRadius: 8, minHeight: 500 }}
          bodyStyle={{ padding: 24 }}
        >
          <CurrentStepComponent
            formData={formData}
            onChange={handleFormChange}
            application={application}
          />
        </Card>

        {/* 操作栏 */}
        <Card style={{ marginTop: 24, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="large"
              onClick={handlePrev}
              disabled={currentStep === 0}
              icon={<LeftOutlined />}
            >
              上一步
            </Button>

            <Space>
              <Button
                size="large"
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                loading={saving}
              >
                保存草稿
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  icon={<RightOutlined />}
                >
                  下一步
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  icon={<CheckCircleOutlined />}
                  disabled={!application}
                >
                  提交申报
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ApplyWizard;
