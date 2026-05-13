/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

interface CertificateProps {
  certificateNo?: string;
  enrollmentNo?: string;
  studentName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  courseName?: string;
  securedPercent?: string;
  grade?: string;
  session?: string;
  centerCode?: string;
  centerName?: string;
  centerAddress?: string;
  issueDate?: string;
  studentPhotoUrl?: string;
  qrCodeUrl?: string;
}

export default function ModernCertificate({
  certificateNo = '',
  enrollmentNo = '',
  studentName = '',
  fatherName = '',
  motherName = '',
  dob = '',
  courseName = '',
  securedPercent = '',
  grade = '',
  session = '',
  centerCode = 'SSTCI/2262025',
  centerName = 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
  centerAddress = 'Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila,Hardoi, Uttar Pradesh 241203',
  issueDate = '',
  studentPhotoUrl = '',
  qrCodeUrl = '',
}: CertificateProps) {
  return (
    <div className="flex justify-center items-center p-0 overflow-visible" style={{ color: '#111827', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Outer Certificate Border with Markshet styling */}
      <div id="certificate-container" className="relative w-[1000px] h-[1380px] shadow-2xl shrink-0"
        style={{ backgroundColor: '#ffffff', border: '6px solid #c0993d', padding: '10px' }}>

        <div className="w-full h-full p-0 relative" style={{ backgroundColor: '#ffffff' }}>

          {/* Inner Border Lines (Absolute for better PDF rendering) */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c0993d] z-50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c0993d] z-50"></div>
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[#c0993d] z-50"></div>
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-[#c0993d] z-50"></div>

          {/* Markshet Corner Ornaments */}
          <div className="absolute top-[-6px] left-[-6px] w-14 h-[4px] bg-[#c0993d]"></div>
          <div className="absolute top-[-6px] left-[-6px] w-[4px] h-14 bg-[#c0993d]"></div>

          <div className="absolute top-[-6px] right-[-6px] w-14 h-[4px] bg-[#c0993d]"></div>
          <div className="absolute top-[-6px] right-[-6px] w-[4px] h-14 bg-[#c0993d]"></div>

          <div className="absolute bottom-[-6px] left-[-6px] w-14 h-[4px] bg-[#c0993d]"></div>
          <div className="absolute bottom-[-6px] left-[-6px] w-[4px] h-14 bg-[#c0993d]"></div>

          <div className="absolute bottom-[-6px] right-[-6px] w-14 h-[4px] bg-[#c0993d]"></div>
          <div className="absolute bottom-[-6px] right-[-6px] w-[4px] h-14 bg-[#c0993d]"></div>

          {/* Faint Background Watermark Image */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mt-12 overflow-hidden">
            <div className="relative w-[620px] h-[720px] flex items-center justify-center opacity-[0.20]">
              <svg width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="none">
                <defs>
                  <path id="curveTop" d="M 100 330 A 170 170 0 1 1 400 330" />
                  <path id="curveBottom" d="M 51 200 A 205 205 0 1 0 449 200" />
                </defs>
                <circle cx="250" cy="250" r="235" fill="none" stroke="#d4af37" strokeWidth="12" />
                <circle cx="250" cy="250" r="191" fill="none" stroke="#1e3a8a" strokeWidth="62" />
                <circle cx="250" cy="250" r="222" fill="none" stroke="#1e3a8a" strokeWidth="4" />
                <circle cx="250" cy="250" r="160" fill="none" stroke="#1e3a8a" strokeWidth="4" />
                <circle cx="250" cy="250" r="150" fill="none" stroke="#d4af37" strokeWidth="6" />
                <text fill="#ffffff" fontSize="22" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" letterSpacing="1">
                  <textPath href="#curveTop" startOffset="50%" textAnchor="middle">
                    SST COMPUTER & WELL KNOWLEDGE INSTITUTE
                  </textPath>
                </text>
                <text fill="#ffffff" fontSize="20" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" letterSpacing="1">
                  <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">
                    Master the Computer, Shape the Future
                  </textPath>
                </text>
                <g transform="translate(130, 130) scale(1.6)">
                  <rect x="30" y="45" width="90" height="65" rx="4" fill="none" stroke="#1e3a8a" strokeWidth="7" />
                  <path d="M 55 110 L 95 110 L 110 135 L 40 135 Z" fill="#1e3a8a" />
                  <path d="M 40 135 L 110 135 L 110 142 L 40 142 Z" fill="#d4af37" />
                  <path d="M 75 5 L 130 25 L 75 45 L 20 25 Z" fill="#1e3a8a" />
                  <path d="M 45 32 L 45 45 C 45 60, 105 60, 105 45 L 105 32 Z" fill="#1e3a8a" />
                  <path d="M 125 25 L 125 55" stroke="#d4af37" strokeWidth="4" />
                  <circle cx="125" cy="60" r="4" fill="#d4af37" />
                </g>
              </svg>
            </div>
          </div>

          <div className="relative z-10 w-full h-full flex flex-col px-4 pt-2 pb-4">

            {/* Header row: Cert No & Enroll No (Corners) */}
            <div className="flex justify-between font-black text-[14px] tracking-widest mb-4 px-2 pt-2 w-full" style={{ color: '#900000' }}>
              <span className="flex-shrink-0">Certificate No: <span style={{ color: '#000000' }}>{certificateNo || 'Pending'}</span></span>
              <span className="flex-shrink-0">Enrollment No: <span style={{ color: '#000000' }}>{enrollmentNo || 'Pending'}</span></span>
            </div>

            {/* Top Logos Row */}
            <div className="flex justify-between items-center mt-6 px-10 h-16 mb-4 relative z-20">
              {/* MSME Logo */}
              <div className="w-[85px] flex flex-col items-center">
                <img src="/images/logo/msme-logo.jpg" alt="MSME Logo"
                  className="w-full h-auto object-contain"
                  width={85} height={85} />
              </div>

              {/* Center Logo Placeholder for SSTCI */}
              <div className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold text-center p-1 ">
                <img src="/images/logo/SST-logo.png" alt="SST-logo" className="w-full h-full object-cover" />
              </div>

              {/* QRO Logo */}
              <div className="w-[85px] flex flex-col items-center">
                <img src="/images/SSSS/jaybalajieducation ro logo_20211101090204_20220203085108 (1)_20230819225226.png" alt="QRO Logo" className="w-full h-auto object-contain" width={85} height={85} />
              </div>
            </div>

            {/* Main Title */}
            <div className="mt-2 w-full text-center">
              <span className="text-[25px] font-[900] !text-[#900000] uppercase tracking-tight" style={{ fontFamily: 'Arial, sans-serif', fontSize: '2.5rem', width: '100%' }}>
                {centerName}
              </span>
            </div>

            {/* Subtitles & Corporate Info */}
            <div className="text-center mt-1 text-[14px] leading-[1.3] font-bold" style={{ color: '#111827' }}>
              <p>An ISO 9001:2026 Certified Institute</p>
              <p>Registered Under Ministry of Corporate Affairs (Govt. of India)</p>
              <p className="font-[900] text-[15.5px]">Udyam Registration No.: UDYAM-UP-35-0054566</p>
              <p>Registered under the Societies Registration Act, 1860 (Act No. 21).</p>
              <p className="font-[900] text-[15.5px]">Society Registration No.:HAR/05025/2025-2026</p>

              <p className="mt-1">(An Autonomous Institute Registered Under the Micro, Small or Medium Enterprise MSME Regd. with Govt. of India)</p>
              <p>(A National Programme Of I.T Education & Computer Literacy)</p>
            </div>

            {/* Certificate Title & Photos Row */}
            <div className="flex justify-between items-center w-full px-8 mt-1 relative z-20">
              <div className="w-[120px] flex-shrink-0 flex justify-start items-center">
                <div className="w-[110px] h-[140px] flex items-center justify-center bg-white shadow-sm border border-gray-200 p-1">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" width={100} height={100} crossOrigin="anonymous" />
                  ) : (
                    <QRCodeSVG value={`${window.location.origin}/verify-certificate?certNo=${certificateNo}`} size={100} />
                  )}
                </div>
              </div>

              {/* Certificate Cursive Word */}
              <div className="text-center flex-1 flex flex-col items-center mt-8 relative z-30">
                <h2 className={`!text-[100px] !text-[#dc2626] leading-[0.7] ${greatVibes.className}`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                  Certificate
                </h2>
                <div className="text-[24px] font-bold text-[#1e3a8a] tracking-wide relative z-20">
                  This is Certified That
                </div>
              </div>

              {/* Right Box (Student Photo) */}
              <div className="w-[120px] flex-shrink-0 flex justify-end">
                <div className="w-[110px] h-[140px] overflow-hidden border-[3px] border-gray-300 shadow-sm p-1" style={{ backgroundColor: '#ffffff' }}>
                  <img
                    src={(() => {
                      if (!studentPhotoUrl) return 'https://placehold.co/120x150?text=Photo';
                      if (studentPhotoUrl.startsWith('http')) return studentPhotoUrl;
                      const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_API_URL || '').replace(/\/$/, '');
                      const cleanPath = studentPhotoUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
                      return `${baseUrl}/uploads/${cleanPath}`;
                    })()}
                    alt="Student"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area: Student Details Grid */}
            <div className="relative mt-2 px-8 text-[18px] font-[950] w-full z-20" style={{ color: '#000000', letterSpacing: '0.4px' }}>

              {/* Top Grid for Personal Info */}
              <div className="grid grid-cols-[160px_1fr_170px_1fr] gap-x-4 gap-y-4 items-baseline w-full">
                <div className="text-left text-[#374151] font-bold">Mr./Mrs/Miss:</div>
                <div className="uppercase border-b border-gray-200 tracking-wider font-black">{studentName}</div>

                <div className="text-left pl-4 text-[#374151] font-bold">Father's Name:</div>
                <div className="uppercase border-b border-gray-200 leading-tight tracking-wider font-black">{fatherName}</div>

                <div className="text-left text-[#374151] font-bold">Mother's Name:</div>
                <div className="uppercase border-b border-gray-200 tracking-wider font-black">{motherName}</div>

                <div className="text-left pl-4 text-[#374151] font-bold">Date Of Birth:</div>
                <div className="uppercase border-b border-gray-200 tracking-wider font-black">{dob}</div>
              </div>

              {/* Course Completion Section */}
              <div className="text-center mt-4 mb-4">
                <p className="font-[950] text-[20px]" style={{ color: '#900000' }}>Has Successfully Completed the Course:</p>
                <p className="text-[32px] font-[950] tracking-wide mt-1 uppercase" style={{ color: '#000000' }}>{courseName}</p>
              </div>

              {/* Bottom Grid for Academic Info */}
              <div className="flex justify-between items-center w-full mt-2 text-[19px]">
                <div className="flex w-[50%] items-baseline">
                  <div className="w-[150px] text-[#374151] font-bold">And Secured:</div>
                  <div className="font-black tracking-wider">{securedPercent || '81'} </div>
                </div>
                <div className="flex w-[50%] justify-start pl-12 items-baseline">
                  <div className="w-[150px] text-[#374151] font-bold">In the Grade:</div>
                  <div className="font-black tracking-wider">{grade || 'A'}</div>
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-4 text-[20px]">
                <div className="flex w-[50%] items-baseline">
                  <div className="w-[150px] text-[#374151] font-bold">Session:</div>
                  <div className="font-black tracking-wider">{session || '2025-2026'}</div>
                </div>
                <div className="flex w-[50%] justify-start pl-12 items-baseline">
                  <div className="w-[150px] text-[#374151] font-bold">Center Code:</div>
                  <div className="font-black tracking-wider" style={{ color: '#000000' }}>{centerCode}</div>
                </div>
              </div>
            </div>

            {/* Logos Row at the bottom */}
            <div className="flex justify-between items-center gap-4 mt-1 px-10 mb-1">
              <div className="w-14 items-center justify-center flex">
                <img src="/images/SSSS/ISO_9001-2015-jbce6_20210920091101_20220203085121_20230819225005.jpg" alt="ISO" />
              </div>
              <div className="w-16">
                <div className="w-16 h-12 rounded-full border border-blue-800 flex items-center justify-center text-blue-800 font-extrabold text-[10px] tracking-wide relative">
                  <img src="/images/SSSS/download_20220928221937_20221025212704.png" alt="IAF" />
                </div>
              </div>
              <div className="w-20">
                <img src="/images/SSSS/swachh-bharat-abhiyan  jbce 5_20210920091019_20220203085200.png" alt="Swachh Bharat" className="w-16 mx-auto" />
              </div>
              <div className="w-24">
                <img src="/images/SSSS/digital india_20231001222002.png" alt="Digital India" className="w-full" />
              </div>
            </div>

            {/* Bottom Row: Reorganized into two rows to prevent overlap */}
            <div className="flex flex-col items-center mt-0 px-2 z-10 w-full gap-1">

              {/* Row 1: Issue Date & Grade Bubble */}
              <div className="flex flex-col items-center">
                <div className="font-black text-[#900000] text-[20px] mb-1 uppercase tracking-widest text-center">
                  ISSUE DATE: {issueDate}
                </div>
                <div className="w-[620px] rounded-[50px] py-1.5 px-6 text-center text-[12px] font-black shadow-md border border-gray-200" style={{ backgroundColor: '#ffffff', color: '#374151' }}>
                  <div style={{ color: '#900000' }}>90% & Above 'A+' Grade, 80% & Above 'A' Grade, 70% & Above 'B' Grade,</div>
                  <div>60% & Above 'C' Grade, 50% & Above 'D' Grade, Below 40% 'Fail'</div>
                </div>
              </div>

              {/* Row 2: Signatures */}
              <div className="flex justify-between items-end w-full px-2">
                <div className="text-center flex flex-col items-center">
                  <div className="h-14 flex items-end justify-center">
                    <img src="/images/sign/amit-tam-sig.png" alt="Amit Kumar" className="h-14 object-contain mix-blend-multiply mb-[-12px]" />
                  </div>
                  <div className="w-44 h-[2.5px] bg-black"></div>
                  <div className="font-black text-[15px] mt-0.5 tracking-tight">Controller of Exam</div>
                </div>

                <div className="text-center flex flex-col items-center">
                  <div className="w-44 flex flex-col items-center">
                    <div className="h-14 flex items-end justify-center">
                      <img src="/images/sign/dheeraj.png" alt="Dheeraj" className="h-16 object-contain mix-blend-multiply mb-[-14px]" />
                    </div>
                    <div className="w-44 h-[2.5px] bg-black"></div>
                    <div className="font-black text-[15px] mt-0.5 text-center whitespace-nowrap tracking-tight">Authorized Signatory</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Address */}
            <div className="text-center mt-0 mb-0 text-[14.5px] font-black w-full" style={{ color: '#1f2937' }}>
              <p className="tracking-wide">Head Office: {centerAddress}</p>
              <div className="flex justify-center gap-14 mt-1 text-[13px] tracking-wide">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#900000] font-[950]">Visit On US :</span>
                  <span className="text-[#1e40af] font-[950] underline decoration-1 underline-offset-4">https://sstci-student-panel-cms.vercel.app/</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#900000] font-[950]">Verify Tab in :</span>
                  <span className="text-[#1e40af] font-[950] underline decoration-1 underline-offset-4">{process.env.NEXT_PUBLIC_BACKEND_API_URL}verify-certificate</span>
                </div>
                <div className="text-[#1e40af] font-[950] underline decoration-1 underline-offset-4 lowercase">info@sstci.in</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

