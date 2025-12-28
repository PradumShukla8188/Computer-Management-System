"use client";

import { apiEndPoints } from "@/constants/apiEndPoint";
import { Student } from "@/interfaces/addStudent";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import {
  CalendarOutlined,
  ContactsOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  BookOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Card, Col, Divider, Row, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ViewStudent.module.css";

const { Title, Text } = Typography;


const ViewStudent = ({id} : {id : string}) => { 
  const router = useRouter();

  const { data: student, isLoading, isError } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await ApiHitter("GET", "GET_STUDENT_BY_ID", {}, id);
      return response?.data;
    },
    enabled: !!id,
  });


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" tip="Loading Student Details..." />
      </div>
    );
  }

  if (isError ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Title level={4} type="danger">
          Student not found or error occurred.
        </Title>
        <Link href="/student">
          <Button type="primary">Go Back to List</Button>
        </Link>
      </div>
    );
  }

  // Helper to safely render fields
  const renderField = (label: string, value: any, icon?: React.ReactNode) => (
    <div className="mb-4">
      <Text type="secondary" className="block text-xs uppercase tracking-wide mb-1">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Text>
      <Text strong className="text-gray-800 dark:text-gray-200 text-base">
        {value || "N/A"}
      </Text>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="flex items-center gap-2 border-none bg-transparent shadow-none hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Back to Students
        </Button>
        <div className="flex gap-2">
            <Link href={`/student/edit/${id}`}>
                <Button type="primary">Edit Profile</Button> 
            </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: ID Card & Key Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* ID CARD DESIGN */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-2xl transition-transform hover:scale-[1.02]">
            {/* Background Pattern */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 mb-6 flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <IdcardOutlined />
                </div>
                <span className="font-bold tracking-wider">STUDENT ID</span>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">Enrollment No</div>
                <div className="font-mono font-bold">{student?.enrollmentNo || "PENDING"}</div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full border-4 border-white/30 p-1 shadow-lg">
                <Avatar
                  size={100}
                  src={student?.studentPhoto}
                  icon={<UserOutlined />}
                  className="bg-white text-indigo-600"
                />
              </div>
              <h2 className="mb-1 text-2xl font-bold text-white">{student?.name}</h2>
              <p className="mb-4 text-sm font-medium text-white/80">{student?.courseName}</p>
              
              <div className="my-2 flex gap-2">
                  <Tag color={student?.status === "Active" ? "success" : student?.status === "Inactive" ? "error" : "warning"} className="border-none px-3 py-1">
                      {student?.status || "Unknown"}
                  </Tag>
                  <Tag color="geekblue" className="border-none px-3 py-1">
                      {student.examMode || "Mode N/A"}
                  </Tag>
              </div>
            </div>

            {/* Footer Details */}
            <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-sm">
              <div>
                <div className="text-xs opacity-70">Date of Birth</div>
                <div className="font-semibold">{dayjs(student?.dob).format("DD MMM YYYY")}</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-70">Valid Upto</div>
                <div className="font-semibold">
                    {student?.dateOfAdmission ? dayjs(student?.dateOfAdmission).add(parseInt(student?.courseDuration) || 12, 'month').format("MMM YYYY") : "N/A"}
                </div>
              </div>
            </div>
            
             {/* Barcode Simulation */}
             <div className="relative z-10 mt-6 opacity-60">
                <div className="h-8 w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_39_encoded_text_%22WIKIPEDIA%22.svg/1200px-Code_39_encoded_text_%22WIKIPEDIA%22.svg.png')] bg-contain bg-repeat-x grayscale brightness-200"></div>
             </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2">
          <Card 
            className="rounded-xl border-gray-100 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            classNames={{ body: styles.customScrollbar }}
          >
            <Title level={4} className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-200">
               <span className="text-indigo-600"><FileTextOutlined /></span> Detailed Information
            </Title>
            
            <Divider titlePlacement="start" className="!mb-6 !mt-0 !text-gray-500">
                <UserOutlined /> Personal Details
            </Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                {renderField("Full Name", student?.name)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Father's Name", student?.fatherName)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Mother's Name", student?.motherName)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Gender", student?.gender)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Religion", student?.religion)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Category", student?.category)}
              </Col>
            </Row>

            <Divider titlePlacement="start" className="!my-6 !text-gray-500">
               <ContactsOutlined /> Contact & Address
            </Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                {renderField("Email", student?.email, <MailOutlined />)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Mobile", student?.mobile, <PhoneOutlined />)}
              </Col>
              <Col span={24}>
                {renderField("Residential Address", student?.residentialAddress, <EnvironmentOutlined />)}
              </Col>
              <Col xs={24} sm={8}>
                {renderField("District", student?.district)}
              </Col>
               <Col xs={24} sm={8}>
                {renderField("State", student?.state)}
              </Col>
               <Col xs={24} sm={8}>
                {renderField("Pin Code", student?.pinCode)}
              </Col>
            </Row>

            <Divider titlePlacement="start" className="!my-6 !text-gray-500">
                <BookOutlined /> Course & Academic
            </Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                {renderField("Course Name", student?.courseName)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Duration", student?.courseDuration)}
              </Col>
               <Col xs={24} sm={12}>
                {renderField("Date of Admission", dayjs(student?.dateOfAdmission).format("DD MMMM YYYY"), <CalendarOutlined />)}
              </Col>
              <Col xs={24} sm={12}>
                 {renderField("Session", student?.session)}
              </Col>
              <Col xs={24} sm={12}>
                 {renderField("Total Fees", `₹${student?.totalFees?.toLocaleString('en-IN')}`)}
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
