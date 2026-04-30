// "use client";

// import { addStudent, courseData } from "@/interfaces/addStudent";
// import { ApiHitter } from "@/lib/axiosApi/apiHitter";
// import { UploadOutlined } from "@ant-design/icons";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//   Button,
//   Card,
//   Col,
//   DatePicker,
//   Form,
//   Input,
//   InputNumber,
//   Row,
//   Select,
//   Upload,
//   message,
// } from "antd";
// import type { UploadFile } from "antd/es/upload/interface";
// import dayjs from "dayjs";
// import { useState } from "react";
// import { toastify } from "@/lib/toast";

// const { Option } = Select;

// const genderOptions = ["Male", "Female", "Other"];
// const religionOptions = [
//   "Hindu",
//   "Muslim",
//   "Sikh",
//   "Christian",
//   "Jain",
//   "Buddhist",
//   "Other",
// ];
// const categoryOptions = ["General", "OBC", "SC", "ST", "Other"];
// const examModeOptions = ["Online", "Offline"];

// // Allowed file types
// const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// const ALLOWED_DOC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

// const normalizeUrl = (rawUrl?: string) => {
//   if (!rawUrl) return null;

//   // remove quotes
//   const cleaned = rawUrl.replace(/"/g, '').trim();

//   // handle comma-separated base + path
//   if (cleaned.includes(',')) {
//     const parts = cleaned.split(',');
//     return `${parts[0]}${parts[1]}`;
//   }

//   return cleaned;
// };


// export default function AddStudent() {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState<{
//     studentPhoto: UploadFile[];
//     uploadEducationProof: UploadFile[];
//     uploadIdentityProof: UploadFile[];
//   }>({
//     studentPhoto: [],
//     uploadEducationProof: [],
//     uploadIdentityProof: [],
//   });

//   const [previews, setPreviews] = useState({
//     studentPhoto: null as string | null,
//     uploadEducationProof: null as string | null,
//     uploadIdentityProof: null as string | null,
//   });
//   const [selectedCourseId, setSelectedCourseId] = useState<string>("");


//   // Get courses
//   const { data: courseData, isLoading: coursesLoading } = useQuery({
//     queryKey: ['courses'],
//     queryFn: async () => {
//       const response = await ApiHitter("GET", "GET_COURSE_LIST", {}, "", {
//         showError: true,
//         showSuccess: false
//       });
//       return response?.data || [];
//     },
//   });
//   const handleCourseChange = (courseId: string) => {
//     setSelectedCourseId(courseId);

//     // Find the selected course
//     const selectedCourse = courseData?.find((course: courseData) => course._id === courseId);

//     if (selectedCourse) {
//       // Set the duration in the form
//       form.setFieldsValue({
//         courseDuration: `${selectedCourse.durationInMonths} months`
//       });
//     } else {
//       // Clear duration if no course selected
//       form.setFieldsValue({
//         courseDuration: ""
//       });
//     }
//   };

//   // Handle file upload and preview
//   const handleFileChange = (info: any, field: keyof typeof fileList) => {
//     const { file } = info;

//     // Check file type
//     if (field === 'studentPhoto' && file.originFileObj) {
//       const fileType = file.originFileObj.type;
//       if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
//         message.error('Please upload only image files (JPEG, JPG, PNG, WebP) for student photo!');
//         return;
//       }
//     }

//     // Update file list
//     setFileList(prev => ({
//       ...prev,
//       [field]: file.status === 'removed' ? [] : [file]
//     }));

//     // Generate preview for images
//     if (file.originFileObj && file.status !== 'removed') {
//       const isImage = ALLOWED_IMAGE_TYPES.includes(file.originFileObj.type);
//       if (isImage) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setPreviews(prev => ({
//             ...prev,
//             [field]: e.target?.result as string
//           }));
//         };
//         reader.readAsDataURL(file.originFileObj);
//       } else {
//         setPreviews(prev => ({
//           ...prev,
//           [field]: null
//         }));
//       }
//     } else {
//       setPreviews(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   // Custom upload request (prevents automatic upload)
//   const dummyRequest = ({ file, onSuccess }: any) => {
//     setTimeout(() => {
//       onSuccess("ok", file);
//     }, 0);
//   };

//   // Custom before upload validation
//   const beforeUpload = (file: File, field: string) => {
//     let isValid = true;
//     let errorMessage = '';

//     if (field === 'studentPhoto') {
//       if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//         isValid = false;
//         errorMessage = 'Student photo must be an image (JPEG, JPG, PNG, WebP)!';
//       }
//     } else {
//       if (!ALLOWED_DOC_TYPES.includes(file.type)) {
//         isValid = false;
//         errorMessage = 'Document must be an image or PDF!';
//       }
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       isValid = false;
//       errorMessage = 'File size must be less than 5MB!';
//     }

//     if (!isValid) {
//       message.error(errorMessage);
//       return Upload.LIST_IGNORE;
//     }

//     return true;
//   };

//   //   add student
//   const { mutate: addStudent, isPending } = useMutation({
//     mutationFn: (body: addStudent) =>
//       ApiHitter("POST", "ADD_STUDENT", body, "", {
//         showSuccess: true,
//         successMessage: "Student added successfully",
//         showError: true,
//       }),

//     onSuccess: (res) => {
//       console.log("Student added successfully:", res);
//       toastify.success(res?.message || "Student added successfully!");
//       form.resetFields();
//       setFileList({
//         studentPhoto: [],
//         uploadEducationProof: [],
//         uploadIdentityProof: [],
//       });
//       setPreviews({
//         studentPhoto: null,
//         uploadEducationProof: null,
//         uploadIdentityProof: null,
//       });
//     },
//     onError: (error) => {
//       console.error("Error adding student:", error);
//       toastify.error(error?.message || "Failed to add student");
//     },
//   });

//   //   upload api
//   const { mutateAsync: uploadFile } = useMutation({
//     mutationFn: async ({ file, type }: { file: File; type: string }) => {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('type', type);

//       return ApiHitter("POST", "UPLOAD", formData, "", {
//         showSuccess: false,
//         showError: true,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//     },
//   });

