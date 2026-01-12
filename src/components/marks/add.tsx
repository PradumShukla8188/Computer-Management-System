'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';
import { toast } from '@/lib/toast';

type SubjectMark = {
    subjectId: string;
    totalMarks: number;
    obtainedMarks: number;
};

type FormValues = {
    studentId: string;
    courseId: string;
    examName: string;
    isPublished: boolean;
    subjects: SubjectMark[];
};

export default function AddStudentMarksPage() {
    const queryClient = useQueryClient();
    const [subjects, setSubjects] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        reset,
        formState: { errors, touchedFields },
    } = useForm<FormValues>({
        mode: 'onTouched',
        defaultValues: {
            isPublished: true,
            subjects: [{ subjectId: '', totalMarks: 0, obtainedMarks: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'subjects',
    });

    const courseId = watch('courseId');

    // Fetch Students
    const { data: students = [], isLoading: studentsLoading } = useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const res = await ApiHitter('GET', 'GET_STUDENT_LIST', {}, '', {
                showError: true,
                showSuccess: false,
            });
            return res?.data || [];
        },
    });

    // Fetch Courses
    const { data: courses = [], isLoading: coursesLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const res = await ApiHitter('GET', 'GET_COURSE_LIST', {}, '', {
                showError: true,
                showSuccess: false,
            });
            return res?.data || [];
        },
    });

    // Fetch Subjects based on selected Course
    useEffect(() => {
        if (!courseId) return;
        setSubjects([]);
        // Reset all subject fields when course changes
        fields.forEach((_, index) => {
            setValue(`subjects.${index}.subjectId`, '');
        });

        ApiHitter('GET', 'GET_SUBJECT_LIST', {}, courseId, {
            showError: true,
            showSuccess: false,
        })
            .then((res) => setSubjects(res?.data || []))
            .catch((err) => console.error(err));
    }, [courseId, setValue]);

    // Mutation to add student marks
    // const addMarksMutation = useMutation({
    //     mutationFn: async (data: FormValues) => {
    //         // Transform data to send individual requests or bulk request
    //         // Depending on your API structure
    //         const res = await ApiHitter('POST', 'ADD_STUDENT_MARKS', data, '', {
    //             showError: true,
    //             showSuccess: true,
    //         });
    //         return res?.data;
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['marks'] });
    //     },
    //     onError: (err: any) => {
    //         console.error(err?.response?.data?.message || 'Something went wrong');
    //     },
    // });
    const addMarksMutation = useMutation({
        mutationFn: async (formData: FormValues) => {
            const res = await ApiHitter(
                'POST',
                'ADD_STUDENT_MARKS',
                formData,
                '',
                {
                    showError: false,   // handle manually
                    showSuccess: false, // handle manually
                }
            );

            return res;
        },

        onSuccess: (response) => {
            toast.success(response?.message || 'Marks added successfully');

            // Reset form after success
            reset({
                studentId: '',
                courseId: '',
                examName: '',
                isPublished: true,
                subjects: [{ subjectId: '', totalMarks: 0, obtainedMarks: 0 }],
            });

            // Refresh marks list
            queryClient.invalidateQueries({ queryKey: ['marks'] });
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                'Failed to add marks. Please try again.';

            toast.error(message);
        },
    });


    const onSubmit = (data: FormValues) => {
        console.log('Form Data:', data);
        addMarksMutation.mutate(data);
    };

    const addMoreSubject = () => {
        append({ subjectId: '', totalMarks: 0, obtainedMarks: 0 });
    };

    const removeSubject = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                        <svg
                            className="w-8 h-8 text-white"
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Add Student Marks
                    </h1>
                    <p className="text-gray-600">
                        Enter student examination marks for multiple subjects
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h2 className="text-2xl font-semibold text-white">
                            Examination Details
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b pb-3">
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
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Student */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Student
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('studentId', {
                                                required: 'Please select a student',
                                            })}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer ${errors.studentId && touchedFields.studentId
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                            disabled={studentsLoading}
                                        >
                                            <option value="">
                                                {studentsLoading ? 'Loading...' : 'Select Student'}
                                            </option>
                                            {students.map((s: any) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {touchedFields.studentId && errors.studentId && (
                                        <p className="text-sm text-red-600 flex items-center mt-1">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.studentId.message}
                                        </p>
                                    )}
                                </div>

                                {/* Course */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Course
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('courseId', {
                                                required: 'Please select a course',
                                            })}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer ${errors.courseId && touchedFields.courseId
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                            disabled={coursesLoading}
                                        >
                                            <option value="">
                                                {coursesLoading ? 'Loading...' : 'Select Course'}
                                            </option>
                                            {courses.map((c: any) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {touchedFields.courseId && errors.courseId && (
                                        <p className="text-sm text-red-600 flex items-center mt-1">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
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

                                {/* Exam Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Exam Type
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('examName', {
                                                required: 'Please select an exam type',
                                            })}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer ${errors.examName && touchedFields.examName
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <option value="">Select Exam</option>
                                            <option value="Monthly Test">Monthly Test</option>
                                            <option value="Final Exam">Final Exam</option>
                                            <option value="Practical">Practical</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {touchedFields.examName && errors.examName && (
                                        <p className="text-sm text-red-600 flex items-center mt-1">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.examName.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Subject Marks Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
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
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    Subject Marks
                                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                        {fields.length} Subject{fields.length !== 1 ? 's' : ''}
                                    </span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={addMoreSubject}
                                    disabled={!courseId || subjects.length === 0}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <span className="text-white">Add Subject</span>
                                </button>
                            </div>

                            {!courseId && (
                                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-center space-x-3">
                                    <svg
                                        className="w-6 h-6 text-amber-600 flex-shrink-0"
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
                                    <p className="text-sm text-amber-800 font-medium">
                                        Please select a course first to add subject marks
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 relative"
                                    >
                                        {/* Remove Button */}
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(index)}
                                                className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-200 group"
                                                title="Remove Subject"
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
                                        )}

                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                                {index + 1}
                                            </div>
                                            <h4 className="font-semibold text-gray-900">
                                                Subject {index + 1}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Subject */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Subject
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        {...register(`subjects.${index}.subjectId`, {
                                                            required: 'Please select a subject',
                                                        })}
                                                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer ${errors.subjects?.[index]?.subjectId
                                                            ? 'border-red-500'
                                                            : 'border-gray-200'
                                                            }`}
                                                        disabled={!courseId || subjects.length === 0}
                                                    >
                                                        <option value="">
                                                            {!courseId
                                                                ? 'Select course first'
                                                                : subjects.length === 0
                                                                    ? 'Loading...'
                                                                    : 'Select Subject'}
                                                        </option>
                                                        {subjects.map((s: any) => (
                                                            <option key={s._id} value={s._id}>
                                                                {s.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                        <svg
                                                            className="w-5 h-5 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.subjects?.[index]?.subjectId && (
                                                    <p className="text-sm text-red-600 flex items-center mt-1">
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.subjects[index].subjectId?.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Total Marks */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Total Marks
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register(`subjects.${index}.totalMarks`, {
                                                        required: 'Total marks is required',
                                                        min: { value: 1, message: 'Must be at least 1' },
                                                        valueAsNumber: true,
                                                    })}
                                                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.subjects?.[index]?.totalMarks
                                                        ? 'border-red-500'
                                                        : 'border-gray-200'
                                                        }`}
                                                    placeholder="100"
                                                />
                                                {errors.subjects?.[index]?.totalMarks && (
                                                    <p className="text-sm text-red-600 flex items-center mt-1">
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.subjects[index].totalMarks?.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Obtained Marks */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Obtained Marks
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register(`subjects.${index}.obtainedMarks`, {
                                                        required: 'Obtained marks is required',
                                                        min: { value: 0, message: 'Cannot be negative' },
                                                        valueAsNumber: true,
                                                    })}
                                                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.subjects?.[index]?.obtainedMarks
                                                        ? 'border-red-500'
                                                        : 'border-gray-200'
                                                        }`}
                                                    placeholder="85"
                                                />
                                                {errors.subjects?.[index]?.obtainedMarks && (
                                                    <p className="text-sm text-red-600 flex items-center mt-1">
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.subjects[index].obtainedMarks?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Publish Toggle */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="flex items-center h-5 mt-1">
                                        <input
                                            type="checkbox"
                                            {...register('isPublished')}
                                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-gray-900 cursor-pointer">
                                            Publish Result
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Make this result visible to the student immediately
                                        </p>
                                    </div>
                                </div>
                                <svg
                                    className="w-8 h-8 text-amber-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={addMarksMutation.isPending}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 "
                            >
                                {addMarksMutation.isPending ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
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
                                        <span className="text-white">Adding Marks...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-white">Submit All Marks</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        All fields marked with{' '}
                        <span className="text-red-500 font-semibold">*</span> are required
                    </p>
                </div>
            </div>
        </div>
    );
}