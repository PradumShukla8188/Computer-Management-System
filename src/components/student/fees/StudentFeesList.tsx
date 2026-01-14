"use client";

import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { Table } from 'antd';
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Accordion } from "react-bootstrap";

const StudentFeesList = () => {

  const {data: dataSource,isLoading} = useQuery({
    queryKey: ['student-fees-list'],
    queryFn: async () => ApiHitter('GET', 'GET_STUDENT_FEES_LIST', {}, '', { showError: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  console.log("Student Fees List Data:", dataSource);

  const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: (text: any) => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
  render: (text:any, record:any) => (
    <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <DownOutlined />
      </a>
    </span>
  ),
}];

let monthWiseData: any[] = [];
console.log("Data Source:", dataSource);
if(dataSource){
 const inputData = dataSource?.data; // your API data array

 monthWiseData = Object.values(
  inputData.reduce((acc:any, item:any) => {
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

console.log("month wise--->",monthWiseData);

}

if(isLoading){
  return <div>Loading...</div>;
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

  <Accordion>
  {monthWiseData?.length ? (
    monthWiseData.map((record: any, index: number) => (
      <Accordion.Item
        eventKey={String(index)}
        key={index}
        className="mb-3 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        {/* ===== HEADER ===== */}
        <Accordion.Header>
          <div className="d-flex w-100 align-items-center justify-content-between">
            <span className="fw-semibold text-gray-800 dark:text-white">
              {record?.month} {record?.year}
            </span>
          </div>
        </Accordion.Header>

        {/* ===== BODY ===== */}
        <Accordion.Body>
          {/* HEADER ROW */}
          <div className="d-flex fw-semibold px-3 py-2 mb-2 rounded bg-[#f7f7f7] dark:bg-gray-700">
            <div className="flex-grow-1">Student Name</div>
            <div className="flex-grow-1">Roll Number</div>
            <div className="flex-grow-1">Fees</div>
            <div style={{ width: 120 }} className="text-center">
              Actions
            </div>
          </div>

          {/* DATA ROWS */}
          {record?.data?.map((student: any, studentIndex: number) => (
            <div
              key={studentIndex}
              className="d-flex align-items-center px-3 py-2 mb-2 form-control"
            >
              <div className="flex-grow-1">
                {student?.studentId?.name}
              </div>

              <div className="flex-grow-1">
                {student?.studentId?.rollNo}
              </div>

              <div className="flex-grow-1">
                ₹ {student?.amount}
              </div>

              <div
                className="d-flex justify-content-center gap-3"
                style={{ width: 120 }}
              >
                <button className="border-0 bg-transparent text-primary">
                  <EditOutlined />
                </button>

                <button className="border-0 bg-transparent text-danger">
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    ))
  ) : (
    <div className="text-center py-4 text-gray-500">
      No data found
    </div>
  )}
</Accordion>

    </Card>
    </div>
     
  );
}
export default StudentFeesList;

