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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const genderOptions = ["Male", "Female", "Other"];
const religionOptions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Other"];
const categoryOptions = ["General", "OBC", "SC", "ST", "Other"];
const examModeOptions = ["Online", "Offline"];

export default function AddStudent() {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        try {
            // Convert dates to ISO
            values.dob = dayjs(values.dob).toISOString();
            values.dateOfAdmission = dayjs(values.dateOfAdmission).toISOString();

            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "studentPhoto" || key === "uploadEducationProof" || key === "uploadIdentityProof") {
                    if (values[key]?.file) {
                        formData.append(key, values[key].file.originFileObj);
                    }
                } else {
                    formData.append(key, values[key]);
                }
            });

            await axios.post("/api/student", formData);

            message.success("Student added successfully!");
            form.resetFields();
        } catch (error) {
            console.log(error);
            message.error("Failed to add student");
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2>Add Student</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >

                {/* NAME */}
                <Form.Item
                    label="Student Name"
                    name="name"
                    rules={[
                        { required: true },
                        { max: 50 },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* FATHER NAME */}
                <Form.Item
                    label="Father Name"
                    name="fatherName"
                    rules={[
                        { required: true },
                        { max: 50 },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* MOTHER NAME */}
                <Form.Item
                    label="Mother Name"
                    name="motherName"
                    rules={[
                        { required: true },
                        { max: 50 },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* DOB */}
                <Form.Item
                    label="Date of Birth"
                    name="dob"
                    rules={[{ required: true }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                {/* GENDER */}
                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {genderOptions.map((g) => (
                            <Option key={g} value={g}>{g}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* MOBILE */}
                <Form.Item
                    label="Mobile"
                    name="mobile"
                    rules={[
                        { required: true },
                        { max: 15 },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* EMAIL */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true },
                        { type: "email" },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* ADDRESS */}
                <Form.Item
                    label="Residential Address"
                    name="residentialAddress"
                    rules={[{ required: true }]}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                {/* STATE */}
                <Form.Item label="State" name="state" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                {/* DISTRICT */}
                <Form.Item label="District" name="district" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                {/* COUNTRY */}
                <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                {/* PIN CODE */}
                <Form.Item
                    label="Pin Code"
                    name="pinCode"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                {/* RELIGION */}
                <Form.Item
                    label="Religion"
                    name="religion"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {religionOptions.map((item) => (
                            <Option key={item} value={item}>{item}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* CATEGORY */}
                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {categoryOptions.map((item) => (
                            <Option key={item} value={item}>{item}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* DATE OF ADMISSION */}
                <Form.Item
                    label="Date of Admission"
                    name="dateOfAdmission"
                    rules={[{ required: true }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                {/* SELECT COURSE */}
                <Form.Item
                    label="Select Course"
                    name="selectedCourse"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                {/* COURSE DURATION */}
                <Form.Item
                    label="Course Duration"
                    name="courseDuration"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                {/* SESSION */}
                <Form.Item
                    label="Session"
                    name="session"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                {/* TOTAL FEES */}
                <Form.Item
                    label="Total Fees"
                    name="totalFees"
                    rules={[
                        { required: true },
                        { type: "number", min: 0 },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                {/* EXAM MODE */}
                <Form.Item
                    label="Exam Mode"
                    name="examMode"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {examModeOptions.map((m) => (
                            <Option key={m} value={m}>{m}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* FILE UPLOADS */}
                <Form.Item label="Student Photo" name="studentPhoto">
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Education Proof" name="uploadEducationProof">
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload Document</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Identity Proof" name="uploadIdentityProof">
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload Document</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
