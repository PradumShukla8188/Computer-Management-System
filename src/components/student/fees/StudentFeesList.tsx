"use client";

import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { Table } from 'antd';
import { DownOutlined } from "@ant-design/icons";

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

if(isLoading){
  return <div>Loading...</div>;
}
  return (
  <Card className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
<Table dataSource={dataSource?.data} columns={columns} />;
    </Card>
     
  );
}
export default StudentFeesList;

