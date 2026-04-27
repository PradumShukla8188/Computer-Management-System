"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Divider, Form, Input, Row, Select, Space, Tag, Typography, message } from "antd";
import { CheckCircleOutlined, DownloadOutlined, FileProtectOutlined, SaveOutlined } from "@ant-design/icons";
import CertificateViewer from "@/components/certificate/CertificateViewer";
import ModernCertificate from "@/components/certificate/ModernCertificate";
import { downloadIssuedCertificatePdf, useCertificateTemplates, useEligibleCertificateStudents, useIssueCertificate } from "../hooks/useCertificateApi";

const { Title, Text } = Typography;

const formatDate = (value?: string | Date) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB").replace(/\//g, "-");
};

const buildCertificateQrText = (student: any) => {
  const studentName = student?.name || "";
  const fatherName = student?.fatherName || "";
  const courseName = student?.courseId?.name || student?.courseName || "";
  const rollNo = student?.rollNo || "";

  return [
    "SST COMPUTER & WELL KNOWLEDGE INSTITUTE",
    "Certificate No: Pending Issue",
    `Student: ${studentName}`,
    `Father: ${fatherName}`,
    `Course: ${courseName}`,
    `Roll No: ${rollNo}`,
    `Issue Date: ${formatDate(new Date())}`,
  ]
    .filter(Boolean)
    .join("\n");
};

const mapStudentToCertificateData = (student: any) => ({
  student_name: student?.name || "",
  student_full_name: student?.name || "",
  name: student?.name || "",
  father_name: student?.fatherName || "",
  mother_name: student?.motherName || "",
  date_of_birth: formatDate(student?.dob),
  dob: formatDate(student?.dob),
  course_name: student?.courseId?.name || student?.courseName || "",
  course: student?.courseId?.name || student?.courseName || "",
  duration: student?.courseDuration || "",
  roll_no: student?.rollNo || "",
  roll_number: student?.rollNo || "",
  registration_number: student?.rollNo || "",
  session: student?.session || "",
  date: formatDate(new Date()),
  issue_date: formatDate(new Date()),
  student_photo: student?.studentPhoto || "",
  institute_name: "SST COMPUTER & WELL KNOWLEDGE INSTITUTE",
  institute_address: "Dikunni Dhikunni, Uttar Pradesh 241203",
  institute_contact: "9519222486, 7376486686",
  qr_code: `https://quickchart.io/qr?size=170&margin=1&text=${encodeURIComponent(buildCertificateQrText(student))}`,
});

