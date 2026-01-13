"use client";

import { Student } from "@/interfaces/addStudent";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    MoreOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";

const { Option } = Select;


export default function StudentList() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  // Fetch students from API (falls back to static data)
const { data: studentsResponse, isLoading } = useQuery({
  queryKey: ["students", page, pageSize],
  queryFn: async () => {
    const response = await ApiHitter(
      "GET",
      "GET_STUDENT_LIST",
      {},
      `?page=${page}&limit=${pageSize}`,
      {
        showError: false,
        showSuccess: false,
      }
    );
    return response;
  },
  // keepPreviousData: true,
}); 

const studentsData = studentsResponse?.data || [];
const totalStudents = studentsResponse?.total || 0;


  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    let result = Array.isArray(studentsData) ? studentsData : [];

    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(
        (student: Student) =>
          student.name.toLowerCase().includes(search) ||
          student.email.toLowerCase().includes(search) ||
          student.mobile.includes(search) ||
          student.enrollmentNo?.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      result = result.filter(
        (student: Student) => student.status === statusFilter
      );
    }

    if (courseFilter) {
      result = result.filter(
        (student: Student) => student.courseName === courseFilter
      );
    }

    return result;
  }, [studentsData, searchText, statusFilter, courseFilter]);

  // Get unique courses for filter
  const uniqueCourses = useMemo((): string[] => {
    if (!Array.isArray(studentsData)) return [];
    
    const courses = new Set(
      studentsData.map((s: Student) => s.courseName).filter(Boolean) as string[]
    );
    return Array.from(courses);
  }, [studentsData]);

  // Action menu items
  const getActionItems = (record: Student) => [
    {
      key: "view",
      label: (
        <Link href={`/student/${record._id}`} className="flex items-center gap-2">
          <EyeOutlined /> View Details
        </Link>
      ),
    },
    {
      key: "edit",
      label: (
        <Link href={`/student/edit/${record._id}`} className="flex items-center gap-2">
          <EditOutlined /> Edit Student
        </Link>
      ),
    },
    {
      key: "download",
      label: (
        <span className="flex items-center gap-2">
          <DownloadOutlined /> Download ID Card
        </span>
      ),
    },
    {
      type: "divider" as const,
    },
    {
      key: "delete",
      label: (
        <span className="flex items-center gap-2 text-red-500">
          <DeleteOutlined /> Delete Student
        </span>
      ),
      danger: true,
    },
  ];

  // Table columns
  const columns: ColumnsType<Student> = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={44}
            src={record.studentPhoto}
            icon={<UserOutlined />}
            className="border-2 border-gray-100"
          />
          <div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {record.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {record.enrollmentNo}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 220,
      render: (_, record) => (
        <div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {record.email}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            📞 {record.mobile}
          </div>
        </div>
      ),
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      width: 180,
      render: (courseName, record) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white">
            {courseName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {record.courseDuration}
          </div>
        </div>
      ),
    },
    {
      title: "Admission Date",
      dataIndex: "dateOfAdmission",
      key: "dateOfAdmission",
      width: 140,
      render: (date) => (
        <span className="text-gray-600 dark:text-gray-300">
          {dayjs(date).format("DD MMM YYYY")}
        </span>
      ),
      sorter: (a, b) =>
        dayjs(a.dateOfAdmission).unix() - dayjs(b.dateOfAdmission).unix(),
    },
    {
      title: "Fees",
      dataIndex: "totalFees",
      key: "totalFees",
      width: 120,
      render: (fees) => (
        <span className="font-medium text-gray-800 dark:text-white">
          ₹{fees?.toLocaleString("en-IN")}
        </span>
      ),
      sorter: (a, b) => a.totalFees - b.totalFees,
    },
    {
      title: "Exam Mode",
      dataIndex: "examMode",
      key: "examMode",
      width: 110,
      render: (mode) => (
        <Tag color={mode === "Online" ? "blue" : "purple"}>{mode}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => {
        const colorMap: Record<string, string> = {
          Active: "success",
          Inactive: "error",
          Pending: "warning",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Link href={`/student/${record._id}`}>
              <Button
                type="text"
                icon={<EyeOutlined />}
                className="text-blue-500 hover:text-blue-600"
              />
            </Link>
          </Tooltip>
          <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            👨‍🎓 All Students
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and view all registered students
          </p>
        </div>
        <Link href="/student/add">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Add New Student
          </Button>
        </Link>
      </div>

      {/* Filters Card */}
      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, mobile or enrollment no..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-lg"
              size="large"
              allowClear
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 160 }}
              onChange={(value) => setStatusFilter(value)}
              size="large"
              className="rounded-lg"
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Pending">Pending</Option>
            </Select>
            <Select
              placeholder="Filter by Course"
              allowClear
              style={{ width: 180 }}
              onChange={(value) => setCourseFilter(value)}
              size="large"
              className="rounded-lg"
            >
              {uniqueCourses.map((course) => (
                <Option key={course} value={course}>
                  {course}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4 mt-4">
        <Card className="rounded-xl border-l-4 border-l-blue-500 bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {studentsData?.length || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <UserOutlined className="text-xl text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border-l-4 border-l-green-500 bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Students
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {Array.isArray(studentsData) ? studentsData.filter((s: Student) => s.status === "Active").length : 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-xl">✓</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border-l-4 border-l-yellow-500 bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Approvals
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {Array.isArray(studentsData) ? studentsData.filter((s: Student) => s.status === "Pending").length : 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-xl">⏳</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border-l-4 border-l-purple-500 bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {uniqueCourses.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-xl">📚</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Table Card - with internal scroll */}
      <Card className="flex-1 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="overflow-auto min-h-[calc(100vh-480px)]">
          <Table
            columns={columns}
            dataSource={filteredStudents}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: page,
              pageSize,
              total: totalStudents,
              showSizeChanger: true,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} students`,
            }}
            className="student-table"
          />

        </div>
      </Card>
    </div>
  );
}
