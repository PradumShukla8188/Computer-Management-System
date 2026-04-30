"use client";

import React, { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Divider, Form, Row, Select, Space, Tag, Typography, message } from "antd";
import { FileTextOutlined, SaveOutlined, DownloadOutlined } from "@ant-design/icons";
import ModernMarksheet from "@/components/marksheet/ModernMarksheet";
import { useEligibleMarksheetStudents, downloadIssuedMarksheetPdf } from "../hooks/useMarksheetApi";

const { Title, Text } = Typography;

const formatDate = (value?: string | Date) => {
  if (!value) return "";
  const parsed = new Date(value);
  return parsed.toLocaleDateString("en-GB").replace(/\//g, "-");
};

const calculateGrade = (percent: number) => {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "Fail";
};

export default function IssueMarksheetPage() {
  const [form] = Form.useForm();
  const { data: students = [], isLoading: isStudentsLoading } = useEligibleMarksheetStudents();
  const [previewData, setPreviewData] = useState<any>(null);

  const selectedStudentId = Form.useWatch("studentId", form);
  const selectedExamName = Form.useWatch("examName", form);

  const selectedStudent = useMemo(
    () => students.find((s: any) => s._id === selectedStudentId),
    [selectedStudentId, students]
  );

  const examOptions = useMemo(() => {
    if (!selectedStudent) return [];
    const exams = new Set(selectedStudent.marks?.map((m: any) => m.examName));
    return Array.from(exams).map(name => ({ label: name, value: name }));
  }, [selectedStudent]);

  const handleFormChange = (changedValues: any, allValues: any) => {
    if (!allValues.studentId || !allValues.examName) {
      setPreviewData(null);
      return;
    }

    const student = students.find((s: any) => s._id === allValues.studentId);
    if (!student) return;

    const examMarks = student.marks.filter((m: any) => m.examName === allValues.examName);
    if (examMarks.length === 0) {
      setPreviewData(null);
      return;
    }

    const totalObtained = examMarks.reduce((sum: number, m: any) => sum + m.obtainedMarks, 0);
    const totalMax = examMarks.reduce((sum: number, m: any) => sum + m.totalMarks, 0);
    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0";
    const grade = calculateGrade(Number(percentage));

    setPreviewData({
      marksheetNo: "MS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      rollNo: student.rollNo,
      studentName: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      dob: formatDate(student.dob),
      courseName: student.courseId?.name || student.courseName,
      session: student.session || "2025-2026",
      issueDate: formatDate(new Date()),
      studentPhotoUrl: student.studentPhoto,
      subjects: examMarks.map((m: any) => ({
        title: m.subjectId?.title || "Subject",
        totalMarks: m.totalMarks,
        obtainedMarks: m.obtainedMarks
      })),
      totalObtained,
      totalMaximum: totalMax,
      percentage,
      grade,
      result: Number(percentage) >= 40 ? "PASS" : "FAIL"
    });
  };

  const onDownload = () => {
    if (!selectedStudentId || !selectedExamName) {
      message.error("Please select a student and exam first");
      return;
    }
    downloadIssuedMarksheetPdf(selectedStudentId, selectedExamName, `marksheet-${selectedStudent.name}.pdf`);
  };

  return (
    <div className="p-6">
      <Row gutter={24}>
        <Col xs={24} xl={10}>
          <Card title={<Space><FileTextOutlined /> Issue Marksheet</Space>} className="shadow-sm">
            <Alert
              type="info"
              showIcon
              className="mb-6"
              message="Marksheet Availability"
              description="Only students with published marks appear here. You can select the exam type to generate the specific marksheet."
            />

            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
            >
              <Form.Item
                name="studentId"
                label="Select Student"
                rules={[{ required: true, message: "Please choose a student" }]}
              >
                <Select
                  placeholder="Search by name or roll number"
                  showSearch
                  optionFilterProp="label"
                  loading={isStudentsLoading}
                  options={students.map((s: any) => ({
                    value: s._id,
                    label: `${s.name} (${s.rollNo || "No Roll"})`,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="examName"
                label="Select Exam"
                rules={[{ required: true, message: "Please choose an exam" }]}
              >
                <Select
                  placeholder="Choose exam type"
                  disabled={!selectedStudentId}
                  options={examOptions}
                />
              </Form.Item>

              {selectedStudent && (
                <Card size="small" className="mb-4 bg-blue-50 border-blue-100">
                  <div className="text-sm">
                    <p><strong>Course:</strong> {selectedStudent.courseId?.name || selectedStudent.courseName}</p>
                    <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
                  </div>
                </Card>
              )}

              <Divider />

              <Space direction="vertical" className="w-full">
                <Button type="primary" size="large" block icon={<DownloadOutlined />} onClick={onDownload} disabled={!previewData}>
                  Download Marksheet PDF
                </Button>
                <Text type="secondary" className="text-xs text-center block">
                  Downloading will officially record the marksheet issuance.
                </Text>
              </Space>
            </Form>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card title="Marksheet Preview" className="shadow-sm">
            {previewData ? (
              <div className="rounded-2xl border bg-slate-50 p-4 overflow-auto">
                <div className="scale-[0.6] origin-top mx-auto" style={{ width: '900px', height: '1100px' }}>
                  <ModernMarksheet {...previewData} />
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-xl border border-dashed text-gray-400">
                Select a student and exam to preview the marksheet
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
