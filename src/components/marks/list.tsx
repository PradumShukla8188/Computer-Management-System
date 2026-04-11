'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';

type Student = {
    _id: string;
    name: string;
};

type Course = {
    _id: string;
    name: string;
};

type Subject = {
    _id: string;
    title: string;
};

type StudentMark = {
    _id: string;
    studentId: Student;
    courseId: Course;
    subjectId: Subject;
    examName: string;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    isPublished: boolean;
    createdAt: string;
};

export default function StudentMarksListPage() {
    const queryClient = useQueryClient();
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingMark, setEditingMark] = useState<StudentMark | null>(null);
    const [editFormData, setEditFormData] = useState({
        totalMarks: 0,
        obtainedMarks: 0,
        isPublished: true,
    });

    // Fetch all marks
    const { data: marksData = [], isLoading } = useQuery({
        queryKey: ['studentMarks'],
        queryFn: async () => {
            const res = await ApiHitter('GET', 'GET_ALL_STUDENT_MARKS', {}, '', {
                showError: true,
                showSuccess: false,
            });
            return res?.data || [];
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await ApiHitter('DELETE', 'DELETE_STUDENT_MARKS', {}, id, {
                showError: true,
                showSuccess: true,
            });
            return res?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentMarks'] });
            setDeleteModalOpen(false);
            setDeleteId(null);
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (data: { id: string; payload: any }) => {
            const res = await ApiHitter(
                'PATCH',
                'UPDATE_STUDENT_MARKS',
                data.payload,
                data.id,
                {
                    showError: true,
                    showSuccess: true,
                }
            );
            return res?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentMarks'] });
            setEditModalOpen(false);
            setEditingMark(null);
        },
    });

    // Filter marks
    const filteredMarks = marksData.filter((mark: StudentMark) => {
        if (selectedStudent && mark.studentId?._id !== selectedStudent) return false;
        if (selectedCourse && mark.courseId?._id !== selectedCourse) return false;
        if (selectedExam && mark.examName !== selectedExam) return false;
        return true;
    });

    const uniqueStudents = Array.from(
        new Set(marksData.map((m: StudentMark) => m.studentId._id))
    ).map((id) => {
        const mark = marksData.find((m: StudentMark) => m.studentId._id === id);
        return { id, name: mark?.studentId?.name || '' };
    });

    const uniqueCourses = Array.from(
        new Set(marksData.map((m: StudentMark) => m?.courseId?._id))
    ).map((id) => {
        const mark = marksData.find((m: StudentMark) => m?.courseId?._id === id);
        return { id, name: mark?.courseId?.name || '' };
    });


    const uniqueExams = Array.from(
        new Set(marksData.map((m: StudentMark) => m.examName))
    );

    // Calculate statistics
    const calculateStats = (studentId: string) => {
        const studentMarks = marksData.filter(
            (m: StudentMark) => m.studentId?._id === studentId
        );
        const totalObtained = studentMarks.reduce(
            (sum: number, m: StudentMark) => sum + m.obtainedMarks,
            0
        );
        const totalMax = studentMarks.reduce(
            (sum: number, m: StudentMark) => sum + m.totalMarks,
            0
        );
        const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        return { totalObtained, totalMax, percentage, count: studentMarks.length };
    };

    const getGradeColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-100';
        if (percentage >= 75) return 'text-blue-600 bg-blue-100';
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
        if (percentage >= 40) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    const handleEdit = (mark: StudentMark) => {
        setEditingMark(mark);
        setEditFormData({
            totalMarks: mark.totalMarks,
            obtainedMarks: mark.obtainedMarks,
            isPublished: mark.isPublished,
        });
        setEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        // console.log("delte id", id);
        setDeleteId(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId);
        }
    };

    const handleUpdate = () => {
        if (editingMark) {
            updateMutation.mutate({
                id: editingMark._id,
                payload: editFormData,
            });
        }
    };

    const clearFilters = () => {
        setSelectedStudent('');
        setSelectedCourse('');
        setSelectedExam('');
    };

    // Group marks by student
    const groupedMarks = filteredMarks.reduce((acc: any, mark: StudentMark) => {
        if (!acc[mark.studentId?._id]) {
            acc[mark.studentId?._id] = {
                studentName: mark.studentId?.name,
                studentId: mark.studentId?._id,
                marks: [],
            };
        }
        acc[mark.studentId?._id].marks.push(mark);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Student Marks Records
                            </h1>
                            <p className="text-gray-600">
                                View, manage, and analyze student examination results
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border-2 border-blue-100">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {filteredMarks.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <svg
                                className="w-5 h-5 mr-2 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            Filters
                        </h2>
                        {(selectedStudent || selectedCourse || selectedExam) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                <span>Clear Filters</span>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Student Filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Student
                            </label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="">All Students</option>
                                {uniqueStudents.map((student: any) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Course Filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Course
                            </label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="">All Courses</option>
                                {uniqueCourses.map((course: any) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Exam Filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Exam
                            </label>
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="">All Exams</option>
                                {uniqueExams.map((exam: any) => (
                                    <option key={exam} value={exam}>
                                        {exam}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                className="animate-spin h-12 w-12 text-blue-600 mb-4"
                                xmlns="http://www.w3.org/2000/svg"
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
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="text-gray-600 font-medium">Loading marks data...</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredMarks.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Marks Found
                            </h3>
                            <p className="text-gray-600">
                                {selectedStudent || selectedCourse || selectedExam
                                    ? 'Try adjusting your filters'
                                    : 'No student marks have been added yet'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Marks List - Grouped by Student */}
                {!isLoading && filteredMarks.length > 0 && (
                    <div className="space-y-6">
                        {Object.values(groupedMarks).map((group: any) => {
                            const stats = calculateStats(group.studentId);
                            // console.log("stats", stats);
                            return (
                                <div
                                    key={group.studentId}
                                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                                >
                                    {/* Student Header */}
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-6 h-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {group.studentName}
                                                    </h3>
                                                    <p className="text-blue-100 text-sm">
                                                        {stats.count} Subject{stats.count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-blue-100 text-sm mb-1">
                                                    Overall Performance
                                                </p>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl font-bold text-white">
                                                        {stats?.percentage?.toFixed(2)}%
                                                    </span>
                                                    <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm font-semibold">
                                                        {stats.totalObtained}/{stats.totalMax}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Marks Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Course
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Student Name
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Subject
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Exam Type
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Marks
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Percentage
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Grade
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {group.marks.map((mark: StudentMark, index: number) => (
                                                    <tr
                                                        key={mark._id}
                                                        className="hover:bg-blue-50/50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                                    <svg
                                                                        className="w-4 h-4 text-blue-600"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {mark?.courseId?.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {mark?.studentId?.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {mark?.subjectId?.title}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="w-[84px] inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                                {mark.examName}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {mark.obtainedMarks}/{mark.totalMarks}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {((mark.obtainedMarks / mark.totalMarks) * 100 || 0).toFixed(2)}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span
                                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${getGradeColor(
                                                                    (mark.obtainedMarks / mark.totalMarks) * 100 || 0
                                                                )}`}
                                                            >
                                                                {mark.grade}
                                                            </span>

                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {mark.isPublished ? (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                    <svg
                                                                        className="w-3 h-3 mr-1"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Published
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                                    <svg
                                                                        className="w-3 h-3 mr-1"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Draft
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center space-x-2 gap-[5px]">
                                                                <button
                                                                    onClick={() => handleEdit(mark)}
                                                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200 group"
                                                                    title="Edit Marks"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4 group-hover:scale-110 transition-transform"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(mark._id)}
                                                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-200 group"
                                                                    title="Delete Record"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4 group-hover:scale-110 transition-transform"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Edit Modal */}
                {editModalOpen && editingMark && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white">Update Marks</h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    {editingMark?.studentId?.name} - {editingMark?.subjectId?.title}
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Total Marks
                                    </label>
                                    <input
                                        type="number"
                                        value={editFormData.totalMarks}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                totalMarks: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Obtained Marks
                                    </label>
                                    <input
                                        type="number"
                                        value={editFormData.obtainedMarks}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                obtainedMarks: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center space-x-3 gap-[5px]">
                                    <input
                                        type="checkbox"
                                        checked={editFormData.isPublished}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                isPublished: e.target.checked,
                                            })
                                        }
                                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Publish Result
                                    </label>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex space-x-3 gap-[5px]">
                                <button
                                    onClick={() => setEditModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
                                >
                                    <span className='text-white'>
                                        {updateMutation.isPending ? 'Updating...' : 'Update'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">
                                            Are you sure you want to delete this record?
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex space-x-3 gap-[5px]">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteMutation.isPending}
                                    className=" flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
                                >
                                    <span className="text-white"> {deleteMutation.isPending ? 'Deleting...' : 'Delete'} </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}