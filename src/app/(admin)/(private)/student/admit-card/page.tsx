"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Col, Row, Select, Space, Spin, Tag, Typography, message } from "antd";
import { DownloadOutlined, PrinterOutlined, IdcardOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { axiosInstance } from "@/lib/axiosApi/axiosInstance";

const { Title, Text } = Typography;
const CARD_PDF_WIDTH_MM = 96;
const CARD_PDF_HEIGHT_MM = 61;

const DEFAULT_INSTITUTE = {
  name: "SST COMPUTER & WELL KNOWLEDGE INSTITUTE",
  email: "SSTCOMPUTER115@GMAIL.COM",
  contact: "9519222486, 7376486686",
  address: "Dikunni Dhikunni, Uttar Pradesh 241203",
};

type StudentOption = {
  _id: string;
  name: string;
  rollNo?: string;
  fatherName?: string;
  courseId?: {
    name?: string;
  };
};

type AdmitCardPayload = {
  rollNumber: string;
  registrationNumber: string;
  name: string;
  fatherName: string;
  motherName: string;
  course: string;
  courseDuration?: string;
  admissionDate?: string;
  session: string;
  examName: string;
  examDate: string;
  examTime: string;
  center: string;
  instituteName: string;
  instituteAddress: string;
  instituteContact: string;
  studentPhoto?: string;
};

const getAssetUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_API_URL || "").replace(/\/+$/, "");
  if (!baseUrl) return value;
  return `${baseUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

const getDisplayValue = (value?: string) => value?.trim() || "-";

const buildDummyProfile = (name: string) => {
  const initial = (name.trim().charAt(0) || "S").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffd7c2" />
          <stop offset="100%" stop-color="#f0a36f" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="120" fill="url(#bg)" />
      <circle cx="120" cy="88" r="42" fill="#fff3eb" />
      <path d="M54 205c12-38 44-58 66-58s54 20 66 58" fill="#fff3eb" />
      <text x="120" y="223" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" font-weight="700" fill="#b9571e">${initial}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const buildQrPayload = (admitCard: AdmitCardPayload) =>
  [
    DEFAULT_INSTITUTE.name,
    `Student Name: ${getDisplayValue(admitCard.name)}`,
    `Roll Number: ${getDisplayValue(admitCard.rollNumber)}`,
    `Registration: ${getDisplayValue(admitCard.registrationNumber)}`,
    `Father's Name: ${getDisplayValue(admitCard.fatherName)}`,
    `Course: ${getDisplayValue(admitCard.course)}`,
    `Course Duration: ${getDisplayValue(admitCard.courseDuration)}`,
    `Admission Date: ${getDisplayValue(admitCard.admissionDate)}`,
    `Contact: ${DEFAULT_INSTITUTE.contact}`,
    `Address: ${DEFAULT_INSTITUTE.address}`,
  ].join("\n");

