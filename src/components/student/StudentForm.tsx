// "use client";

// import { addStudent, courseData } from "@/interfaces/addStudent";
// import { ApiHitter } from "@/lib/axiosApi/apiHitter";
// import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
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
//   Spin,
// } from "antd";
// import type { UploadFile } from "antd/es/upload/interface";
// import dayjs from "dayjs";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

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

// interface StudentFormProps {
//   mode: "add" | "edit";
//   studentId?: string;
//   initialData?: any;
// }

// export default function StudentForm({ mode, studentId, initialData }: StudentFormProps) {
//   const [form] = Form.useForm();
//   const router = useRouter();
//   const isEditMode = mode === "edit";

//   const [fileList, setFileList] = useState<{
//     studentPhoto: UploadFile[];
//     uploadEducationProof: UploadFile[];
//     uploadIdentityProof: UploadFile[];
//   }>({
//     studentPhoto: [],
//     uploadEducationProof: [],
//     uploadIdentityProof: [],
//   });

//   // Store backend URLs
//   const [uploadedUrls, setUploadedUrls] = useState<{
//     studentPhoto: string | null;
//     uploadEducationProof: string | null;
//     uploadIdentityProof: string | null;
//   }>({
//     studentPhoto: null,
//     uploadEducationProof: null,
//     uploadIdentityProof: null,
//   });

//   // Previews for local display
//   const [previews, setPreviews] = useState({
//     studentPhoto: null as string | null,
//     uploadEducationProof: null as string | null,
//     uploadIdentityProof: null as string | null,
//   });
//   const [courseIdId, setcourseIdId] = useState<string>("");
//   const [selectedReligion, setSelectedReligion] = useState<string>("");

//   // Fetch student data for edit mode
//   const { data: studentData, isLoading: studentLoading } = useQuery({
//     queryKey: ['student', studentId],
//     queryFn: async () => {
//       if (!studentId) return null;
//       const response = await ApiHitter("GET", "GET_STUDENT_LIST", {}, studentId, {
//         showError: true,
//         showSuccess: false
//       });
//       return response?.data || null;
//     },
//     enabled: isEditMode && !!studentId,
//   });

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

//   // Prefill form when editing
//   useEffect(() => {
//     if (isEditMode && (studentData || initialData)) {
//       const data = studentData || initialData;
//       form.setFieldsValue({
//         ...data,
//         dob: data.dob ? dayjs(data.dob) : null,
//         dateOfAdmission: data.dateOfAdmission ? dayjs(data.dateOfAdmission) : null,
//       });
//       setcourseIdId(data.courseId || "");
//       setSelectedReligion(data.religion || "");

//       // Set existing images in fileList for proper display in Upload component
//       if (data.studentPhoto) {
//         setFileList(prev => ({
//           ...prev,
//           studentPhoto: [{
//             uid: '-1',
//             name: 'student-photo',
//             status: 'done',
//             url: data.studentPhoto,
//           }]
//         }));
//         setUploadedUrls(prev => ({ ...prev, studentPhoto: data.studentPhoto }));
//       }

//       if (data.uploadEducationProof) {
//         setFileList(prev => ({
//           ...prev,
//           uploadEducationProof: [{
//             uid: '-2',
//             name: 'education-proof',
//             status: 'done',
//             url: data.uploadEducationProof,
//           }]
//         }));
//         setUploadedUrls(prev => ({ ...prev, uploadEducationProof: data.uploadEducationProof }));
//       }

//       if (data.uploadIdentityProof) {
//         setFileList(prev => ({
//           ...prev,
//           uploadIdentityProof: [{
//             uid: '-3',
//             name: 'identity-proof',
//             status: 'done',
//             url: data.uploadIdentityProof,
//           }]
//         }));
//         setUploadedUrls(prev => ({ ...prev, uploadIdentityProof: data.uploadIdentityProof }));
//       }
//     }
//   }, [studentData, initialData, isEditMode, form]);

//   const handleCourseChange = (courseId: string) => {
//     setcourseIdId(courseId);

//     // Find the selected course
//     const courseId = courseData?.find((course: courseData) => course._id === courseId);

//     if (courseId) {
//       // Set the duration in the form
//       form.setFieldsValue({
//         courseDuration: `${courseId.durationInMonths} months`
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