//   const handleSubmit = async (values: any) => {
//     try {
//       if (!fileList.studentPhoto.length) {
//         toastify.error("Please upload student photo!");
//         return;
//       }

//       values.dob = dayjs(values.dob).toISOString();
//       values.dateOfAdmission = dayjs(values.dateOfAdmission).toISOString();

//       const uploadTasks = [];

//       if (fileList.studentPhoto[0]?.originFileObj) {
//         uploadTasks.push(
//           uploadFile({
//             file: fileList.studentPhoto[0].originFileObj,
//             type: 'student_photo',
//           }).then(res => ({
//             key: 'studentPhoto',
//             url: normalizeUrl(res?.data?.[0]?.url),
//           }))
//         );
//       }

//       if (fileList.uploadEducationProof[0]?.originFileObj) {
//         uploadTasks.push(
//           uploadFile({
//             file: fileList.uploadEducationProof[0].originFileObj,
//             type: 'education_proof',
//           }).then(res => ({
//             key: 'educationProof',
//             url: normalizeUrl(res?.data?.[0]?.url),
//           }))
//         );
//       }

//       if (fileList.uploadIdentityProof[0]?.originFileObj) {
//         uploadTasks.push(
//           uploadFile({
//             file: fileList.uploadIdentityProof[0].originFileObj,
//             type: 'identity_proof',
//           }).then(res => ({
//             key: 'identityProof',
//             url: normalizeUrl(res?.data?.[0]?.url),
//           }))
//         );
//       }

//       const uploadResults = await Promise.all(uploadTasks);

//       const studentData: any = { ...values };

//       uploadResults.forEach(({ key, url }) => {
//         if (url) {
//           studentData[key] = url;
//         }
//       });

//       console.log("FINAL PAYLOAD ", studentData);

//       addStudent(studentData);
//     } catch (error) {
//       console.error(error);
//       message.error("Failed to submit student");
//     }
//   };

//   return (
//     <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
//       {/* Header Section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//             ➕ Add New Student
//           </h1>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Fill in the details to register a new student
//           </p>
//         </div>
//       </div>

//       <Card className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           {/* ---------------- PERSONAL DETAILS ---------------- */}
//           <div className="mb-6">
//             <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
//                 <span className="text-lg">👤</span>
//               </div>
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 Personal Details
//               </h2>
//             </div>
//           </div>

//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Student Name"
//                 name="name"
//                 rules={[
//                   { required: true, message: "Student name is required" },
//                 ]}
//               >
//                 <Input placeholder="Enter student full name" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Date of Birth"
//                 name="dob"
//                 rules={[
//                   { required: true, message: "Please select date of birth" },
//                 ]}
//               >
//                 <DatePicker className="w-full" format="YYYY-MM-DD" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Gender"
//                 name="gender"
//                 rules={[{ required: true, message: "Please select gender" }]}
//               >
//                 <Select placeholder="Select gender">
//                   {genderOptions.map((g) => (
//                     <Option key={g}>{g}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Religion"
//                 name="religion"
//                 rules={[{ required: true, message: "Please select religion" }]}
//               >
//                 <Select placeholder="Select religion">
//                   {religionOptions.map((r) => (
//                     <Option key={r}>{r}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Category"
//                 name="category"
//                 rules={[{ required: true, message: "Please select category" }]}
//               >
//                 <Select placeholder="Select category">
//                   {categoryOptions.map((c) => (
//                     <Option key={c}>{c}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Father Name"
//                 name="fatherName"
//                 rules={[{ required: true, message: "Father's name required" }]}
//               >
//                 <Input placeholder="Enter Father's Name" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Mother Name"
//                 name="motherName"
//                 rules={[{ required: true, message: "Mother's name required" }]}
//               >
//                 <Input placeholder="Enter Mother's Name" />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* ---------------- CONTACT INFO ---------------- */}
//           <div className="mb-6 mt-8">
//             <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
//                 <span className="text-lg">📞</span>
//               </div>
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 Contact Information
//               </h2>
//             </div>
//           </div>

//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Mobile"
//                 name="mobile"
//                 rules={[{ required: true, message: "Mobile number required" }]}
//               >
//                 <Input placeholder="e.g. 9876543210" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[
//                   {
//                     required: true,
//                     type: "email",
//                     message: "Enter a valid email",
//                   },
//                 ]}
//               >
//                 <Input placeholder="example@gmail.com" />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item
//                 label="Residential Address"
//                 name="residentialAddress"
//                 rules={[{ required: true, message: "Address required" }]}
//               >
//                 <Input.TextArea rows={2} placeholder="Full address" />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* ---------------- ADDRESS ---------------- */}
//           <div className="mb-6 mt-8">
//             <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
//                 <span className="text-lg">📍</span>
//               </div>
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 Address Details
//               </h2>
//             </div>
//           </div>

//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="State"
//                 name="state"
//                 rules={[{ required: true, message: "State required" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="District"
//                 name="district"
//                 rules={[{ required: true, message: "District required" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Country"
//                 name="country"
//                 rules={[{ required: true, message: "Country required" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Pin Code"
//                 name="pinCode"
//                 rules={[{ required: true, message: "Pin code required" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* ---------------- EDUCATION ---------------- */}
//           <div className="mb-6 mt-8">
//             <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
//                 <span className="text-lg">🎓</span>
//               </div>
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 Education Details
//               </h2>
//             </div>
//           </div>

