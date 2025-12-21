import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const StudentForm = dynamic(
  () => import("@/components/student/StudentForm"),
  { ssr: true, loading: () => <CustomLoader /> }
);

export const metadata: Metadata = {
  title: "Student | Add",
  description: "This is page for adding students in this panel.",
};

export default function AddStudentPage() {
  return <StudentForm mode="add" />;
}
