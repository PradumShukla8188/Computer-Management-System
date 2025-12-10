"use client";

import { addStudent, courseData } from "@/interfaces/addStudent";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Upload,
    message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { useState } from "react";

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

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

export default function AddStudent() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<{
    studentPhoto: UploadFile[];
    uploadEducationProof: UploadFile[];
    uploadIdentityProof: UploadFile[];
  }>({
    studentPhoto: [],
    uploadEducationProof: [],
    uploadIdentityProof: [],
  });

  const [previews, setPreviews] = useState({
    studentPhoto: null as string | null,
    uploadEducationProof: null as string | null,
    uploadIdentityProof: null as string | null,
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");


// Get courses
const { data: courseData, isLoading: coursesLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: async () => {
    const response = await ApiHitter("GET", "GET_COURSE_LIST", {}, "", {
      showError: true,
      showSuccess: false
    });
    return response?.data || [];
  },
});
const handleCourseChange = (courseId: string) => {
  setSelectedCourseId(courseId);

  // Find the selected course
  const selectedCourse = courseData?.find((course: courseData) => course._id === courseId);

  if (selectedCourse) {
    // Set the duration in the form
    form.setFieldsValue({
      courseDuration: `${selectedCourse.durationInMonths} months`
    });
  } else {
    // Clear duration if no course selected
    form.setFieldsValue({
      courseDuration: ""
    });
  }
};

  // Handle file upload and preview
  const handleFileChange = (info: any, field: keyof typeof fileList) => {
    const { file } = info;

    // Check file type
    if (field === 'studentPhoto' && file.originFileObj) {
      const fileType = file.originFileObj.type;
      if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
        message.error('Please upload only image files (JPEG, JPG, PNG, WebP) for student photo!');
        return;
      }
    }

    // Update file list
    setFileList(prev => ({
      ...prev,
      [field]: file.status === 'removed' ? [] : [file]
    }));

    // Generate preview for images
    if (file.originFileObj && file.status !== 'removed') {
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.originFileObj.type);
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [field]: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file.originFileObj);
      } else {
        setPreviews(prev => ({
          ...prev,
          [field]: null
        }));
      }
    } else {
      setPreviews(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Custom upload request (prevents automatic upload)
  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok", file);
    }, 0);
  };

  // Custom before upload validation
  const beforeUpload = (file: File, field: string) => {
    let isValid = true;
    let errorMessage = '';

    if (field === 'studentPhoto') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        isValid = false;
        errorMessage = 'Student photo must be an image (JPEG, JPG, PNG, WebP)!';
      }
    } else {
      if (!ALLOWED_DOC_TYPES.includes(file.type)) {
        isValid = false;
        errorMessage = 'Document must be an image or PDF!';
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      isValid = false;
      errorMessage = 'File size must be less than 5MB!';
    }

    if (!isValid) {
      message.error(errorMessage);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

//   add student
  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (body: addStudent) =>
      ApiHitter("POST", "ADD_STUDENT", body, "", {
        showSuccess: true,
        successMessage: "Student added successfully",
        showError: true,
      }),

    onSuccess: (res) => {
      console.log("Student added successfully:", res);
      message.success("Student added successfully!");
      form.resetFields();
      setFileList({
        studentPhoto: [],
        uploadEducationProof: [],
        uploadIdentityProof: [],
      });
      setPreviews({
        studentPhoto: null,
        uploadEducationProof: null,
        uploadIdentityProof: null,
      });
    },
    onError: (error) => {
      console.error("Error adding student:", error);
      message.error("Failed to add student");
    },
  });

