// 'use client';

// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { ApiHitter } from '@/lib/axiosApi/apiHitter';
// import Pagination from '@/components/pagination/pagination';
// import {
//     Bell,
//     Edit,
//     Trash2,
//     Plus,
//     Search,
//     Grid,
//     List,
//     Calendar,
//     MoreVertical,
//     Eye,
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// interface Notice {
//     _id: string;
//     title: string;
//     description: string;
//     createdAt: string;
//     updatedAt: string;
// }

// interface NoticesResponse {
//     notices: Notice[];
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
// }

// export default function NoticeListPage() {
//     const router = useRouter();
//     const queryClient = useQueryClient();
//     const [currentPage, setCurrentPage] = useState(1);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//     const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
//     const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

//     // Fetch Notices
//     const { data, isLoading, isError } = useQuery<NoticesResponse>({
//         queryKey: ['notices', currentPage, searchQuery],
//         queryFn: async () => {
//             const res = await ApiHitter(
//                 'GET',
//                 'GET_NOTICE',
//                 {},
//                 `?page=${currentPage}&search=${searchQuery}`,
//                 { showError: true, showSuccess: false }
//             );
//             return res?.data || { notices: [], page: 1, limit: 10, total: 0, totalPages: 1 };
//         },
//     });

//     // Delete Notice Mutation
//     const deleteMutation = useMutation({
//         mutationFn: async (noticeId: string) => {
//             await ApiHitter(
//                 'DELETE',
//                 'DELETE_NOTICE',
//                 {},
//                 `/${noticeId}`,
//                 { showError: true, showSuccess: true }
//             );
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['notices'] });
//         },
//     });

//     const handleDelete = async (noticeId: string, noticeTitle: string) => {
//         if (window.confirm(`Are you sure you want to delete "${noticeTitle}"?`)) {
//             deleteMutation.mutate(noticeId);
//         }
//         setActiveDropdown(null);
//     };

//     const handleEdit = (noticeId: string) => {
//         router.push(`/notice/edit/${noticeId}`);
//         setActiveDropdown(null);
//     };

//     const handleCreateNew = () => {
//         router.push('/notice/add');
//     };

//     const handleView = (notice: Notice) => {
//         setSelectedNotice(notice);
//         setActiveDropdown(null);
//     };

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//         });
//     };

//     const truncateText = (text: string, wordLimit: number) => {
//         const words = text.split(' ');
//         if (words.length <= wordLimit) return text;
//         return words.slice(0, wordLimit).join(' ') + '...';
//     };

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div>
//                             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
//                                 Student Notices
//                             </h1>
//                             <p className="text-gray-600">Manage and organize all student notices</p>
//                         </div>
//                         <button
//                             onClick={handleCreateNew}
//                             className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
//                         >
//                             <Plus size={20} />
//                             Add New Notice
//                         </button>
//                     </div>
//                 </div>

//                 {/* Search & View Toggle */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//                     <div className="relative w-full sm:max-w-md">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                             type="text"
//                             placeholder="Search notices..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
//                         />
//                     </div>

