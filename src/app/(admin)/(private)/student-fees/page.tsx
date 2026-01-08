import dynamic from 'next/dynamic';

const StudentFeesList = dynamic(() => import('@/components/student/fees/StudentFeesList'));

const StudentFeesPage = () => {
  return (
    <StudentFeesList/>
  )
}
export default StudentFeesPage;