const buildQrImageUrl = (value: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(value)}`;

const waitForCardImages = async (element: HTMLDivElement) => {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }
          image.onload = () => resolve();
          image.onerror = () => resolve();
        }),
    ),
  );
};

const generateCardCanvas = async (element: HTMLDivElement) => {
  await waitForCardImages(element);
  return html2canvas(element, {
    scale: 3,
    backgroundColor: "#ffffff",
    useCORS: true,
    allowTaint: false,
  });
};

function AdmitCardPreview({ admitCard }: { admitCard: AdmitCardPayload }) {
  const instituteName = DEFAULT_INSTITUTE.name;
  const instituteAddress = DEFAULT_INSTITUTE.address;
  const instituteContact = DEFAULT_INSTITUTE.contact;
  const qrValue = useMemo(() => buildQrPayload(admitCard), [admitCard]);
  const dummyProfile = useMemo(() => buildDummyProfile(admitCard.name), [admitCard.name]);
  const [displayPhoto, setDisplayPhoto] = useState(getAssetUrl(admitCard.studentPhoto) || dummyProfile);

  return (
    <div className="h-[290px] w-[460px] overflow-hidden rounded-[20px] border border-[#d9c7ba] bg-[#fffaf6] shadow-[0_18px_50px_rgba(132,74,33,0.18)]">
      <div
        className="h-[96px] px-5 py-4 text-white"
        style={{ backgroundColor: '#f35d1d' }}
      >
        <div className="relative flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 p-1 shadow-sm">
            <img src="/images/logo/SST-logo.png" alt="SST Logo" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="max-w-[360px] text-[11px] font-black uppercase leading-4">
              {instituteName}
            </h1>
            <p className="mt-1.5 text-[8px] font-medium uppercase tracking-[0.04em] text-white/90">
              Email: {DEFAULT_INSTITUTE.email} | Call: {instituteContact}
            </p>
            <p className="mt-1 max-w-[330px] text-[8px] leading-3 text-white/90">{instituteAddress}</p>
          </div>
        </div>
      </div>

      <div className="grid h-[164px] grid-cols-[122px_minmax(0,1fr)_94px] gap-4 px-4 pb-3 pt-3">
        <div className="flex flex-col items-center">
          <div className="z-10 mt-0 h-[88px] w-[88px] overflow-hidden rounded-full border-[5px] border-white bg-[#f4ede7] shadow-lg">
            <img
              src={displayPhoto}
              alt={admitCard.name}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
              onError={() => setDisplayPhoto(dummyProfile)}
            />
          </div>

          <div className="mt-3 w-full text-center">
            <h2 className="line-clamp-2 text-[15px] font-black uppercase leading-5 tracking-[0.02em] text-[#ef4c1d]">
              {getDisplayValue(admitCard.name)}
            </h2>
            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.35em] text-[#8f4a28]">
              Admit Card
            </p>
          </div>
        </div>

        <div className="pt-1">
          <div className="grid gap-1 text-[8px] leading-4 text-[#161616]">
            {[
              ["Course", admitCard.course],
              ["Course Duration", admitCard.courseDuration],
              ["Roll Number", admitCard.rollNumber],
              ["Registration", admitCard.registrationNumber],
              ["Father's Name", admitCard.fatherName],
              ["Admission Date", admitCard.admissionDate],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[86px_9px_minmax(0,1fr)] items-start">
                <span className="font-semibold text-[#2b2b2b]">{label}</span>
                <span className="font-semibold">:</span>
                <span className="break-words font-medium text-[#1f1f1f]">{getDisplayValue(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between pt-1">
          <div className="rounded-[10px] border border-[#efc7ae] bg-white p-1 shadow-sm">
            <img
              src={buildQrImageUrl(qrValue)}
              alt={`QR for ${admitCard.name}`}
              className="h-[78px] w-[78px]"
              crossOrigin="anonymous"
            />
          </div>
          <div />
        </div>
      </div>

      <div
        className="px-4 py-1.5 text-center text-[8px] font-medium text-white"
        style={{ backgroundColor: '#ef5a22' }}
      >
        Email: {DEFAULT_INSTITUTE.email} | Call: {instituteContact}
      </div>
    </div>
  );
}

export default function AdminAdmitCardPage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [studentId, setStudentId] = useState<string>();

  const { data: students = [], isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students-for-admit-card"],
    queryFn: async () => {
      const response = await axiosInstance.get("/student", {
        params: { page: 1, limit: 500 },
      });
      return response?.data?.data || [];
    },
  });

  const selectedStudent = useMemo(
    () => students.find((student: StudentOption) => student._id === studentId),
    [studentId, students],
  );

  const { data: documentRecord, isLoading: isDocumentLoading } = useQuery({
    queryKey: ["student-public-documents", selectedStudent?.rollNo],
    enabled: !!selectedStudent?.rollNo,
    queryFn: async () => {
      const response = await axiosInstance.get("/public/student-documents/search", {
        params: {
          search: selectedStudent?.rollNo,
          searchType: "roll",
        },
      });
      return Array.isArray(response?.data?.data) ? response.data.data[0] : null;
    },
  });

  const admitCard = documentRecord?.admitCard as AdmitCardPayload | undefined;

  const handleDownload = async () => {
    if (!cardRef.current || !admitCard) return;

    const canvas = await generateCardCanvas(cardRef.current);
    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [CARD_PDF_WIDTH_MM, CARD_PDF_HEIGHT_MM],
    });
    pdf.addImage(imageData, "PNG", 0, 0, CARD_PDF_WIDTH_MM, CARD_PDF_HEIGHT_MM);
    pdf.save(`admit-card-${admitCard.rollNumber || "student"}.pdf`);
  };

  const handlePrint = async () => {
    if (!cardRef.current || !admitCard) return;

    const canvas = await generateCardCanvas(cardRef.current);
    const imageData = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) {
      message.error("Unable to open print preview");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Card</title>
          <style>
            @page { size: ${CARD_PDF_WIDTH_MM}mm ${CARD_PDF_HEIGHT_MM}mm; margin: 0; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${CARD_PDF_WIDTH_MM}mm;
              height: ${CARD_PDF_HEIGHT_MM}mm;
              overflow: hidden;
            }
            img {
              display: block;
              width: ${CARD_PDF_WIDTH_MM}mm;
              height: ${CARD_PDF_HEIGHT_MM}mm;
            }
          </style>
        </head>
        <body>
          <img src="${imageData}" alt="Admit Card" />
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={8}>
          <Card title={<Space><IdcardOutlined /> Download Admit Card</Space>} className="shadow-sm">
            <Alert
              type="info"
              showIcon
              className="mb-6"
              message="Live student card"
              description="Select a student to generate a live admit card using course exam data and institute settings from the backend."
            />

            <div className="space-y-4">
              <div>
                <Text strong>Select Student</Text>
                <Select
                  className="mt-2 w-full"
                  showSearch
                  placeholder="Search by student name or roll number"
                  optionFilterProp="label"
                  loading={isStudentsLoading}
                  value={studentId}
                  onChange={setStudentId}
                  options={students.map((student: StudentOption) => ({
                    value: student._id,
                    label: `${student.name} (${student.rollNo || "No Roll"})`,
                  }))}
                />
              </div>

              {selectedStudent && (
                <Card size="small" className="bg-slate-50">
                  <div className="flex flex-col gap-1 text-sm">
                    <Text strong>{selectedStudent.name}</Text>
                    <Text type="secondary">Roll No: {selectedStudent.rollNo || "-"}</Text>
                    <Text type="secondary">Course: {selectedStudent.courseId?.name || "-"}</Text>
                  </div>
                </Card>
              )}

              {documentRecord?.availability && (
                <Space wrap>
                  <Tag color={documentRecord.availability.admitCard ? "blue" : "default"}>Admit Card</Tag>
                  <Tag color={documentRecord.availability.marksheet ? "green" : "default"}>Marksheet</Tag>
                  <Tag color={documentRecord.availability.certificateIssued ? "gold" : "default"}>Certificate</Tag>
                </Space>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="primary" icon={<DownloadOutlined />} block disabled={!admitCard} onClick={handleDownload}>
                  Download PDF
                </Button>
                <Button icon={<PrinterOutlined />} block disabled={!admitCard} onClick={handlePrint}>
                  Print
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={16}>
          <Card title="Preview" className="shadow-sm">
            {isDocumentLoading ? (
              <div className="flex h-[540px] items-center justify-center">
                <Spin size="large" />
              </div>
            ) : admitCard ? (
              <div className="overflow-auto rounded-3xl bg-slate-100 p-4">
                <div ref={cardRef} className="mx-auto w-fit">
                  <AdmitCardPreview admitCard={admitCard} />
                </div>
              </div>
            ) : (
              <div className="flex h-[540px] items-center justify-center rounded-2xl border border-dashed text-slate-400">
                Select a student to preview the admit card
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
