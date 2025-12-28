import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const StudentList = dynamic(() => import("@/components/student/StudentList"), { 
  ssr: true, 
  loading: () => <CustomLoader /> 
});

export const metadata: Metadata = {
  title: "Students | All Students",
  description: "View and manage all registered students in the system.",
};

export default function StudentListPage() {
  return <StudentList />;
}