//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Select Course"
//                 name="selectedCourse"
//                 rules={[{ required: true, message: "Course required" }]}
//               >
//                 <Select
//                   placeholder="Select a course"
//                   loading={coursesLoading}
//                   onChange={handleCourseChange}
//                 >
//                   {courseData?.map((course: courseData) => (
//                     <Option key={course._id} value={course._id}>
//                       {course.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Course Duration"
//                 name="courseDuration"
//               >
//                 <Input
//                   readOnly
//                   className="bg-gray-50"
//                 />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Date of Admission"
//                 name="dateOfAdmission"
//                 rules={[{ required: true, message: "Select admission date" }]}
//               >
//                 <DatePicker className="w-full" format="YYYY-MM-DD" />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Session"
//                 name="session"
//                 rules={[{ required: true, message: "Session required" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Total Fees"
//                 name="totalFees"
//                 rules={[{ required: true, message: "Fees required" }]}
//               >
//                 <InputNumber className="w-full" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Exam Mode"
//                 name="examMode"
//                 rules={[{ required: true, message: "Select exam mode" }]}
//               >
//                 <Select placeholder="Choose mode">
//                   {examModeOptions.map((m) => (
//                     <Option key={m}>{m}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* ---------------- FILE UPLOAD ---------------- */}
//           <div className="mb-6 mt-8">
//             <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
//                 <span className="text-lg">📄</span>
//               </div>
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 Upload Documents
//               </h2>
//             </div>
//           </div>

//           <Row gutter={[18, 18]}>
//             {/* Student Photo */}
//             <Col xs={24} sm={12} md={8}>
//               <Form.Item
//                 label="Student Photo *"
//                 required
//               >
//                 <Upload
//                   listType="picture-card"
//                   fileList={fileList.studentPhoto}
//                   maxCount={1}
//                   beforeUpload={(file) => beforeUpload(file, 'studentPhoto')}
//                   customRequest={dummyRequest}
//                   onChange={(info) => handleFileChange(info, 'studentPhoto')}
//                   onRemove={() => {
//                     setFileList(prev => ({ ...prev, studentPhoto: [] }));
//                     setPreviews(prev => ({ ...prev, studentPhoto: null }));
//                   }}
//                   accept="image/*"
//                   className="w-full"
//                 >
//                   {fileList.studentPhoto.length === 0 && (
//                     <div className="flex flex-col items-center justify-center">
//                       <UploadOutlined style={{ fontSize: '24px' }} />
//                       <div className="mt-2">Upload Photo</div>
//                       <div className="text-xs text-gray-500">JPG, PNG, WebP</div>
//                     </div>
//                   )}
//                 </Upload>

//                 {previews.studentPhoto && (
//                   <div className="mt-2">
//                     <img
//                       src={previews.studentPhoto}
//                       alt="Student Preview"
//                       className="h-32 w-32 rounded-lg border object-cover shadow-sm"
//                     />
//                   </div>
//                 )}
//               </Form.Item>
//             </Col>

//             {/* Education Proof */}
//             <Col xs={24} sm={12} md={8}>
//               <Form.Item
//                 label="Education Proof"
//               >
//                 <Upload
//                   listType="picture-card"
//                   fileList={fileList.uploadEducationProof}
//                   maxCount={1}
//                   beforeUpload={(file) => beforeUpload(file, 'document')}
//                   customRequest={dummyRequest}
//                   onChange={(info) => handleFileChange(info, 'uploadEducationProof')}
//                   onRemove={() => {
//                     setFileList(prev => ({ ...prev, uploadEducationProof: [] }));
//                     setPreviews(prev => ({ ...prev, uploadEducationProof: null }));
//                   }}
//                   accept="image/*,.pdf"
//                   className="w-full"
//                 >
//                   {fileList.uploadEducationProof.length === 0 && (
//                     <div className="flex flex-col items-center justify-center">
//                       <UploadOutlined style={{ fontSize: '24px' }} />
//                       <div className="mt-2">Upload Document</div>
//                       <div className="text-xs text-gray-500">JPG, PNG, PDF</div>
//                     </div>
//                   )}
//                 </Upload>

//                 {previews.uploadEducationProof ? (
//                   <div className="mt-2">
//                     <img
//                       src={previews.uploadEducationProof}
//                       alt="Education Proof Preview"
//                       className="h-32 w-32 rounded-lg border object-cover shadow-sm"
//                     />
//                   </div>
//                 ) : fileList.uploadEducationProof.length > 0 && (
//                   <div className="mt-2 rounded bg-blue-50 p-2">
//                     <div className="text-sm font-medium text-blue-700">
//                       ✓ {fileList.uploadEducationProof[0].name}
//                     </div>
//                     <div className="text-xs text-blue-600">
//                       (PDF document uploaded)
//                     </div>
//                   </div>
//                 )}
//               </Form.Item>
//             </Col>

//             {/* Identity Proof */}
//             <Col xs={24} sm={12} md={8}>
//               <Form.Item
//                 label="Identity Proof"
//               >
//                 <Upload
//                   listType="picture-card"
//                   fileList={fileList.uploadIdentityProof}
//                   maxCount={1}
//                   beforeUpload={(file) => beforeUpload(file, 'document')}
//                   customRequest={dummyRequest}
//                   onChange={(info) => handleFileChange(info, 'uploadIdentityProof')}
//                   onRemove={() => {
//                     setFileList(prev => ({ ...prev, uploadIdentityProof: [] }));
//                     setPreviews(prev => ({ ...prev, uploadIdentityProof: null }));
//                   }}
//                   accept="image/*,.pdf"
//                   className="w-full"
//                 >
//                   {fileList.uploadIdentityProof.length === 0 && (
//                     <div className="flex flex-col items-center justify-center">
//                       <UploadOutlined style={{ fontSize: '24px' }} />
//                       <div className="mt-2">Upload ID</div>
//                       <div className="text-xs text-gray-500">JPG, PNG, PDF</div>
//                     </div>
//                   )}
//                 </Upload>

//                 {previews.uploadIdentityProof ? (
//                   <div className="mt-2">
//                     <img
//                       src={previews.uploadIdentityProof}
//                       alt="Identity Proof Preview"
//                       className="h-32 w-32 rounded-lg border object-cover shadow-sm"
//                     />
//                   </div>
//                 ) : fileList.uploadIdentityProof.length > 0 && (
//                   <div className="mt-2 rounded bg-green-50 p-2">
//                     <div className="text-sm font-medium text-green-700">
//                       ✓ {fileList.uploadIdentityProof[0].name}
//                     </div>
//                     <div className="text-xs text-green-600">
//                       (PDF document uploaded)
//                     </div>
//                   </div>
//                 )}
//               </Form.Item>
//             </Col>
//           </Row>

