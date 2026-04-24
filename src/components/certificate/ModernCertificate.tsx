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
  centerAddress = '12, Radhe ,Dhikunni Bharawan, Hardoi Uttar Pradesh 241203',
  issueDate = '',
  studentPhotoUrl = '',
}: CertificateProps) {
  return (
    <div className="flex justify-center items-center p-4 overflow-auto" style={{ backgroundColor: '#e5e7eb', color: '#111827', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Outer Certificate Border with complex gold styling */}
      <div className="relative w-[900px] h-auto p-[6px] shadow-2xl shrink-0"
        style={{ backgroundColor: '#ffffff', background: 'linear-gradient(135deg, rgba(234,213,141,1) 0%, rgba(200,165,65,1) 50%, rgba(234,213,141,1) 100%)' }}>

        <div className="w-full h-full border-[4px] border-[#c0993d] outline outline-2 outline-offset-2 outline-[#c0993d] p-10 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>

          {/* Faint Background Watermark Image */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mt-8">
            <div className="relative w-[520px] h-[580px] flex items-center justify-center opacity-[0.20]">
              <svg width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="none">
                <defs>
                  <path id="curveTop" d="M 100 330 A 170 170 0 1 1 400 330" />
                  <path id="curveBottom" d="M 51 200 A 205 205 0 1 0 449 200" />
                </defs>

                {/* Outer Rings */}
                <circle cx="250" cy="250" r="235" fill="none" stroke="#d4af37" strokeWidth="12" />

                {/* Ribbon Text Background (Darker blue for better white font contrast) */}
                <circle cx="250" cy="250" r="191" fill="none" stroke="#1e3a8a" strokeWidth="62" />

                <circle cx="250" cy="250" r="222" fill="none" stroke="#1e3a8a" strokeWidth="4" />

                {/* Inner Rings */}
                <circle cx="250" cy="250" r="160" fill="none" stroke="#1e3a8a" strokeWidth="4" />
                <circle cx="250" cy="250" r="150" fill="none" stroke="#d4af37" strokeWidth="6" />

                {/* Top Text */}
                <text fill="#ffffff" fontSize="22" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" letterSpacing="1">
                  <textPath href="#curveTop" startOffset="50%" textAnchor="middle">
                    {centerName}
                  </textPath>
                </text>

                {/* Bottom Text */}
                <text fill="#ffffff" fontSize="20" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" letterSpacing="1">
                  <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">
                    Master the Computer, Shape the Future
                  </textPath>
                </text>

                {/* Center Image Component (Monitor + Graduation Cap) */}
                <g transform="translate(130, 130) scale(1.6)">
                  {/* Monitor */}
                  <rect x="30" y="45" width="90" height="65" rx="4" fill="none" stroke="#1e3a8a" strokeWidth="7" />
                  <path d="M 55 110 L 95 110 L 110 135 L 40 135 Z" fill="#1e3a8a" />
                  <path d="M 40 135 L 110 135 L 110 142 L 40 142 Z" fill="#d4af37" />

                  {/* Cap */}
                  <path d="M 75 5 L 130 25 L 75 45 L 20 25 Z" fill="#1e3a8a" />
                  <path d="M 45 32 L 45 45 C 45 60, 105 60, 105 45 L 105 32 Z" fill="#1e3a8a" />

                  {/* Tassel */}
                  <path d="M 125 25 L 125 55" stroke="#d4af37" strokeWidth="4" />
                  <circle cx="125" cy="60" r="4" fill="#d4af37" />
                </g>
              </svg>
            </div>
          </div>

          <div className="relative z-10 w-full h-full flex flex-col">

            {/* Header row: Cert No & Enroll No */}
            <div className="flex justify-between font-bold text-sm tracking-wide mb-6 px-4" style={{ color: '#78350f' }}>
              <span>Certificate No: <span style={{ color: '#000000', fontSize: '15px' }}>{certificateNo || 'Pending'}</span></span>
              <span>Enrollment No: <span style={{ color: '#000000', fontSize: '15px' }}>{enrollmentNo || 'Pending'}</span></span>
            </div>

            {/* Top Logos Row */}
            <div className="flex justify-between items-start mt-2 px-8 h-14 mb-4 relative z-20">
              {/* MSME Logo */}
              <div className="w-[85px] mt-[-20px] flex flex-col items-center">
                <img src="/images/logo/msme-logo.jpg" alt="MSME Logo"
                  className="w-full h-auto object-contain"
                  width={85} height={85} />
              </div>

              {/* Center Logo Placeholder for SSTCI */}
              <div className="w-28 h-28 mt-[-40px] rounded-full flex flex-col items-center justify-center text-white font-bold text-center p-2 ">
                <img src="/images/logo/SST-logo.png" alt="SST-logo" className="w-full h-full object-cover" />
              </div>

              {/* QRO Logo */}
              <div className="w-[85px] mt-[-20px] flex flex-col items-center">
                <img src="/images/SSSS/jaybalajieducation ro logo_20211101090204_20220203085108 (1)_20230819225226.png" alt="QRO Logo" className="w-full h-auto object-contain" width={85} height={85} />
              </div>
            </div>

            {/* Main Title */}
            <div className="mt-2 w-full text-center">
              <span className="text-[25px] font-[900] !text-[#900000] uppercase tracking-tight" style={{ fontFamily: 'Arial, sans-serif', fontSize: '2.4rem', width: '100%' }}>
                {centerName}
              </span>
            </div>

            {/* Subtitles & Corporate Info */}
            <div className="text-center mt-3 text-[13px] leading-[1.3] font-bold" style={{ color: '#111827' }}>
              <p>An ISO 9001:2026 Certified Institute</p>
              <p>Registered Under Ministry of Corporate Affairs (Govt. of India)</p>
              <p className="font-[900] text-[14px]">Udyam Registration No.: UDYAM-UP-35-0054566</p>
              <p>Registered under the Societies Registration Act, 1860 (Act No. 21).</p>
              <p className="font-[900] text-[14px]">Society Registration No.:HAR/05025/2025-2026</p>

              <p className="mt-1">(An Autonomous Institute Registered Under the Micro, Small or Medium Enterprise MSME Regd. with Govt. of India)</p>
              <p>(A National Programme Of I.T Education & Computer Literacy)</p>
            </div>

            {/* Certificate Title & Photos Row */}
            <div className="flex justify-between items-center w-full px-8 mt-4 relative z-20">
              <div className="w-[120px] flex-shrink-0"></div>

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
                    src={process.env.NEXT_PUBLIC_BACKEND_API_URL + "uploads/" + studentPhotoUrl || 'https://placehold.co/120x150?text=Photo'}
                    alt="Student"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area: Student Details Grid */}
            <div className="relative mt-8 px-6 text-[15px] font-[900] w-full z-20" style={{ color: '#000000' }}>

              {/* Top Grid for Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[125px_3fr_130px_3fr] gap-x-2 gap-y-4 items-start w-full text-[10px] md:text-[15px]">
                <div className="text-left whitespace-nowrap">Mr./Mrs/Miss:</div>
                <div className="uppercase break-words">{studentName}</div>

                <div className="text-left sm:pl-2 whitespace-nowrap">Father's Name:</div>
                <div className="uppercase leading-tight max-w-[195px] md:max-w-[200px] break-words sm:pl-2 md:pl-4">{fatherName}</div>

                <div className="text-left whitespace-nowrap">Mother's Name :</div>
                <div className="uppercase break-words">{motherName}</div>

                <div className="text-left sm:pl-2 whitespace-nowrap">Date Of Birth:</div>
                <div className="uppercase break-words sm:pl-2 md:pl-4">{dob}</div>
              </div>

              {/* Course Completion Section */}
              <div className="text-center mt-6 mb-6">
                <p className="font-[800] text-[16px]" style={{ color: '#900000' }}>Has Successfully Completed the Course:</p>
                <p className="text-[22px] font-[900] tracking-wide mt-0" style={{ color: '#000000' }}>{courseName}</p>
              </div>

              {/* Bottom Grid for Academic Info */}
              <div className="flex justify-between items-center w-full mt-2">
                <div className="flex w-[50%]">
                  <div className="w-[120px] text-left">And Secured:</div>
                  <div>{securedPercent || '81 %'}</div>
                </div>
                <div className="flex w-[50%] justify-start pl-2">
                  <div className="w-[110px] text-left">In the Grade:</div>
                  <div>{grade || 'A'}</div>
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-3">
                <div className="flex w-[50%]">
                  <div className="w-[120px] text-left">Session:</div>
                  <div>{session || '2025-2026'}</div>
                </div>
                <div className="flex w-[50%] justify-start pl-2">
                  <div className="w-[110px] text-left">Center Code:</div>
                  <div style={{ color: '#000000' }}>{centerCode}</div>
                </div>
              </div>
            </div>

            {/* Logos Row at the bottom */}
            <div className="flex justify-between items-center gap-4 mt-8 px-10">
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

            {/* Bottom Row: Controller, QR, Signatory */}
            <div className="flex justify-between items-end mt-12 px-8 z-10 w-full static bottom-0">

              <div className="text-center">
                <div className="w-40 border-t border-black mb-1"></div>
                <div className="font-bold text-[14px]">Controller of Exam</div>
              </div>

              <div className="flex flex-col items-center flex-1">
                <div className="font-[900] text-[#900000] text-lg mb-2 uppercase text-center w-full">
                  ISSUE DATE: {issueDate}
                </div>
                <div className="w-[105%] max-w-[480px] rounded-[50px] py-1 px-3 text-center text-[10px] font-bold shadow-md" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                  <div style={{ color: '#900000' }}>90% & Above 'A+' Grade, 80% & Above 'A' Grade, 70% & Above 'B' Grade,</div>
                  <div>60% & Above 'C' Grade, 50% & Above 'D' Grade, Below 40% 'Fail'</div>
                </div>
              </div>

              <div className="text-center flex flex-col items-end relative">
                <div className="absolute bottom-[35px] left-[-70px]">
                  <QRCodeSVG value={`https://spaptc.in/certificate-verify?cert=${certificateNo}`} size={60} />
                </div>
                <div className="w-40 flex flex-col items-center">
                  <div className="w-40 border-t border-black mb-1"></div>
                  <div className="font-bold text-[14px]">Authorized Signatory</div>
                </div>
              </div>

            </div>

            {/* Footer Address */}
            <div className="text-center mt-6 text-[11px] font-bold" style={{ color: '#1f2937' }}>
              <p>Head Office: {centerAddress}</p>
              <div className="flex justify-center gap-6 mt-1 text-[10px]" style={{ color: '#900000' }}>
                <span>Visit On US : <span style={{ color: '#1e40af' }}>www.sstci.in</span></span>
                <span>Verify Tab in <span style={{ color: '#1e40af' }}>www.sstci.in/certificate-verify</span></span>
                <span style={{ color: '#1e40af' }}>info@sstci.in</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
