"use client";

import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  FileTextOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Popconfirm,
  Row,
  Select,
  Steps,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CourseFormProps {
  mode: "add" | "edit";
}

export default function CourseForm({ mode }: CourseFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [modules, setModules] = useState<any[]>([]);
  const isEditMode = mode === "edit";

  /* ===================== MUTATION ===================== */
  const { mutate: saveCourse, isPending } = useMutation({
    mutationFn: (data: any) =>
      ApiHitter("POST", "ADD_COURSE", data, "", {
        showSuccess: true,
        successMessage: `Course ${isEditMode ? "updated" : "created"} successfully`,
        showError: true,
      }),
    onSuccess: () => {
      form.resetFields();
      setModules([]);
      router.push("/courses");
    },
  });

  /* ===================== SUBMIT ===================== */
  const handleSubmit = () => {
    const values = form.getFieldsValue(true);

    const payload = {
      name: values.name,
      shortName: values.shortName,
      description: values.description,
      durationInMonths: values.durationInMonths,
      monthlyFees: values.monthlyFees,
      syllabus: modules,
    };

    saveCourse(payload);
  };

  const steps = [
    { title: "Course Details", icon: <FileTextOutlined /> },
    { title: "Modules & Topics", icon: <FileTextOutlined /> },
    { title: "Review", icon: <SaveOutlined /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button type="text" icon={<ArrowLeftOutlined />} />
        </Link>
        <div>
          <Title level={2} className="!mb-1">
            {isEditMode ? "Edit Course" : "Add New Course"}
          </Title>
          <Text type="secondary">Create a course with modules and topics</Text>
        </div>
      </div>

      {/* STEPS */}
      <Card>
        <Steps current={current} items={steps} />
      </Card>

      <Form form={form} layout="vertical" preserve>
        {/* ===================== STEP 1 ===================== */}
        {current === 0 && (
          <Card title="Course Information">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Course Name" name="name" rules={[{ required: true }]}>
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
              <Col span={12}>
                <Form.Item
                  label="Duration (Months)"
                  name="durationInMonths"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} className="w-full" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Monthly Fees"
                  name="monthlyFees"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} className="w-full" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Status" name="status" initialValue="Active">
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
            <Card title="Add Module & Topic">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Module Title"
                    name="moduleTitle"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Module Description" name="moduleDescription">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Topic Name"
                    name="topicName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Topic Description" name="topicDescription">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  form.validateFields(["moduleTitle", "topicName"]).then((values) => {
                    setModules((prev) => {
                      const index = prev.findIndex((m) => m.title === values.moduleTitle);

                      if (index !== -1) {
                        const updated = [...prev];
                        updated[index].topics.push({
                          name: values.topicName,
                          description: values.topicDescription,
                        });
                        return updated;
                      }

                      return [
                        ...prev,
                        {
                          title: values.moduleTitle,
                          description: values.moduleDescription,
                          topics: [
                            {
                              name: values.topicName,
                              description: values.topicDescription,
                            },
                          ],
                        },
                      ];
                    });

                    form.setFieldsValue({
                      topicName: "",
                      topicDescription: "",
                    });

                    message.success("Added successfully");
                  });
                }}
              >
                Add Topic
              </Button>
            </Card>

            {modules.length > 0 && (
              <Card title={`Modules (${modules.length})`}>
                <List
                  dataSource={modules}
                  renderItem={(module, index) => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          title="Delete module?"
                          onConfirm={() =>
                            setModules((prev) => prev.filter((_, i) => i !== index))
                          }
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>,
                      ]}
                    >
                      <div className="w-full">
                        <Text strong>{module.title}</Text>
                        <br />
                        <Text type="secondary">{module.description}</Text>

                        <div className="mt-2 pl-4">
                          {module.topics.map((t: any, i: number) => (
                            <div key={i}>• {t.name}</div>
                          ))}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}

        {/* ===================== STEP 3 ===================== */}
        {current === 2 && (
          <Card title="Review">
            <Text strong className="text-lg">
              {form.getFieldValue("name")}
            </Text>

            <Divider />

            <Text>Modules: {modules.length}</Text>

            <div className="mt-3 space-y-3">
              {modules.map((m, i) => (
                <div key={i} className="rounded bg-gray-50 p-3">
                  <Text strong>
                    {i + 1}. {m.title}
                  </Text>

                  <div className="mt-1 ml-3">
                    {m.topics.map((t: any, j: number) => (
                      <div key={j}>- {t.name}</div>
                    ))}
                  </div>
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
                {isEditMode ? "Update Course" : "Create Course"}
              </Button>
            )}
          </div>
        </Card>
      </Form>
    </div>
  );
}
