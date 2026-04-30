"use client";

import React, { useState } from "react";
import { Table, Card, Button, Space, Input, Tag, Typography, Modal } from "antd";
import { SearchOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import ModernMarksheet from "@/components/marksheet/ModernMarksheet";
import { useEligibleMarksheetStudents, downloadIssuedMarksheetPdf } from "../hooks/useMarksheetApi";

const { Title, Text } = Typography;

const calculateGrade = (percent: number) => {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "Fail";
};

export default function MarksheetListPage() {
  const { data: students = [], isLoading } = useEligibleMarksheetStudents();
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<any>(null);

  const flattenData = () => {
    const data: any[] = [];
    students.forEach((student: any) => {
      // Group student marks by exam
      const examGroups = student.marks.reduce((acc: any, m: any) => {
        if (!acc[m.examName]) acc[m.examName] = [];
        acc[m.examName].push(m);
        return acc;
      }, {});

      Object.entries(examGroups).forEach(([examName, marks]: [string, any]) => {
        const totalObtained = marks.reduce((sum: number, m: any) => sum + m.obtainedMarks, 0);
        const totalMax = marks.reduce((sum: number, m: any) => sum + m.totalMarks, 0);
        const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0";
        
        data.push({
          key: `${student._id}-${examName}`,
          student,
          studentName: student.name,
          rollNo: student.rollNo,
          course: student.courseId?.name || student.courseName,
          examName,
          totalObtained,
          totalMax,
          percentage,
          grade: calculateGrade(Number(percentage)),
          marks
        });
      });
    });
    return data;
  };

  const filteredData = flattenData().filter(item => 
    item.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.rollNo.toLowerCase().includes(searchText.toLowerCase()) ||
    item.course.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePreview = (record: any) => {
    const preview = {
      marksheetNo: "MS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      rollNo: record.rollNo,
      studentName: record.studentName,
      fatherName: record.student.fatherName,
      motherName: record.student.motherName,
      dob: new Date(record.student.dob).toLocaleDateString("en-GB").replace(/\//g, "-"),
      courseName: record.course,
      session: record.student.session || "2025-2026",
      issueDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      studentPhotoUrl: record.student.studentPhoto,
      subjects: record.marks.map((m: any) => ({
        title: m.subjectId?.title || "Subject",
        totalMarks: m.totalMarks,
        obtainedMarks: m.obtainedMarks
      })),
      totalObtained: record.totalObtained,
      totalMaximum: record.totalMax,
      percentage: record.percentage,
      grade: record.grade,
      result: Number(record.percentage) >= 40 ? "PASS" : "FAIL",
      studentId: record.student._id
    };
    setCurrentPreview(preview);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Student Details',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text>
          <div className="text-xs text-gray-500">Roll: {record.rollNo}</div>
        </div>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Exam',
      dataIndex: 'examName',
      key: 'examName',
      render: (exam: string) => <Tag color="blue">{exam}</Tag>
    },
    {
      title: 'Marks',
      key: 'marks',
      render: (record: any) => (
        <div className="text-center">
          <Text strong>{record.totalObtained}/{record.totalMax}</Text>
          <div className="text-xs text-gray-500">{record.percentage}%</div>
        </div>
      ),
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: string) => {
        let color = grade === 'Fail' ? 'red' : 'green';
        if (grade === 'A+') color = 'gold';
        return <Tag color={color} className="font-bold">{grade}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handlePreview(record)}>Preview</Button>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={() => downloadIssuedMarksheetPdf(record.student._id, record.examName, `marksheet-${record.studentName}.pdf`)}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card 
        title={<Space><FileTextOutlined className="text-blue-600" /> Issued Marksheet List</Space>}
        className="shadow-sm"
        extra={
          <Input
            placeholder="Search student, roll or course..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={e => setSearchText(e.target.value)}
          />
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Marksheet Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>Close</Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => {
              if (currentPreview) {
                downloadIssuedMarksheetPdf(currentPreview.studentId || '', currentPreview.examName || '', `marksheet.pdf`);
              }
            }}
          >
            Download PDF
          </Button>
        ]}
        width={1000}
        centered
      >
        {currentPreview && (
          <div className="bg-slate-100 p-8 rounded-xl overflow-auto max-h-[70vh]">
            <div className="scale-[0.8] origin-top mx-auto" style={{ width: '900px' }}>
              <ModernMarksheet {...currentPreview} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