//   // Real upload request
//   const uploadFileRequest = async (options: any, field: keyof typeof uploadedUrls) => {
//     const { file, onSuccess, onError } = options;

//     const formData = new FormData();
//     formData.append('files', file);

//     try {
//       const response = await ApiHitter("POST", "UPLOAD", formData, "", {
//         showSuccess: false,
//         showError: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response && response.length > 0) {
//         const uploadedUrl = response[0].path; // Backend returns array of files
//         setUploadedUrls(prev => ({ ...prev, [field]: uploadedUrl }));
//         message.success(`${field} uploaded successfully`);
//         onSuccess("ok");
//       } else {
//         throw new Error("Upload failed - No URL returned");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       onError({ err });
//       message.error(`${field} upload failed`);
//     }
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

//   // Add student mutation
//   const { mutate: addStudentMutation, isPending: isAddPending } = useMutation({
//     mutationFn: (body: addStudent) =>
//       ApiHitter("POST", "ADD_STUDENT", body, "", {
//         showSuccess: true,
//         successMessage: "Student added successfully",
//         showError: true,
//       }),

//     onSuccess: (res) => {
//       message.success(res?.message || "Student added successfully!");
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
//       setUploadedUrls({
//         studentPhoto: null,
//         uploadEducationProof: null,
//         uploadIdentityProof: null,
//       });
//       router.push("/student");
//     },
//     onError: (error: any) => {
//       console.error("Error adding student:", error);
//       message.error(error?.response?.data?.message || "Failed to add student");
//     },
//   });

//   // Edit student mutation
//   const { mutate: editStudentMutation, isPending: isEditPending } = useMutation({
//     mutationFn: (body: addStudent) =>
//       ApiHitter("POST", "EDIT_STUDENT", body, studentId || "", {
//         showSuccess: true,
//         successMessage: "Student updated successfully",
//         showError: true,
//       }),

//     onSuccess: () => {
//       message.success("Student updated successfully!");
//       router.push("/student");
//     },
//     onError: (error) => {
//       console.error("Error updating student:", error);
//       message.error("Failed to update student");
//     },
//   });

//   const isPending = isAddPending || isEditPending;

//   const handleSubmit = async (values: any) => {
//     try {
//       // Validate required files only for add mode
//       if (!isEditMode && !fileList.studentPhoto.length && !previews.studentPhoto) {
//         message.error("Please upload student photo!");
//         return;
//       }

//       // Convert dates
//       values.dob = dayjs(values.dob).toISOString();
//       values.dateOfAdmission = dayjs(values.dateOfAdmission).toISOString();

//       // Use uploaded URLs or existing ones, fallback only if absolutely necessary (or handle validation)
//       values.studentPhoto = uploadedUrls.studentPhoto || null;
//       values.uploadEducationProof = uploadedUrls.uploadEducationProof || null;
//       values.uploadIdentityProof = uploadedUrls.uploadIdentityProof || null;

//       // Prepare student data
//       const studentData: any = { ...values };

//       // Call appropriate mutation
//       if (isEditMode) {
//         editStudentMutation(studentData);
//       } else {
//         addStudentMutation(studentData);
//       }

//     } catch (err) {
//       console.error("Submission error:", err);
//       message.error(" Failed to submit student");
//     }
//   };