export default function IssueCertificatePage() {
  const [form] = Form.useForm();
  const { data: templates = [], isLoading: isTemplatesLoading } = useCertificateTemplates();
  const { data: students = [], isLoading: isStudentsLoading } = useEligibleCertificateStudents();
  const { mutate: issueCertificate, isPending: loading } = useIssueCertificate();

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>({});
  const [lastIssuedId, setLastIssuedId] = useState<string | null>(null);

  const selectedStudentId = Form.useWatch("studentId", form);

  const selectedStudent = useMemo(
    () => students.find((student: any) => student._id === selectedStudentId),
    [selectedStudentId, students],
  );

  useEffect(() => {
    if (!templates.length || form.getFieldValue("templateId")) return;
    const defaultTemplate = templates.find((item: any) => item.name === "SST Default Certificate") || templates[0];
    if (defaultTemplate) {
      form.setFieldsValue({ templateId: defaultTemplate._id });
      setSelectedTemplate(defaultTemplate);
    }
  }, [templates, form]);

  const calculateGrade = (percent: number) => {
    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 70) return "B";
    if (percent >= 60) return "C";
    if (percent >= 50) return "D";
    if (percent < 40) return "Fail";
    return "Fail"; // Default for 40-49 if not specified, or just let user override
  };

  const handleFormChange = (changedValues: any, allValues: any) => {
    const student = students.find((item: any) => item._id === allValues.studentId);
    const template = templates.find((item: any) => item._id === allValues.templateId);

    // If student changed, set initial percentage and grade
    if (changedValues.studentId && student) {
      const initialPercent = student.securedPercent || "0";
      const initialGrade = calculateGrade(Number(initialPercent));
      form.setFieldsValue({
        securedPercent: initialPercent,
        grade: initialGrade
      });
      allValues.securedPercent = initialPercent;
      allValues.grade = initialGrade;
    }

    // If percentage changed, update grade
    if (changedValues.securedPercent) {
      const newGrade = calculateGrade(Number(changedValues.securedPercent));
      form.setFieldsValue({ grade: newGrade });
      allValues.grade = newGrade;
    }

    setPreviewData(student ? {
      ...mapStudentToCertificateData(student),
      secured_percent: allValues.securedPercent + "%",
      grade: allValues.grade
    } : {});
    setSelectedTemplate(template || null);
  };

  const onFinish = async (values: any) => {
    const student = students.find((item: any) => item._id === values.studentId);
    if (!student) {
      message.error("Please select an eligible student");
      return;
    }

    issueCertificate(
      {
        studentId: values.studentId,
        templateId: values.templateId,
        grade: values.grade,
        securedPercent: values.securedPercent + "%",
        data: {
          ...mapStudentToCertificateData(student),
          grade: values.grade,
          secured_percent: values.securedPercent + "%",
        },
      },
      {
        onSuccess: (response: any) => {
          console.log("Certificate Issue Response:", response);
          const issuedId = response?.data?._id || response?.data?.id || response?._id || response?.id;
          if (issuedId) {
            setLastIssuedId(issuedId);
          }
          form.resetFields();
          setSelectedTemplate(null);
          setPreviewData({});
        },
        onError: (error: any) => {
          message.error(error?.response?.data?.message || "Failed to issue certificate");
        },
      },
    );
  };

  return (
    <div className="p-6">
      <Row gutter={24}>
        <Col xs={24} xl={10}>
          <Card title={<Space><FileProtectOutlined /> Issue Certificate</Space>} className="shadow-sm">
            <Alert
              type="info"
              showIcon
              className="mb-6"
              message="Certificate eligibility rule"
              description="Only students with published marks appear here. Once marks are added and published, the student becomes eligible for certificate issuance."
            />

            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              onFinish={onFinish}
            >
              <Form.Item
                name="templateId"
                label="Select Template"
                rules={[{ required: true, message: "Please choose a certificate template" }]}
              >
                <Select placeholder="Choose a certificate template" loading={isTemplatesLoading}>
                  {templates.map((template: any) => (
                    <Select.Option key={template._id} value={template._id}>
                      {template.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="studentId"
                label="Eligible Student"
                rules={[{ required: true, message: "Please choose a student" }]}
              >
                <Select
                  placeholder="Search by student name or roll number"
                  showSearch
                  optionFilterProp="label"
                  loading={isStudentsLoading}
                  options={students.map((student: any) => ({
                    value: student._id,
                    label: `${student.name} (${student.rollNo || "No Roll"})`,
                  }))}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="securedPercent"
                    label="Secured Percentage (%)"
                    rules={[{ required: true, message: "Please enter percentage" }]}
                  >
                    <Input placeholder="e.g. 85" suffix="%" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="grade"
                    label="Student Grade"
                    rules={[{ required: true, message: "Please select student grade" }]}
                  >
                    <Select placeholder="Select student grade">
                      <Select.Option value="A+">A+ (90% & Above)</Select.Option>
                      <Select.Option value="A">A (80% & Above)</Select.Option>
                      <Select.Option value="B">B (70% & Above)</Select.Option>
                      <Select.Option value="C">C (60% & Above)</Select.Option>
                      <Select.Option value="D">D (50% & Above)</Select.Option>
                      <Select.Option value="Fail">Fail (Below 40%)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {selectedStudent && (
                <Card size="small" className="mb-4 bg-slate-50">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-600" />
                      <Text strong>{selectedStudent.name}</Text>
                    </div>
                    <Text type="secondary">Roll No: {selectedStudent.rollNo || "-"}</Text>
                    <Text type="secondary">Course: {selectedStudent.courseId?.name || selectedStudent.courseName || "-"}</Text>
                    <Text type="secondary">System Percentage: {selectedStudent.securedPercent || "0"}%</Text>
                    <Space wrap>
                      <Tag color="blue">Published marks available</Tag>
                      {selectedStudent.hasIssuedCertificate ? <Tag color="gold">Certificate already issued</Tag> : <Tag color="green">Ready to issue</Tag>}
                    </Space>
                  </div>
                </Card>
              )}

              <Divider />

              <Title level={5}>Issue Summary</Title>
              <div className="mb-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p>Date: {formatDate(new Date())}</p>
                <p>Certificate number: auto-generated on submit</p>
                <p>Status: active after issue</p>
              </div>

              <Form.Item className="mt-4 mb-0">
                <Button type="primary" htmlType="submit" size="large" block icon={<SaveOutlined />} loading={loading}>
                  Issue Certificate
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card
            title="Certificate Preview"
            className="shadow-sm"
          // extra={
          //   lastIssuedId && (
          //     <Button 
          //       type="primary" 
          //       icon={<DownloadOutlined />} 
          //       onClick={() => downloadIssuedCertificatePdf(lastIssuedId)}
          //     >
          //       Download Last Issued
          //     </Button>
          //   )
          // }
          >
            {selectedTemplate ? (
              <div className="rounded-2xl border bg-slate-50 p-4">
                {selectedTemplate.name?.toLowerCase().includes("advanced") ? (
                  <div className="flex justify-center">
                    <div className="scale-[0.6] origin-top">
                      <ModernCertificate
                        certificateNo={previewData.certificate_no || "PENDING"}
                        enrollmentNo={previewData.enrollment_no || previewData.roll_no}
                        studentName={previewData.student_full_name}
                        fatherName={previewData.father_name}
                        motherName={previewData.mother_name}
                        dob={previewData.date_of_birth}
                        courseName={previewData.course_name}
                        securedPercent={previewData.secured_percent}
                        grade={previewData.grade}
                        session={previewData.session}
                        centerCode={previewData.center_code || "SSTCI/2262025"}
                        centerName={previewData.center_name}
                        centerAddress={previewData.center_address}
                        issueDate={previewData.issue_date}
                        studentPhotoUrl={previewData.student_photo}
                        qrCodeUrl={previewData.qr_code}
                      />
                    </div>
                  </div>
                ) : (
                  <CertificateViewer
                    design={selectedTemplate.design}
                    dimensions={selectedTemplate.dimensions}
                    backgroundImage={selectedTemplate.backgroundImage}
                    data={previewData}
                  />
                )}
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-xl border border-dashed text-gray-400">
                Select a template and eligible student to preview the certificate
              </div>
            )}

            {/* {lastIssuedId && (
              <Alert
                message="Certificate Issued Successfully"
                description="The certificate has been recorded. You can now download the official PDF."
                type="success"
                showIcon
                className="mt-4"
                action={
                  <Button size="small" type="primary" icon={<DownloadOutlined />} onClick={() => downloadIssuedCertificatePdf(lastIssuedId)}>
                    Download PDF
                  </Button>
                }
              />
            )} */}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
