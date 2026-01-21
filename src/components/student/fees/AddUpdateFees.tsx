"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

import axios from "axios";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { Card } from "antd";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

const Select = dynamic(() => import("react-select"), { ssr: false });

type StudentOption = {
    label: string;
    value: string;
    fatherName: string;
    rollNo: string;
};

type CourseOption = {
    label: string;
    value: string;
    amount: number;
};

type FeesFormData = {
    student?: StudentOption | null;
    fatherName?: string;
    rollNo?: string;
    studentId?: string | null;
    course?: CourseOption | null;
    courseId?: string | null; // ✅ FIXED
    amount: number;
};



type Props = {
    initialData?: FeesFormData; // pass this for update
    isUpdate?: boolean;
    studentId?: string | null;
};

export default function StudentFeesForm({
    initialData,
    isUpdate = false,
    studentId = null,

}: Props) {

    const router = useRouter();

    const { data: studentData } = useQuery({
        queryKey: ["student-details", studentId],
        queryFn: async () => {
            if (studentId) {
                const res = await ApiHitter("GET", "GET_STUDENT_FEES_BY_ID", {}, studentId, { showError: true });
                return res.data;
            }
            return null;
        },
        enabled: !!studentId,
    });



    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FeesFormData>({
        defaultValues: initialData || {
            student: null,
            fatherName: "",
            rollNo: "",
            studentId: null,
            course: null,
            courseId: null,
            amount: 0,
        },
    });

    /* ---------------- Fetch students for dropdown ---------------- */
    const results = useQueries({
        queries: [
            {
                queryKey: ["students"],
                queryFn: async () => {
                    const resApiHitter = await ApiHitter(
                        "GET",
                        "GET_STUDENT_LIST",
                        {},
                        "",
                        { showError: true }
                    );

                    return resApiHitter.data.map((student: any) => ({
                        label: student?.name,
                        value: student?._id,
                        fatherName: student?.fatherName,
                        rollNo: student?.rollNo,
                    }));
                },
            },
            {
                queryKey: ["courses"],
                queryFn: async () => {
                    const response = await ApiHitter(
                        "GET",
                        "GET_COURSE_LIST",
                        {},
                        "",
                        {
                            showError: true,
                            showSuccess: false,
                        }
                    );

                    return response?.data?.map((course: any) => ({
                        label: course?.name,
                        value: course?._id,
                        amount: Number(course?.monthlyFees),
                    }));;
                },
            },
        ],
    });
    const isLoading = results.some((result: any) => result.isLoading);

    const [studentsQuery, coursesQuery] = results;

    const students = studentsQuery.data ?? [];
    const courses = coursesQuery.data ?? [];


    /* ---------------- Add / Update fees ---------------- */
    const feesMutation = useMutation({
        mutationFn: async (data: FeesFormData) => {




            if (studentId) {
                const payload = {
                    _id: studentId,
                    studentId: data?.studentId,
                    userId: data?.studentId,
                    courseId: data?.courseId,
                    amount: data?.amount,
                };
                return await ApiHitter("PATCH", "UPDATE_STUDENT_FEES", payload, "");
            } else {
                const payload = {
                    studentId: data?.studentId,
                    userId: data?.studentId,
                    courseId: data?.courseId,
                    amount: data?.amount,
                };
                return await ApiHitter("POST", "ADD_STUDENT_FEES", payload, "");
            }
        },
        onSuccess: () => {
            alert(isUpdate ? "Fees updated successfully" : "Fees added successfully");
            reset();
            router.push("/student-fees");
        },
    });

    /* ---------------- Submit ---------------- */
    const onSubmit = (data: FeesFormData) => {
        console.log("Form Data Submitted:", data);
        feesMutation.mutate(data);
    };

    const handleCourseChange = (selectedCourse: CourseOption | null) => {
        console.log("Selected course:", selectedCourse);
        setValue("course", selectedCourse, {
            shouldValidate: true,
            shouldDirty: true,
        });
        if (selectedCourse) {
            setValue("amount", selectedCourse?.amount, {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue("courseId", selectedCourse?.value, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }
    const handleStudentChange = (selectedStudent: StudentOption | null) => {
        console.log("Selected student:", selectedStudent);
        setValue("student", selectedStudent, {
            shouldValidate: true,
            shouldDirty: true,
        });

        setValue("studentId", selectedStudent?.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setValue("fatherName", selectedStudent?.fatherName, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setValue("rollNo", selectedStudent?.rollNo, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }

    useEffect(() => {
        if (studentData) {
            console.log("Setting form values with studentData:", studentData);
            reset({
                student: {
                    label: studentData?.studentId?.name,
                    value: studentData?.studentId?._id,
                    fatherName: studentData?.studentId?.fatherName,
                    rollNo: studentData?.studentId?.rollNo,
                },
                studentId: studentData?.studentId?._id,
                fatherName: studentData?.studentId?.fatherName,
                rollNo: studentData?.studentId?.rollNo,
                course: {
                    label: studentData?.courseId?.name,
                    value: studentData?.courseId?._id,
                    amount: studentData?.amount,
                },
                courseId: studentData?.courseId?._id,
                amount: studentData?.amount,
            });
        }
    }, [studentData, reset]);

    if (isLoading) {
        return <CustomLoader />;
    }

    console.log("Student Data for Edit:", studentData);

    return (

        <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        👨‍🎓  {studentId ? "Edit Fees" : "Add Fees"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        `Fill the detail to {studentId ? "edit" : "add"} student fees`
                    </p>
                </div>

            </div>
            <Card className="rounded-xl w-full border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-full space-y-4 rounded-xl border p-6 shadow"
                >
                    <h2 className="text-xl font-semibold">
                        {isUpdate ? "Update Student Fees" : "Add Student Fees"}
                    </h2>

                    {/* Student Name (React Select) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div >
                            <label className="block font-medium mb-1">Student Name<span className="required">*</span></label>
                            <Controller
                                name="student"
                                control={control}
                                rules={{ required: "Student is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value}
                                        options={students}
                                        onChange={(e) => handleStudentChange(e as StudentOption)}
                                        placeholder="Select student"
                                    />
                                )}
                            />
                            {errors.student && (
                                <p className="required">{errors?.student?.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Father Name<span className="required">*</span></label>
                            <input
                                type="text"
                                placeholder="Father name"
                                {...register("fatherName", { required: "Father Name is required" })}
                                readOnly
                                className="w-full rounded border px-3 py-2"
                            />
                            {errors?.fatherName && (
                                <p className="required">{errors?.fatherName?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Student ID */}
                        <div>
                            <label className="block font-medium mb-1">Student ID (userId)<span className="required">*</span></label>
                            <input
                                type="text"
                                {...register("studentId", { required: "Student ID is required" })}
                                readOnly
                                className="w-full rounded border px-3 py-2"
                            />
                            {errors?.studentId && (
                                <p className="required">{errors?.studentId?.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Roll Number<span className="required">*</span></label>
                            <input
                                type="text"
                                {...register("rollNo", { required: "Roll Number is required" })}
                                readOnly
                                className="w-full rounded border px-3 py-2"
                            />
                            {errors?.rollNo && (
                                <p className="required">{errors?.rollNo?.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Course ID */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block font-medium mb-1">Course ID<span className="required">*</span></label>
                            <Controller
                                name="course"
                                control={control}
                                rules={{ required: "Course ID is required" }}
                                render={({ field }) => (
                                    <Select
                                        // {...field}
                                        value={field.value}
                                        options={courses}
                                        onChange={(e) => handleCourseChange(e as CourseOption)}
                                        placeholder="Select course"
                                    />
                                )}
                            />
                            {errors.course && (
                                <p className="required">{errors?.course?.message}</p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block font-medium mb-1">Amount<span className="required">*</span></label>
                            <input
                                type="number"

                                readOnly
                                {...register("amount", {
                                    required: "Amount is required",
                                    min: { value: 1, message: "Amount must be greater than 0" },
                                    valueAsNumber: true,
                                })}
                                className="w-full rounded border px-3 py-2"
                            />
                            {errors?.amount && (
                                <p className="required">{errors?.amount?.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={feesMutation.isPending}
                        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                    >
                        {feesMutation.isPending
                            ? "Saving..."
                            : isUpdate
                                ? "Update Fees"
                                : "Add Fees"}
                    </button>
                </form>
            </Card>
        </div>
    );
}