//   if (isEditMode && studentLoading) {
//     return (
//       <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8 flex items-center justify-center">
//         <Spin size="large" tip="Loading student data..." />
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
//       {/* Header Section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <Link href="/student">
//             <Button
//               type="text"
//               icon={<ArrowLeftOutlined />}
//               className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//               {isEditMode ? "✏️ Edit Student" : "➕ Add New Student"}
//             </h1>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               {isEditMode ? "Update student details" : "Fill in the details to register a new student"}
//             </p>
//           </div>
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
//                 <Select
//                   placeholder="Select religion"
//                   onChange={(value) => {
//                     setSelectedReligion(value);
//                     // Clear category if religion is not Hindu
//                     if (value !== "Hindu") {
//                       form.setFieldValue("category", undefined);
//                     }
//                   }}
//                 >
//                   {religionOptions.map((r) => (
//                     <Option key={r}>{r}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             {selectedReligion === "Hindu" && (
//               <Col xs={24} md={12}>
//                 <Form.Item
//                   label="Category"
//                   name="category"
//                   rules={[{ required: true, message: "Please select category" }]}
//                 >
//                   <Select placeholder="Select category">
//                     {categoryOptions.map((c) => (
//                       <Option key={c}>{c}</Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//             )}

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
//                 <Input
//                   placeholder="e.g. 9876543210"
//                   disabled={isEditMode}
//                 />
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
//                 <Input
//                   placeholder="example@gmail.com"
//                   disabled={isEditMode}
//                 />
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
//                 name="courseId"
//                 rules={[{ required: true, message: "Course required" }]}
//               >
//                 <Select
//                   placeholder="Select a course"
//                   loading={coursesLoading}
//                   onChange={handleCourseChange}
//                   disabled={isEditMode}
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
//                 <DatePicker
//                   className="w-full"
//                   format="YYYY-MM-DD"
//                   disabled={isEditMode}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Session"
//                 name="session"
//                 rules={[{ required: true, message: "Session required" }]}
//               >
//                 <Input disabled={isEditMode} />
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
//             <Col xs={24} sm={12} md={8}>
//               <Form.Item
//                 label={isEditMode ? "Student Photo (Optional)" : "Student Photo *"}
//                 required={!isEditMode}
//               >
//                 <Upload
//                   listType="picture-card"
//                   fileList={fileList.studentPhoto}
//                   maxCount={1}
//                   beforeUpload={(file) => beforeUpload(file, 'studentPhoto')}
//                   customRequest={(options) => uploadFileRequest(options, 'studentPhoto')}
//                   onChange={(info) => handleFileChange(info, 'studentPhoto')}
//                   onRemove={() => {
//                     setFileList(prev => ({ ...prev, studentPhoto: [] }));
//                     setPreviews(prev => ({ ...prev, studentPhoto: null }));
//                     setUploadedUrls(prev => ({ ...prev, studentPhoto: null }));
//                   }}
//                   accept="image/*"
//                   className="w-full"
//                 >
//                   {fileList.studentPhoto.length === 0 && (
//                     <div className="flex flex-col items-center justify-center">
//                       <UploadOutlined style={{ fontSize: '24px' }} />
//                       <div className="mt-2">{isEditMode ? "Update Photo" : "Upload Photo"}</div>
//                       <div className="text-xs text-gray-500">JPG, PNG, WebP</div>
//                     </div>
//                   )}
//                 </Upload>
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
//                   customRequest={(options) => uploadFileRequest(options, 'uploadEducationProof')}
//                   onChange={(info) => handleFileChange(info, 'uploadEducationProof')}
//                   onRemove={() => {
//                     setFileList(prev => ({ ...prev, uploadEducationProof: [] }));
//                     setPreviews(prev => ({ ...prev, uploadEducationProof: null }));
//                     setUploadedUrls(prev => ({ ...prev, uploadEducationProof: null }));
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
//                   customRequest={(options) => uploadFileRequest(options, 'uploadIdentityProof')}
//                   onChange={(info) => handleFileChange(info, 'uploadIdentityProof')}
//                   onRemove={() => {
//                     setFileList(prev => ({ ...prev, uploadIdentityProof: [] }));
//                     setPreviews(prev => ({ ...prev, uploadIdentityProof: null }));
//                     setUploadedUrls(prev => ({ ...prev, uploadIdentityProof: null }));
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
//               </Form.Item>
//             </Col>
//           </Row>

//           <div className="mb-4 text-sm text-gray-600">
//             <p>* {isEditMode ? "Photo is optional when editing" : "Required: Student Photo (Max 5MB, JPG/PNG/WebP)"}</p>
//             <p>* Documents: Max 5MB each, JPG/PNG/PDF format</p>
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
//             <Link href="/student">
//               <Button
//                 size="large"
//                 className="rounded-lg px-8 h-12"
//               >
//                 Cancel
//               </Button>
//             </Link>
//             <Button
//               type="primary"
//               htmlType="submit"
//               size="large"
//               loading={isPending}
//               className="rounded-lg bg-blue-600 hover:bg-blue-700 px-8 h-12 text-base font-semibold"
//             >
//               {isPending
//                 ? (isEditMode ? "Updating..." : "Submitting...")
//                 : (isEditMode ? "Update Student" : "Submit Student Details")
//               }
//             </Button>
//           </div>
//         </Form>
//       </Card>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface StudentFormProps {
  mode: 'add' | 'edit';
  studentId?: string;
  initialData?: any;
}

