"use client";

import { Course } from "@/interfaces/courses";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import {
  ArrowLeftOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ProjectOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Collapse, Divider, Row, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ViewCourse.module.css";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ViewCourse = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data: course, isLoading, isError } = useQuery<Course>({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await ApiHitter("GET", "GET_COURSE_BY_ID", {}, id);
      return response?.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" tip="Loading Course Details..." />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Title level={4} type="danger">
          Course not found or error occurred.
        </Title>
        <Link href="/courses">
          <Button type="primary">Go Back to List</Button>
        </Link>
      </div>
    );
  }

  const renderField = (label: string, value: any, icon?: React.ReactNode) => (
    <div className="mb-4">
      <Text type="secondary" className="mb-1 block text-xs uppercase tracking-wide">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Text>
      <Text strong className="text-base text-gray-800 dark:text-gray-200">
        {value || "N/A"}
      </Text>
    </div>
  );

  const modulesToShow = course.syllabus || course.modules || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="flex items-center gap-2 border-none bg-transparent shadow-none hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Back to Courses
        </Button>
        <div className="flex gap-2">
          <Link href={`/courses/edit/${id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit Course
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Course Card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-2xl transition-transform hover:scale-[1.02]">
            {/* Background Pattern */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 mb-6 flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <BookOutlined />
                </div>
                <span className="font-bold tracking-wider">COURSE INFO</span>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">Short Name</div>
                <div className="font-mono font-bold">{course.shortName}</div>
              </div>
            </div>

            {/* Main Info Section */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="mb-2 text-2xl font-bold text-white">{course.name}</h2>
              <p className="mb-4 text-sm font-medium text-white/80 line-clamp-2">
                {course.description || "No description provided."}
              </p>

              <div className="my-2 flex gap-2">
                <Tag
                  color={course.status === "Active" ? "success" : "error"}
                  className="border-none px-3 py-1"
                >
                  {course.status}
                </Tag>
                <Tag color="cyan" className="border-none px-3 py-1">
                  {course.durationInMonths} Months
                </Tag>
              </div>
            </div>

            {/* Footer Details */}
            <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-sm">
              <div>
                <div className="text-xs opacity-70">Monthly Fee</div>
                <div className="font-semibold">₹{course.monthlyFees?.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-70">Total Fee</div>
                <div className="font-semibold">₹{course.totalFees?.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          {/* Key Statistics Card */}
          <Card className="rounded-xl border-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <Title level={5} className="mb-4 text-gray-700 dark:text-gray-200">
              Quick Stats
            </Title>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <ProjectOutlined />
                  </div>
                  <Text>Modules</Text>
                </div>
                <Text strong>{modulesToShow.length}</Text>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <ClockCircleOutlined />
                  </div>
                  <Text>Duration</Text>
                </div>
                <Text strong>{course.durationInMonths} Months</Text>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Info & Syllabus */}
        <div className="lg:col-span-2">
          <Card
            className="rounded-xl border-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-800"
            bodyStyle={{ maxHeight: "75vh", overflowY: "auto" }}
            classNames={{ body: styles.customScrollbar }}
          >
            <Title level={4} className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <span className="text-indigo-600">
                <FileTextOutlined />
              </span>{" "}
              Full Course Details
            </Title>

            <Divider titlePlacement="start" className="!mb-6 !mt-0 !text-gray-500">
              <InfoCircleOutlined /> General Information
            </Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                {renderField("Course Name", course.name)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Short Name", course.shortName)}
              </Col>
              <Col span={24}>
                <Text type="secondary" className="mb-1 block text-xs uppercase tracking-wide">
                  Description
                </Text>
                <Paragraph className="text-gray-600 dark:text-gray-300">
                  {course.description || "No detailed description available for this course."}
                </Paragraph>
              </Col>
            </Row>

            <Divider titlePlacement="start" className="!my-6 !text-gray-500">
              <WalletOutlined /> Fee Structure
            </Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                {renderField("Monthly Fee", `₹${course.monthlyFees?.toLocaleString("en-IN")}`)}
              </Col>
              <Col xs={24} sm={12}>
                {renderField("Total Course Fee", `₹${course.totalFees?.toLocaleString("en-IN")}`)}
              </Col>
            </Row>

            <Divider titlePlacement="start" className="!my-6 !text-gray-500">
              <BookOutlined /> Curriculum / Syllabus
            </Divider>

            {modulesToShow.length > 0 ? (
              <Collapse
                ghost
                expandIconPosition="end"
                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2"
              >
                {modulesToShow.map((module, index) => (
                  <Panel
                    header={
                      <div className="flex items-center gap-3">
                        <Tag color="blue" className="rounded-full border-none px-2">
                          M{index + 1}
                        </Tag>
                        <Text strong className="text-gray-800 dark:text-gray-100 italic">
                          {module.title}
                        </Text>
                      </div>
                    }
                    key={module._id || index}
                    className="mb-2 overflow-hidden rounded-lg border-none bg-white shadow-sm dark:bg-gray-800"
                  >
                    <div className="pl-12 pr-4 pb-2">
                       {module.description && (
                         <Paragraph className="mb-4 text-gray-500 text-sm italic">
                           {module.description}
                         </Paragraph>
                       )}
                       
                       <div className="space-y-3">
                         {module.topics && module.topics.length > 0 ? (
                            module.topics.map((topic, tIdx) => (
                              <div key={topic._id || tIdx} className="flex items-start gap-4">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                                <div>
                                  <Text strong className="block text-sm text-gray-700 dark:text-gray-200">
                                    {topic.name}
                                  </Text>
                                  {topic.description && (
                                    <Text type="secondary" className="text-xs">
                                      {topic.description}
                                    </Text>
                                  )}
                                </div>
                              </div>
                            ))
                         ) : (
                           <Text type="secondary" italic className="text-xs">No topics listed for this module.</Text>
                         )}
                       </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-900/50">
                <Text type="secondary" italic>
                  No curriculum modules have been added to this course yet.
                </Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