//           <div className="mb-4 text-sm text-gray-600">
//             <p>* Required: Student Photo (Max 5MB, JPG/PNG/WebP)</p>
//             <p>* Documents: Max 5MB each, JPG/PNG/PDF format</p>
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               type="primary"
//               htmlType="submit"
//               size="large"
//               loading={isPending}
//               className="rounded-lg bg-blue-600 hover:bg-blue-700 px-8 h-12 text-base font-semibold"
//             >
//               {isPending ? "Submitting..." : "Submit Student Details"}
//             </Button>
//           </div>
//         </Form>
//       </Card>
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { ApiHitter } from "@/lib/axiosApi/apiHitter";
// import { toastify } from "@/lib/toast";

// interface CourseData {
//   _id: string;
//   name: string;
//   durationInMonths: number;
// }

// interface StudentFormData {
//   name: string;
//   dob: string;
//   gender: string;
//   religion: string;
//   category: string;
//   fatherName: string;
//   motherName: string;
//   mobile: string;
//   email: string;
//   residentialAddress: string;
//   state: string;
//   district: string;
//   country: string;
//   pinCode: string;
//   selectedCourse: string;
//   dateOfAdmission: string;
//   session: string;
//   totalFees: string;
//   examMode: string;
//   studentPhoto?: string;
//   educationProof?: string;
//   identityProof?: string;
// }

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
// const ALLOWED_DOC_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

// const normalizeUrl = (rawUrl?: string) => {
//   if (!rawUrl) return null;
//   const cleaned = rawUrl.replace(/"/g, "").trim();
//   if (cleaned.includes(",")) {
//     const parts = cleaned.split(",");
//     return `${parts[0]}${parts[1]}`;
//   }
//   return cleaned;
// };

// export default function AddStudent() {
//   const [formData, setFormData] = useState<Partial<StudentFormData>>({});
//   const [files, setFiles] = useState<{
//     studentPhoto: File | null;
//     educationProof: File | null;
//     identityProof: File | null;
//   }>({
//     studentPhoto: null,
//     educationProof: null,
//     identityProof: null,
//   });

//   const [previews, setPreviews] = useState<{
//     studentPhoto: string | null;
//     educationProof: string | null;
//     identityProof: string | null;
//   }>({
//     studentPhoto: null,
//     educationProof: null,
//     identityProof: null,
//   });

//   const [courseDuration, setCourseDuration] = useState("");
//   const [totalFees, setTotalFees] = useState("");

//   // Get courses
//   const { data: courseData = [], isLoading: coursesLoading } = useQuery({
//     queryKey: ["courses"],
//     queryFn: async () => {
//       const response = await ApiHitter("GET", "GET_COURSE_LIST", {}, "", {
//         showError: true,
//         showSuccess: false,
//       });
//       return response?.data || [];
//     },
//   });

//   // Upload file mutation
//   const { mutateAsync: uploadFile } = useMutation({
//     mutationFn: async ({ file, type }: { file: File; type: string }) => {
//       const formDataUpload = new FormData();
//       formDataUpload.append("file", file);
//       formDataUpload.append("type", type);

//       return ApiHitter("POST", "UPLOAD", formDataUpload, "", {
//         showSuccess: false,
//         showError: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     },
//   });

//   // Add student mutation
//   const { mutate: addStudent, isPending } = useMutation({
//     mutationFn: (body: StudentFormData) =>
//       ApiHitter("POST", "ADD_STUDENT", body, "", {
//         showSuccess: true,
//         successMessage: "Student added successfully",
//         showError: true,
//       }),
//     onSuccess: () => {
//       toastify.success("Student added successfully!");
//       resetForm();
//     },
//     onError: (error: any) => {
//       toastify.error(error?.message || "Failed to add student");
//     },
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const courseId = e.target.value;
//     setFormData((prev) => ({ ...prev, selectedCourse: courseId }));

//     const selected = courseData.find((c: CourseData) => c._id === courseId);
//     if (selected) {
//       setCourseDuration(`${selected.durationInMonths} months`);
//     } else {
//       setCourseDuration("");
//     }
//   };

//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: keyof typeof files
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const allowedTypes =
//       field === "studentPhoto" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;

//     if (!allowedTypes.includes(file.type)) {
//       toastify.error(`Invalid file type for ${field}`);
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toastify.error("File size must be less than 5MB");
//       return;
//     }

//     setFiles((prev) => ({ ...prev, [field]: file }));

//     // Generate preview
//     if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setPreviews((prev) => ({
//           ...prev,
//           [field]: event.target?.result as string,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const resetForm = () => {
//     setFormData({});
//     setFiles({ studentPhoto: null, educationProof: null, identityProof: null });
//     setPreviews({ studentPhoto: null, educationProof: null, identityProof: null });
//     setCourseDuration("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!files.studentPhoto) {
//       toastify.error("Please upload student photo");
//       return;
//     }

//     try {
//       const uploadTasks = [];

//       if (files.studentPhoto) {
//         uploadTasks.push(
//           uploadFile({
//             file: files.studentPhoto,
//             type: "student_photo",
//           }).then((res) => ({
//             key: "studentPhoto",
//             url: normalizeUrl(res?.data?.[0]?.url),
//           }))
//         );
//       }

//       if (files.educationProof) {
//         uploadTasks.push(
//           uploadFile({
//             file: files.educationProof,
//             type: "education_proof",
//           }).then((res) => ({
//             key: "educationProof",
//             url: normalizeUrl(res?.data?.[0]?.url),
//           }))
//         );
//       }

//       if (files.identityProof) {
//         uploadTasks.push(
//           uploadFile({
//             file: files.identityProof,
//             type: "identity_proof",
//           }).then((res) => ({
//             key: "identityProof",
//             url: normalizeUrl(res?.data?.[0]?.url),
//           }))
//         );
//       }

//       const uploadResults = await Promise.all(uploadTasks);
//       const studentData: any = { ...formData };

