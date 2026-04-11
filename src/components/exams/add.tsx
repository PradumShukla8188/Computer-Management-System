// 'use client';

// import { useForm, useFieldArray } from 'react-hook-form';
// import { ExamMode, ExamType, QuestionType } from '@/constants/enums';
// import AIQuestionGenerator from '@/components/exams/AIQuestionGenerator';
// import { useQuery } from '@tanstack/react-query';
// import { ApiHitter } from '@/lib/axiosApi/apiHitter';

// /* -------------------- TYPES -------------------- */

// type OptionForm = {
//     text: string;
//     isCorrect: boolean;
// };

// type QuestionForm = {
//     questionType: QuestionType;
//     text: string;
//     marks: number;
//     options: OptionForm[];
// };

// type ExamFormValues = {
//     title: string;
//     courseId: string;
//     examDate: string;
//     startTime: string;
//     endTime: string;
//     durationMinutes: number;
//     totalMarks: number;
//     passMarks: number;
//     type: ExamType;
//     mode: ExamMode;
//     negativeMarking: boolean;
//     negativeMarksPerQuestion?: number;
//     questions: QuestionForm[];
// };

// /* -------------------- STYLES -------------------- */

// const baseInput =
//     'w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2';

// const input = (error?: boolean) =>
//     `${baseInput} ${error
//         ? 'border-red-500 focus:ring-red-200'
//         : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
//     }`;

// const label = 'text-sm font-medium text-gray-700';
// const errorText = 'text-xs text-red-600 mt-1';

// /* -------------------- COMPONENT -------------------- */

// export default function CreateExamPage() {
//     const {
//         register,
//         control,
//         handleSubmit,
//         watch,
//         formState: { errors },
//     } = useForm<ExamFormValues>({
//         mode: 'onBlur',
//         defaultValues: {
//             negativeMarking: false,
//             questions: [],
//         },
//     });

//     // Fetch Courses
//     const { data: courses = [], isLoading: coursesLoading } = useQuery({
//         queryKey: ['courses'],
//         queryFn: async () => {
//             const res = await ApiHitter('GET', 'GET_COURSE_LIST', {}, '', {
//                 showError: true,
//                 showSuccess: false,
//             });
//             return res?.data || [];
//         },
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'questions',
//     });

//     const onSubmit = (data: ExamFormValues) => {
//         console.log('EXAM PAYLOAD 👉', data);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-10">
//             <div className="max-w-6xl mx-auto px-6">
//                 <div className="bg-white rounded-2xl shadow border p-8">

//                     <h1 className="text-3xl font-semibold mb-8">Create Exam</h1>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

//                         {/* ---------------- EXAM DETAILS ---------------- */}
//                         <section>
//                             <h2 className="text-lg font-semibold mb-4">Exam Details</h2>

//                             <div className="grid md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className={label}>Exam Title</label>
//                                     <input
//                                         {...register('title', { required: 'Exam title is required' })}
//                                         className={input(!!errors.title)}
//                                     />
//                                     <p className={errorText}>{errors.title?.message}</p>
//                                 </div>

//                                 <div>
//                                     <label className={label}>Course ID</label>
//                                     <select
//                                         {...register('courseId', {
//                                             required: 'Please select a course',
//                                         })}
//                                         className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer
//                                             ? 'border-red-500'
//                                             : 'border-gray-200'
//                                             }`}
//                                         disabled={coursesLoading}
//                                     >
//                                         <option value="">
//                                             {coursesLoading ? 'Loading...' : 'Select Course'}
//                                         </option>
//                                         {courses.map((c: any) => (
//                                             <option key={c._id} value={c._id}>
//                                                 {c.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <p className={errorText}>{errors.courseId?.message}</p>
//                                 </div>

//                                 <div>
//                                     <label className={label}>Exam Date</label>
//                                     <input
//                                         type="date"
//                                         {...register('examDate', { required: 'Exam date is required' })}
//                                         className={input(!!errors.examDate)}
//                                     />
//                                     <p className={errorText}>{errors.examDate?.message}</p>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className={label}>Start Time</label>
//                                         <input
//                                             type="time"
//                                             {...register('startTime', { required: 'Start time required' })}
//                                             className={input(!!errors.startTime)}
//                                         />
//                                         <p className={errorText}>{errors.startTime?.message}</p>
//                                     </div>

//                                     <div>
//                                         <label className={label}>End Time</label>
//                                         <input
//                                             type="time"
//                                             {...register('endTime', { required: 'End time required' })}
//                                             className={input(!!errors.endTime)}
//                                         />
//                                         <p className={errorText}>{errors.endTime?.message}</p>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className={label}>Duration (minutes)</label>
//                                     <input
//                                         type="number"
//                                         {...register('durationMinutes', {
//                                             required: 'Duration required',
//                                             min: { value: 1, message: 'Must be greater than 0' },
//                                         })}
//                                         className={input(!!errors.durationMinutes)}
//                                     />
//                                     <p className={errorText}>{errors.durationMinutes?.message}</p>
//                                 </div>

