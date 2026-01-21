import dynamic from 'next/dynamic';

const AddUpdateFees = dynamic(() => import('@/components/student/fees/AddUpdateFees'));

interface AddFeesPageProps {
    params:Promise <{ studentId: string }>;
}

const EditFeesPage = async({ params }: AddFeesPageProps) => {
    const  {studentId}= await params;
  return (
    <AddUpdateFees studentId={studentId} />
  )
}
export default EditFeesPage;