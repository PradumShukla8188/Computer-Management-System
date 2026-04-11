import dynamic from 'next/dynamic';

const AddUpdateFees = dynamic(() => import('@/components/student/fees/AddUpdateFees'));

const AddFeesPage = () => {
  return (
    <AddUpdateFees />
  )
}
export default AddFeesPage;