"use client";

import { useState } from "react";
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
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { useMutation } from "@tanstack/react-query";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Subject {
  id: string;
  name: string;
  description?: string;
}

interface CourseFormProps {
  mode: "add" | "edit";
  courseId?: string;
  initialData?: any;
}

export default function CourseForm({
  mode,
}: CourseFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const isEditMode = mode === "edit";

  /* ===================== MUTATION ===================== */
  const { mutate: saveCourse, isPending } = useMutation({
    mutationFn: (data: any) =>
      ApiHitter("POST", "ADD_COURSE", data, "", {
        showSuccess: true,
        successMessage: `Course ${
          isEditMode ? "updated" : "created"
        } successfully`,
        showError: true,
      }),
    onSuccess: () => {
      form.resetFields();
      setSubjects([]);
      router.push("/courses");
    },
  });

  /* ===================== SUBJECT HANDLERS ===================== */
  const handleAddSubject = () => {
    form
      .validateFields(["subjectName", "subjectDescription"])
      .then((values) => {
        setSubjects((prev) => [
          ...prev,
          {
            id: `sub-${Date.now()}`,
            name: values.subjectName,
            description: values.subjectDescription,
          },
        ]);

        form.setFieldsValue({
          subjectName: "",
          subjectDescription: "",
        });

        message.success("Subject added");
      });
  };

  const deleteSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = () => {
    const values = form.getFieldsValue(true);

    const payload = {
      name: values.name,
      shortName: values.shortName,
      description: values.description,
      durationInMonths: values.durationInMonths,
      monthlyFees: values.monthlyFees,
      totalFees: values.totalFees,
      status: values.status,
      subjects: subjects.map((s) => ({
        name: s.name,
        description: s.description,
      })),
    };

    saveCourse(payload);
  };

  const steps = [
    { title: "Course Details", icon: <FileTextOutlined /> },
    { title: "Subjects", icon: <BookOutlined /> },
    { title: "Review", icon: <SaveOutlined /> },
  ];

  return (
    <div className="space-y-6">
      {/* ===================== HEADER ===================== */}
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button type="text" icon={<ArrowLeftOutlined />} />
        </Link>
        <div>
          <Title level={2} className="!mb-1">
            {isEditMode ? "Edit Course" : "Add New Course"}
          </Title>
          <Text type="secondary">
            Create a course with subjects
          </Text>
        </div>
      </div>

      {/* ===================== STEPS ===================== */}
      <Card>
        <Steps current={current} items={steps} />
      </Card>

      <Form form={form} layout="vertical" preserve>
        {/* ===================== STEP 1 ===================== */}
        {current === 0 && (
          <Card title="Course Information">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Course Name"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Short Name"
                  name="shortName"
                  rules={[{ required: true }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Duration (Months)"
                  name="durationInMonths"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} className="w-full" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Monthly Fees"
                  name="monthlyFees"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} className="w-full" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Total Fees"
                  name="totalFees"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} className="w-full" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Status"
              name="status"
              initialValue="Active"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Card>
        )}

        {/* ===================== STEP 2 ===================== */}
        {current === 1 && (
          <div className="space-y-4">
            <Card title="Add Subjects">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Subject Name"
                    name="subjectName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Subject Description"
                    name="subjectDescription"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                block
                icon={<PlusOutlined />}
                onClick={handleAddSubject}
              >
                Add Subject
              </Button>
            </Card>

            {subjects.length > 0 && (
              <Card title={`Subjects (${subjects.length})`}>
                <List
                  dataSource={subjects}
                  renderItem={(item, index) => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          title="Delete subject?"
                          onConfirm={() => deleteSubject(index)}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}

        {/* ===================== STEP 3 ===================== */}
        {current === 2 && (
          <Card title="Review Course">
            <Text strong className="text-lg">
              {form.getFieldValue("name")}
            </Text>
            <Divider />

            <Text>Subjects: {subjects.length}</Text>
            <div className="mt-3 space-y-2">
              {subjects.map((s, i) => (
                <div key={s.id} className="p-2 bg-gray-50 rounded">
                  <Text strong>
                    {i + 1}. {s.name}
                  </Text>
                  {s.description && (
                    <Text type="secondary" className="block text-xs">
                      {s.description}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ===================== NAVIGATION ===================== */}
        <Card>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrent((c) => c - 1)}
              disabled={current === 0}
              icon={<LeftOutlined />}
            >
              Previous
            </Button>

            {current < 2 && (
              <Button
                type="primary"
                onClick={() => setCurrent((c) => c + 1)}
                icon={<RightOutlined />}
              >
                Next
              </Button>
            )}

            {current === 2 && (
              <Button
                type="primary"
                loading={isPending}
                icon={<SaveOutlined />}
                onClick={handleSubmit}
              >
                Create Course
              </Button>
            )}
          </div>
        </Card>
      </Form>
    </div>
  );
}
