import ViewStudent from "@/components/student/ViewStudent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student | View",
  description: "This is page for view students seperately.",
};
const Student = () => {

  return (
    <>
       <ViewStudent/>
    </>
  )
}

export default Student
