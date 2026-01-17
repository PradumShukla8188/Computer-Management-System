"use client";

import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Card, Form, Select, Divider, Row, Col, message } from 'antd';
import { FileProtectOutlined, EyeOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import CertificateViewer from '@/components/certificate/CertificateViewer';

const { Content } = Layout;
const { Title, Text } = Typography;

import { useCertificateTemplates, useIssueCertificate, useStudentList } from '../hooks/useCertificateApi';

export default function IssueCertificatePage() {
  const [form] = Form.useForm();
  const { data: templates = [], isLoading: isTemplatesLoading } = useCertificateTemplates();
  const { data: students = [], isLoading: isStudentsLoading } = useStudentList();
  const { mutate: issueCertificate, isPending: loading } = useIssueCertificate();

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>({});

  const handleFormChange = (_: any, allValues: any) => {
    const student = students.find((s: any) => s._id === allValues.studentId);
    setPreviewData({
      student_name: student?.name || 'Select Student',
      course_name: student?.courseId?.name || student?.courseName || 'Select Course',
      date: new Date().toLocaleDateString(),
    });
    
    const template = templates.find((t: any) => t._id === allValues.templateId);
    setSelectedTemplate(template);
  };

  const onFinish = async (values: any) => {
    const student = students.find((s: any) => s._id === values.studentId);
    issueCertificate({
      studentId: values.studentId,
      templateId: values.templateId,
      data: {
        student_name: student?.name,
        course_name: student?.courseId?.name,
        date: new Date().toLocaleDateString(),
      }
    }, {
      onSuccess: () => {
        form.resetFields();
        setSelectedTemplate(null);
        setPreviewData({});
      }
    });
  };

  return (
    <div className="p-6">
      <Row gutter={24}>
        <Col span={10}>
          <Card title={<Space><FileProtectOutlined /> Issue Certificate</Space>}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              onFinish={onFinish}
            >
              <Form.Item name="templateId" label="Select Template" rules={[{ required: true }]}>
                <Select placeholder="Choose a certificate template" loading={isTemplatesLoading}>
                  {templates.map((t: any) => <Select.Option key={t._id} value={t._id}>{t.name}</Select.Option>)}
                </Select>
              </Form.Item>

              <Form.Item name="studentId" label="Select Student" rules={[{ required: true }]}>
                <Select placeholder="Search for a student" showSearch optionFilterProp="children" loading={isStudentsLoading}>
                  {students.map((s: any) => <Select.Option key={s._id} value={s._id}>{s.name} ({s.courseName})</Select.Option>)}
                </Select>
              </Form.Item>

              <Divider />

              <Title level={5}>Additional Info</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="certificateNumber" label="Certificate No (Optional)">
                    <Select placeholder="Auto-generate" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="issueDate" label="Issue Date">
                    <Text type="secondary">{new Date().toLocaleDateString()}</Text>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="mt-4">
                <Button type="primary" htmlType="submit" size="large" block icon={<SaveOutlined />} loading={loading}>
                  Issue Certificate
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={14}>
          <Card title="Certificate Preview">
            {selectedTemplate ? (
              <div className="flex justify-center border p-4 bg-gray-50 scale-75 origin-top">
                <CertificateViewer 
                  design={selectedTemplate.design} 
                  dimensions={selectedTemplate.dimensions} 
                  data={previewData} 
                />
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-400 border border-dashed rounded">
                Select a template and student to see preview
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
