'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';
import Pagination from '@/components/pagination/pagination';
import {
    Calendar,
    Users,
    FileText,
    Edit,
    Trash2,
    Plus,
    Search,
    BookOpen,
    Clock,
    MoreVertical,
    Grid,
    List
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Exam {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    questionCount: number;
    studentCount: number;
    courseName: string;
}

interface ExamsResponse {
    exams: Exam[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function ExamsList() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Fetch Exams
    const { data, isLoading, isError } = useQuery<ExamsResponse>({
        queryKey: ['exams', currentPage, searchQuery],
        queryFn: async () => {
            const res = await ApiHitter(
                'GET',
                'GET_EXAMS_LIST',
                {},
                '',
                { showError: true, showSuccess: false }
            );
            return res?.data || { exams: [], page: 1, limit: 10, total: 0, totalPages: 1 };
        },
    });

    // Delete Exam Mutation
    const deleteMutation = useMutation({
        mutationFn: async (examId: string) => {
            await ApiHitter(
                'DELETE',
                'DELETE_EXAM',
                {},
                `/${examId}`,
                { showError: true, showSuccess: true }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });

    const handleDelete = async (examId: string, examTitle: string) => {
        if (window.confirm(`Are you sure you want to delete "${examTitle}"?`)) {
            deleteMutation.mutate(examId);
        }
        setActiveDropdown(null);
    };

    const handleEdit = (examId: string) => {
        router.push(`/exams/edit/${examId}`);
        setActiveDropdown(null);
    };

    const handleCreateNew = () => {
        router.push('/exam/create');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Exams
                            </h1>
                            <p className="text-gray-600">Manage and organize all your exams</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Plus className="text-white" size={20} />
                            <span className="text-white">Create New Exam</span>
                        </button>
                    </div>
                </div>

                {/* Search & View Toggle */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search exams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 border-2 border-gray-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewMode === 'list'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <List size={18} />
                            <span className="hidden sm:inline">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewMode === 'grid'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Grid size={18} />
                            <span className="hidden sm:inline">Grid</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 font-medium">Loading exams...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Exams</h3>
                            <p className="text-gray-600">Please try again later</p>
                        </div>
                    </div>
                ) : data?.exams.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Found</h3>
                            <p className="text-gray-600 mb-6">Get started by creating your first exam</p>
                            <button
                                onClick={handleCreateNew}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Plus size={20} />
                                Create Your First Exam
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'list' ? (
                            /* List View */
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                                        <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm">
                                            <div className="col-span-4">Exam Details</div>
                                            <div className="col-span-2 text-center">Course</div>
                                            <div className="col-span-2 text-center">Questions</div>
                                            <div className="col-span-2 text-center">Students</div>
                                            <div className="col-span-1 text-center">Created</div>
                                            <div className="col-span-1 text-center">Actions</div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {data?.exams.map((exam) => (
                                            <div
                                                key={exam._id}
                                                className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-blue-50/50 transition-colors duration-200"
                                            >
                                                <div className="col-span-4 flex items-start gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <FileText size={24} className="text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                            {exam.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <Clock size={12} />
                                                            Updated {formatDate(exam.updatedAt)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                                        <BookOpen size={14} />
                                                        {exam.courseName}
                                                    </div>
                                                </div>

                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                                                        <FileText size={16} />
                                                        {exam.questionCount}
                                                    </div>
                                                </div>

                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                                                        <Users size={16} />
                                                        {exam.studentCount}
                                                    </div>
                                                </div>

                                                <div className="col-span-1 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                                            <Calendar size={12} />
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {formatDate(exam.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-1 flex items-center justify-center">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === exam._id ? null : exam._id)}
                                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            <MoreVertical size={18} className="text-gray-600" />
                                                        </button>

                                                        {activeDropdown === exam._id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                />
                                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                                                                    <button
                                                                        onClick={() => handleEdit(exam._id)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Edit size={16} />
                                                                        <span className="font-medium">Edit Exam</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(exam._id, exam.title)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        <span className="font-medium">Delete Exam</span>
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden divide-y divide-gray-100">
                                    {data?.exams.map((exam) => (
                                        <div key={exam._id} className="p-4 hover:bg-blue-50/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <FileText size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                            {exam.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <BookOpen size={12} />
                                                            {exam.courseName}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative ml-2">
                                                    <button
                                                        onClick={() => setActiveDropdown(activeDropdown === exam._id ? null : exam._id)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <MoreVertical size={18} className="text-gray-600" />
                                                    </button>

                                                    {activeDropdown === exam._id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setActiveDropdown(null)}
                                                            />
                                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                                                                <button
                                                                    onClick={() => handleEdit(exam._id)}
                                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                >
                                                                    <Edit size={16} />
                                                                    <span className="font-medium">Edit Exam</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(exam._id, exam.title)}
                                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                    <span className="font-medium">Delete Exam</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="flex flex-col items-center gap-1 p-2 bg-green-50 rounded-lg">
                                                    <FileText size={16} className="text-green-600" />
                                                    <span className="text-sm font-semibold text-green-700">{exam.questionCount}</span>
                                                    <span className="text-xs text-gray-600">Questions</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 p-2 bg-blue-50 rounded-lg">
                                                    <Users size={16} className="text-blue-600" />
                                                    <span className="text-sm font-semibold text-blue-700">{exam.studentCount}</span>
                                                    <span className="text-xs text-gray-600">Students</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 p-2 bg-purple-50 rounded-lg">
                                                    <Calendar size={16} className="text-purple-600" />
                                                    <span className="text-sm font-semibold text-purple-700">{formatDate(exam.createdAt).split(',')[0]}</span>
                                                    <span className="text-xs text-gray-600">Created</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {data && (
                                    // <Pagination
                                    //     currentPage={data.page}
                                    //     totalPages={data.totalPages}
                                    //     onPageChange={setCurrentPage}
                                    //     totalItems={data.total}
                                    //     itemsPerPage={data.limit}
                                    // />
                                    <Pagination
                                        pageCount={data.totalPages}
                                        currentPage={data.page}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </div>
                        ) : (
                            /* Grid View */
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data?.exams.map((exam) => (
                                        <div
                                            key={exam._id}
                                            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 group"
                                        >
                                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                        <FileText size={28} className="text-white" />
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === exam._id ? null : exam._id)}
                                                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                                                        >
                                                            <MoreVertical size={18} className="text-white" />
                                                        </button>

                                                        {activeDropdown === exam._id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                />
                                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                                                                    <button
                                                                        onClick={() => handleEdit(exam._id)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Edit size={16} />
                                                                        <span className="font-medium">Edit Exam</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(exam._id, exam.title)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        <span className="font-medium">Delete Exam</span>
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                                    {exam.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                                    <BookOpen size={14} />
                                                    {exam.courseName}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <FileText size={18} className="text-green-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-green-700">{exam.questionCount}</div>
                                                            <div className="text-xs text-gray-600">Questions</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Users size={18} className="text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-blue-700">{exam.studentCount}</div>
                                                            <div className="text-xs text-gray-600">Students</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(exam.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} />
                                                        <span>{formatDate(exam.updatedAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {data && data.totalPages > 1 && (
                                    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        {/* <Pagination
                                            currentPage={data.page}
                                            totalPages={data.totalPages}
                                            onPageChange={setCurrentPage}
                                            totalItems={data.total}
                                            itemsPerPage={data.limit}
                                                        /> */}
                                        <Pagination
                                            pageCount={data.totalPages}
                                            currentPage={data.page}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}