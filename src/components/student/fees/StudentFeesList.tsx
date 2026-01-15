"use client";

import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import {  useState } from "react";
import { CustomLoader } from "@/components/common";
import CommonConfirmModal from "@/lib/popup/CommonConfirmModal";
import { toast } from "@/lib/toast";


const StudentFeesList = () => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentFeedId, setSelectedStudentFeedId] = useState<string|null>(null);

  const { data: dataSource, isLoading,refetch } = useQuery({
    queryKey: ['student-fees-list'],
    queryFn: async () => ApiHitter('GET', 'GET_STUDENT_FEES_LIST', {}, '', { showError: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });



  let monthWiseData: any[] = [];
  if (dataSource) {
    const inputData = dataSource?.data; // your API data array

    monthWiseData = Object.values(
      inputData.reduce((acc: any, item: any) => {
        const date = new Date(item.createdAt);

        const month = date.toLocaleString("en-US", { month: "long" });
        const year = date.getFullYear();

        const key = `${month}-${year}`;

        if (!acc[key]) {
          acc[key] = {
            month,
            year,
            data: [],
          };
        }

        acc[key].data.push(item);

        return acc;
      }, {})
    );
  }

  const deleteFeesMutate=useMutation({
    mutationFn: async (selectedStudentFeedId: string) => {
      await ApiHitter("DELETE", "DELETE_STUDENT_FEES", {_id:selectedStudentFeedId},"");
    },
    onSuccess: (result) => {
      refetch();
      toast.success("Fees deleted successfully.");
    },
    onError: (error) => {
      console.error("Error deleting fees:", error);
      toast.error("Failed to delete fees. Please try again.");
    }
  });

  function handleFeesDelete(e: React.MouseEvent<HTMLButtonElement>,feesId:string){
    e.preventDefault();
    setSelectedStudentFeedId(feesId);
    setShowModal(true);
  }

  function deleteFeesFunc(){
    if(selectedStudentFeedId){
      deleteFeesMutate.mutate(selectedStudentFeedId)
    };
    setShowModal(false);
  }

   const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading) {
    return <div><CustomLoader /></div>;
  }
  return (

    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            👨‍🎓  Students Fees Details
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and view all registered students
          </p>
        </div>
        <Link href="/student-fees/add-fees">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="large"
                      className="rounded-lg bg-blue-600 hover:bg-blue-700"
                    >
                      Add Fees
                    </Button>
                  </Link>

      </div>
      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-lg">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Month Wise Fees Details
            </h2>
          </div>
           
        </div>

       <div className="w-full">
      {monthWiseData?.length ? (
        monthWiseData.map((record: any, index: number) => (
          <div
            key={index}
            className="mb-3 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            {/* ===== HEADER ===== */}
            <button
              onClick={() => toggleAccordion(index)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-bold text-gray-800 dark:text-white">
                {record?.month} {record?.year}
              </span>

              <span
                className={`transition-transform duration-100 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* ===== BODY ===== */}
            {openIndex === index && (
              <div className="px-3 pb-4">
                {/* HEADER ROW */}
                <div className="mb-2 flex rounded bg-gray-100 px-3 py-2 font-semibold dark:bg-gray-700">
                  <div className="flex-1">Student Name</div>
                  <div className="flex-1">Roll Number</div>
                  <div className="flex-1">Fees</div>
                  <div className="w-30 text-center">Actions</div>
                </div>

                {/* DATA ROWS */}
                {record?.data?.map((item: any, studentIndex: number) => (
                  <div
                    key={studentIndex}
                    className="mb-2 flex items-center rounded border px-3 py-2"
                  >
                    <div className="flex-1">
                      {item?.studentId?.name}
                    </div>

                    <div className="flex-1">
                      {item?.studentId?.rollNo}
                    </div>

                    <div className="flex-1">
                      ₹ {item?.amount}
                    </div>

                    <div className="flex w-30 justify-center gap-3">
                      <Link 
                      href={`/student-fees/edit-fees/${item?._id}`}
                      className="text-blue-600 hover:text-blue-800">
                        <EditOutlined />
                      </Link>

                      <button 
                      onClick={(e)=>handleFeesDelete(e,item?._id)}
                      className="text-red-600 hover:text-red-800">
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="py-4 text-center text-gray-500">
          No data found
        </div>
      )}
    </div>

      </Card>

      {showModal && (
        <CommonConfirmModal
          open={showModal}
          setShowModal={setShowModal}
          selectedData={selectedStudentFeedId}
          DeleteFunc={deleteFeesFunc}
        />
      )}
    </div>


  );
}
export default StudentFeesList;

