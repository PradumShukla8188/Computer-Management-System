"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueries } from "@tanstack/react-query";

import axios from "axios";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { Card } from "antd";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";
import { useRouter } from "next/navigation";

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
    student?: StudentOption | null;
    studentId?: string | null;
    courseId?: string | null; // ✅ FIXED
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
    const router = useRouter();
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
            studentId: null,
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
            const payload = {
                studentId: data?.studentId,
                userId: data?.studentId,
                courseId: data?.courseId,
                amount: data?.amount,
            };



            if (isUpdate) {
                return axios.put("/api/student-fees", payload);
            } else {
                return await ApiHitter("POST", "ADD_STUDENT_FEES", payload,"");
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

     const handleCourseChange = ( selectedCourse: CourseOption | null) => {
        console.log("Selected course:", selectedCourse);
        setValue("courseId", selectedCourse?.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
        if (selectedCourse) {
            setValue("amount", selectedCourse?.amount, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }   
    }
    const handleStudentChange = ( selectedStudent: StudentOption | null) => {
        console.log("Selected student:", selectedStudent);
        setValue("student", selectedStudent, {
            shouldValidate: true,
            shouldDirty: true,
        });
        
        setValue("studentId", selectedStudent?.value, {
            shouldValidate: true,
            shouldDirty: true,
        });  
    }



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
                                onChange={(e)=>handleStudentChange(e as StudentOption)}
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
                        type="text"
                        {...register("studentId", { required: "Student ID is required" })}
                        readOnly
                        className="w-full rounded border px-3 py-2"
                    />
                    {errors?.studentId && (
                        <p className="required">{errors?.studentId?.message}</p>
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
                                onChange={(e)=>handleCourseChange( e as CourseOption)}                                
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
