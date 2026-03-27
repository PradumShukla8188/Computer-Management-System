"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Table, Space, Button, Card, Typography, Modal, Tag, message } from 'antd';
import { DownloadOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import CertificateViewer, { CertificateViewerHandle } from '@/components/certificate/CertificateViewer';
import { useIssuedCertificates } from '../hooks/useCertificateApi';

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
  student_name: record?.studentId?.name || '',
  student_full_name: record?.studentId?.name || '',
  name: record?.studentId?.name || '',
  father_name: record?.studentId?.fatherName || '',
  mother_name: record?.studentId?.motherName || '',
  date_of_birth: record?.studentId?.dob ? new Date(record.studentId.dob).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
  dob: record?.studentId?.dob ? new Date(record.studentId.dob).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
  course_name: record?.studentId?.courseId?.name || record?.studentId?.courseName || '',
  course: record?.studentId?.courseId?.name || record?.studentId?.courseName || '',
  duration: record?.studentId?.courseDuration || '',
  roll_no: record?.studentId?.rollNo || '',
  roll_number: record?.studentId?.rollNo || '',
  registration_number: record?.data?.registration_number || record?.certificateNumber || '',
  certificate_number: record?.certificateNumber || '',
  issue_date: record?.issuedAt ? new Date(record.issuedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
  date: record?.issuedAt ? new Date(record.issuedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
  student_photo: record?.studentId?.studentPhoto || '',
  institute_name: 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
  institute_address: 'Dikunni Dhikunni, Uttar Pradesh 241203',
  institute_contact: '9519222486, 7376486686',
  qr_code: buildQrCodeUrl(record),
  ...(record?.data || {}),
});

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function IssuedCertificateListPage() {
  const { data: issuedCertificates = [], isLoading } = useIssuedCertificates();
  const [viewingCert, setViewingCert] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'download' | null>(null);
  const viewerRef = useRef<CertificateViewerHandle | null>(null);

  const openPreview = (cert: any, action: 'download' | null = null) => {
    setViewingCert(cert);
    setIsPreviewOpen(true);
    setPendingAction(action);
  };

  const exportCertificateImage = async () => {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (viewerRef.current?.isReady()) {
        const image = viewerRef.current.exportAsDataUrl(2);
        if (image) {
          return image;
        }
      }
      await wait(250);
    }

    throw new Error('Certificate preview is still loading. Please try again.');
  };

  const handleDownload = async (cert: any) => {
    try {
      setDownloadingId(cert._id);
      const imageDataUrl = await exportCertificateImage();
      const dimensions = cert?.templateId?.dimensions || { width: 1123, height: 794 };
      const pdf = new jsPDF({
        orientation: dimensions.width >= dimensions.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [dimensions.width, dimensions.height],
      });

      pdf.addImage(imageDataUrl, 'PNG', 0, 0, dimensions.width, dimensions.height);
      pdf.save(`${cert.certificateNumber || cert._id}.pdf`);
    } catch (error: any) {
      message.error(error?.message || 'Failed to download certificate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = async (cert: any) => {
    try {
      const imageDataUrl = await exportCertificateImage();
      const dimensions = cert?.templateId?.dimensions || { width: 1123, height: 794 };
      const printWindow = window.open('', '_blank', 'width=1400,height=900');

      if (!printWindow) {
        message.error('Please allow popups to print the certificate.');
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${cert?.certificateNumber || 'Certificate'}</title>
            <style>
              @page {
                size: ${dimensions.width}px ${dimensions.height}px;
                margin: 0;
              }
              html, body {
                margin: 0;
                padding: 0;
                background: #ffffff;
              }
              body {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img {
                width: 100%;
                max-width: ${dimensions.width}px;
                height: auto;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${imageDataUrl}" alt="Certificate" onload="window.focus(); window.print();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error: any) {
      message.error(error?.message || 'Failed to print certificate');
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
          <Button icon={<EyeOutlined />} onClick={() => openPreview(record)} />
          <Button
            icon={<DownloadOutlined />}
            loading={downloadingId === record._id}
            onClick={() => openPreview(record, 'download')}
          />
          <Button icon={<PrinterOutlined />} onClick={() => openPreview(record)} />
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
          <div className="rounded-2xl bg-slate-100 p-4">
            <CertificateViewer
              ref={viewerRef}
              design={viewingCert.templateId?.design || []}
              dimensions={viewingCert.templateId?.dimensions || { width: 1123, height: 794 }}
              backgroundImage={viewingCert.templateId?.backgroundImage}
              data={buildViewerData(viewingCert)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