//                     {/* View Toggle */}
//                     <div className="flex items-center gap-2 bg-white rounded-xl p-1 border-2 border-gray-200">
//                         <button
//                             onClick={() => setViewMode('list')}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewMode === 'list'
//                                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
//                                 : 'text-gray-600 hover:bg-gray-100'
//                                 }`}
//                         >
//                             <List size={18} />
//                             <span className="hidden sm:inline">List</span>
//                         </button>
//                         <button
//                             onClick={() => setViewMode('grid')}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewMode === 'grid'
//                                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
//                                 : 'text-gray-600 hover:bg-gray-100'
//                                 }`}
//                         >
//                             <Grid size={18} />
//                             <span className="hidden sm:inline">Grid</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Content */}
//                 {isLoading ? (
//                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
//                         <div className="flex flex-col items-center justify-center gap-4">
//                             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                             <p className="text-gray-600 font-medium">Loading notices...</p>
//                         </div>
//                     </div>
//                 ) : isError ? (
//                     <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-12">
//                         <div className="text-center">
//                             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <span className="text-3xl">⚠️</span>
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Notices</h3>
//                             <p className="text-gray-600">Please try again later</p>
//                         </div>
//                     </div>
//                 ) : data?.notices.length === 0 ? (
//                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
//                         <div className="text-center">
//                             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <Bell size={40} className="text-gray-400" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notices Found</h3>
//                             <p className="text-gray-600 mb-6">Get started by creating your first notice</p>
//                             <button
//                                 onClick={handleCreateNew}
//                                 className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
//                             >
//                                 <Plus size={20} />
//                                 Create Your First Notice
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         {viewMode === 'list' ? (
//                             /* List View */
//                             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//                                 {/* Desktop Table View */}
//                                 <div className="hidden lg:block">
//                                     <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
//                                         <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm">
//                                             <div className="col-span-4">Title</div>
//                                             <div className="col-span-5">Description</div>
//                                             <div className="col-span-2 text-center">Date</div>
//                                             <div className="col-span-1 text-center">Actions</div>
//                                         </div>
//                                     </div>

//                                     <div className="divide-y divide-gray-100">
//                                         {data?.notices.map((notice) => (
//                                             <div
//                                                 key={notice._id}
//                                                 className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-blue-50/50 transition-colors duration-200"
//                                             >
//                                                 <div className="col-span-4 flex items-start gap-3">
//                                                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
//                                                         <Bell size={20} className="text-white" />
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
//                                                             {notice.title}
//                                                         </h3>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-span-5 flex items-center">
//                                                     <p className="text-sm text-gray-600 line-clamp-2">
//                                                         {notice.description}
//                                                     </p>
//                                                 </div>

//                                                 <div className="col-span-2 flex items-center justify-center">
//                                                     <div className="text-center">
//                                                         <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
//                                                             <Calendar size={12} />
//                                                         </div>
//                                                         <div className="text-sm font-medium text-gray-700">
//                                                             {formatDate(notice.createdAt)}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-span-1 flex items-center justify-center">
//                                                     <div className="relative">
//                                                         <button
//                                                             onClick={() =>
//                                                                 setActiveDropdown(
//                                                                     activeDropdown === notice._id ? null : notice._id
//                                                                 )
//                                                             }
//                                                             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                                                         >
//                                                             <MoreVertical size={18} className="text-gray-600" />
//                                                         </button>

//                                                         {activeDropdown === notice._id && (
//                                                             <>
//                                                                 <div
//                                                                     className="fixed inset-0 z-10"
//                                                                     onClick={() => setActiveDropdown(null)}
//                                                                 />
//                                                                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
//                                                                     <button
//                                                                         onClick={() => handleView(notice)}
//                                                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
//                                                                     >
//                                                                         <Eye size={16} />
//                                                                         <span className="font-medium">View</span>
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() => handleEdit(notice._id)}
//                                                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
//                                                                     >
//                                                                         <Edit size={16} />
//                                                                         <span className="font-medium">Edit</span>
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             handleDelete(notice._id, notice.title)
//                                                                         }
//                                                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
//                                                                     >
//                                                                         <Trash2 size={16} />
//                                                                         <span className="font-medium">Delete</span>
//                                                                     </button>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Mobile Card View */}
//                                 <div className="lg:hidden divide-y divide-gray-100">
//                                     {data?.notices.map((notice) => (
//                                         <div key={notice._id} className="p-4 hover:bg-blue-50/50 transition-colors">
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <div className="flex items-start gap-3 flex-1 min-w-0">
//                                                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
//                                                         <Bell size={18} className="text-white" />
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
//                                                             {notice.title}
//                                                         </h3>
//                                                         <p className="text-xs text-gray-500 flex items-center gap-1">
//                                                             <Calendar size={12} />
//                                                             {formatDate(notice.createdAt)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="relative ml-2">
//                                                     <button
//                                                         onClick={() =>
//                                                             setActiveDropdown(
//                                                                 activeDropdown === notice._id ? null : notice._id
//                                                             )
//                                                         }
//                                                         className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                                                     >
//                                                         <MoreVertical size={18} className="text-gray-600" />
//                                                     </button>

//                                                     {activeDropdown === notice._id && (
//                                                         <>
//                                                             <div
//                                                                 className="fixed inset-0 z-10"
//                                                                 onClick={() => setActiveDropdown(null)}
//                                                             />
//                                                             <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
//                                                                 <button
//                                                                     onClick={() => handleView(notice)}
//                                                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
//                                                                 >
//                                                                     <Eye size={16} />
//                                                                     <span className="font-medium">View</span>
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleEdit(notice._id)}
//                                                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
//                                                                 >
//                                                                     <Edit size={16} />
//                                                                     <span className="font-medium">Edit</span>
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleDelete(notice._id, notice.title)}
//                                                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
//                                                                 >
//                                                                     <Trash2 size={16} />
//                                                                     <span className="font-medium">Delete</span>
//                                                                 </button>
//                                                             </div>
//                                                         </>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <p className="text-sm text-gray-600 line-clamp-3 ml-13">
//                                                 {notice.description}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {data && (
//                                     // <Pagination
//                                     //     currentPage={data.page}
//                                     //     totalPages={data.totalPages}
//                                     //     onPageChange={setCurrentPage}
//                                     //     totalItems={data.total}
//                                     //     itemsPerPage={data.limit}
//                                     //             />
//                                     <Pagination
//                                         pageCount={data.totalPages}
//                                         currentPage={data.page}
//                                         onPageChange={handlePageChange}
//                                     />
//                                 )}
//                             </div>
//                         ) : (
//                             /* Grid View */
//                             <div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {data?.notices.map((notice) => (
//                                         <div
//                                             key={notice._id}
//                                             className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 group"
//                                         >
//                                             <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative">
//                                                 <div className="flex items-start justify-between mb-4">
//                                                     <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                                                         <Bell size={24} className="text-white" />
//                                                     </div>
//                                                     <div className="relative">
//                                                         <button
//                                                             onClick={() =>
//                                                                 setActiveDropdown(
//                                                                     activeDropdown === notice._id ? null : notice._id
//                                                                 )
//                                                             }
//                                                             className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
//                                                         >
//                                                             <MoreVertical size={18} className="text-white" />
//                                                         </button>

