"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import {
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  Card,
  Typography,
  Row,
  Col,
  Collapse,
  Empty,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  BookOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomLoader } from "@/components/common";
import { Course } from "@/interfaces/courses";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function CourseList() {
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();

  // Fetch courses
  const { data: coursesData, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await ApiHitter("GET", "GET_COURSE_LIST", {}, "", {
        showError: true,
        showSuccess: false,
      });
      return response?.data || [];
    },
  });

  // Delete course mutation
  const { mutate: deleteCourse } = useMutation({
    mutationFn: (courseId: string) =>
      ApiHitter("DELETE", "DELETE_COURSE", {}, courseId, {
        showSuccess: true,
        successMessage: "Course deleted successfully",
        showError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Filter courses based on search
  const filteredCourses = coursesData?.filter((course: Course) =>
    course.name.toLowerCase().includes(searchText.toLowerCase()) ||
    course.shortName?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Title level={4} type="danger">
            Failed to load courses
          </Title>
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={2} className="!mb-1">
            📚 Course Management
          </Title>
          <p className="text-gray-500 dark:text-gray-400">
            Manage courses, modules, and topics
          </p>
        </div>
        <Link href="/courses/add">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Add New Course
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by course name or short name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
            className="w-full sm:w-96"
          />
          <div className="flex items-center gap-2">
            <Tag color="blue" className="text-sm">
              Total: <strong>{filteredCourses?.length || 0}</strong> courses
            </Tag>
          </div>
        </div>
      </Card>

      {/* Courses Grid */}
      {filteredCourses && filteredCourses.length > 0 ? (
        <Row gutter={[16, 16]} className="mt-5">
          {filteredCourses.map((course: Course) => (
            <Col xs={24} lg={12} xl={8} key={course._id}>
              <Card
                className="h-full shadow-md hover:shadow-lg transition-all duration-300 border-l-4"
                style={{
                  borderLeftColor: course.status === "Active" ? "#52c41a" : "#ff4d4f",
                }}
                actions={[
                  <Link href={`/courses/${course._id}`} key="view">
                    <Button type="link" icon={<FileTextOutlined />}>
                      View Details
                    </Button>
                  </Link>,
                  <Popconfirm
                    key="delete"
                    title="Delete Course"
                    description="Are you sure? This will delete all modules and topics!"
                    onConfirm={() => deleteCourse(course._id)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                {/* Course Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/courses/${course._id}`}>
                      <Title level={4} className="!mb-0 hover:text-blue-600 cursor-pointer">
                        {course.name}
                      </Title>
                    </Link>
                    <Tag
                      color={course.status === "Active" ? "success" : "error"}
                      icon={course.status === "Active" ? <CheckCircleOutlined /> : undefined}
                    >
                      {course.status}
                    </Tag>
                  </div>
                  <Tag color="blue" className="!mt-1">
                    {course.shortName}
                  </Tag>
                </div>

                {/* Description */}
                {course.description && (
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    className="text-gray-600 dark:text-gray-400 mb-4"
                  >
                    {course.description}
                  </Paragraph>
                )}

                {/* Quick Stats */}
                <Row gutter={16} className="mb-4">
                  <Col span={8}>
                    <Statistic
                      title="Duration"
                      value={course.durationInMonths}
                      suffix="months"
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ fontSize: "16px" }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Modules"
                      value={(course.syllabus || course.modules)?.length || 0}
                      prefix={<BookOutlined />}
                      valueStyle={{ fontSize: "16px", color: "#1890ff" }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Total Fees"
                      value={course.totalFees}
                      prefix="₹"
                      valueStyle={{ fontSize: "16px", color: "#52c41a" }}
                    />
                  </Col>
                </Row>

                {/* Monthly Fees */}
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Space>
                    <DollarOutlined className="text-green-600" />
                    <Text strong className="text-green-700 dark:text-green-400">
                      Monthly: ₹{course.monthlyFees?.toLocaleString("en-IN")}
                    </Text>
                  </Space>
                </div>

                {/* Modules & Topics */}
                {((course.syllabus && course.syllabus.length > 0) || (course.modules && course.modules.length > 0)) && (
                  <Collapse
                    size="small"
                    className="mt-4"
                    expandIconPosition="end"
                  >
                    <Panel
                      header={
                        <Text strong>
                          <BookOutlined className="mr-2" />
                          {(course.syllabus || course.modules)?.length} Module{(course.syllabus || course.modules)?.length !== 1 ? 's' : ''}
                        </Text>
                      }
                      key="modules"
                    >
                      <div className="space-y-3">
                        {(course.syllabus || course.modules)?.map((module, index) => (
                          <div
                            key={module._id}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <Text strong className="block mb-1">
                              {index + 1}. {module.title}
                            </Text>
                            <Text type="secondary" className="text-xs block mb-2">
                              {module.description}
                            </Text>
                            {module.topics && module.topics.length > 0 && (
                              <div className="mt-2 pl-4 border-l-2 border-blue-300">
                                <Text type="secondary" className="text-xs block mb-1">
                                  Topics ({module.topics.length}):
                                </Text>
                                <ul className="list-disc list-inside space-y-1">
                                  {module.topics.map((topic) => (
                                    <li key={topic._id} className="text-xs text-gray-600 dark:text-gray-400">
                                      {topic.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Panel>
                  </Collapse>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                No courses found. <Link href="/courses/add">Add a new course</Link> to get started.
              </span>
            }
          />
        </Card>
      )}
    </div>
  );
}
