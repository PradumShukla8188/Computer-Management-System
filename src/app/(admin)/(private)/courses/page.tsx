import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const CourseList = dynamic(
  () => import("@/components/course/CourseList"),
  { ssr: true, loading: () => <CustomLoader /> }
);

export const metadata: Metadata = {
  title: "Courses | All Courses",
  description: "View and manage all registered courses in the system.",
};

export default function CoursesPage() {
  return <CourseList />;
}
