'use client';

import React, { useState } from 'react';
import { LayoutGrid, List, Search, Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';

// Types
interface CMSPage {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    isActive: boolean;
    createdAt: string;
}

// Dummy Data
const DUMMY_PAGES: CMSPage[] = [
    {
        id: '1',
        name: 'Home Page',
        description: 'Main landing page with hero section and featured content',
        status: 'active',
        isActive: true,
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'About Us',
        description: 'Company background, mission, vision and team information',
        status: 'active',
        isActive: true,
        createdAt: '2024-01-10',
    },
    {
        id: '3',
        name: 'Services',
        description: 'Comprehensive list of all services offered',
        status: 'active',
        isActive: true,
        createdAt: '2024-01-08',
    },
    {
        id: '4',
        name: 'Blog',
        description: 'Latest articles and news updates',
        status: 'inactive',
        isActive: false,
        createdAt: '2024-01-05',
    },
    {
        id: '5',
        name: 'Contact Us',
        description: 'Contact form and business information',
        status: 'active',
        isActive: true,
        createdAt: '2024-01-12',
    },
    {
        id: '6',
        name: 'FAQ',
        description: 'Frequently asked questions and answers',
        status: 'inactive',
        isActive: false,
        createdAt: '2024-01-03',
    },
    {
        id: '7',
        name: 'Pricing',
        description: 'Pricing plans and subscription details',
        status: 'active',
        isActive: true,
        createdAt: '2024-01-20',
    },
    {
        id: '8',
        name: 'Testimonials',
        description: 'Customer reviews and success stories',
        status: 'active',
        isActive: true,
        createdAt: '2024-01-18',
    },
];

export default function CMSPagesList() {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [pages, setPages] = useState<CMSPage[]>(DUMMY_PAGES);

    // Filter pages based on search
    const filteredPages = pages.filter(
        (page) =>
            page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            page.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle toggle active status
    const handleToggleStatus = (id: string) => {
        setPages((prevPages) =>
            prevPages.map((page) =>
                page.id === id
                    ? {
                        ...page,
                        isActive: !page.isActive,
                        status: page.isActive ? 'inactive' : 'active',
                    }
                    : page
            )
        );
    };

    // Handle delete
    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this page?')) {
            setPages((prevPages) => prevPages.filter((page) => page.id !== id));
        }
    };

    // Handle edit
    const handleEdit = (id: string) => {
        alert(`Edit page ${id} - Redirect to edit page`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            CMS Pages
                        </h1>
                        <p className="text-slate-600 mt-1">Manage and organize all your website pages</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                        <Plus size={20} />
                        <span>New Page</span>
                    </button>
                </div>

                {/* Search and View Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search pages by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2.5 rounded transition-all duration-200 ${viewMode === 'table'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            title="Table View"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded transition-all duration-200 ${viewMode === 'grid'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredPages.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{pages.length}</span> pages
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                                        Page Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredPages.length > 0 ? (
                                    filteredPages.map((page) => (
                                        <tr
                                            key={page.id}
                                            className="hover:bg-slate-50 transition-colors duration-150 group"
                                        >
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                                        <ChevronRight size={18} className="text-white" />
                                                    </div>
                                                    {page.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <span className="line-clamp-1">{page.description}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(page.id)}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${page.isActive
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                                        }`}
                                                >
                                                    {page.isActive ? (
                                                        <>
                                                            <Eye size={14} />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff size={14} />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(page.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => handleEdit(page.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                        title="Edit page"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(page.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                        title="Delete page"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="text-slate-400" size={32} />
                                                <p className="text-slate-600 font-medium">No pages found</p>
                                                <p className="text-slate-500 text-sm">Try adjusting your search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div>
                    {filteredPages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPages.map((page) => (
                                <div
                                    key={page.id}
                                    className="group bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>

                                    <div className="p-6 space-y-4">
                                        {/* Title and Badge */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                                                    {page.name}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => handleToggleStatus(page.id)}
                                                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${page.isActive
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                                    }`}
                                            >
                                                {page.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-600 text-sm line-clamp-2">{page.description}</p>

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                            <span>
                                                Created{' '}
                                                {new Date(page.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <span className="font-mono text-slate-400">ID: {page.id}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleEdit(page.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium text-sm"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium text-sm"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
                                <Search className="mx-auto text-slate-400 mb-4" size={48} />
                                <p className="text-slate-900 font-bold text-lg">No pages found</p>
                                <p className="text-slate-600 mt-2">Try adjusting your search terms</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}