interface CourseData {
  _id: string;
  name: string;
  durationInMonths: number;
}

interface FormData {
  name: string;
  dob: Date | null;
  gender: string;
  religion: string;
  category?: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  email: string;
  residentialAddress: string;
  state: string;
  district: string;
  country: string;
  pinCode: string;
  courseId: string;
  courseDuration?: string;
  dateOfAdmission: Date | null;
  session: string;
  totalFees: number;
  examMode: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

export default function StudentForm({ mode, studentId, initialData }: StudentFormProps) {
  const router = useRouter();
  const isEditMode = mode === 'edit';

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      dob: null,
      dateOfAdmission: null,
    },
  });

  // Store selected files (not uploaded yet)
  const [selectedFiles, setSelectedFiles] = useState<{
    studentPhoto: File | null;
    uploadEducationProof: File | null;
    uploadIdentityProof: File | null;
  }>({
    studentPhoto: null,
    uploadEducationProof: null,
    uploadIdentityProof: null,
  });

  // Store existing URLs from edit mode
  const [existingUrls, setExistingUrls] = useState<{
    studentPhoto: string | null;
    uploadEducationProof: string | null;
    uploadIdentityProof: string | null;
  }>({
    studentPhoto: null,
    uploadEducationProof: null,
    uploadIdentityProof: null,
  });

  const [previews, setPreviews] = useState<{
    studentPhoto: string | null;
    uploadEducationProof: string | null;
    uploadIdentityProof: string | null;
  }>({
    studentPhoto: null,
    uploadEducationProof: null,
    uploadIdentityProof: null,
  });

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const selectedReligion = watch('religion');
  const courseId = watch('courseId');

  // Fetch student data for edit mode
  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const response = await ApiHitter('GET', 'GET_STUDENT_LIST', {}, studentId, {
        showError: true,
        showSuccess: false,
      });
      return response?.data || null;
    },
    enabled: isEditMode && !!studentId,
  });

  // Get courses
  const { data: courseData, isLoading: coursesLoading } = useQuery<CourseData[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await ApiHitter('GET', 'GET_COURSE_LIST', {}, '', {
        showError: true,
        showSuccess: false,
      });
      return response?.data || [];
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (isEditMode && (studentData || initialData)) {
      const data = studentData || initialData;
      reset({
        ...data,
        dob: data.dob ? new Date(data.dob) : null,
        dateOfAdmission: data.dateOfAdmission ? new Date(data.dateOfAdmission) : null,
      });

      if (data.studentPhoto) {
        setPreviews((prev) => ({ ...prev, studentPhoto: data.studentPhoto }));
        setExistingUrls((prev) => ({ ...prev, studentPhoto: data.studentPhoto }));
      }
      if (data.uploadEducationProof) {
        setPreviews((prev) => ({ ...prev, uploadEducationProof: data.uploadEducationProof }));
        setExistingUrls((prev) => ({ ...prev, uploadEducationProof: data.uploadEducationProof }));
      }
      if (data.uploadIdentityProof) {
        setPreviews((prev) => ({ ...prev, uploadIdentityProof: data.uploadIdentityProof }));
        setExistingUrls((prev) => ({ ...prev, uploadIdentityProof: data.uploadIdentityProof }));
      }
    }
  }, [studentData, initialData, isEditMode, reset]);

  // Update course duration when course changes
  useEffect(() => {
    if (courseId && courseData) {
      const course = courseData.find((c: CourseData) => c._id === courseId);
      if (course) {
        setValue('courseDuration', `${course.durationInMonths} months`);
      }
    }
  }, [courseId, courseData, setValue]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 5000);
  };

  // Handle file selection (no upload yet)
  const handleFileSelect = (
    file: File,
    field: 'studentPhoto' | 'uploadEducationProof' | 'uploadIdentityProof'
  ) => {
    // Validate file type
    if (field === 'studentPhoto' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showNotification('error', 'Please upload only image files (JPEG, JPG, PNG, WebP) for student photo!');
      return;
    }

    if (field !== 'studentPhoto' && !ALLOWED_DOC_TYPES.includes(file.type)) {
      showNotification('error', 'Document must be an image or PDF!');
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 5MB!');
      return;
    }

    // Store the file
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({
        ...prev,
        [field]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (field: 'studentPhoto' | 'uploadEducationProof' | 'uploadIdentityProof') => {
    setSelectedFiles((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
    setExistingUrls((prev) => ({ ...prev, [field]: null }));
  };

  // Upload single file
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await ApiHitter('POST', 'UPLOAD', formData, '', {
        showSuccess: false,
        showError: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response[0].fileName || null;
      return null;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  // Add student mutation
  const { mutate: addStudentMutation } = useMutation({
    mutationFn: (body: any) =>
      ApiHitter('POST', 'ADD_STUDENT', body, '', {
        showSuccess: true,
        successMessage: 'Student added successfully',
        showError: true,
      }),
    onSuccess: () => {
      showNotification('success', 'Student added successfully!');
      setTimeout(() => {
        router.push('/student');
      }, 1500);
    },
    onError: (error: any) => {
      showNotification('error', error?.response?.data?.message || 'Failed to add student');
    },
  });

  // Edit student mutation
  const { mutate: editStudentMutation } = useMutation({
    mutationFn: (body: any) =>
      ApiHitter('POST', 'EDIT_STUDENT', body, studentId || '', {
        showSuccess: true,
        successMessage: 'Student updated successfully',
        showError: true,
      }),
    onSuccess: () => {
      showNotification('success', 'Student updated successfully!');
      setTimeout(() => {
        router.push('/student');
      }, 1500);
    },
    onError: () => {
      showNotification('error', 'Failed to update student');
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Validate required files only for add mode
      if (!isEditMode && !selectedFiles.studentPhoto && !existingUrls.studentPhoto) {
        showNotification('error', 'Please select student photo!');
        return;
      }

      // Validate dates
      if (!data.dob) {
        showNotification('error', 'Please select date of birth!');
        return;
      }

      if (!data.dateOfAdmission) {
        showNotification('error', 'Please select date of admission!');
        return;
      }

      showNotification('success', 'Uploading files and submitting...');

      // Upload all selected files
      let studentPhotoUrl = existingUrls.studentPhoto;
      let educationProofUrl = existingUrls.uploadEducationProof;
      let identityProofUrl = existingUrls.uploadIdentityProof;

      if (selectedFiles.studentPhoto) {
        studentPhotoUrl = await uploadFile(selectedFiles.studentPhoto);
        console.log("studentPhotoUrl", studentPhotoUrl);
      }

      if (selectedFiles.uploadEducationProof) {
        educationProofUrl = await uploadFile(selectedFiles.uploadEducationProof);
        console.log("educationProofUrl", educationProofUrl);
      }

      if (selectedFiles.uploadIdentityProof) {
        identityProofUrl = await uploadFile(selectedFiles.uploadIdentityProof);
        console.log("identityProofUrl", identityProofUrl);
      }

      // Prepare submission data
      const submissionData = {
        ...data,
        dob: data.dob.toISOString(),
        dateOfAdmission: data.dateOfAdmission.toISOString(),
        studentPhoto: studentPhotoUrl,
        uploadEducationProof: educationProofUrl,
        uploadIdentityProof: identityProofUrl,
      };

      console.log("submissionData", submissionData);

      if (isEditMode) {
        editStudentMutation(submissionData);
      } else {
        addStudentMutation(submissionData);
      }
    } catch (error) {
      console.error('Submission error:', error);
      showNotification('error', 'Failed to upload files or submit form');
    }
  };

  if (isEditMode && studentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Custom DatePicker Styles */}
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
          display: block;
        }
        
        .react-datepicker-popper {
          z-index: 9999 !important;
        }
        
        .react-datepicker {
          font-family: inherit;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          font-size: 0.875rem;
        }
        
        .react-datepicker__header {
          background: linear-gradient(to right, #2563eb, #4f46e5);
          border-bottom: none;
          border-radius: 0.875rem 0.875rem 0 0;
          padding-top: 0.75rem;
        }
        
        .react-datepicker__current-month {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .react-datepicker__day-name {
          color: white;
          font-weight: 600;
          width: 2rem;
          line-height: 2rem;
          margin: 0.2rem;
        }
        
        .react-datepicker__day {
          color: #374151;
          border-radius: 0.5rem;
          width: 2rem;
          line-height: 2rem;
          margin: 0.2rem;
          transition: all 0.2s;
        }
        
        .react-datepicker__day:hover {
          background-color: #dbeafe;
          transform: scale(1.05);
        }
        
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: linear-gradient(to right, #2563eb, #4f46e5) !important;
          color: white !important;
          font-weight: bold;
        }
        
        .react-datepicker__day--today {
          font-weight: bold;
          color: #2563eb;
          border: 2px solid #2563eb;
        }
        
        .react-datepicker__navigation {
          top: 0.75rem;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: white;
          border-width: 2px 2px 0 0;
          height: 7px;
          width: 7px;
        }
        
        .react-datepicker__month {
          margin: 0.8rem;
        }
        
        .react-datepicker__day--disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }

        .react-datepicker__month-select,
        .react-datepicker__year-select {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.25rem 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .react-datepicker__header__dropdown {
          padding: 0.5rem 0;
        }
        
        .custom-datepicker-input {
          width: 100%;
          padding: 0.75rem 1rem;
          padding-right: 3rem;
          background-color: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s;
          cursor: pointer;
          display: block;
        }
        
        .custom-datepicker-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .custom-datepicker-input.error {
          border-color: #ef4444;
        }
        
        .datepicker-wrapper {
          position: relative;
          width: 100%;
        }
        
        .datepicker-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #6b7280;
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .react-datepicker {
            font-size: 0.75rem;
          }
          
          .react-datepicker__day-name,
          .react-datepicker__day {
            width: 1.75rem;
            line-height: 1.75rem;
            margin: 0.15rem;
          }

          .react-datepicker__current-month {
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in max-w-sm">
          <div
            className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl border-2 flex items-center space-x-3 ${notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
              }`}
          >
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium text-sm sm:text-base">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
            <Link href="/student">
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                {isEditMode ? '✏️ Edit Student' : '➕ Add New Student'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {isEditMode ? 'Update student details' : 'Fill in the details to register a new student'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">👤</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Details</h2>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Student Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Student name is required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter student full name"
                  />
                  {errors.name && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="datepicker-wrapper">
                    <Controller
                      control={control}
                      name="dob"
                      rules={{ required: 'Please select date of birth' }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          maxDate={new Date()}
                          placeholderText="Select date of birth"
                          className={`custom-datepicker-input ${errors.dob ? 'error' : ''}`}
                          wrapperClassName="w-full"
                          popperPlacement="bottom-start"
                        />
                      )}
                    />
                    <div className="datepicker-icon">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.dob && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.dob.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('gender', { required: 'Please select gender' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.gender ? 'border-red-500' : 'border-gray-200'
                      }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Religion */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('religion', { required: 'Please select religion' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.religion ? 'border-red-500' : 'border-gray-200'
                      }`}
                  >
                    <option value="">Select religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Christian">Christian</option>
                    <option value="Jain">Jain</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.religion && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.religion.message}
                    </p>
                  )}
                </div>

                {/* Category - Only shown for Hindu */}
                {selectedReligion === 'Hindu' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category', {
                        required: selectedReligion === 'Hindu' ? 'Please select category' : false,
                      })}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.category ? 'border-red-500' : 'border-gray-200'
                        }`}
                    >
                      <option value="">Select category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Father Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Father Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fatherName', { required: "Father's name required" })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${errors.fatherName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter Father's Name"
                  />
                  {errors.fatherName && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.fatherName.message}
                    </p>
                  )}
                </div>

                {/* Mother Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mother Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('motherName', { required: "Mother's name required" })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${errors.motherName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter Mother's Name"
                  />
                  {errors.motherName && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.motherName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">📞</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Information</h2>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('mobile', { required: 'Mobile number required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base ${errors.mobile ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="e.g. 9876543210"
                    disabled={isEditMode}
                  />
                  {errors.mobile && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email',
                      },
                    })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base ${errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="example@gmail.com"
                    disabled={isEditMode}
                  />
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Residential Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Residential Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('residentialAddress', { required: 'Address required' })}
                    rows={3}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-sm sm:text-base ${errors.residentialAddress ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Full address"
                  />
                  {errors.residentialAddress && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.residentialAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">📍</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Address Details</h2>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'State required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base ${errors.state ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('district', { required: 'District required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base ${errors.district ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter district"
                  />
                  {errors.district && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.district.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base ${errors.country ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter country"
                  />
                  {errors.country && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Pin Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('pinCode', { required: 'Pin code required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base ${errors.pinCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter pin code"
                  />
                  {errors.pinCode && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.pinCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Education Details */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🎓</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Education Details</h2>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Select Course */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('courseId', { required: 'Course required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.courseId ? 'border-red-500' : 'border-gray-200'
                      }`}
                    disabled={isEditMode || coursesLoading}
                  >
                    <option value="">Select a course</option>
                    {courseData?.map((course: CourseData) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.courseId.message}
                    </p>
                  )}
                </div>

                {/* Course Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Course Duration</label>
                  <input
                    type="text"
                    {...register('courseDuration')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 text-sm sm:text-base"
                    readOnly
                    placeholder="Auto-filled"
                  />
                </div>

                {/* Date of Admission */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date of Admission <span className="text-red-500">*</span>
                  </label>
                  <div className="datepicker-wrapper">
                    <Controller
                      control={control}
                      name="dateOfAdmission"
                      rules={{ required: 'Select admission date' }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          placeholderText="Select admission date"
                          className={`custom-datepicker-input ${errors.dateOfAdmission ? 'error' : ''}`}
                          wrapperClassName="w-full"
                          disabled={isEditMode}
                          popperPlacement="bottom-start"
                        />
                      )}
                    />
                    <div className="datepicker-icon">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.dateOfAdmission && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.dateOfAdmission.message}
                    </p>
                  )}
                </div>

                {/* Session */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Session <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('session', { required: 'Session required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm sm:text-base ${errors.session ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="e.g., 2024-2025"
                    disabled={isEditMode}
                  />
                  {errors.session && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.session.message}
                    </p>
                  )}
                </div>

                {/* Total Fees */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Total Fees <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('totalFees', {
                      required: 'Fees required',
                      valueAsNumber: true,
                    })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm sm:text-base ${errors.totalFees ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="Enter total fees"
                  />
                  {errors.totalFees && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.totalFees.message}
                    </p>
                  )}
                </div>

                {/* Exam Mode */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Exam Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('examMode', { required: 'Select exam mode' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.examMode ? 'border-red-500' : 'border-gray-200'
                      }`}
                  >
                    <option value="">Choose mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                  {errors.examMode && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.examMode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Documents */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-red-600 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">📄</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Upload Documents</h2>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Student Photo */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Student Photo {!isEditMode && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    {previews.studentPhoto ? (
                      <div className="relative group">
                        <img
                          src={isEditMode ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}uploads/${studentData?.studentPhoto}` : previews.studentPhoto}
                          alt="Student"
                          className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('studentPhoto')}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-rose-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Upload Photo</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file, 'studentPhoto');
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Education Proof */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Education Proof</label>
                  <div className="relative">
                    {previews.uploadEducationProof ? (
                      <div className="relative group">
                        <img
                          // src={previews.uploadEducationProof}
                          src={isEditMode ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}uploads/${studentData?.uploadEducationProof}` : previews.uploadEducationProof}
                          alt="Education Proof"
                          className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('uploadEducationProof')}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-rose-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Upload Document</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file, 'uploadEducationProof');
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Identity Proof */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Identity Proof</label>
                  <div className="relative">
                    {previews.uploadIdentityProof ? (
                      <div className="relative group">
                        <img
                          // src={previews.uploadIdentityProof}
                          src={isEditMode ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}uploads/${studentData?.uploadIdentityProof}` : previews.uploadIdentityProof}
                          alt="Identity Proof"
                          className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('uploadIdentityProof')}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-rose-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Upload ID</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file, 'uploadIdentityProof');
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>Note:</strong> {isEditMode ? 'Photo is optional when editing.' : 'Student Photo is required.'}
                  {' '}All documents must be less than 5MB. Files will be uploaded when you click Submit.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
            <Link href="/student" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? 'Updating...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className='text-white'>{isEditMode ? 'Update Student' : 'Submit Student Details'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}