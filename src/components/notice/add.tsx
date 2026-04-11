'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';
import { useRouter } from 'next/navigation';
import { Bell, Save, X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface NoticeFormData {
    title: string;
    description: string;
}

interface AddEditNoticeProps {
    noticeId?: string;
    initialData?: NoticeFormData;
    mode?: 'add' | 'edit';
}

export default function AddEditNotice({ noticeId, initialData, mode = 'add' }: AddEditNoticeProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<NoticeFormData>({
        mode: 'onBlur',
        defaultValues: initialData || {
            title: '',
            description: '',
        },
    });

    const descriptionValue = watch('description') || '';
    const wordCount = descriptionValue.trim().split(/\s+/).filter(Boolean).length;

    // Create/Update Notice Mutation
    const mutation = useMutation({
        mutationFn: async (data: NoticeFormData) => {
            const endpoint = mode === 'edit' && noticeId ? `${noticeId}` : '';
            const method = mode === 'edit' ? 'PUT' : 'POST';

            const res = await ApiHitter(
                method,
                'ADD_NOTICE',
                data,
                endpoint,
                { showError: true, showSuccess: true }
            );
            return res?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
            router.push('/notice/list');
        },
    });

    const onSubmit = (data: NoticeFormData) => {
        mutation.mutate(data);
    };

    const handleCancel = () => {
        router.push('/notice/list');
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Bell className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {mode === 'edit' ? 'Edit Notice' : 'Add New Notice'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {mode === 'edit' ? 'Update notice information' : 'Create a new notice for students'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-5">
                        <h2 className="text-xl font-semibold text-white">Notice Details</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                        <div className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notice Title *
                                </label>
                                <input
                                    {...register('title', {
                                        required: 'Title is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Title must be at least 10 characters',
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Title cannot exceed 100 characters',
                                        },
                                    })}
                                    placeholder="Enter notice title (10-100 characters)"
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.title
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                />
                                <div className="flex items-start justify-between mt-2">
                                    {errors.title && (
                                        <p className="text-red-600 text-xs flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.title.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 ml-auto">
                                        {watch('title')?.length || 0}/100 characters
                                    </p>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    {...register('description', {
                                        required: 'Description is required',
                                        validate: {
                                            minWords: (value) => {
                                                const words = value.trim().split(/\s+/).filter(Boolean).length;
                                                return words >= 10 || 'Description must be at least 10 words';
                                            },
                                            maxWords: (value) => {
                                                const words = value.trim().split(/\s+/).filter(Boolean).length;
                                                return words <= 100 || 'Description cannot exceed 100 words';
                                            },
                                        },
                                    })}
                                    placeholder="Enter notice description (10-100 words)"
                                    rows={6}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none ${errors.description
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                />
                                <div className="flex items-start justify-between mt-2">
                                    {errors.description && (
                                        <p className="text-red-600 text-xs flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.description.message}
                                        </p>
                                    )}
                                    <p
                                        className={`text-xs ml-auto ${wordCount < 10
                                            ? 'text-red-500 font-medium'
                                            : wordCount > 100
                                                ? 'text-red-500 font-medium'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        {wordCount}/100 words
                                    </p>
                                </div>
                                {/* Word count indicator */}
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${wordCount < 10
                                                ? 'bg-red-500'
                                                : wordCount > 100
                                                    ? 'bg-red-500'
                                                    : wordCount > 80
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                            style={{
                                                width: `${Math.min((wordCount / 100) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <X size={20} />
                                    <span className="text-black"> Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="flex-1 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {mode === 'edit' ? 'Updating...' : 'Saving...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            <span className="text-white">{mode === 'edit' ? 'Update Notice' : 'Save Notice'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Validation Rules</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Title: 10-100 characters</li>
                                <li>• Description: 10-100 words</li>
                                <li>• Both fields are required</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}