//                                 <div>
//                                     <label className={label}>Total Marks</label>
//                                     <input
//                                         type="number"
//                                         {...register('totalMarks', { required: 'Total marks required' })}
//                                         className={input(!!errors.totalMarks)}
//                                     />
//                                     <p className={errorText}>{errors.totalMarks?.message}</p>
//                                 </div>

//                                 <div>
//                                     <label className={label}>Pass Marks</label>
//                                     <input
//                                         type="number"
//                                         {...register('passMarks', { required: 'Pass marks required' })}
//                                         className={input(!!errors.passMarks)}
//                                     />
//                                     <p className={errorText}>{errors.passMarks?.message}</p>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* ---------------- TYPE & MODE ---------------- */}
//                         <section className="grid md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className={label}>Exam Type</label>
//                                 <select {...register('type', { required: true })} className={input()}>
//                                     {Object.values(ExamType).map(v => (
//                                         <option key={v}>{v}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className={label}>Exam Mode</label>
//                                 <select {...register('mode', { required: true })} className={input()}>
//                                     {Object.values(ExamMode).map(v => (
//                                         <option key={v}>{v}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </section>

//                         {/* ---------------- NEGATIVE MARKING ---------------- */}
//                         <section className="bg-gray-50 border rounded-xl p-5">
//                             <label className="flex items-center gap-3">
//                                 <input type="checkbox" {...register('negativeMarking')} />
//                                 <span className="font-medium">Enable Negative Marking</span>
//                             </label>

//                             {watch('negativeMarking') && (
//                                 <div className="mt-4 max-w-xs">
//                                     <label className={label}>Negative Marks / Question</label>
//                                     <input
//                                         type="number"
//                                         {...register('negativeMarksPerQuestion', {
//                                             required: 'Required',
//                                             min: { value: 0, message: 'Cannot be negative' },
//                                         })}
//                                         className={input(!!errors.negativeMarksPerQuestion)}
//                                     />
//                                     <p className={errorText}>
//                                         {errors.negativeMarksPerQuestion?.message}
//                                     </p>
//                                 </div>
//                             )}
//                         </section>

//                         {/* ---------------- AI QUESTION GENERATOR ---------------- */}
//                         <AIQuestionGenerator
//                             onAddQuestions={(qs) => qs.forEach(q => append(q))}
//                         />


//                         {/* ---------------- QUESTIONS ---------------- */}
//                         <section>
//                             <h2 className="text-lg font-semibold mb-4">Questions</h2>

