"use client";

import { useState } from "react";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Steps,
  Card,
  Typography,
  Space,
  Divider,
  message,
  Row,
  Col,
  List,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  RightOutlined,
  LeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Module, Topic } from "@/interfaces/courses";
import { useMutation } from "@tanstack/react-query";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CourseFormProps {
  mode: "add" | "edit";
  courseId?: string;
  initialData?: any;
}

export default function CourseForm({
  mode,
  courseId,
  initialData,
}: CourseFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const isEditMode = mode === "edit";

  // State for syllabus and topics
  const [syllabus, setSyllabus] = useState<Module[]>([]);
  const [currentTopics, setCurrentTopics] = useState<Topic[]>([]);

  // Add/Edit course mutation
  const { mutate: saveCourse, isPending } = useMutation({
    mutationFn: (data: any) => {
      return ApiHitter("POST", "ADD_COURSE", data, "", {
        showSuccess: true,
        successMessage: `Course ${isEditMode ? "updated" : "added"} successfully`,
        showError: true,
      });
    },
    onSuccess: () => {
      form.resetFields();
      setSyllabus([]);
      router.push("/courses");
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} course`
      );
    },
  });

  // Handle course details submission (Step 1)
  const handleCourseDetails = () => {
    form
      .validateFields([
        "name",
        "shortName",
        "description",
        "durationInMonths",
        "monthlyFees",
        "totalFees",
        "status",
      ])
      .then(() => {
        setCurrent(1);
      });
  };

  // Add syllabus item
  const handleAddSyllabus = () => {
    form
      .validateFields(["syllabusTitle", "syllabusDescription"])
      .then((values) => {
        const newSyllabus: Module = {
          _id: `temp-${Date.now()}`,
          title: values.syllabusTitle,
          description: values.syllabusDescription,
          courseId: "", // Will be set when course is created
          topics: currentTopics,
        };

        setSyllabus([...syllabus, newSyllabus]);
        form.setFieldsValue({
          syllabusTitle: "",
          syllabusDescription: "",
        });
        setCurrentTopics([]);
        message.success("Module added successfully");
      });
  };

  // Add topic to current syllabus
  const handleAddTopic = () => {
    form
      .validateFields(["topicName", "topicDescription"])
      .then((values) => {
        const newTopic: Topic = {
          _id: `topic-temp-${Date.now()}`,
          name: values.topicName,
          description: values.topicDescription,
          moduleId: "", // Will be set when module is created
        };

        setCurrentTopics([...currentTopics, newTopic]);
        form.setFieldsValue({ topicName: "", topicDescription: "" });
        message.success("Topic added to module");
      });
  };

  // Delete syllabus item
  const deleteSyllabus = (index: number) => {
    const newSyllabus = syllabus.filter((_, i) => i !== index);
    setSyllabus(newSyllabus);
    message.success("Module deleted");
  };

  // Delete topic
  const deleteTopic = (index: number) => {
    const newTopics = currentTopics.filter((_, i) => i !== index);
    setCurrentTopics(newTopics);
    message.success("Topic deleted");
  };

  // Final submission
  const handleSubmit = () => {
    // Get all form values, including those from unmounted steps
    const values = form.getFieldsValue(true);
    
    const courseData = {
      name: values.name,
      shortName: values.shortName,
      description: values.description,
      durationInMonths: values.durationInMonths,
      monthlyFees: values.monthlyFees,
      syllabus: syllabus.map((item) => ({
        title: item.title,
        description: item.description,
        topics: item.topics.map((topic) => ({
          name: topic.name,
          description: topic.description,
        })),
      })),
    };

    saveCourse(courseData);
  };

  const steps = [
    {
      title: "Course Details",
      icon: <FileTextOutlined />,
    },
    {
      title: "Syllabus & Topics",
      icon: <BookOutlined />,
    },
    {
      title: "Review",
      icon: <SaveOutlined />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button type="text" icon={<ArrowLeftOutlined />} />
        </Link>
        <div>
          <Title level={2} className="!mb-1">
            {isEditMode ? "Edit Course" : "Add New Course"}
          </Title>
          <Text type="secondary">
            {isEditMode
              ? "Update course details"
              : "Complete all steps to create a new course"}
          </Text>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <Steps current={current} items={steps} />
      </Card>

      {/* Form */}
      <Form form={form} layout="vertical" preserve={true}>
        {/* Step 1: Course Details */}
        {current === 0 && (
          <Card title="Course Information">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Course Name"
                  name="name"
                  rules={[
                    { required: true, message: "Course name is required" },
                  ]}
                >
                  <Input
                    placeholder="e.g., Full Stack Web Development"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Short Name"
                  name="shortName"
                  rules={[
                    { required: true, message: "Short name is required" },
                  ]}
                >
                  <Input placeholder="e.g., MERN-2024" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea
                rows={4}
                placeholder="Brief description of the course..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Duration (months)"
                  name="durationInMonths"
                  rules={[{ required: true, message: "Duration is required" }]}
                >
                  <InputNumber
                    min={1}
                    max={48}
                    placeholder="6"
                    className="w-full"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Monthly Fees (₹)"
                  name="monthlyFees"
                  rules={[{ required: true, message: "Monthly fees required" }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="5000"
                    className="w-full"
                    size="large"
                    formatter={(value) =>
                      `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Total Fees (₹)"
                  name="totalFees"
                  rules={[{ required: true, message: "Total fees required" }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="30000"
                    className="w-full"
                    size="large"
                    formatter={(value) =>
                      `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is required" }]}
              initialValue="Active"
            >
              <Select size="large">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Card>
        )}

        {/* Step 2: Syllabus & Topics */}
        {current === 1 && (
          <div className="space-y-4">
            <Card title="Add Module to Syllabus">
              <Form.Item label="Module Title" name="syllabusTitle">
                <Input
                  placeholder="e.g., Frontend Fundamentals"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Module Description"
                name="syllabusDescription"
              >
                <TextArea
                  rows={2}
                  placeholder="HTML, CSS, and JS basics"
                />
              </Form.Item>

              <Divider>Add Topics to this Module</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Topic Name" name="topicName">
                    <Input placeholder="e.g., Introduction to React" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Topic Description" name="topicDescription">
                    <Input placeholder="Basic concepts of components" />
                  </Form.Item>
                </Col>
              </Row>

              <Space className="mb-4">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddTopic}
                >
                  Add Topic
                </Button>
              </Space>

              {/* Current Topics List */}
              {currentTopics.length > 0 && (
                <>
                  <Text strong className="block mb-2">
                    Topics in this module ({currentTopics.length}):
                  </Text>
                  <List
                    size="small"
                    bordered
                    dataSource={currentTopics}
                    className="mb-4"
                    renderItem={(topic, index) => (
                      <List.Item
                        actions={[
                          <Button
                            key="delete"
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => deleteTopic(index)}
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={topic.name}
                          description={topic.description}
                        />
                      </List.Item>
                    )}
                  />
                </>
              )}

              <Button
                type="primary"
                block
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAddSyllabus}
              >
                Save & Add Module
              </Button>
            </Card>

            {/* Added Syllabus List */}
            {syllabus.length > 0 && (
              <Card title={`Syllabus Modules (${syllabus.length})`}>
                {syllabus.map((item, index) => (
                  <Card
                    key={item._id}
                    className="mb-3"
                    size="small"
                    title={
                      <Space>
                        <BookOutlined />
                        <Text strong>{item.title}</Text>
                      </Space>
                    }
                    extra={
                      <Popconfirm
                        title="Delete Module"
                        description="Are you sure you want to delete this module?"
                        onConfirm={() => deleteSyllabus(index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    }
                  >
                    <Text type="secondary" className="block mb-2">
                      {item.description}
                    </Text>
                    {item.topics.length > 0 && (
                      <div className="pl-3 border-l-2 border-blue-300">
                        <Text type="secondary" className="text-xs">
                          {item.topics.length} topic(s):
                        </Text>
                        <ul className="list-disc list-inside mt-1">
                          {item.topics.map((topic) => (
                            <li
                              key={topic._id}
                              className="text-sm text-gray-600"
                            >
                              {topic.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {current === 2 && (
          <Card title="Review Course Details">
            <div className="space-y-4">
              <div>
                <Text type="secondary">Course Name:</Text>
                <div>
                  <Text strong className="text-lg">
                    {form.getFieldValue("name")}
                  </Text>
                </div>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Short Name:</Text>
                  <div>
                    <Text strong>{form.getFieldValue("shortName")}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Duration:</Text>
                  <div>
                    <Text strong>
                      {form.getFieldValue("durationInMonths")} months
                    </Text>
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Monthly Fees:</Text>
                  <div>
                    <Text strong className="text-green-600">
                      ₹
                      {form
                        .getFieldValue("monthlyFees")
                        ?.toLocaleString("en-IN")}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Total Fees:</Text>
                  <div>
                    <Text strong className="text-green-600">
                      ₹
                      {form
                        .getFieldValue("totalFees")
                        ?.toLocaleString("en-IN")}
                    </Text>
                  </div>
                </Col>
              </Row>

              <div>
                <Text type="secondary">Description:</Text>
                <div>
                  <Text>{form.getFieldValue("description")}</Text>
                </div>
              </div>

              <Divider />

              <div>
                <Text type="secondary" className="text-base">
                  Syllabus Modules: <strong>{syllabus.length}</strong>
                </Text>
                <div className="mt-3 space-y-2">
                  {syllabus.map((item, index) => (
                    <div
                      key={item._id}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <Text strong>
                        {index + 1}. {item.title}
                      </Text>
                      <Text type="secondary" className="block text-xs">
                        {item.topics.length} topic(s)
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Card>
          <div className="flex justify-between">
            <Button
              size="large"
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
              icon={<LeftOutlined />}
            >
              Previous
            </Button>

            {current < steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  if (current === 0) {
                    handleCourseDetails();
                  } else {
                    setCurrent(current + 1);
                  }
                }}
                icon={<RightOutlined />}
                iconPosition="end"
              >
                Next
              </Button>
            )}

            {current === steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={isPending}
                icon={<SaveOutlined />}
              >
                {isEditMode ? "Update Course" : "Create Course"}
              </Button>
            )}
          </div>
        </Card>
      </Form>
    </div>
  );
}
