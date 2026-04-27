"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  Space, 
  Empty, 
  Spin, 
  Tag, 
  Alert,
  DatePicker
} from "antd";
import { 
  SearchOutlined, 
  SafetyCertificateOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  NumberOutlined,
  BankOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import ModernCertificate from "@/components/certificate/ModernCertificate";
import { usePublicSearchCertificates } from "../../(admin)/(private)/certificate/hooks/useCertificateApi";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const certNoParam = searchParams.get("certNo");
  
  const [form] = Form.useForm();
  const [searchCriteria, setSearchCriteria] = useState<any>({});

  const { data: results = [], isLoading, isFetched } = usePublicSearchCertificates(searchCriteria);

  useEffect(() => {
    if (certNoParam) {
      const criteria = { search: certNoParam, searchType: "certificateNo" };
      setSearchCriteria(criteria);
      form.setFieldsValue({ search: certNoParam, searchType: "certificateNo" });
    }
  }, [certNoParam, form]);

  const onFinish = (values: any) => {
    const criteria: any = {
      search: values.search,
      searchType: values.searchType || "certificateNo",
      studentName: values.studentName,
      dob: values.dob ? values.dob.format("DD-MM-YYYY") : undefined,
    };
    setSearchCriteria(criteria);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SafetyCertificateOutlined style={{ fontSize: "48px", color: "#1e40af" }} />
          <Title level={1} className="mt-4">Certificate Verification</Title>
          <Text type="secondary" className="text-lg">
            Verify the authenticity of certificates issued by SST COMPUTER & WELL KNOWLEDGE INSTITUTE
          </Text>
        </div>

        <Card className="shadow-md mb-8 rounded-2xl overflow-hidden border-none">
          <div className="bg-blue-600 p-1 mb-6"></div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ searchType: "certificateNo" }}
          >
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="searchType"
                  label="Search By"
                >
                  <select 
                    className="ant-input w-full p-2 border border-gray-300 rounded-md"
                    style={{ height: "40px" }}
                  >
                    <option value="certificateNo">Certificate No</option>
                    <option value="enrollment">Enrollment No</option>
                    <option value="roll">Roll No</option>
                  </select>
                </Form.Item>
              </Col>
              <Col xs={24} md={16}>
                <Form.Item
                  name="search"
                  label="Number (Enrollment / Certificate / Roll)"
                  rules={[{ required: true, message: "Please enter the number" }]}
                >
                  <Input 
                    prefix={<NumberOutlined />} 
                    placeholder="e.g. CERT-25042026-7094 or 34257283" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider>OR Search by Details</Divider>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="studentName"
                  label="Student Name"
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter student name" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="dob"
                  label="Date of Birth"
                >
                  <DatePicker 
                    className="w-full" 
                    format="DD-MM-YYYY" 
                    placeholder="Select date of birth" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 text-center mt-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />} 
                size="large" 
                className="px-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700"
                loading={isLoading}
              >
                Verify Now
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {isLoading ? (
          <div className="text-center py-20">
            <Spin size="large" tip="Verifying certificate..." />
          </div>
        ) : isFetched && results.length === 0 ? (
          <Empty 
            description="No matching certificate found. Please check the details and try again." 
            className="py-12 bg-white rounded-2xl shadow-sm"
          />
        ) : results.length > 0 ? (
          <div className="space-y-8">
            {results.map((item: any, index: number) => (
              <div key={index} className="space-y-8">
                <Alert
                  message="Certificate Verified Successfully"
                  description="The details provided match our records. Below is the authentic certificate information."
                  type="success"
                  showIcon
                  className="rounded-xl shadow-sm"
                />

                <Row gutter={24}>
                  <Col xs={24} lg={8}>
                    <Card title={<Space><UserOutlined /> Student Details</Space>} className="shadow-sm rounded-xl h-full">
                      <div className="space-y-4">
                        <div>
                          <Text type="secondary">Full Name</Text>
                          <Text strong className="text-lg uppercase">{item.student.name}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Enrollment / Roll No</Text>
                          <Text strong>{item.student.rollNo}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Course Name</Text>
                          <Text strong>{item.student.courseId?.name || item.student.courseName}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Date of Birth</Text>
                          <Text strong>{dayjs(item.student.dob).format("DD-MM-YYYY")}</Text>
                        </div>
                        <Divider />
                        <div>
                          <Text type="secondary">Grade Secured</Text>
                          <Tag color="gold" className="text-lg px-3 py-1 font-bold">
                            {item.certificate?.grade || item.student.grade || "N/A"}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} lg={16}>
                    <Card title={<Space><BankOutlined /> Institute Details</Space>} className="shadow-sm rounded-xl">
                      <Row gutter={16}>
                        <Col span={16}>
                          <div className="space-y-3">
                            <Title level={4} className="mb-0">SST COMPUTER & WELL KNOWLEDGE INSTITUTE</Title>
                            <Text type="secondary">ISO 9001:2026 Certified Institute</Text>
                            <div className="mt-4">
                              <Text style={{ display: 'block' }}><Text strong>Address:</Text> Dikunni Dhikunni, Bharawan, Hardoi, Uttar Pradesh 241203</Text>
                              <Text style={{ display: 'block' }}><Text strong>Contact:</Text> 9519222486, 7376486686</Text>
                              <Text style={{ display: 'block' }}><Text strong>Verification Date:</Text> {dayjs().format("DD-MM-YYYY HH:mm")}</Text>
                            </div>
                          </div>
                        </Col>
                        <Col span={8} className="text-right">
                          <CheckCircleOutlined style={{ fontSize: "64px", color: "#52c41a" }} />
                          <div className="mt-2 text-green-600 font-bold uppercase tracking-widest">Genuine</div>
                        </Col>
                      </Row>
                    </Card>

                    <div className="mt-8 overflow-auto flex justify-center bg-white p-8 rounded-2xl shadow-sm">
                      <div className="scale-[0.75] md:scale-[1] origin-top">
                        {item.certificate && (
                          <ModernCertificate
                            certificateNo={item.certificate.certificateNumber}
                            enrollmentNo={item.student.rollNo}
                            studentName={item.student.name}
                            fatherName={item.student.fatherName}
                            motherName={item.student.motherName}
                            dob={dayjs(item.student.dob).format("DD-MM-YYYY")}
                            courseName={item.student.courseId?.name || item.student.courseName}
                            securedPercent={item.student.securedPercent}
                            grade={item.certificate.grade || item.student.grade}
                            session={item.student.session}
                            centerCode={item.student.centerCode}
                            centerName="SST COMPUTER & WELL KNOWLEDGE INSTITUTE"
                            issueDate={dayjs(item.certificate.issuedAt).format("DD-MM-YYYY")}
                            studentPhotoUrl={item.student.studentPhoto}
                            qrCodeUrl={item.certificate.data?.qr_code}
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
            <Space direction="vertical" size="large">
              <div className="p-4 bg-blue-50 rounded-full inline-block">
                <SafetyCertificateOutlined style={{ fontSize: "48px", color: "#1e40af" }} />
              </div>
              <div>
                <Title level={4}>Ready to Verify</Title>
                <Text type="secondary">Enter the certificate details above to verify the student record.</Text>
              </div>
            </Space>
          </div>
        )}

        <div className="text-center mt-12 text-slate-400">
          <p>© {new Date().getFullYear()} SST COMPUTER & WELL KNOWLEDGE INSTITUTE. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spin size="large" tip="Loading verification..." /></div>}>
      <VerifyCertificateContent />
    </Suspense>
  );
}
