import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const CourseForm = dynamic(
  () => import("@/components/course/CourseForm"),
  { ssr: true, loading: () => <CustomLoader /> }
);

export const metadata: Metadata = {
  title: "Course | Edit",
  description: "Edit course details.",
};

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  
  return <CourseForm mode="edit" courseId={id} />;
}
