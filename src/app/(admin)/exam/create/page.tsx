'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { ExamMode, ExamType, QuestionType } from '@/constants/enums';
import AIQuestionGenerator from '@/components/exams/AIQuestionGenerator';

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

/* -------------------- STYLES -------------------- */

const baseInput =
    'w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2';

const input = (error?: boolean) =>
    `${baseInput} ${error
        ? 'border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
    }`;

const label = 'text-sm font-medium text-gray-700';
const errorText = 'text-xs text-red-600 mt-1';

/* -------------------- COMPONENT -------------------- */

export default function CreateExamPage() {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ExamFormValues>({
        mode: 'onBlur',
        defaultValues: {
            negativeMarking: false,
            questions: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions',
    });

    const onSubmit = (data: ExamFormValues) => {
        console.log('EXAM PAYLOAD 👉', data);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white rounded-2xl shadow border p-8">

                    <h1 className="text-3xl font-semibold mb-8">Create Exam</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* ---------------- EXAM DETAILS ---------------- */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4">Exam Details</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={label}>Exam Title</label>
                                    <input
                                        {...register('title', { required: 'Exam title is required' })}
                                        className={input(!!errors.title)}
                                    />
                                    <p className={errorText}>{errors.title?.message}</p>
                                </div>

                                <div>
                                    <label className={label}>Course ID</label>
                                    <input
                                        {...register('courseId', { required: 'Course ID is required' })}
                                        className={input(!!errors.courseId)}
                                    />
                                    <p className={errorText}>{errors.courseId?.message}</p>
                                </div>

                                <div>
                                    <label className={label}>Exam Date</label>
                                    <input
                                        type="date"
                                        {...register('examDate', { required: 'Exam date is required' })}
                                        className={input(!!errors.examDate)}
                                    />
                                    <p className={errorText}>{errors.examDate?.message}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={label}>Start Time</label>
                                        <input
                                            type="time"
                                            {...register('startTime', { required: 'Start time required' })}
                                            className={input(!!errors.startTime)}
                                        />
                                        <p className={errorText}>{errors.startTime?.message}</p>
                                    </div>

                                    <div>
                                        <label className={label}>End Time</label>
                                        <input
                                            type="time"
                                            {...register('endTime', { required: 'End time required' })}
                                            className={input(!!errors.endTime)}
                                        />
                                        <p className={errorText}>{errors.endTime?.message}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className={label}>Duration (minutes)</label>
                                    <input
                                        type="number"
                                        {...register('durationMinutes', {
                                            required: 'Duration required',
                                            min: { value: 1, message: 'Must be greater than 0' },
                                        })}
                                        className={input(!!errors.durationMinutes)}
                                    />
                                    <p className={errorText}>{errors.durationMinutes?.message}</p>
                                </div>

                                <div>
                                    <label className={label}>Total Marks</label>
                                    <input
                                        type="number"
                                        {...register('totalMarks', { required: 'Total marks required' })}
                                        className={input(!!errors.totalMarks)}
                                    />
                                    <p className={errorText}>{errors.totalMarks?.message}</p>
                                </div>

                                <div>
                                    <label className={label}>Pass Marks</label>
                                    <input
                                        type="number"
                                        {...register('passMarks', { required: 'Pass marks required' })}
                                        className={input(!!errors.passMarks)}
                                    />
                                    <p className={errorText}>{errors.passMarks?.message}</p>
                                </div>
                            </div>
                        </section>

                        {/* ---------------- TYPE & MODE ---------------- */}
                        <section className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className={label}>Exam Type</label>
                                <select {...register('type', { required: true })} className={input()}>
                                    {Object.values(ExamType).map(v => (
                                        <option key={v}>{v}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={label}>Exam Mode</label>
                                <select {...register('mode', { required: true })} className={input()}>
                                    {Object.values(ExamMode).map(v => (
                                        <option key={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        {/* ---------------- NEGATIVE MARKING ---------------- */}
                        <section className="bg-gray-50 border rounded-xl p-5">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" {...register('negativeMarking')} />
                                <span className="font-medium">Enable Negative Marking</span>
                            </label>

                            {watch('negativeMarking') && (
                                <div className="mt-4 max-w-xs">
                                    <label className={label}>Negative Marks / Question</label>
                                    <input
                                        type="number"
                                        {...register('negativeMarksPerQuestion', {
                                            required: 'Required',
                                            min: { value: 0, message: 'Cannot be negative' },
                                        })}
                                        className={input(!!errors.negativeMarksPerQuestion)}
                                    />
                                    <p className={errorText}>
                                        {errors.negativeMarksPerQuestion?.message}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* ---------------- AI QUESTION GENERATOR ---------------- */}
                        <AIQuestionGenerator
                            onAddQuestions={(qs) => qs.forEach(q => append(q))}
                        />


                        {/* ---------------- QUESTIONS ---------------- */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4">Questions</h2>

                            <div className="space-y-6 mb-4">
                                {fields.map((_, index) => (
                                    <QuestionBlock
                                        key={index}
                                        index={index}
                                        control={control}
                                        register={register}
                                        remove={remove}
                                        errors={errors}
                                    />
                                ))}
                            </div>

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
                                className="mt-10 px-4 py-2 rounded-lg bg-blue-50 text-blue-600"
                            >
                                + Add Question
                            </button>
                        </section>

                        {/* ---------------- SUBMIT ---------------- */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-lg bg-green-600 text-white font-medium"
                            >
                                Create Exam
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

/* -------------------- QUESTION BLOCK -------------------- */

function QuestionBlock({ index, control, register, remove, errors }: any) {
    const { fields, append, remove: removeOpt } = useFieldArray({
        control,
        name: `questions.${index}.options`,
    });

    return (
        <div className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Question {index + 1}</h3>
                <button onClick={() => remove(index)} className="text-red-600 text-sm">
                    Remove
                </button>
            </div>

            <input
                {...register(`questions.${index}.text`, {
                    required: 'Question text required',
                })}
                placeholder="Question text"
                className={input(!!errors?.questions?.[index]?.text)}
            />
            <p className={errorText}>{errors?.questions?.[index]?.text?.message}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                    type="number"
                    {...register(`questions.${index}.marks`, {
                        required: 'Marks required',
                        min: 1,
                    })}
                    placeholder="Marks"
                    className={input(!!errors?.questions?.[index]?.marks)}
                />

                <select {...register(`questions.${index}.questionType`)} className={input()}>
                    <option value="MCQ">MCQ</option>
                    <option value="TYPING">Typing</option>
                </select>
            </div>

            {/* OPTIONS */}
            <div className="mt-4">
                <p className="font-medium mb-2">Options</p>

                {fields.map((opt, i) => (
                    <div key={opt.id} className="flex gap-3 items-center mb-2">
                        <input
                            {...register(`questions.${index}.options.${i}.text`, {
                                required: 'Option required',
                            })}
                            placeholder={`Option ${i + 1}`}
                            className={input()}
                        />
                        <input type="checkbox" {...register(`questions.${index}.options.${i}.isCorrect`)} />
                        <button onClick={() => removeOpt(i)}>❌</button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => append({ text: '', isCorrect: false })}
                    className="text-sm text-blue-600 mt-2"
                >
                    + Add Option
                </button>
            </div>
        </div>
    );
}
