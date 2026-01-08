"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

import axios from "axios";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { Card } from "antd";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const Select = dynamic(() => import("react-select"), { ssr: false });

type StudentOption = {
    label: string;
    value: string;
};

type CourseOption = {
  label: string;
  value: string;
  amount: number;
};

type FeesFormData = {
  student: StudentOption | null;
  userId: string;
  courseId: CourseOption | null; // ✅ FIXED
  amount: number;
};



type Props = {
    initialData?: FeesFormData; // pass this for update
    isUpdate?: boolean;
};

export default function StudentFeesForm({
    initialData,
    isUpdate = false,
}: Props) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<FeesFormData>({
        defaultValues: initialData || {
            student: null,
            userId: "",
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
                        label: student.name,
                        value: student._id,
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
                        amount: Number(course?.totalFees),
                    }));;
                },
            },
        ],
    });
    const isLoading = results.some((result: any) => result.isLoading);

    console.log("Results of queries:", results?.[1]?.data);
    const [studentsQuery, coursesQuery] = results;

    const students = studentsQuery.data ?? [];
    const courses = coursesQuery.data ?? [];
    console.log("Students for Select:", students);
    console.log("Courses for Select:", courses);

    /* ---------------- Add / Update fees ---------------- */
    const feesMutation = useMutation({
        mutationFn: async (data: FeesFormData) => {
            const payload = {
                studentId: data.student?.value,
                userId: data.userId,
                courseId: data.courseId,
                amount: data.amount,
            };

            if (isUpdate) {
                return axios.put("/api/student-fees", payload);
            } else {
                return axios.post("/api/student-fees", payload);
            }
        },
        onSuccess: () => {
            alert(isUpdate ? "Fees updated successfully" : "Fees added successfully");
            reset();
        },
    });

    /* ---------------- Submit ---------------- */
    const onSubmit = (data: FeesFormData) => {
        console.log("Form Data Submitted:", data);
        // feesMutation.mutate(data);
    };

    const studentselected = watch("student");
    const courseSelected = watch("courseId");

    if (isLoading) {
        return <CustomLoader />;
    }

    return (
        <Card className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md space-y-4 rounded-xl border p-6 shadow"
            >
                <h2 className="text-xl font-semibold">
                    {isUpdate ? "Update Student Fees" : "Add Student Fees"}
                </h2>

                {/* Student Name (React Select) */}
                <div>
                    <label className="block font-medium mb-1">Student Name<span className="required">*</span></label>
                    <Controller
                        name="student"
                        control={control}
                        rules={{ required: "Student is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={students}
                                placeholder="Select student"
                            />
                        )}
                    />
                    {errors.student && (
                        <p className="required">{errors?.student?.message}</p>
                    )}
                </div>

                {/* Student ID */}
                <div>
                    <label className="block font-medium mb-1">Student ID (userId)<span className="required">*</span></label>
                    <input
                        value={studentselected ? studentselected?.value : ''}
                        {...register("userId", { required: "Student ID is required" })}
                        readOnly
                        className="w-full rounded border px-3 py-2"
                    />
                    {errors.userId && (
                        <p className="required">{errors?.userId?.message}</p>
                    )}
                </div>

                {/* Course ID */}
                <div>
                    <label className="block font-medium mb-1">Course ID<span className="required">*</span></label>
                    <Controller
                        name="courseId"
                        control={control}
                        rules={{ required: "Course ID is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={courses}
                                placeholder="Select course"
                            />
                        )}
                    />
                    {errors.courseId && (
                        <p className="required">{errors?.courseId?.message}</p>
                    )}
                </div>

                {/* Amount */}
                <div>
                    <label className="block font-medium mb-1">Amount<span className="required">*</span></label>
                    <input
                        type="number"
                        value={courseSelected ? courseSelected?.amount : 0}
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
    );
}