//       uploadResults.forEach(({ key, url }) => {
//         if (url) {
//           studentData[key] = url;
//         }
//       });

//       addStudent(studentData);
//     } catch (error) {
//       toastify.error("Failed to submit student");
//     }
//   };

//   const FormSection = ({
//     title,
//     icon,
//     color,
//     children,
//   }: {
//     title: string;
//     icon: string;
//     color: string;
//     children: React.ReactNode;
//   }) => (
//     <div className="mb-8">
//       <div
//         className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${color === "blue" ? "border-blue-200" : ""
//           } ${color === "green" ? "border-green-200" : ""} ${color === "purple" ? "border-purple-200" : ""
//           } ${color === "yellow" ? "border-yellow-200" : ""} ${color === "red" ? "border-red-200" : ""
//           }`}
//       >
//         <div
//           className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${color === "blue" ? "bg-blue-100 text-blue-600" : ""
//             } ${color === "green" ? "bg-green-100 text-green-600" : ""} ${color === "purple" ? "bg-purple-100 text-purple-600" : ""
//             } ${color === "yellow" ? "bg-yellow-100 text-yellow-600" : ""} ${color === "red" ? "bg-red-100 text-red-600" : ""
//             }`}
//         >
//           {icon}
//         </div>
//         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//       </div>
//       <div className="space-y-4">{children}</div>
//     </div>
//   );

//   const FormInput = ({
//     label,
//     name,
//     type = "text",
//     placeholder,
//     required = false,
//     value,
//   }: {
//     label: string;
//     name: string;
//     type?: string;
//     placeholder?: string;
//     required?: boolean;
//     value: string;
//   }) => (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={handleInputChange}
//         placeholder={placeholder}
//         required={required}
//         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//       />
//     </div>
//   );

//   const FormTextarea = ({
//     label,
//     name,
//     placeholder,
//     required = false,
//     value,
//   }: {
//     label: string;
//     name: string;
//     placeholder?: string;
//     required?: boolean;
//     value: string;
//   }) => (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <textarea
//         name={name}
//         value={value}
//         onChange={handleInputChange}
//         placeholder={placeholder}
//         required={required}
//         rows={3}
//         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//       />
//     </div>
//   );

//   const FormSelect = ({
//     label,
//     name,
//     options,
//     required = false,
//     value,
//   }: {
//     label: string;
//     name: string;
//     options: string[];
//     required?: boolean;
//     value: string;
//   }) => (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <select
//         name={name}
//         value={value}
//         onChange={handleInputChange}
//         required={required}
//         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white cursor-pointer"
//       >
//         <option value="">Select {label}</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   const FileUpload = ({
//     label,
//     field,
//     accept,
//     required = false,
//   }: {
//     label: string;
//     field: keyof typeof files;
//     accept: string;
//     required?: boolean;
//   }) => (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <input
//           type="file"
//           accept={accept}
//           onChange={(e) => handleFileChange(e, field)}
//           className="hidden"
//           id={field}
//           required={required}
//         />
//         <label
//           htmlFor={field}
//           className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
//         >
//           <div className="text-center">
//             <svg
//               className="w-8 h-8 mx-auto text-gray-400 mb-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             <p className="text-sm text-gray-600">
//               {files[field]?.name || "Click to upload or drag and drop"}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               {field === "studentPhoto" ? "JPG, PNG, WebP (Max 5MB)" : "JPG, PNG, PDF (Max 5MB)"}
//             </p>
//           </div>
//         </label>
//       </div>
//       {previews[field] && (
//         <div className="mt-3">
//           <img
//             src={previews[field] as string}
//             alt="Preview"
//             className="h-32 w-32 rounded-lg border border-gray-200 object-cover shadow-sm"
//           />
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 md:px-8">
//       <div className="mx-auto max-w-6xl">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-start gap-3 mb-2">
//             <span className="text-3xl">➕</span>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
//               <p className="text-gray-600 mt-1">
//                 Complete the form to register a new student in the system
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <form onSubmit={handleSubmit} className="p-8">
//             {/* Personal Details */}
//             <FormSection title="Personal Details" icon="👤" color="blue">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormInput
//                   label="Student Name"
//                   name="name"
//                   placeholder="Enter full name"
//                   required
//                   value={formData.name || ""}
//                 />
//                 <FormInput
//                   label="Date of Birth"
//                   name="dob"
//                   type="date"
//                   required
//                   value={formData.dob || ""}
//                 />
//                 <FormSelect
//                   label="Gender"
//                   name="gender"
//                   options={["Male", "Female", "Other"]}
//                   required
//                   value={formData.gender || ""}
//                 />
//                 <FormSelect
//                   label="Religion"
//                   name="religion"
//                   options={[
//                     "Hindu",
//                     "Muslim",
//                     "Sikh",
//                     "Christian",
//                     "Jain",
//                     "Buddhist",
//                     "Other",
//                   ]}
//                   required
//                   value={formData.religion || ""}
//                 />
//                 <FormSelect
//                   label="Category"
//                   name="category"
//                   options={["General", "OBC", "SC", "ST", "Other"]}
//                   required
//                   value={formData.category || ""}
//                 />
//                 <FormInput
//                   label="Father Name"
//                   name="fatherName"
//                   placeholder="Enter father's name"
//                   required
//                   value={formData.fatherName || ""}
//                 />
//               </div>
//               <FormInput
//                 label="Mother Name"
//                 name="motherName"
//                 placeholder="Enter mother's name"
//                 required
//                 value={formData.motherName || ""}
//               />
//             </FormSection>

//             {/* Contact Information */}
//             <FormSection title="Contact Information" icon="📞" color="green">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormInput
//                   label="Mobile"
//                   name="mobile"
//                   type="tel"
//                   placeholder="9876543210"
//                   required
//                   value={formData.mobile || ""}
//                 />
//                 <FormInput
//                   label="Email"
//                   name="email"
//                   type="email"
//                   placeholder="student@example.com"
//                   required
//                   value={formData.email || ""}
//                 />
//               </div>
//               <FormTextarea
//                 label="Residential Address"
//                 name="residentialAddress"
//                 placeholder="Enter full address"
//                 required
//                 value={formData.residentialAddress || ""}
//               />
//             </FormSection>

