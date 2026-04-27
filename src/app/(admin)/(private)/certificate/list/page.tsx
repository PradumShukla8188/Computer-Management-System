"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Table, Space, Button, Card, Typography, Modal, Tag, message } from 'antd';
import { DownloadOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ModernCertificate from '@/components/certificate/ModernCertificate';
import CertificateViewer, { CertificateViewerHandle } from '@/components/certificate/CertificateViewer';
import { downloadIssuedCertificatePdf, printIssuedCertificatePdf, useIssuedCertificates } from '../hooks/useCertificateApi';

const { Title } = Typography;

const buildCertificateQrText = (record: any) => {
  const studentName = record?.studentId?.name || record?.data?.student_name || '';
  const fatherName = record?.studentId?.fatherName || record?.data?.father_name || '';
  const courseName = record?.studentId?.courseId?.name || record?.studentId?.courseName || record?.data?.course_name || '';
  const rollNo = record?.studentId?.rollNo || record?.data?.roll_no || '';
  const registrationNumber = record?.data?.registration_number || record?.certificateNumber || rollNo || '';
  const issueDate = record?.issuedAt ? new Date(record.issuedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : '';

  return [
    'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
    `Certificate No: ${record?.certificateNumber || ''}`,
    `Student: ${studentName}`,
    `Father: ${fatherName}`,
    `Course: ${courseName}`,
    `Roll No: ${rollNo}`,
    `Registration No: ${registrationNumber}`,
    `Issue Date: ${issueDate}`,
  ]
    .filter(Boolean)
    .join('\n');
};

const buildQrCodeUrl = (record: any) =>
  `https://quickchart.io/qr?size=170&margin=1&text=${encodeURIComponent(buildCertificateQrText(record))}`;

const buildViewerData = (record: any) => ({
  certificate_no: record?.certificateNumber || '',
  enrollment_no: record?.studentId?.rollNo || '',
  student_name: record?.studentId?.name || '',
  father_name: record?.studentId?.fatherName || '',
  mother_name: record?.studentId?.motherName || '',
  dob: record?.studentId?.dob ? new Date(record.studentId.dob).toLocaleDateString('en-GB') : '',
  course_name: record?.studentId?.courseId?.name || record?.studentId?.courseName || '',
  secured_percent: record?.data?.secured_percent || record?.data?.securedPercent || '',
  grade: record?.data?.grade || '',
  session: record?.data?.session || '',
  center_code: record?.data?.center_code || record?.data?.centerCode || 'SSTCI/2262025',
  center_name: 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
  center_address: 'Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila,Hardoi, Uttar Pradesh 241203',
  issue_date: record?.issuedAt ? new Date(record.issuedAt).toLocaleDateString('en-GB') : '',
  student_photo_url: record?.studentId?.studentPhoto || '',
});

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function IssuedCertificateListPage() {
  const { data: issuedCertificates = [], isLoading } = useIssuedCertificates();
  const [viewingCert, setViewingCert] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'download' | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CertificateViewerHandle>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const openPreview = (cert: any, action: 'download' | null = null) => {
    setViewingCert(cert);
    setIsPreviewOpen(true);
    setPendingAction(action);
  };

  const handleDownload = async (cert: any) => {
    try {
      setDownloadingId(cert._id);

      // If we have a viewer ref (canvas based), use its download method
      if (isPreviewOpen && viewerRef.current && !cert.templateId?.name?.toLowerCase().includes('advanced')) {
        await viewerRef.current.downloadPdf(`certificate-${cert.certificateNumber || cert._id}.pdf`);
        return;
      }

      // If we are in preview mode and the capture ref is available, use client-side html2canvas
      const elementToCapture = captureRef.current || certificateRef.current;
      if (isPreviewOpen && elementToCapture) {
        const canvas = await html2canvas(elementToCapture, {
          scale: 3, // High resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`certificate-${cert.certificateNumber || cert._id}.pdf`);
        return;
      }

      // Fallback or direct list download
      await downloadIssuedCertificatePdf(cert._id, `certificate-${cert.certificateNumber || cert._id}.pdf`);
    } catch (error: any) {
      console.error('Download error:', error);
      message.error('Failed to download certificate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = async (cert: any) => {
    try {
      const elementToCapture = captureRef.current || certificateRef.current;
      if (isPreviewOpen && elementToCapture) {
        const canvas = await html2canvas(elementToCapture, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Certificate Print - ${cert.certificateNumber}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
                  img { max-width: 100%; height: auto; }
                  @page { size: auto; margin: 0mm; padding: 0; }
                </style>
              </head>
              <body>
                <img src="${imgData}" onload="window.print(); window.close();" />
              </body>
            </html>
          `);
          printWindow.document.close();
        }
        return;
      }

      await printIssuedCertificatePdf(cert._id);
    } catch (error) {
      console.error('Print error:', error);
      message.error('Failed to print certificate');
    }
  };

  useEffect(() => {
    if (!isPreviewOpen || !viewingCert || pendingAction !== 'download') {
      return;
    }

    const run = async () => {
      await wait(350);
      await handleDownload(viewingCert);
      setPendingAction(null);
    };

    run();
  }, [isPreviewOpen, pendingAction, viewingCert]);

  const columns = [
    { title: 'Student Name', render: (_: any, record: any) => record.studentId?.name || 'N/A', key: 'studentName' },
    { title: 'Course', render: (_: any, record: any) => record.studentId?.courseId?.name || 'N/A', key: 'courseName' },
    { title: 'Cert No', dataIndex: 'certificateNumber', key: 'certificateNumber' },
    { title: 'Issue Date', render: (_: any, record: any) => new Date(record.issuedAt || record.createdAt).toLocaleDateString(), key: 'issueDate' },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => (record?.studentId ? <Tag color="green">Issued</Tag> : <Tag color="default">Unknown</Tag>),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => openPreview(record)} title="View Preview" />
          <Button
            icon={<DownloadOutlined />}
            loading={downloadingId === record._id}
            onClick={() => handleDownload(record)}
            title="Download PDF"
          />
          <Button
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            title="Direct Print"
          />
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
        onCancel={() => {
          setIsPreviewOpen(false);
          setPendingAction(null);
        }}
        width={1100}
        footer={[
          <Button key="close" onClick={() => setIsPreviewOpen(false)}>Close</Button>,
          <Button
            key="print"
            icon={<PrinterOutlined />}
            disabled={!viewingCert}
            onClick={() => viewingCert && handlePrint(viewingCert)}
          >
            Print
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadingId === viewingCert?._id}
            onClick={() => viewingCert && handleDownload(viewingCert)}
          >
            Download PDF
          </Button>,
        ]}
      >
        {viewingCert && (
          <div className="p-4 flex justify-center overflow-auto min-h-[600px] rounded-2xl" style={{ backgroundColor: '#f1f5f9' }}>
            {/* Hidden full-scale container for high quality capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
              <div ref={captureRef}>
                <ModernCertificate
                  certificateNo={buildViewerData(viewingCert).certificate_no}
                  enrollmentNo={buildViewerData(viewingCert).enrollment_no}
                  studentName={buildViewerData(viewingCert).student_name}
                  fatherName={buildViewerData(viewingCert).father_name}
                  motherName={buildViewerData(viewingCert).mother_name}
                  dob={buildViewerData(viewingCert).dob}
                  courseName={buildViewerData(viewingCert).course_name}
                  securedPercent={buildViewerData(viewingCert).secured_percent}
                  grade={buildViewerData(viewingCert).grade}
                  session={buildViewerData(viewingCert).session}
                  centerCode={buildViewerData(viewingCert).center_code}
                  centerName={buildViewerData(viewingCert).center_name}
                  centerAddress={buildViewerData(viewingCert).center_address}
                  issueDate={buildViewerData(viewingCert).issue_date}
                  studentPhotoUrl={buildViewerData(viewingCert).student_photo_url}
                />
              </div>
            </div>

            {viewingCert.templateId?.name?.toLowerCase().includes('advanced') || (!viewingCert.templateId) ? (
              <div className="scale-[0.8] origin-top" ref={certificateRef}>
                <ModernCertificate
                  certificateNo={buildViewerData(viewingCert).certificate_no}
                  enrollmentNo={buildViewerData(viewingCert).enrollment_no}
                  studentName={buildViewerData(viewingCert).student_name}
                  fatherName={buildViewerData(viewingCert).father_name}
                  motherName={buildViewerData(viewingCert).mother_name}
                  dob={buildViewerData(viewingCert).dob}
                  courseName={buildViewerData(viewingCert).course_name}
                  securedPercent={buildViewerData(viewingCert).secured_percent}
                  grade={buildViewerData(viewingCert).grade}
                  session={buildViewerData(viewingCert).session}
                  centerCode={buildViewerData(viewingCert).center_code}
                  centerName={buildViewerData(viewingCert).center_name}
                  centerAddress={buildViewerData(viewingCert).center_address}
                  issueDate={buildViewerData(viewingCert).issue_date}
                  studentPhotoUrl={buildViewerData(viewingCert).student_photo_url}
                />
              </div>
            ) : (
              <div className="w-full">
                <CertificateViewer
                  ref={viewerRef}
                  design={viewingCert.templateId?.design || []}
                  dimensions={viewingCert.templateId?.dimensions || { width: 1123, height: 794 }}
                  backgroundImage={viewingCert.templateId?.backgroundImage}
                  data={{
                    ...buildViewerData(viewingCert),
                    ...viewingCert.data
                  }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
