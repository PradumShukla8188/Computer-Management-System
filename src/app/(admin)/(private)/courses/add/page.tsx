import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const CourseForm = dynamic(
  () => import("@/components/course/CourseForm"),
  { ssr: true, loading: () => <CustomLoader /> }
);

export const metadata: Metadata = {
  title: "Course | Add",
  description: "Add a new course to the system.",
};

export default function AddCoursePage() {
  return <CourseForm mode="add" />;
}