//             {/* Address Details */}
//             <FormSection title="Address Details" icon="📍" color="purple">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormInput
//                   label="State"
//                   name="state"
//                   placeholder="Enter state"
//                   required
//                   value={formData.state || ""}
//                 />
//                 <FormInput
//                   label="District"
//                   name="district"
//                   placeholder="Enter district"
//                   required
//                   value={formData.district || ""}
//                 />
//                 <FormInput
//                   label="Country"
//                   name="country"
//                   placeholder="Enter country"
//                   required
//                   value={formData.country || ""}
//                 />
//                 <FormInput
//                   label="Pin Code"
//                   name="pinCode"
//                   placeholder="Enter pin code"
//                   required
//                   value={formData.pinCode || ""}
//                 />
//               </div>
//             </FormSection>

//             {/* Education Details */}
//             <FormSection title="Education Details" icon="🎓" color="yellow">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Course <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.selectedCourse || ""}
//                     onChange={handleCourseChange}
//                     required
//                     disabled={coursesLoading}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white cursor-pointer"
//                   >
//                     <option value="">
//                       {coursesLoading ? "Loading courses..." : "Select a course"}
//                     </option>
//                     {courseData.map((course: CourseData) => (
//                       <option key={course._id} value={course._id}>
//                         {course.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <FormInput
//                   label="Course Duration"
//                   name="courseDuration"
//                   placeholder="Auto-filled"
//                   value={courseDuration}
//                 />

//                 <FormInput
//                   label="Date of Admission"
//                   name="dateOfAdmission"
//                   type="date"
//                   required
//                   value={formData.dateOfAdmission || ""}
//                 />
//                 <FormInput
//                   label="Session"
//                   name="session"
//                   placeholder="e.g., 2024-2025"
//                   required
//                   value={formData.session || ""}
//                 />
//                 <FormInput
//                   label="Total Fees"
//                   name="totalFees"
//                   type="number"
//                   placeholder="Enter total fees"
//                   required
//                   value={formData.totalFees || ""}
//                 />
//                 <FormSelect
//                   label="Exam Mode"
//                   name="examMode"
//                   options={["Online", "Offline"]}
//                   required
//                   value={formData.examMode || ""}
//                 />
//               </div>
//             </FormSection>

//             {/* Document Upload */}
//             <FormSection title="Upload Documents" icon="📄" color="red">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <FileUpload
//                   label="Student Photo"
//                   field="studentPhoto"
//                   accept="image/*"
//                   required
//                 />
//                 <FileUpload
//                   label="Education Proof"
//                   field="educationProof"
//                   accept="image/*,.pdf"
//                 />
//                 <FileUpload
//                   label="Identity Proof"
//                   field="identityProof"
//                   accept="image/*,.pdf"
//                 />
//               </div>
//               <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
//                 <p>* Student Photo is required (JPEG, PNG, WebP - Max 5MB)</p>
//                 <p>* Documents can be images or PDF (Max 5MB each)</p>
//               </div>
//             </FormSection>

//             {/* Submit Button */}
//             <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
//               <button
//                 type="submit"
//                 disabled={isPending}
//                 className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
//               >
//                 {isPending ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg
//                       className="animate-spin h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Submitting...
//                   </span>
//                 ) : (
//                   "Submit Student Details"
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition"
//               >
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { toastify } from "@/lib/toast";

interface CourseData {
  _id: string;
  name: string;
  durationInMonths: number;
  totalFees: number;
}

interface StudentFormData {
  name: string;
  dob: string;
  gender: string;
  religion: string;
  category: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  email: string;
  residentialAddress: string;
  state: string;
  district: string;
  country: string;
  pinCode: string;
  selectedCourse: string;
  dateOfAdmission: string;
  session: string;
  totalFees: string;
  examMode: string;
  studentPhoto?: string;
  educationProof?: string;
  identityProof?: string;
}

interface FormErrors {
  [key: string]: string;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const normalizeUrl = (rawUrl?: string) => {
  if (!rawUrl) return null;
  const cleaned = rawUrl.replace(/"/g, "").trim();
  if (cleaned.includes(",")) {
    const parts = cleaned.split(",");
    return `${parts[0]}${parts[1]}`;
  }
  return cleaned;
};

export default function AddStudent() {
  const [formData, setFormData] = useState<Partial<StudentFormData>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<{
    studentPhoto: File | null;
    educationProof: File | null;
    identityProof: File | null;
  }>({
    studentPhoto: null,
    educationProof: null,
    identityProof: null,
  });

  const [previews, setPreviews] = useState<{
    studentPhoto: string | null;
    educationProof: string | null;
    identityProof: string | null;
  }>({
    studentPhoto: null,
    educationProof: null,
    identityProof: null,
  });

  const [courseDuration, setCourseDuration] = useState("");
  const [totalFees, setTotalFees] = useState("");

  // Get courses
  const { data: courseData = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await ApiHitter("GET", "GET_COURSE_LIST", {}, "", {
        showError: true,
        showSuccess: false,
      });
      return response?.data || [];
    },
  });

  // Upload file mutation
  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", type);

