import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CustomLoader } from "@/components/common";

const ViewStudent = dynamic(
  () => import("@/components/student/ViewStudent"),
  { ssr: true, loading: () => <CustomLoader /> }
);

export const metadata: Metadata = {
  title: "Student | View",
  description: "This is page for view students seperately.",
};

interface PageProps {
  params: {
    id: string;
  };
}

const Student = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <>
       <ViewStudent id={id} />
    </>
  )
}

export default Student
