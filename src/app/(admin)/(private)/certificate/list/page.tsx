"use client";

import React, { useState } from 'react';
import { Table, Space, Button, Tag, Card, Typography, Modal } from 'antd';
import { DownloadOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import CertificateViewer from '@/components/certificate/CertificateViewer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title } = Typography;

import { useIssuedCertificates } from '../hooks/useCertificateApi';

export default function IssuedCertificateListPage() {
  const { data: issuedCertificates = [], isLoading } = useIssuedCertificates();
  const [viewingCert, setViewingCert] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = async (cert: any) => {
    const input = document.getElementById(`cert-${cert._id}`);
    if (!input) return;
    
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${cert.studentId?.name || 'certificate'}.pdf`);
  };

  const columns = [
    { title: 'Student Name', render: (_: any, record: any) => record.studentId?.name || 'N/A', key: 'studentName' },
    { title: 'Course', render: (_: any, record: any) => record.studentId?.courseId?.name || 'N/A', key: 'courseName' },
    { title: 'Cert No', dataIndex: 'certificateNumber', key: 'certificateNumber' },
    { title: 'Issue Date', render: (_: any, record: any) => new Date(record.createdAt).toLocaleDateString(), key: 'issueDate' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => {
              setViewingCert(record);
              setIsPreviewOpen(true);
            }} 
          />
          <Button 
            icon={<DownloadOutlined />} 
            onClick={() => {
              setViewingCert(record);
              setTimeout(() => handleDownload(record), 500);
            }} 
          />
          <Button icon={<PrinterOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card title={<Title level={4}>Issued Certificates</Title>}>
        <Table columns={columns} dataSource={issuedCertificates} rowKey="_id" loading={isLoading} />
      </Card>

      <Modal
        title="Certificate Preview"
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIsPreviewOpen(false)}>Close</Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => handleDownload(viewingCert)}>Download</Button>
        ]}
      >
        {viewingCert && (
          <div className="flex justify-center overflow-auto bg-gray-100 p-4">
            <div id={`cert-${viewingCert._id}`}>
              <CertificateViewer 
                design={viewingCert.templateId?.design || []} 
                dimensions={viewingCert.templateId?.dimensions || { width: 1123, height: 794 }}
                data={viewingCert.data} 
              />
            </div>
          </div>
        )}
      </Modal>
      
      {/* Hidden container for background processing */}
      {!isPreviewOpen && viewingCert && (
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <div id={`cert-hidden-${viewingCert._id}`}>
             <CertificateViewer 
                design={viewingCert.templateId?.design || []} 
                dimensions={viewingCert.templateId?.dimensions || { width: 1123, height: 794 }}
                data={viewingCert.data} 
              />
          </div>
        </div>
      )}
    </div>
  );
}
