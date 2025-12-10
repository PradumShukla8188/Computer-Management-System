import StudentList from "@/components/student/StudentList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students | All Students",
  description: "View and manage all registered students in the system.",
};

export default function StudentListPage() {
  return <StudentList />;
}