//                             <div className="space-y-6 mb-4">
//                                 {fields.map((_, index) => (
//                                     <QuestionBlock
//                                         key={index}
//                                         index={index}
//                                         control={control}
//                                         register={register}
//                                         remove={remove}
//                                         errors={errors}
//                                     />
//                                 ))}
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={() =>
//                                     append({
//                                         questionType: QuestionType.MCQ,
//                                         text: '',
//                                         marks: 1,
//                                         options: [],
//                                     })
//                                 }
//                                 className="mt-10 px-4 py-2 rounded-lg bg-blue-50 text-blue-600"
//                             >
//                                 + Add Question
//                             </button>
//                         </section>

//                         {/* ---------------- SUBMIT ---------------- */}
//                         <div className="flex justify-end">
//                             <button
//                                 type="submit"
//                                 className="px-8 py-3 rounded-lg bg-green-600 text-white font-medium"
//                             >
//                                 Create Exam
//                             </button>
//                         </div>

//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* -------------------- QUESTION BLOCK -------------------- */

// function QuestionBlock({ index, control, register, remove, errors }: any) {
//     const { fields, append, remove: removeOpt } = useFieldArray({
//         control,
//         name: `questions.${index}.options`,
//     });

//     return (
//         <div className="border rounded-xl p-6 bg-white shadow-sm">
//             <div className="flex justify-between mb-4">
//                 <h3 className="font-semibold">Question {index + 1}</h3>
//                 <button onClick={() => remove(index)} className="text-red-600 text-sm">
//                     Remove
//                 </button>
//             </div>

//             <input
//                 {...register(`questions.${index}.text`, {
//                     required: 'Question text required',
//                 })}
//                 placeholder="Question text"
//                 className={input(!!errors?.questions?.[index]?.text)}
//             />
//             <p className={errorText}>{errors?.questions?.[index]?.text?.message}</p>

//             <div className="grid grid-cols-2 gap-4 mt-4">
//                 <input
//                     type="number"
//                     {...register(`questions.${index}.marks`, {
//                         required: 'Marks required',
//                         min: 1,
//                     })}
//                     placeholder="Marks"
//                     className={input(!!errors?.questions?.[index]?.marks)}
//                 />

//                 <select {...register(`questions.${index}.questionType`)} className={input()}>
//                     <option value="MCQ">MCQ</option>
//                     <option value="TYPING">Typing</option>
//                 </select>
//             </div>

//             {/* OPTIONS */}
//             <div className="mt-4">
//                 <p className="font-medium mb-2">Options</p>

//                 {fields.map((opt, i) => (
//                     <div key={opt.id} className="flex gap-3 items-center mb-2">
//                         <input
//                             {...register(`questions.${index}.options.${i}.text`, {
//                                 required: 'Option required',
//                             })}
//                             placeholder={`Option ${i + 1}`}
//                             className={input()}
//                         />
//                         <input type="checkbox" {...register(`questions.${index}.options.${i}.isCorrect`)} />
//                         <button onClick={() => removeOpt(i)}>❌</button>
//                     </div>
//                 ))}

//                 <button
//                     type="button"
//                     onClick={() => append({ text: '', isCorrect: false })}
//                     className="text-sm text-blue-600 mt-2"
//                 >
//                     + Add Option
//                 </button>
//             </div>
//         </div>
//     );
// }

// 'use client';

// import { useForm, useFieldArray } from 'react-hook-form';
// import { ExamMode, ExamType, QuestionType } from '@/constants/enums';
// import AIQuestionGenerator from '@/components/exams/AIQuestionGenerator';
// import { useQuery } from '@tanstack/react-query';
// import { ApiHitter } from '@/lib/axiosApi/apiHitter';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useState } from 'react';
// import { Calendar, Clock, BookOpen, Award, TrendingDown, Plus, Trash2, Check } from 'lucide-react';

// /* -------------------- TYPES -------------------- */

// type OptionForm = {
//     text: string;
//     isCorrect: boolean;
// };

// type QuestionForm = {
//     questionType: QuestionType;
//     text: string;
//     marks: number;
//     options: OptionForm[];
// };

// type ExamFormValues = {
//     title: string;
//     courseId: string;
//     examDate: string;
//     startTime: string;
//     endTime: string;
//     durationMinutes: number;
//     totalMarks: number;
//     passMarks: number;
//     type: ExamType;
//     mode: ExamMode;
//     negativeMarking: boolean;
//     negativeMarksPerQuestion?: number;
//     questions: QuestionForm[];
// };

// /* -------------------- COMPONENT -------------------- */

// export default function CreateExamPage() {
//     const [examDate, setExamDate] = useState<Date | null>(null);

//     const {
//         register,
//         control,
//         handleSubmit,
//         watch,
//         setValue,
//         formState: { errors },
//     } = useForm<ExamFormValues>({
//         mode: 'onBlur',
//         defaultValues: {
//             negativeMarking: false,
//             questions: [],
//             type: ExamType.INTERNAL,
//             mode: ExamMode.OBJECTIVE,
//         },
//     });

//     // Fetch Courses
//     const { data: courses = [], isLoading: coursesLoading } = useQuery({
//         queryKey: ['courses'],
//         queryFn: async () => {
//             const res = await ApiHitter('GET', 'GET_COURSE_LIST', {}, '', {
//                 showError: true,
//                 showSuccess: false,
//             });
//             return res?.data || [];
//         },
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'questions',
//     });

//     const onSubmit = (data: ExamFormValues) => {
//         console.log('EXAM PAYLOAD 👉', data);
//     };

//     const handleDateChange = (date: Date | null) => {
//         setExamDate(date);
//         if (date) {
//             setValue('examDate', date.toISOString().split('T')[0]);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
//                         Create New Exam
//                     </h1>
//                     <p className="text-gray-600">Fill in the details to create a comprehensive exam</p>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

//                     {/* ---------------- EXAM DETAILS CARD ---------------- */}
//                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//                         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-5">
//                             <div className="flex items-center gap-3">
//                                 <BookOpen className="text-white" size={24} />
//                                 <h2 className="text-xl font-semibold text-white">Exam Details</h2>
//                             </div>
//                         </div>

//                         <div className="p-8">
//                             <div className="grid md:grid-cols-2 gap-6">
//                                 {/* Exam Title */}
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Exam Title *
//                                     </label>
//                                     <input
//                                         {...register('title', {
//                                             required: 'Exam title is required',
//                                             minLength: { value: 3, message: 'Title must be at least 3 characters' }
//                                         })}
//                                         placeholder="e.g., Mid-Term Mathematics Exam"
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.title
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     {errors.title && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.title.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Course Selection */}
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Select Course *
//                                     </label>
//                                     <div className="relative">
//                                         <select
//                                             {...register('courseId', {
//                                                 required: 'Please select a course',
//                                             })}
//                                             className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white ${errors.courseId
//                                                 ? 'border-red-500 focus:border-red-500'
//                                                 : 'border-gray-200 focus:border-blue-500'
//                                                 }`}
//                                             disabled={coursesLoading}
//                                         >
//                                             <option value="">
//                                                 {coursesLoading ? 'Loading courses...' : 'Choose a course'}
//                                             </option>
//                                             {courses.map((c: any) => (
//                                                 <option key={c._id} value={c._id}>
//                                                     {c.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                     {errors.courseId && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.courseId.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Exam Date with DatePicker */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                                         <Calendar size={16} className="text-blue-500" />
//                                         Exam Date *
//                                     </label>
//                                     <DatePicker
//                                         selected={examDate}
//                                         onChange={handleDateChange}
//                                         minDate={new Date()}
//                                         dateFormat="MMMM d, yyyy"
//                                         placeholderText="Select exam date"
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.examDate
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     <input
//                                         type="hidden"
//                                         {...register('examDate', { required: 'Exam date is required' })}
//                                     />
//                                     {errors.examDate && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.examDate.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Duration */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                                         <Clock size={16} className="text-blue-500" />
//                                         Duration (minutes) *
//                                     </label>
//                                     <input
//                                         type="number"
//                                         {...register('durationMinutes', {
//                                             required: 'Duration is required',
//                                             min: { value: 1, message: 'Must be at least 1 minute' },
//                                             max: { value: 480, message: 'Cannot exceed 8 hours' }
//                                         })}
//                                         placeholder="e.g., 120"
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.durationMinutes
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     {errors.durationMinutes && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.durationMinutes.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Start Time */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Start Time *
//                                     </label>
//                                     <input
//                                         type="time"
//                                         {...register('startTime', { required: 'Start time is required' })}
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.startTime
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     {errors.startTime && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.startTime.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* End Time */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         End Time *
//                                     </label>
//                                     <input
//                                         type="time"
//                                         {...register('endTime', { required: 'End time is required' })}
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.endTime
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     {errors.endTime && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.endTime.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Total Marks */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                                         <Award size={16} className="text-blue-500" />
//                                         Total Marks *
//                                     </label>
//                                     <input
//                                         type="number"
//                                         {...register('totalMarks', {
//                                             required: 'Total marks is required',
//                                             min: { value: 1, message: 'Must be at least 1' }
//                                         })}
//                                         placeholder="e.g., 100"
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.totalMarks
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     {errors.totalMarks && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.totalMarks.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Pass Marks */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Pass Marks *
//                                     </label>
//                                     <input
//                                         type="number"
//                                         {...register('passMarks', {
//                                             required: 'Pass marks is required',
//                                             min: { value: 1, message: 'Must be at least 1' },
//                                             validate: (value) => {
//                                                 const totalMarks = watch('totalMarks');
//                                                 return !totalMarks || value <= totalMarks || 'Cannot exceed total marks';
//                                             }
//                                         })}
//                                         placeholder="e.g., 40"
//                                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.passMarks
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-gray-200 focus:border-blue-500'
//                                             }`}
//                                     />
//                                     {errors.passMarks && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.passMarks.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Exam Type */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Exam Type *
//                                     </label>
//                                     <div className="relative">
//                                         <select
//                                             {...register('type', { required: true })}
//                                             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white"
//                                         >
//                                             {Object.values(ExamType).map(v => (
//                                                 <option key={v} value={v}>{v}</option>
//                                             ))}
//                                         </select>
//                                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Exam Mode */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Exam Mode *
//                                     </label>
//                                     <div className="relative">
//                                         <select
//                                             {...register('mode', { required: true })}
//                                             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white"
//                                         >
//                                             {Object.values(ExamMode).map(v => (
//                                                 <option key={v} value={v}>{v}</option>
//                                             ))}
//                                         </select>
//                                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* ---------------- NEGATIVE MARKING CARD ---------------- */}
//                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//                         <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-5">
//                             <div className="flex items-center gap-3">
//                                 <TrendingDown className="text-white" size={24} />
//                                 <h2 className="text-xl font-semibold text-white">Negative Marking</h2>
//                             </div>
//                         </div>

//                         <div className="p-8">
//                             <label className="flex items-center gap-4 cursor-pointer group">
//                                 <div className="relative">
//                                     <input
//                                         type="checkbox"
//                                         {...register('negativeMarking')}
//                                         className="sr-only peer"
//                                     />
//                                     <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
//                                     <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-md"></div>
//                                 </div>
//                                 <div>
//                                     <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
//                                         Enable Negative Marking
//                                     </span>
//                                     <p className="text-sm text-gray-500">Deduct marks for incorrect answers</p>
//                                 </div>
//                             </label>

//                             {watch('negativeMarking') && (
//                                 <div className="mt-6 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Negative Marks per Question *
//                                     </label>
//                                     <input
//                                         type="number"
//                                         step="0.25"
//                                         {...register('negativeMarksPerQuestion', {
//                                             required: 'This field is required when negative marking is enabled',
//                                             min: { value: 0, message: 'Cannot be negative' },
//                                         })}
//                                         placeholder="e.g., 0.25"
//                                         className={`w-full max-w-xs px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-orange-100 outline-none ${errors.negativeMarksPerQuestion
//                                             ? 'border-red-500 focus:border-red-500'
//                                             : 'border-orange-200 focus:border-orange-500'
//                                             }`}
//                                     />
//                                     {errors.negativeMarksPerQuestion && (
//                                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                                             <span className="font-medium">⚠</span> {errors.negativeMarksPerQuestion.message}
//                                         </p>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* ---------------- AI QUESTION GENERATOR ---------------- */}
//                     <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8">
//                         <AIQuestionGenerator
//                             onAddQuestions={(qs) => qs.forEach(q => append(q))}
//                         />
//                     </div>

//                     {/* ---------------- QUESTIONS CARD ---------------- */}
//                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//                         <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-5">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                     </svg>
//                                     <h2 className="text-xl font-semibold text-white">Questions</h2>
//                                 </div>
//                                 <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white font-semibold">
//                                     {fields.length} {fields.length === 1 ? 'Question' : 'Questions'}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="p-8">
//                             {fields.length === 0 ? (
//                                 <div className="text-center py-12">
//                                     <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                         </svg>
//                                     </div>
//                                     <p className="text-gray-500 mb-4">No questions added yet</p>
//                                     <p className="text-sm text-gray-400">Click the button below to add your first question</p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-6">
//                                     {fields.map((_, index) => (
//                                         <QuestionBlock
//                                             key={index}
//                                             index={index}
//                                             control={control}
//                                             register={register}
//                                             remove={remove}
//                                             errors={errors}
//                                         />
//                                     ))}
//                                 </div>
//                             )}

//                             <button
//                                 type="button"
//                                 onClick={() =>
//                                     append({
//                                         questionType: QuestionType.MCQ,
//                                         text: '',
//                                         marks: 1,
//                                         options: [],
//                                     })
//                                 }
//                                 className="mt-6 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 text-green-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
//                             >
//                                 <Plus className="group-hover:scale-110 transition-transform" size={20} />
//                                 Add New Question
//                             </button>
//                         </div>
//                     </div>

//                     {/* ---------------- SUBMIT BUTTON ---------------- */}
//                     <div className="flex justify-end gap-4">
//                         <button
//                             type="button"
//                             className="px-8 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
//                         >
//                             <Check size={20} />
//                             Create Exam
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// /* -------------------- QUESTION BLOCK -------------------- */

// function QuestionBlock({ index, control, register, remove, errors }: any) {
//     const { fields, append, remove: removeOpt } = useFieldArray({
//         control,
//         name: `questions.${index}.options`,
//     });

//     return (
//         <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
//             <div className="flex justify-between items-start mb-5">
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
//                         {index + 1}
//                     </div>
//                     <h3 className="font-semibold text-lg text-gray-800">Question {index + 1}</h3>
//                 </div>
//                 <button
//                     type="button"
//                     onClick={() => remove(index)}
//                     className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200 group"
//                     title="Remove question"
//                 >
//                     <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
//                 </button>
//             </div>

//             {/* Question Text */}
//             <div className="mb-5">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Question Text *
//                 </label>
//                 <textarea
//                     {...register(`questions.${index}.text`, {
//                         required: 'Question text is required',
//                         minLength: { value: 10, message: 'Question must be at least 10 characters' }
//                     })}
//                     placeholder="Enter your question here..."
//                     rows={3}
//                     className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none ${errors?.questions?.[index]?.text
//                         ? 'border-red-500 focus:border-red-500'
//                         : 'border-gray-200 focus:border-blue-500'
//                         }`}
//                 />
//                 {errors?.questions?.[index]?.text && (
//                     <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                         <span className="font-medium">⚠</span> {errors.questions[index].text.message}
//                     </p>
//                 )}
//             </div>

//             {/* Marks and Type */}
//             <div className="grid grid-cols-2 gap-4 mb-5">
//                 <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Marks *
//                     </label>
//                     <input
//                         type="number"
//                         {...register(`questions.${index}.marks`, {
//                             required: 'Marks are required',
//                             min: { value: 1, message: 'Minimum 1 mark' },
//                         })}
//                         placeholder="e.g., 5"
//                         className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors?.questions?.[index]?.marks
//                             ? 'border-red-500 focus:border-red-500'
//                             : 'border-gray-200 focus:border-blue-500'
//                             }`}
//                     />
//                     {errors?.questions?.[index]?.marks && (
//                         <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
//                             <span className="font-medium">⚠</span> {errors.questions[index].marks.message}
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Question Type *
//                     </label>
//                     <div className="relative">
//                         <select
//                             {...register(`questions.${index}.questionType`)}
//                             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white"
//                         >
//                             <option value="MCQ">Multiple Choice (MCQ)</option>
//                             <option value="TYPING">Typing Answer</option>
//                         </select>
//                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* OPTIONS */}
//             <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
//                 <div className="flex items-center justify-between mb-4">
//                     <p className="font-semibold text-gray-800">Answer Options</p>
//                     <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
//                         {fields.length} {fields.length === 1 ? 'option' : 'options'}
//                     </span>
//                 </div>

//                 {fields.length === 0 ? (
//                     <div className="text-center py-6 text-gray-500 text-sm">
//                         No options added yet. Click below to add options.
//                     </div>
//                 ) : (
//                     <div className="space-y-3 mb-4">
//                         {fields.map((opt, i) => (
//                             <div key={opt.id} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group">
//                                 <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center font-semibold text-blue-700 text-sm mt-1">
//                                     {String.fromCharCode(65 + i)}
//                                 </div>
//                                 <input
//                                     {...register(`questions.${index}.options.${i}.text`, {
//                                         required: 'Option text is required',
//                                     })}
//                                     placeholder={`Option ${String.fromCharCode(65 + i)}`}
//                                     className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
//                                 />
//                                 <label className="flex items-center gap-2 cursor-pointer flex-shrink-0" title="Mark as correct">
//                                     <input
//                                         type="checkbox"
//                                         {...register(`questions.${index}.options.${i}.isCorrect`)}
//                                         className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
//                                     />
//                                     <span className="text-xs text-gray-600 font-medium">Correct</span>
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={() => removeOpt(i)}
//                                     className="flex-shrink-0 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors opacity-0 group-hover:opacity-100"
//                                     title="Remove option"
//                                 >
//                                     <Trash2 size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 <button
//                     type="button"
//                     onClick={() => append({ text: '', isCorrect: false })}
//                     className="w-full px-4 py-3 rounded-lg bg-white hover:bg-blue-50 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-600 font-medium transition-all duration-200 flex items-center justify-center gap-2"
//                 >
//                     <Plus size={18} />
//                     Add Option
//                 </button>
//             </div>
//         </div>
//     );
// }


'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { ExamMode, ExamType, QuestionType } from '@/constants/enums';
import AIQuestionGenerator from '@/components/exams/AIQuestionGenerator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiHitter } from '@/lib/axiosApi/apiHitter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { Calendar, Clock, BookOpen, Award, TrendingDown, Plus, Trash2, Check, Timer, CheckSquare } from 'lucide-react';
import { toast } from '@/lib/toast';

/* -------------------- TYPES -------------------- */

type OptionForm = {
    text: string;
    isCorrect: boolean;
};

type QuestionForm = {
    questionType: QuestionType;
    text: string;
    marks: number;
    options: OptionForm[];
    selected?: boolean;
};

type ExamFormValues = {
    title: string;
    courseId: string;
    examDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    totalMarks: number;
    passMarks: number;
    type: ExamType;
    mode: ExamMode;
    negativeMarking: boolean;
    negativeMarksPerQuestion?: number;
    questions: QuestionForm[];
};

/* -------------------- COMPONENT -------------------- */

export default function CreateExamPage() {
    const [examDate, setExamDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
    const [isAllSelected, setIsAllSelected] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ExamFormValues>({
        mode: 'onBlur',
        defaultValues: {
            negativeMarking: false,
            questions: [],
            type: ExamType.INTERNAL,
            mode: ExamMode.OBJECTIVE,
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions',
    });

    const addExamMutation = useMutation({
        mutationFn: async (formData: ExamFormValues) => {
            const res = await ApiHitter(
                'POST',
                'ADD_EXAM',
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
            reset();
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                'Failed to add marks. Please try again.';

            toast.error(message);
        },
    });


    const onSubmit = (data: ExamFormValues) => {
        console.log('EXAM PAYLOAD 👉', data);
        addExamMutation.mutate(data);
    };

    const handleDateChange = (date: Date | null) => {
        setExamDate(date);
        if (date) {
            setValue('examDate', date.toISOString().split('T')[0]);
        }
    };

    const handleStartTimeChange = (time: Date | null) => {
        setStartTime(time);
        if (time) {
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            setValue('startTime', `${hours}:${minutes}`);
        }
    };

    const handleEndTimeChange = (time: Date | null) => {
        setEndTime(time);
        if (time) {
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            setValue('endTime', `${hours}:${minutes}`);
        }
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all
            setSelectedQuestions(new Set());
            setIsAllSelected(false);
        } else {
            // Select all
            const allIndices = new Set(fields.map((_, index) => index));
            setSelectedQuestions(allIndices);
            setIsAllSelected(true);
        }
    };

    const handleQuestionSelect = (index: number) => {
        const newSelected = new Set(selectedQuestions);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedQuestions(newSelected);
        setIsAllSelected(newSelected.size === fields.length);
    };

    const handleAddAIQuestions = (questions: QuestionForm[]) => {
        questions.forEach(q => append(q));
        // Auto-select newly added questions
        const startIndex = fields.length;
        const newSelected = new Set(selectedQuestions);
        questions.forEach((_, i) => {
            newSelected.add(startIndex + i);
        });
        setSelectedQuestions(newSelected);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Create New Exam
                    </h1>
                    <p className="text-gray-600">Fill in the details to create a comprehensive exam</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* ---------------- EXAM DETAILS CARD ---------------- */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-5">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-white" size={24} />
                                <h2 className="text-xl font-semibold text-white">Exam Details</h2>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Exam Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Exam Title *
                                    </label>
                                    <input
                                        {...register('title', {
                                            required: 'Exam title is required',
                                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                        })}
                                        placeholder="e.g., Mid-Term Mathematics Exam"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.title
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    {errors.title && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                {/* Exam Date with DatePicker */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar size={16} className="text-blue-500" />
                                        Exam Date *
                                    </label>
                                    <DatePicker
                                        selected={examDate}
                                        onChange={handleDateChange}
                                        minDate={new Date()}
                                        dateFormat="MMMM d, yyyy"
                                        placeholderText="Select exam date"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.examDate
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    <input
                                        type="hidden"
                                        {...register('examDate', { required: 'Exam date is required' })}
                                    />
                                    {errors.examDate && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.examDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* Course Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Select Course *
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('courseId', {
                                                required: 'Please select a course',
                                            })}
                                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white ${errors.courseId
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                            disabled={coursesLoading}
                                        >
                                            <option value="">
                                                {coursesLoading ? 'Loading courses...' : 'Choose a course'}
                                            </option>
                                            {courses.map((c: any) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.courseId && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.courseId.message}
                                        </p>
                                    )}
                                </div>

                                {/* Start Time Picker */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Timer size={16} className="text-blue-500" />
                                        Start Time *
                                    </label>
                                    <DatePicker
                                        selected={startTime}
                                        onChange={handleStartTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        placeholderText="Select start time"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.startTime
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    <input
                                        type="hidden"
                                        {...register('startTime', { required: 'Start time is required' })}
                                    />
                                    {errors.startTime && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.startTime.message}
                                        </p>
                                    )}
                                </div>

                                {/* End Time Picker */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Timer size={16} className="text-blue-500" />
                                        End Time *
                                    </label>
                                    <DatePicker
                                        selected={endTime}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        placeholderText="Select end time"
                                        minTime={startTime || undefined}
                                        maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.endTime
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    <input
                                        type="hidden"
                                        {...register('endTime', { required: 'End time is required' })}
                                    />
                                    {errors.endTime && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.endTime.message}
                                        </p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Clock size={16} className="text-blue-500" />
                                        Duration (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        {...register('durationMinutes', {
                                            required: 'Duration is required',
                                            min: { value: 1, message: 'Must be at least 1 minute' },
                                            max: { value: 480, message: 'Cannot exceed 8 hours' }
                                        })}
                                        placeholder="e.g., 120"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.durationMinutes
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    {errors.durationMinutes && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.durationMinutes.message}
                                        </p>
                                    )}
                                </div>

                                {/* Total Marks */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Award size={16} className="text-blue-500" />
                                        Total Marks *
                                    </label>
                                    <input
                                        type="number"
                                        {...register('totalMarks', {
                                            required: 'Total marks is required',
                                            min: { value: 1, message: 'Must be at least 1' }
                                        })}
                                        placeholder="e.g., 100"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.totalMarks
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    {errors.totalMarks && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.totalMarks.message}
                                        </p>
                                    )}
                                </div>

                                {/* Pass Marks */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Pass Marks *
                                    </label>
                                    <input
                                        type="number"
                                        {...register('passMarks', {
                                            required: 'Pass marks is required',
                                            min: { value: 1, message: 'Must be at least 1' },
                                            validate: (value) => {
                                                const totalMarks = watch('totalMarks');
                                                return !totalMarks || value >= totalMarks || 'Cannot exceed total marks';
                                            }
                                        })}
                                        placeholder="e.g., 40"
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors.passMarks
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                    />
                                    {errors.passMarks && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.passMarks.message}
                                        </p>
                                    )}
                                </div>

                                {/* Exam Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Exam Type *
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('type', { required: true })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white"
                                        >
                                            {Object.values(ExamType).map(v => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Exam Mode */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Exam Mode *
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('mode', { required: true })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white"
                                        >
                                            {Object.values(ExamMode).map(v => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------------- NEGATIVE MARKING CARD ---------------- */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-5">
                            <div className="flex items-center gap-3">
                                <TrendingDown className="text-white" size={24} />
                                <h2 className="text-xl font-semibold text-white">Negative Marking</h2>
                            </div>
                        </div>

                        <div className="p-8">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register('negativeMarking')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-md"></div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        Enable Negative Marking
                                    </span>
                                    <p className="text-sm text-gray-500">Deduct marks for incorrect answers</p>
                                </div>
                            </label>

                            {watch('negativeMarking') && (
                                <div className="mt-6 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Negative Marks per Question *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        {...register('negativeMarksPerQuestion', {
                                            required: 'This field is required when negative marking is enabled',
                                            min: { value: 0, message: 'Cannot be negative' },
                                        })}
                                        placeholder="e.g., 0.25"
                                        className={`w-full max-w-xs px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-orange-100 outline-none ${errors.negativeMarksPerQuestion
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-orange-200 focus:border-orange-500'
                                            }`}
                                    />
                                    {errors.negativeMarksPerQuestion && (
                                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.negativeMarksPerQuestion.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ---------------- AI QUESTION GENERATOR ---------------- */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8">
                        <AIQuestionGenerator
                            onAddQuestions={handleAddAIQuestions}
                        />
                    </div>

                    {/* ---------------- QUESTIONS CARD ---------------- */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h2 className="text-xl font-semibold text-white">Questions</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white font-semibold">
                                        {fields.length} {fields.length === 1 ? 'Question' : 'Questions'}
                                    </span>
                                    {fields.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-medium transition-all duration-200"
                                        >
                                            <CheckSquare size={18} />
                                            {isAllSelected ? 'Deselect All' : 'Select All'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {fields.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 mb-4">No questions added yet</p>
                                    <p className="text-sm text-gray-400">Click the button below to add your first question</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {fields.map((_, index) => (
                                        <QuestionBlock
                                            key={index}
                                            index={index}
                                            control={control}
                                            register={register}
                                            remove={remove}
                                            errors={errors}
                                            isSelected={selectedQuestions.has(index)}
                                            onSelect={() => handleQuestionSelect(index)}
                                        />
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        questionType: QuestionType.MCQ,
                                        text: '',
                                        marks: 1,
                                        options: [],
                                    })
                                }
                                className="mt-6 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 text-green-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <Plus className="group-hover:scale-110 transition-transform" size={20} />
                                Add New Question
                            </button>
                        </div>
                    </div>

                    {/* ---------------- SUBMIT BUTTON ---------------- */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-8 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <Check size={20} />
                            Create Exam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* -------------------- QUESTION BLOCK -------------------- */

function QuestionBlock({ index, control, register, remove, errors, isSelected, onSelect }: any) {
    const { fields, append, remove: removeOpt } = useFieldArray({
        control,
        name: `questions.${index}.options`,
    });

    return (
        <div className={`border-2 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 transition-all duration-200 shadow-sm hover:shadow-md ${isSelected ? 'border-green-400 ring-4 ring-green-100' : 'border-gray-200 hover:border-blue-300'
            }`}>
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Question {index + 1}</h3>
                </div>
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200 group"
                    title="Remove question"
                >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Question Text */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question Text *
                </label>
                <textarea
                    {...register(`questions.${index}.text`, {
                        required: 'Question text is required',
                        minLength: { value: 10, message: 'Question must be at least 10 characters' }
                    })}
                    placeholder="Enter your question here..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none ${errors?.questions?.[index]?.text
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                        }`}
                />
                {errors?.questions?.[index]?.text && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <span className="font-medium">⚠</span> {errors.questions[index].text.message}
                    </p>
                )}
            </div>

            {/* Marks and Type */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Marks *
                    </label>
                    <input
                        type="number"
                        {...register(`questions.${index}.marks`, {
                            required: 'Marks are required',
                            min: { value: 1, message: 'Minimum 1 mark' },
                        })}
                        placeholder="e.g., 5"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none ${errors?.questions?.[index]?.marks
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500'
                            }`}
                    />
                    {errors?.questions?.[index]?.marks && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                            <span className="font-medium">⚠</span> {errors.questions[index].marks.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Question Type *
                    </label>
                    <div className="relative">
                        <select
                            {...register(`questions.${index}.questionType`)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer bg-white"
                        >
                            <option value="MCQ">Multiple Choice (MCQ)</option>
                            <option value="TYPING">Typing Answer</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* OPTIONS */}
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-gray-800">Answer Options</p>
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                        {fields.length} {fields.length === 1 ? 'option' : 'options'}
                    </span>
                </div>

                {fields.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        No options added yet. Click below to add options.
                    </div>
                ) : (
                    <div className="space-y-3 mb-4">
                        {fields.map((opt, i) => (
                            <div key={opt.id} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center font-semibold text-blue-700 text-sm mt-1">
                                    {String.fromCharCode(65 + i)}
                                </div>
                                <input
                                    {...register(`questions.${index}.options.${i}.text`, {
                                        required: 'Option text is required',
                                    })}
                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0" title="Mark as correct">
                                    <input
                                        type="checkbox"
                                        {...register(`questions.${index}.options.${i}.isCorrect`)}
                                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-600 font-medium">Correct</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeOpt(i)}
                                    className="flex-shrink-0 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove option"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => append({ text: '', isCorrect: false })}
                    className="w-full px-4 py-3 rounded-lg bg-white hover:bg-blue-50 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-600 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Add Option
                </button>
            </div>
        </div>
    );
}