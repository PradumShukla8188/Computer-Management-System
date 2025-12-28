import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const StudentForm = dynamic(
  () => import("@/components/student/StudentForm"),
  { ssr: true, loading: () => <CustomLoader /> }
);

export const metadata: Metadata = {
  title: "Student | Edit",
  description: "Edit student details.",
};

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;
  
  return <StudentForm mode="edit" studentId={id} />;
}