//                                                         {activeDropdown === notice._id && (
//                                                             <>
//                                                                 <div
//                                                                     className="fixed inset-0 z-10"
//                                                                     onClick={() => setActiveDropdown(null)}
//                                                                 />
//                                                                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
//                                                                     <button
//                                                                         onClick={() => handleView(notice)}
//                                                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
//                                                                     >
//                                                                         <Eye size={16} />
//                                                                         <span className="font-medium">View</span>
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() => handleEdit(notice._id)}
//                                                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
//                                                                     >
//                                                                         <Edit size={16} />
//                                                                         <span className="font-medium">Edit</span>
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             handleDelete(notice._id, notice.title)
//                                                                         }
//                                                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
//                                                                     >
//                                                                         <Trash2 size={16} />
//                                                                         <span className="font-medium">Delete</span>
//                                                                     </button>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                                 <h3 className="text-lg font-bold text-white line-clamp-2 min-h-[3.5rem]">
//                                                     {notice.title}
//                                                 </h3>
//                                             </div>

//                                             <div className="p-6">
//                                                 <p className="text-gray-600 text-sm line-clamp-4 mb-4 min-h-[5rem]">
//                                                     {notice.description}
//                                                 </p>

//                                                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                                                     <div className="flex items-center gap-2 text-sm text-gray-500">
//                                                         <Calendar size={14} />
//                                                         <span>{formatDate(notice.createdAt)}</span>
//                                                     </div>
//                                                     <button
//                                                         onClick={() => handleView(notice)}
//                                                         className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                                                     >
//                                                         View
//                                                         <Eye size={14} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {data && data.totalPages > 1 && (
//                                     <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//                                         {/* <Pagination
//                                             currentPage={data.page}
//                                             totalPages={data.totalPages}
//                                             onPageChange={setCurrentPage}
//                                             totalItems={data.total}
//                                             itemsPerPage={data.limit}
//                                         /> */}
//                                         <Pagination
//                                             pageCount={data.totalPages}
//                                             currentPage={data.page}
//                                             onPageChange={handlePageChange}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             {/* View Modal */}
//             {selectedNotice && (
//                 <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-start gap-3">
//                                     <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
//                                         <Bell size={24} className="text-white" />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-2xl font-bold text-white mb-1">Notice Details</h2>
//                                         <p className="text-white/80 text-sm">
//                                             {formatDate(selectedNotice.createdAt)}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={() => setSelectedNotice(null)}
//                                     className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
//                                 >
//                                     {/* <X size={20} className="text-white" /> */} x
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="p-6">
//                             <div className="mb-6">
//                                 <h3 className="text-sm font-semibold text-gray-500 mb-2">TITLE</h3>
//                                 <p className="text-xl font-bold text-gray-900">{selectedNotice.title}</p>
//                             </div>

