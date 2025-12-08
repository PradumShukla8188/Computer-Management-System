import AddStudent from "@/components/student/addStudent"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student | Add ",
  description: "This is page for adding students in this pannel.",
};
const Student = () => {
    
  return (
    <>
      <div className="studentForm">
       <AddStudent/>
      </div>
    </>
  )
}

export default Student
