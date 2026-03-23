/**
 * 申报向导 - 步骤2：证明材料上传
 * 创建时间: 2026-03-23
 */

import React, { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  Typography,
  Space,
  Tag,
  Progress,
  Alert,
  List,
  Tooltip,
  Row,
  Col,
} from 'antd';
import {
  UploadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import type { Application, ApplicationMaterial } from '../types';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface Step2MaterialProps {
  formData: any;
  onChange: (data: any) => void;
  application: Application | null;
}

// 材料清单模板
const materialTemplates: ApplicationMaterial[] = [
  {
    id: 'mat-1',
    name: '营业执照（三证合一）',
    type: 'license',
    required: true,
    description: '企业营业执照扫描件，需加盖公章',
    status: 'pending',
  },
  {
    id: 'mat-2',
    name: '财务审计报告',
    type: 'finance',
    required: true,
    description: '上年度财务审计报告，需会计师事务所盖章',
    status: 'pending',
  },
  {
    id: 'mat-3',
    name: '知识产权证明',
    type: 'ip',
    required: true,
    description: '专利证书、软件著作权等知识产权证明',
    status: 'pending',
  },
  {
    id: 'mat-4',
    name: '研发项目证明',
    type: 'rd',
    required: false,
    description: '研发项目立项书、验收报告等',
    status: 'pending',
  },
  {
    id: 'mat-5',
    name: '人员情况说明',
    type: 'personnel',
    required: false,
    description: '研发人员学历证明、劳动合同等',
    status: 'pending',
  },
];

const Step2Material: React.FC<Step2MaterialProps> = ({ formData, onChange, application }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <FileImageOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
    if (['doc', 'docx'].includes(ext || '')) return <FileWordOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
    return <FilePdfOutlined style={{ fontSize: 24 }} />;
  };

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload', // 实际API地址
    accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        // message.error('文件大小不能超过 10MB');
      }
      return isLt10M;
    },
    onChange: (info) => {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true);
        setProgress(info.file.percent || 0);
      }
      if (status === 'done') {
        setUploading(false);
        // 更新材料列表
        const newMaterials = formData.materials?.map((m: ApplicationMaterial) =>
          m.id === info.file.uid
            ? { ...m, fileUrl: info.file.response?.url, fileName: info.file.name, status: 'uploaded' }
            : m
        ) || [];
        onChange({ materials: newMaterials });
      }
    },
  };

  // 删除已上传文件
  const handleDelete = (materialId: string) => {
    const newMaterials = formData.materials?.map((m: ApplicationMaterial) =>
      m.id === materialId
        ? { ...m, fileUrl: undefined, fileName: undefined, status: 'pending' }
        : m
    ) || [];
    onChange({ materials: newMaterials });
  };

  // 计算上传进度
  const uploadedCount = formData.materials?.filter((m: ApplicationMaterial) => m.status === 'uploaded').length || 0;
  const requiredCount = materialTemplates.filter(m => m.required).length;
  const uploadProgress = Math.round((uploadedCount / requiredCount) * 100);

  return (
    <div>
      <Title level={4}>证明材料上传</Title>
      <Text type="secondary">请上传申报所需的各类证明材料</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左侧上传区 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* 上传进度 */}
            <Card size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>材料上传进度</Text>
                <Text type="secondary">{uploadedCount} / {requiredCount} 项必填材料</Text>
              </div>
              <Progress
                percent={uploadProgress}
                status={uploadProgress === 100 ? 'success' : 'active'}
                style={{ marginTop: 8 }}
              />
            </Card>

            {/* 拖拽上传区 */}
            <Card>
              <Dragger {...uploadProps} style={{ padding: 24 }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持 PDF、JPG、PNG、DOC 格式，单个文件不超过 10MB
                </p>
              </Dragger>
            </Card>

            {/* 材料清单 */}
            <Card title="材料清单" size="small">
              <Alert
                message="请按照要求上传所有材料，带 * 号为必填"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <List
                dataSource={materialTemplates}
                renderItem={(item) => {
                  const uploadedMaterial = formData.materials?.find((m: ApplicationMaterial) => m.id === item.id);
                  const isUploaded = uploadedMaterial?.status === 'uploaded';

                  return (
                    <List.Item
                      actions={[
                        isUploaded ? (
                          <Space>
                            <Tag icon={<CheckCircleOutlined />} color="success">
                              已上传
                            </Tag>
                            <Tooltip title="删除">
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(item.id)}
                              />
                            </Tooltip>
                          </Space>
                        ) : (
                          <Upload {...uploadProps} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>上传</Button>
                          </Upload>
                        ),
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>{item.name}</Text>
                            {item.required && <Tag color="red">必填</Tag>}
                            {!item.required && <Tag>选填</Tag>}
                          </Space>
                        }
                        description={
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.description}
                            </Text>
                            {isUploaded && (
                              <div style={{ marginTop: 4 }}>
                                <Space>
                                  {getFileIcon(uploadedMaterial.fileName || '')}
                                  <Text style={{ fontSize: 12 }}>{uploadedMaterial.fileName}</Text>
                                </Space>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          </Space>
        </Col>

        {/* 右侧提示区 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="材料要求" size="small">
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>所有材料需加盖企业公章</li>
                <li>扫描件要求清晰可辨</li>
                <li>单个文件不超过 10MB</li>
                <li>支持批量上传</li>
              </ul>
            </Card>

            <Card title="材料模板" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button icon={<DownloadOutlined />} block>
                  财务审计报告模板
                </Button>
                <Button icon={<DownloadOutlined />} block>
                  知识产权清单模板
                </Button>
                <Button icon={<DownloadOutlined />} block>
                  研发项目说明模板
                </Button>
              </Space>
            </Card>

            <Card title="常见问题" size="small">
              <Space direction="vertical" size={8}>
                <Text style={{ fontSize: 13 }}>Q: 材料上传失败怎么办？</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  A: 请检查文件大小和格式是否符合要求。
                </Text>
                <Text style={{ fontSize: 13 }}>Q: 可以修改已上传的材料吗？</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  A: 可以，删除后重新上传即可。
                </Text>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Step2Material;