      return ApiHitter("POST", "UPLOAD", formDataUpload, "", {
        showSuccess: false,
        showError: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  // Add student mutation
  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (body: StudentFormData) =>
      ApiHitter("POST", "ADD_STUDENT", body, "", {
        showSuccess: true,
        successMessage: "Student added successfully",
        showError: true,
      }),
    onSuccess: () => {
      toastify.success("Student added successfully!");
      resetForm();
    },
    onError: (error: any) => {
      toastify.error(error?.message || "Failed to add student");
    },
  });

  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal Details
    if (!formData.name?.trim()) newErrors.name = "Student name is required";
    if (!formData.dob?.trim()) newErrors.dob = "Date of birth is required (DD/MM/YYYY)";
    else if (!isValidDate(formData.dob)) newErrors.dob = "Invalid date format. Use DD/MM/YYYY";

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.religion) newErrors.religion = "Religion is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.fatherName?.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.motherName?.trim()) newErrors.motherName = "Mother's name is required";

    // Contact Info
    if (!formData.mobile?.trim()) newErrors.mobile = "Mobile number is required";
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.residentialAddress?.trim()) newErrors.residentialAddress = "Address is required";

    // Address Details
    if (!formData.state?.trim()) newErrors.state = "State is required";
    if (!formData.district?.trim()) newErrors.district = "District is required";
    if (!formData.country?.trim()) newErrors.country = "Country is required";
    if (!formData.pinCode?.trim()) newErrors.pinCode = "Pin code is required";

    // Education Details
    if (!formData.selectedCourse) newErrors.selectedCourse = "Course selection is required";
    if (!formData.dateOfAdmission?.trim()) newErrors.dateOfAdmission = "Admission date is required (DD/MM/YYYY)";
    else if (!isValidDate(formData.dateOfAdmission)) newErrors.dateOfAdmission = "Invalid date format. Use DD/MM/YYYY";

    if (!formData.session?.trim()) newErrors.session = "Session is required";
    if (!formData.totalFees) newErrors.totalFees = "Total fees is required";
    if (!formData.examMode) newErrors.examMode = "Exam mode is required";

    // File Upload
    if (!files.studentPhoto) newErrors.studentPhoto = "Student photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Sync specific states for auto-filled fields
    if (name === "totalFees") {
      setTotalFees(value);
    }
    if (name === "courseDuration") {
      setCourseDuration(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    const selected = courseData.find((c: CourseData) => c._id === courseId);

    if (selected) {
      const fees = selected.totalFees.toString();
      const duration = `${selected.durationInMonths} months`;

      setCourseDuration(duration);
      setTotalFees(fees);

      setFormData((prev) => ({
        ...prev,
        selectedCourse: courseId,
        totalFees: fees,
        courseDuration: duration,
      }));
    } else {
      setCourseDuration("");
      setTotalFees("");
      setFormData((prev) => ({
        ...prev,
        selectedCourse: courseId,
        totalFees: "",
        courseDuration: "",
      }));
    }

    if (errors.selectedCourse) {
      setErrors((prev) => ({ ...prev, selectedCourse: "" }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof files
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes =
      field === "studentPhoto" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [field]: `Invalid file type. Allowed: ${field === "studentPhoto" ? "JPG, PNG, WebP" : "JPG, PNG, PDF"}`,
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [field]: "File size must be less than 5MB" }));
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Generate preview
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews((prev) => ({
          ...prev,
          [field]: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({});
    setFiles({ studentPhoto: null, educationProof: null, identityProof: null });
    setPreviews({ studentPhoto: null, educationProof: null, identityProof: null });
    setCourseDuration("");
    setTotalFees("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastify.error("Please fix the errors in the form");
      return;
    }

    try {
      const uploadTasks = [];

      if (files.studentPhoto) {
        uploadTasks.push(
          uploadFile({
            file: files.studentPhoto,
            type: "student_photo",
          }).then((res) => ({
            key: "studentPhoto",
            url: normalizeUrl(res?.data?.[0]?.url),
          }))
        );
      }

      if (files.educationProof) {
        uploadTasks.push(
          uploadFile({
            file: files.educationProof,
            type: "education_proof",
          }).then((res) => ({
            key: "educationProof",
            url: normalizeUrl(res?.data?.[0]?.url),
          }))
        );
      }

      if (files.identityProof) {
        uploadTasks.push(
          uploadFile({
            file: files.identityProof,
            type: "identity_proof",
          }).then((res) => ({
            key: "identityProof",
            url: normalizeUrl(res?.data?.[0]?.url),
          }))
        );
      }

      const uploadResults = await Promise.all(uploadTasks);
      const studentData: any = { ...formData };

      uploadResults.forEach(({ key, url }) => {
        if (url) {
          studentData[key] = url;
        }
      });

      addStudent(studentData);
    } catch (error) {
      toastify.error("Failed to submit student");
    }
  };

  const FormSection = ({
    title,
    icon,
    color,
    children,
  }: {
    title: string;
    icon: string;
    color: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-8">
      <div
        className={`flex items-center gap-3 mb-6 px-0 py-4 border-b-2 ${color === "blue" ? "border-blue-500" : ""
          } ${color === "green" ? "border-green-500" : ""} ${color === "purple" ? "border-purple-500" : ""} ${color === "yellow" ? "border-orange-500" : ""
          } ${color === "red" ? "border-red-500" : ""}`}
      >
        <div className={`text-2xl p-2 rounded-lg ${color === "blue" ? "bg-blue-100 text-blue-600" : ""
          } ${color === "green" ? "bg-green-100 text-green-600" : ""} ${color === "purple" ? "bg-purple-100 text-purple-600" : ""
          } ${color === "yellow" ? "bg-orange-100 text-orange-600" : ""} ${color === "red" ? "bg-red-100 text-red-600" : ""
          }`}>
          {icon}
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const FormInput = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    value,
  }: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${errors[name]
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
          }`}
      />
      {errors[name] && (
        <div className="flex items-start gap-2 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errors[name]}</span>
        </div>
      )}
    </div>
  );

  const FormTextarea = ({
    label,
    name,
    placeholder,
    required = false,
    value,
  }: {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        rows={3}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition resize-none ${errors[name]
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
          }`}
      />
      {errors[name] && (
        <div className="flex items-start gap-2 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errors[name]}</span>
        </div>
      )}
    </div>
  );

  const FormSelect = ({
    label,
    name,
    options,
    required = false,
    value,
  }: {
    label: string;
    name: string;
    options: string[];
    required?: boolean;
    value: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleInputChange}
        required={required}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition appearance-none bg-white cursor-pointer ${errors[name]
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
          }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="flex items-start gap-2 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errors[name]}</span>
        </div>
      )}
    </div>
  );

  const FileUpload = ({
    label,
    field,
    accept,
    required = false,
  }: {
    label: string;
    field: keyof typeof files;
    accept: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e, field)}
          className="hidden"
          id={field}
          required={required}
        />
        <label
          htmlFor={field}
          className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition ${errors[field]
            ? "border-red-300 bg-red-50 hover:border-red-500"
            : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
            }`}
        >
          <div className="text-center">
            <svg
              className={`w-8 h-8 mx-auto mb-2 ${errors[field] ? "text-red-400" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className={`text-sm font-medium ${errors[field] ? "text-red-600" : "text-gray-600"}`}>
              {files[field]?.name || "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {field === "studentPhoto" ? "JPG, PNG, WebP (Max 5MB)" : "JPG, PNG, PDF (Max 5MB)"}
            </p>
          </div>
        </label>
      </div>
      {errors[field] && (
        <div className="flex items-start gap-2 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errors[field]}</span>
        </div>
      )}
      {previews[field] && (
        <div className="mt-3">
          <img
            src={previews[field] as string}
            alt="Preview"
            className="h-32 w-32 rounded-lg border border-gray-200 object-cover shadow-sm"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-2">
            <span className="text-3xl md:text-4xl">➕</span>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Add New Student</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Complete all sections to register a new student
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Personal Details */}
            <FormSection title="Personal Details" icon="👤" color="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Student Name"
                  name="name"
                  placeholder="Enter full name"
                  required
                  value={formData.name || ""}
                />
                <FormInput
                  label="Date of Birth"
                  name="dob"
                  type="text"
                  placeholder="DD/MM/YYYY (e.g., 15/08/2005)"
                  required
                  value={formData.dob || ""}
                />
                <FormSelect
                  label="Gender"
                  name="gender"
                  options={["Male", "Female", "Other"]}
                  required
                  value={formData.gender || ""}
                />
                <FormSelect
                  label="Religion"
                  name="religion"
                  options={[
                    "Hindu",
                    "Muslim",
                    "Sikh",
                    "Christian",
                    "Jain",
                    "Buddhist",
                    "Other",
                  ]}
                  required
                  value={formData.religion || ""}
                />
                <FormSelect
                  label="Category"
                  name="category"
                  options={["General", "OBC", "SC", "ST", "Other"]}
                  required
                  value={formData.category || ""}
                />
                <FormInput
                  label="Father Name"
                  name="fatherName"
                  placeholder="Enter father's name"
                  required
                  value={formData.fatherName || ""}
                />
              </div>
              <FormInput
                label="Mother Name"
                name="motherName"
                placeholder="Enter mother's name"
                required
                value={formData.motherName || ""}
              />
            </FormSection>

            {/* Contact Information */}
            <FormSection title="Contact Information" icon="📞" color="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Mobile"
                  name="mobile"
                  type="tel"
                  placeholder="9876543210"
                  required
                  value={formData.mobile || ""}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  required
                  value={formData.email || ""}
                />
              </div>
              <FormTextarea
                label="Residential Address"
                name="residentialAddress"
                placeholder="Enter full address"
                required
                value={formData.residentialAddress || ""}
              />
            </FormSection>

            {/* Address Details */}
            <FormSection title="Address Details" icon="📍" color="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="State"
                  name="state"
                  placeholder="Enter state"
                  required
                  value={formData.state || ""}
                />
                <FormInput
                  label="District"
                  name="district"
                  placeholder="Enter district"
                  required
                  value={formData.district || ""}
                />
                <FormInput
                  label="Country"
                  name="country"
                  placeholder="Enter country"
                  required
                  value={formData.country || ""}
                />
                <FormInput
                  label="Pin Code"
                  name="pinCode"
                  placeholder="Enter pin code"
                  required
                  value={formData.pinCode || ""}
                />
              </div>
            </FormSection>

            {/* Education Details */}
            <FormSection title="Education Details" icon="🎓" color="yellow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Select Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.selectedCourse || ""}
                    onChange={handleCourseChange}
                    required
                    disabled={coursesLoading}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition appearance-none bg-white cursor-pointer ${errors.selectedCourse
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="">
                      {coursesLoading ? "Loading courses..." : "Select a course"}
                    </option>
                    {courseData.map((course: CourseData) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {errors.selectedCourse && (
                    <div className="flex items-start gap-2 mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{errors.selectedCourse}</span>
                    </div>
                  )}
                </div>

                <FormInput
                  label="Course Duration"
                  name="courseDuration"
                  placeholder="Auto-filled"
                  value={courseDuration}
                />

                <FormInput
                  label="Date of Admission"
                  name="dateOfAdmission"
                  type="text"
                  placeholder="DD/MM/YYYY (e.g., 01/03/2024)"
                  required
                  value={formData.dateOfAdmission || ""}
                />
                <FormInput
                  label="Session"
                  name="session"
                  placeholder="e.g., 2024-2025"
                  required
                  value={formData.session || ""}
                />
                <FormInput
                  label="Total Fees"
                  name="totalFees"
                  type="number"
                  placeholder="Auto-filled from course"
                  required
                  value={totalFees || ""}
                />
                <FormSelect
                  label="Exam Mode"
                  name="examMode"
                  options={["Online", "Offline"]}
                  required
                  value={formData.examMode || ""}
                />
              </div>
            </FormSection>

            {/* Document Upload */}
            <FormSection title="Upload Documents" icon="📄" color="red">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FileUpload
                  label="Student Photo"
                  field="studentPhoto"
                  accept="image/*"
                  required
                />
                <FileUpload
                  label="Education Proof"
                  field="educationProof"
                  accept="image/*,.pdf"
                />
                <FileUpload
                  label="Identity Proof"
                  field="identityProof"
                  accept="image/*,.pdf"
                />
              </div>
              <div className="mt-4 text-xs text-gray-700 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">📋 Important Notes:</p>
                <p>✓ Student Photo is required (JPEG, PNG, WebP - Max 5MB)</p>
                <p>✓ Documents can be images or PDF (Max 5MB each)</p>
                <p>✓ All files will be uploaded when you click Submit</p>
              </div>
            </FormSection>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "✓ Submit Student Details"
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition"
              >
                ↻ Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}