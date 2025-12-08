"use client";

import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Upload,
  message,
  Card,
  Row,
  Col,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import DropzoneComponent from "../form/form-elements/DropZone";
import { useMutation } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { addStudent } from "@/interfaces/addStudent";

const { Option } = Select;

const genderOptions = ["Male", "Female", "Other"];
const religionOptions = [
  "Hindu",
  "Muslim",
  "Sikh",
  "Christian",
  "Jain",
  "Buddhist",
  "Other",
];
const categoryOptions = ["General", "OBC", "SC", "ST", "Other"];
const examModeOptions = ["Online", "Offline"];

export default function AddStudent() {
  const [form] = Form.useForm();

  const [previews, setPreviews] = React.useState({
    studentPhoto: null,
    uploadEducationProof: null,
    uploadIdentityProof: null,
  });

  // Handle preview
  const handlePreview = (file: any, field: any) => {
    const url = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [field]: url }));
  };

  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (body: addStudent) =>
      ApiHitter("POST", "ADD_STUDENT", body, "", {
        showSuccess: true,
        successMessage: "Student added successfully",
        showError: true,
      }),

    onSuccess: (res) => {
      console.log("res", res);
    },
  });

  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: (body: addStudent) =>
      ApiHitter("POST", "UPLOAD", body, "", {
        showSuccess: true,
        showError: true,
      }),

    onSuccess: (res) => {
      console.log("res", res);
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      values.dob = dayjs(values.dob).toISOString();
      values.dateOfAdmission = dayjs(values.dateOfAdmission).toISOString();

      const formData = new FormData();
      ["studentPhoto", "uploadEducationProof", "uploadIdentityProof"].forEach(
        (key) => {
          const file = values[key]?.file?.originFileObj;
          if (file) formData.append(key, file);
        },
      );

      // STEP 1 → Upload files first
      const uploadRes = await upload(formData as any, {
        onSuccess: () => {},
      });

      // Upload Response should return URLs
      const uploadedUrls = {
        studentPhoto: uploadRes?.data?.studentPhoto,
        uploadEducationProof: uploadRes?.data?.educationProof,
        uploadIdentityProof: uploadRes?.data?.identityProof,
      };

      // STEP 2 → Now add student with URLs
      addStudent({
        ...values,
        ...uploadedUrls,
      });
    } catch (error) {
      message.error("❌ Failed to upload or submit student");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
      <h1 className="mb-6 text-left text-3xl font-bold text-gray-800">
        ➕ Add New Student
      </h1>

      <Card className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- PERSONAL DETAILS ---------------- */}
          <section className="mb-2 py-3">
            <h2 className="mb-3 border-l-4 border-blue-600 pl-2 text-xl font-semibold text-gray-800">
              👤 Personal Details
            </h2>
          </section>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Student Name"
                name="name"
                rules={[
                  { required: true, message: "Student name is required" },
                ]}
              >
                <Input placeholder="Enter student full name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  { required: true, message: "Please select date of birth" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select placeholder="Select gender">
                  {genderOptions.map((g) => (
                    <Option key={g}>{g}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Religion"
                name="religion"
                rules={[{ required: true, message: "Please select religion" }]}
              >
                <Select placeholder="Select religion">
                  {religionOptions.map((r) => (
                    <Option key={r}>{r}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  {categoryOptions.map((c) => (
                    <Option key={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Father Name"
                name="fatherName"
                rules={[{ required: true, message: "Father's name required" }]}
              >
                <Input placeholder="Enter Father's Name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Mother Name"
                name="motherName"
                rules={[{ required: true, message: "Mother's name required" }]}
              >
                <Input placeholder="Enter Mother's Name" />
              </Form.Item>
            </Col>
          </Row>

          {/* ---------------- CONTACT INFO ---------------- */}
          <section className="mb-2 py-3">
            <h2 className="mb-3 border-l-4 border-green-600 pl-2 text-xl font-semibold text-gray-800">
              📞 Contact Information
            </h2>
          </section>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mobile"
                name="mobile"
                rules={[{ required: true, message: "Mobile number required" }]}
              >
                <Input placeholder="e.g. 9876543210" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Enter a valid email",
                  },
                ]}
              >
                <Input placeholder="example@gmail.com" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Residential Address"
                name="residentialAddress"
                rules={[{ required: true, message: "Address required" }]}
              >
                <Input.TextArea rows={2} placeholder="Full address" />
              </Form.Item>
            </Col>
          </Row>

          {/* ---------------- ADDRESS ---------------- */}
          <section className="mb-2 py-3">
            <h2 className="mb-3 border-l-4 border-purple-600 pl-2 text-xl font-semibold text-gray-800">
              📍 Address Details
            </h2>
          </section>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: "State required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="District"
                name="district"
                rules={[{ required: true, message: "District required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Country required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Pin Code"
                name="pinCode"
                rules={[{ required: true, message: "Pin code required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* ---------------- EDUCATION ---------------- */}
          <section className="mb-2 py-3">
            <h2 className="mb-3 border-l-4 border-yellow-500 pl-2 text-xl font-semibold text-gray-800">
              🎓 Education Details
            </h2>
          </section>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Select Course"
                name="selectedCourse"
                rules={[{ required: true, message: "Course required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Course Duration"
                name="courseDuration"
                rules={[{ required: true, message: "Duration required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Date of Admission"
                name="dateOfAdmission"
                rules={[{ required: true, message: "Select admission date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Session"
                name="session"
                rules={[{ required: true, message: "Session required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Total Fees"
                name="totalFees"
                rules={[{ required: true, message: "Fees required" }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Exam Mode"
                name="examMode"
                rules={[{ required: true, message: "Select exam mode" }]}
              >
                <Select placeholder="Choose mode">
                  {examModeOptions.map((m) => (
                    <Option key={m}>{m}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ---------------- FILE UPLOAD ---------------- */}
          <section className="mb-2 py-3">
            <h2 className="mb-3 border-l-4 border-red-500 pl-2 text-xl font-semibold text-gray-800">
              📄 Upload Documents
            </h2>
          </section>

          <Row gutter={[18, 18]}>
            {/* Student Photo */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Student Photo" name="studentPhoto">
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    if (info.file.originFileObj) {
                      handlePreview(info.file.originFileObj, "studentPhoto");
                    }
                  }}
                  className="cursor-pointer rounded-md border border-blue-300 bg-blue-50 p-3 text-center transition-all hover:bg-blue-100"
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="w-full font-medium"
                  >
                    Upload Photo
                  </Button>
                </Upload>

                {previews.studentPhoto && (
                  <img
                    src={previews.studentPhoto}
                    alt="Preview"
                    className="mt-2 h-24 w-24 rounded-md border object-cover shadow-sm"
                  />
                )}
              </Form.Item>
            </Col>

            {/* Education Proof */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Education Proof" name="uploadEducationProof">
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    if (info.file.originFileObj) {
                      handlePreview(
                        info.file.originFileObj,
                        "uploadEducationProof",
                      );
                    }
                  }}
                  className="cursor-pointer rounded-md border border-green-300 bg-green-50 p-3 text-center transition-all hover:bg-green-100"
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="w-full font-medium"
                  >
                    Upload Document
                  </Button>
                </Upload>

                {previews.uploadEducationProof && (
                  <p className="mt-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
                    ✓ File added
                  </p>
                )}
              </Form.Item>
            </Col>

            {/* Identity Proof */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Identity Proof" name="uploadIdentityProof">
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    if (info.file.originFileObj) {
                      handlePreview(
                        info.file.originFileObj,
                        "uploadIdentityProof",
                      );
                    }
                  }}
                  className="cursor-pointer rounded-md border border-purple-300 bg-purple-50 p-3 text-center transition-all hover:bg-purple-100"
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="w-full font-medium"
                  >
                    Upload ID
                  </Button>
                </Upload>

                {previews.uploadIdentityProof && (
                  <p className="mt-2 rounded bg-purple-100 px-2 py-1 text-sm font-medium text-purple-700">
                    ✓ File added
                  </p>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="mt-4 w-full rounded-lg text-lg font-semibold"
          >
            Submit Student Details
          </Button>
        </Form>
      </Card>
    </div>
  );
}