//   upload api
  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      return ApiHitter("POST", "UPLOAD", formData, "", {
        showSuccess: false,
        showError: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      // Validate required files
      if (!fileList.studentPhoto.length) {
        message.error("Please upload student photo!");
        return;
      }

      // Convert dates
      values.dob = dayjs(values.dob).toISOString();
      values.dateOfAdmission = dayjs(values.dateOfAdmission).toISOString();
      values.studentPhoto = "uploads/photos/student123.jpg";
      values.uploadEducationProof = "uploads/photos/student123.jpg";
      values.uploadIdentityProof = "uploads/photos/student123.jpg";

      // Upload files
    //   const uploadPromises = [];

    //   if (fileList.studentPhoto[0]?.originFileObj) {
    //     uploadPromises.push(
    //       uploadFile({
    //         file: fileList.studentPhoto[0].originFileObj,
    //         type: 'student_photo'
    //       }).then(res => ({ key: 'studentPhoto', url: res?.data?.url || "www.example.com" }))
    //     );
    //   }

    //   if (fileList.uploadEducationProof[0]?.originFileObj) {
    //     uploadPromises.push(
    //       uploadFile({
    //         file: fileList.uploadEducationProof[0].originFileObj,
    //         type: 'education_proof'
    //       }).then(res => ({ key: 'educationProof', url: res?.data?.url || "www.example.com" }))
    //     );
    //   }

    //   if (fileList.uploadIdentityProof[0]?.originFileObj) {
    //     uploadPromises.push(
    //       uploadFile({
    //         file: fileList.uploadIdentityProof[0].originFileObj,
    //         type: 'identity_proof'
    //       }).then(res => ({ key: 'identityProof', url: res?.data?.url || "www.example.com" }))
    //     );
    //   }

    //   const uploadResults = await Promise.allSettled(uploadPromises);

      // Prepare student data
      const studentData: any = { ...values };

    //   uploadResults.forEach(result => {
    //     if (result.status === 'fulfilled' && result.value.url) {
    //       studentData[result.value.key] = result.value.url;
    //     }
    //   });

      // Add student
      addStudent(studentData);

    } catch (err) {
      console.error("Submission error:", err);
      message.error("❌ Failed to submit student");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            ➕ Add New Student
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fill in the details to register a new student
          </p>
        </div>
      </div>

      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ---------------- PERSONAL DETAILS ---------------- */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-lg">👤</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Personal Details
              </h2>
            </div>
          </div>

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
                <DatePicker className="w-full" format="YYYY-MM-DD" />
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
          <div className="mb-6 mt-8">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-lg">📞</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Contact Information
              </h2>
            </div>
          </div>

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
          <div className="mb-6 mt-8">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <span className="text-lg">📍</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Address Details
              </h2>
            </div>
          </div>

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
          <div className="mb-6 mt-8">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <span className="text-lg">🎓</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Education Details
              </h2>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
            <Form.Item
                label="Select Course"
                name="selectedCourse"
                rules={[{ required: true, message: "Course required" }]}
            >
                <Select
                placeholder="Select a course"
                loading={coursesLoading}
                onChange={handleCourseChange}
                >
                {courseData?.map((course: courseData) => (
                    <Option key={course._id} value={course._id }>
                    {course.name}
                    </Option>
                ))}
                </Select>
            </Form.Item>
            </Col>

            <Col xs={24} md={12}>
            <Form.Item
                label="Course Duration"
                name="courseDuration"
            >
                <Input
                readOnly
                className="bg-gray-50"
                />
            </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Date of Admission"
                name="dateOfAdmission"
                rules={[{ required: true, message: "Select admission date" }]}
              >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
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
                <InputNumber className="w-full" />
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
          <div className="mb-6 mt-8">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <span className="text-lg">📄</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Upload Documents
              </h2>
            </div>
          </div>

          <Row gutter={[18, 18]}>
            {/* Student Photo */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Student Photo *"
                required
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList.studentPhoto}
                  maxCount={1}
                  beforeUpload={(file) => beforeUpload(file, 'studentPhoto')}
                  customRequest={dummyRequest}
                  onChange={(info) => handleFileChange(info, 'studentPhoto')}
                  onRemove={() => {
                    setFileList(prev => ({ ...prev, studentPhoto: [] }));
                    setPreviews(prev => ({ ...prev, studentPhoto: null }));
                  }}
                  accept="image/*"
                  className="w-full"
                >
                  {fileList.studentPhoto.length === 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <UploadOutlined style={{ fontSize: '24px' }} />
                      <div className="mt-2">Upload Photo</div>
                      <div className="text-xs text-gray-500">JPG, PNG, WebP</div>
                    </div>
                  )}
                </Upload>

                {/* {previews.studentPhoto && (
                  <div className="mt-2">
                    <img
                      src={previews.studentPhoto}
                      alt="Student Preview"
                      className="h-32 w-32 rounded-lg border object-cover shadow-sm"
                    />
                  </div>
                )} */}
              </Form.Item>
            </Col>

            {/* Education Proof */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Education Proof"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList.uploadEducationProof}
                  maxCount={1}
                  beforeUpload={(file) => beforeUpload(file, 'document')}
                  customRequest={dummyRequest}
                  onChange={(info) => handleFileChange(info, 'uploadEducationProof')}
                  onRemove={() => {
                    setFileList(prev => ({ ...prev, uploadEducationProof: [] }));
                    setPreviews(prev => ({ ...prev, uploadEducationProof: null }));
                  }}
                  accept="image/*,.pdf"
                  className="w-full"
                >
                  {fileList.uploadEducationProof.length === 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <UploadOutlined style={{ fontSize: '24px' }} />
                      <div className="mt-2">Upload Document</div>
                      <div className="text-xs text-gray-500">JPG, PNG, PDF</div>
                    </div>
                  )}
                </Upload>

                {/* {previews.uploadEducationProof ? (
                  <div className="mt-2">
                    <img
                      src={previews.uploadEducationProof}
                      alt="Education Proof Preview"
                      className="h-32 w-32 rounded-lg border object-cover shadow-sm"
                    />
                  </div>
                ) : fileList.uploadEducationProof.length > 0 && (
                  <div className="mt-2 rounded bg-blue-50 p-2">
                    <div className="text-sm font-medium text-blue-700">
                      ✓ {fileList.uploadEducationProof[0].name}
                    </div>
                    <div className="text-xs text-blue-600">
                      (PDF document uploaded)
                    </div>
                  </div>
                )} */}
              </Form.Item>
            </Col>

            {/* Identity Proof */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Identity Proof"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList.uploadIdentityProof}
                  maxCount={1}
                  beforeUpload={(file) => beforeUpload(file, 'document')}
                  customRequest={dummyRequest}
                  onChange={(info) => handleFileChange(info, 'uploadIdentityProof')}
                  onRemove={() => {
                    setFileList(prev => ({ ...prev, uploadIdentityProof: [] }));
                    setPreviews(prev => ({ ...prev, uploadIdentityProof: null }));
                  }}
                  accept="image/*,.pdf"
                  className="w-full"
                >
                  {fileList.uploadIdentityProof.length === 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <UploadOutlined style={{ fontSize: '24px' }} />
                      <div className="mt-2">Upload ID</div>
                      <div className="text-xs text-gray-500">JPG, PNG, PDF</div>
                    </div>
                  )}
                </Upload>

                {/* {previews.uploadIdentityProof ? (
                  <div className="mt-2">
                    <img
                      src={previews.uploadIdentityProof}
                      alt="Identity Proof Preview"
                      className="h-32 w-32 rounded-lg border object-cover shadow-sm"
                    />
                  </div>
                ) : fileList.uploadIdentityProof.length > 0 && (
                  <div className="mt-2 rounded bg-green-50 p-2">
                    <div className="text-sm font-medium text-green-700">
                      ✓ {fileList.uploadIdentityProof[0].name}
                    </div>
                    <div className="text-xs text-green-600">
                      (PDF document uploaded)
                    </div>
                  </div>
                )} */}
              </Form.Item>
            </Col>
          </Row>

          <div className="mb-4 text-sm text-gray-600">
            <p>* Required: Student Photo (Max 5MB, JPG/PNG/WebP)</p>
            <p>* Documents: Max 5MB each, JPG/PNG/PDF format</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-8 h-12 text-base font-semibold"
            >
              {isPending ? "Submitting..." : "Submit Student Details"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