//                             <div>
//                                 <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
//                                 <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                                     {selectedNotice.description}
//                                 </p>
//                             </div>

//                             <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
//                                 <button
//                                     onClick={() => {
//                                         setSelectedNotice(null);
//                                         handleEdit(selectedNotice._id);
//                                     }}
//                                     className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
//                                 >
//                                     <Edit size={16} />
//                                     Edit Notice
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';
import Pagination from '@/components/pagination/pagination';
import {
    Bell,
    Edit,
    Trash2,
    Plus,
    Search,
    Grid,
    List,
    Calendar,
    MoreVertical,
    Eye,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notice {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface NoticesResponse {
    notices: Notice[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function NoticeList() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    // Fetch Notices
    const { data, isLoading, isError } = useQuery<NoticesResponse>({
        queryKey: ['notices', currentPage, searchQuery],
        queryFn: async () => {
            const res = await ApiHitter(
                'GET',
                'GET_NOTICE',
                {},
                `?page=${currentPage}&search=${searchQuery}`,
                { showError: true, showSuccess: false }
            );
            return res?.data || { notices: [], page: 1, limit: 10, total: 0, totalPages: 1 };
        },
    });

    // Delete Notice Mutation
    const deleteMutation = useMutation({
        mutationFn: async (noticeId: string) => {
            await ApiHitter(
                'DELETE',
                'DELETE_NOTICE',
                {},
                `/${noticeId}`,
                { showError: true, showSuccess: true }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });

    const handleDelete = async (noticeId: string, noticeTitle: string) => {
        if (window.confirm(`Are you sure you want to delete "${noticeTitle}"?`)) {
            deleteMutation.mutate(noticeId);
        }
        setActiveDropdown(null);
    };

    const handleEdit = (noticeId: string) => {
        router.push(`/notice/edit/${noticeId}`);
        setActiveDropdown(null);
    };

    const handleCreateNew = () => {
        router.push('/notice/add');
    };

    const handleView = (notice: Notice) => {
        setSelectedNotice(notice);
        setActiveDropdown(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
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
                                Student Notices
                            </h1>
                            <p className="text-gray-600">Manage and organize all student notices</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Plus size={20} />
                            <span className="text-white"> Add New Notice</span>
                        </button>
                    </div>
                </div>

                {/* Search & View Toggle */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search notices..."
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
                            <p className="text-gray-600 font-medium">Loading notices...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Notices</h3>
                            <p className="text-gray-600">Please try again later</p>
                        </div>
                    </div>
                ) : data?.notices.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notices Found</h3>
                            <p className="text-gray-600 mb-6">Get started by creating your first notice</p>
                            <button
                                onClick={handleCreateNew}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Plus size={20} />
                                Create Your First Notice
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'list' ? (
                            /* List View */
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-2xl">
                                        <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm">
                                            <div className="col-span-4">Title</div>
                                            <div className="col-span-5">Description</div>
                                            <div className="col-span-2 text-center">Date</div>
                                            <div className="col-span-1 text-center">Actions</div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {data?.notices.map((notice, index) => (
                                            <div
                                                key={notice._id}
                                                className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-blue-50/50 transition-colors duration-200 relative"
                                            >
                                                <div className="col-span-4 flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <Bell size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                            {notice.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="col-span-5 flex items-center">
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notice.description}
                                                    </p>
                                                </div>

                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                                            <Calendar size={12} />
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {formatDate(notice.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-1 flex items-center justify-center">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                setActiveDropdown(
                                                                    activeDropdown === notice._id ? null : notice._id
                                                                )
                                                            }
                                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            <MoreVertical size={18} className="text-gray-600" />
                                                        </button>

                                                        {activeDropdown === notice._id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-30"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                />
                                                                <div
                                                                    className={`absolute ${index > data.notices.length - 3 ? 'bottom-full mb-2' : 'top-full mt-2'
                                                                        } right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40`}
                                                                    style={{
                                                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
                                                                    }}
                                                                >
                                                                    <button
                                                                        onClick={() => handleView(notice)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Eye size={16} />
                                                                        <span className="font-medium">View</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEdit(notice._id)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Edit size={16} />
                                                                        <span className="font-medium">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDelete(notice._id, notice.title)
                                                                        }
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        <span className="font-medium">Delete</span>
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
                                    {data?.notices.map((notice, index) => (
                                        <div key={notice._id} className="p-4 hover:bg-blue-50/50 transition-colors relative">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <Bell size={18} className="text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                            {notice.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {formatDate(notice.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="relative ml-2">
                                                    <button
                                                        onClick={() =>
                                                            setActiveDropdown(
                                                                activeDropdown === notice._id ? null : notice._id
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <MoreVertical size={18} className="text-gray-600" />
                                                    </button>

                                                    {activeDropdown === notice._id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-30"
                                                                onClick={() => setActiveDropdown(null)}
                                                            />
                                                            <div
                                                                className={`absolute ${index > data.notices.length - 3 ? 'bottom-full mb-2' : 'top-full mt-2'
                                                                    } right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40`}
                                                                style={{
                                                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
                                                                }}
                                                            >
                                                                <button
                                                                    onClick={() => handleView(notice)}
                                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                >
                                                                    <Eye size={16} />
                                                                    <span className="font-medium">View</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(notice._id)}
                                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                >
                                                                    <Edit size={16} />
                                                                    <span className="font-medium">Edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(notice._id, notice.title)}
                                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                    <span className="font-medium">Delete</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 line-clamp-3 ml-13">
                                                {notice.description}
                                            </p>
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
                                    {data?.notices.map((notice, index) => (
                                        <div
                                            key={notice._id}
                                            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group relative"
                                        >
                                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                        <Bell size={24} className="text-white" />
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                setActiveDropdown(
                                                                    activeDropdown === notice._id ? null : notice._id
                                                                )
                                                            }
                                                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                                                        >
                                                            <MoreVertical size={18} className="text-white" />
                                                        </button>

                                                        {activeDropdown === notice._id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-30"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                />
                                                                <div
                                                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40"
                                                                    style={{
                                                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
                                                                    }}
                                                                >
                                                                    <button
                                                                        onClick={() => handleView(notice)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Eye size={16} />
                                                                        <span className="font-medium">View</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEdit(notice._id)}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        <Edit size={16} />
                                                                        <span className="font-medium">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDelete(notice._id, notice.title)
                                                                        }
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        <span className="font-medium">Delete</span>
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-bold text-white line-clamp-2 min-h-[3.5rem]">
                                                    {notice.title}
                                                </h3>
                                            </div>

                                            <div className="p-6">
                                                <p className="text-gray-600 text-sm line-clamp-4 mb-4 min-h-[5rem]">
                                                    {notice.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(notice.createdAt)}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleView(notice)}
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                    >
                                                        View
                                                        <Eye size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {data && data.totalPages > 1 && (
                                    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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

            {/* View Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Bell size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">Notice Details</h2>
                                        <p className="text-white/80 text-sm">
                                            {formatDate(selectedNotice.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">TITLE</h3>
                                <p className="text-xl font-bold text-gray-900">{selectedNotice.title}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedNotice.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedNotice(null);
                                        handleEdit(selectedNotice._id);
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
                                >
                                    <Edit size={16} />
                                    Edit Notice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}