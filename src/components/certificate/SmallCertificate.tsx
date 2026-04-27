/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

interface SmallCertificateProps {
  certificateNo: string;
  enrollmentNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  courseName: string;
  securedPercent: string;
  grade: string;
  session: string;
  centerCode: string;
  centerName: string;
  centerAddress?: string;
  issueDate: string;
  studentPhotoUrl: string;
  qrCodeUrl?: string;
}

const SmallCertificate: React.FC<SmallCertificateProps> = ({
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
}) => {
  
  const getFullUrl = (path: string) => {
    if (!path) return 'https://placehold.co/120x150?text=Photo';
    if (path.startsWith('http')) return path;
    const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_API_URL || '').replace(/\/$/, '');
    const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  return (
    <div className="flex justify-center items-center p-2 md:p-4 overflow-auto bg-transparent">
      {/* Outer Certificate Border with complex gold styling */}
      <div className="relative w-full max-w-[900px] h-auto p-[4px] md:p-[6px] shadow-2xl shrink-0"
        style={{ backgroundColor: '#ffffff', background: 'linear-gradient(135deg, rgba(234,213,141,1) 0%, rgba(200,165,65,1) 50%, rgba(234,213,141,1) 100%)' }}>

        <div className="w-full h-full border-[3px] md:border-[4px] border-[#c0993d] outline outline-1 md:outline-2 outline-offset-1 md:outline-offset-2 outline-[#c0993d] p-4 md:p-10 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>

          {/* Faint Background Watermark Image */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mt-8">
            <div className="relative w-[300px] md:w-[520px] h-[350px] md:h-[580px] flex items-center justify-center opacity-[0.20]">
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
                  <textPath href="#curveTop" startOffset="50%" textAnchor="middle">{centerName}</textPath>
                </text>
                <text fill="#ffffff" fontSize="20" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" letterSpacing="1">
                  <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">Master the Computer, Shape the Future</textPath>
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

          <div className="relative z-10 w-full h-full flex flex-col">

            {/* Header row: Cert No & Enroll No */}
            <div className="flex justify-between font-bold text-[10px] md:text-sm tracking-wide mb-4 md:mb-6 px-2 md:px-4 text-[#78350f]">
              <span>Cert No: <span className="text-black text-[12px] md:text-[15px]">{certificateNo || 'Pending'}</span></span>
              <span>Enroll No: <span className="text-black text-[12px] md:text-[15px]">{enrollmentNo || 'Pending'}</span></span>
            </div>

            {/* Top Logos Row */}
            <div className="flex justify-between items-start mt-2 px-4 md:px-8 h-10 md:h-14 mb-4 relative z-20">
              <div className="w-12 md:w-[85px] mt-[-10px] md:mt-[-20px] flex flex-col items-center">
                <img src="/images/logo/msme-logo.jpg" alt="MSME Logo" className="w-full h-auto object-contain" />
              </div>

              <div className="w-16 md:w-28 mt-[-20px] md:mt-[-40px] flex flex-col items-center">
                <img src="/images/logo/SST-logo.png" alt="SST-logo" className="w-full h-auto object-contain" />
              </div>

              <div className="w-12 md:w-[85px] mt-[-10px] md:mt-[-20px] flex flex-col items-center">
                <img src="/images/SSSS/jaybalajieducation ro logo_20211101090204_20220203085108 (1)_20230819225226.png" alt="QRO Logo" className="w-full h-auto object-contain" />
              </div>
            </div>

            {/* Main Title */}
            <div className="mt-2 w-full text-center">
              <h1 className="text-[18px] md:text-[36px] font-[900] text-[#900000] uppercase tracking-tight leading-tight">
                {centerName}
              </h1>
            </div>

            {/* Subtitles & Corporate Info */}
            <div className="text-center mt-2 md:mt-3 text-[9px] md:text-[13px] leading-[1.3] font-bold text-gray-900">
              <p>An ISO 9001:2026 Certified Institute</p>
              <p>Registered Under Ministry of Corporate Affairs (Govt. of India)</p>
              <p className="font-[900] text-[10px] md:text-[14px]">Udyam Registration No.: UDYAM-UP-35-0054566</p>
              <p>Registered under the Societies Registration Act, 1860 (Act No. 21).</p>
              <p className="font-[900] text-[10px] md:text-[14px]">Society Registration No.:HAR/05025/2025-2026</p>
              <p className="mt-1">(An Autonomous Institute Registered Under MSME Regd. with Govt. of India)</p>
              <p>(A National Programme Of I.T Education & Computer Literacy)</p>
            </div>

            {/* Certificate Title & Photos Row */}
            <div className="flex justify-between items-center w-full px-4 md:px-8 mt-4 md:mt-6 relative z-20">
              <div className="w-[60px] md:w-[120px] flex-shrink-0 flex justify-start items-center">
                <div className="w-14 h-14 md:w-[110px] md:h-[110px] flex items-center justify-center bg-white shadow-sm border border-gray-200 p-1">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  ) : (
                    <QRCodeSVG value={typeof window !== 'undefined' ? `${window.location.origin}/verify-certificate?certNo=${certificateNo}` : ''} size={100} style={{width: '100%', height: '100%'}} />
                  )}
                </div>
              </div>

              <div className="text-center flex-1 flex flex-col items-center mt-4 md:mt-8 relative z-30">
                <h2 className={`text-[40px] md:text-[100px] text-[#dc2626] leading-[0.7] ${greatVibes.className}`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                  Certificate
                </h2>
                <div className="text-[12px] md:text-[24px] font-bold text-[#1e3a8a] tracking-wide mt-2">
                  This is Certified That
                </div>
              </div>

              <div className="w-[60px] md:w-[120px] flex-shrink-0 flex justify-end">
                <div className="w-14 h-16 md:w-[110px] md:h-[140px] overflow-hidden border-[2px] md:border-[3px] border-gray-300 shadow-sm p-1 bg-white">
                  <img src={getFullUrl(studentPhotoUrl)} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              </div>
            </div>

            {/* Main Content Area: Student Details Grid */}
            <div className="relative mt-6 md:mt-10 px-2 md:px-6 text-[10px] md:text-[15px] font-[900] w-full z-20 text-black">
              <div className="grid grid-cols-2 md:grid-cols-[125px_3fr_130px_3fr] gap-y-3 md:gap-y-4">
                <div className="text-left text-gray-700">Mr./Mrs/Miss:</div>
                <div className="uppercase border-b border-gray-100">{studentName}</div>
                <div className="text-left md:pl-4 text-gray-700">Father's Name:</div>
                <div className="uppercase border-b border-gray-100">{fatherName}</div>
                <div className="text-left text-gray-700">Mother's Name:</div>
                <div className="uppercase border-b border-gray-100">{motherName}</div>
                <div className="text-left md:pl-4 text-gray-700">Date Of Birth:</div>
                <div className="uppercase border-b border-gray-100">{dob}</div>
              </div>

              <div className="text-center mt-6 md:mt-8">
                <p className="font-[800] text-[12px] md:text-[16px] text-[#900000]">Has Successfully Completed the Course:</p>
                <p className="text-[16px] md:text-[24px] font-[900] uppercase mt-1">{courseName}</p>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center w-full mt-6 gap-2">
                <div className="flex w-full md:w-auto">
                  <div className="w-24 md:w-32 text-left text-gray-700">And Secured:</div>
                  <div className="border-b border-gray-100 flex-1 md:flex-none md:min-w-[80px]">{securedPercent}</div>
                </div>
                <div className="flex w-full md:w-auto">
                  <div className="w-24 md:w-32 text-left text-gray-700">In the Grade:</div>
                  <div className="border-b border-gray-100 flex-1 md:flex-none md:min-w-[80px]">{grade}</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center w-full mt-3 gap-2">
                <div className="flex w-full md:w-auto">
                  <div className="w-24 md:w-32 text-left text-gray-700">Session:</div>
                  <div className="border-b border-gray-100 flex-1 md:flex-none md:min-w-[80px]">{session}</div>
                </div>
                <div className="flex w-full md:w-auto">
                  <div className="w-24 md:w-32 text-left text-gray-700">Center Code:</div>
                  <div className="border-b border-gray-100 flex-1 md:flex-none md:min-w-[80px]">{centerCode}</div>
                </div>
              </div>
            </div>

            {/* Bottom Logos */}
            <div className="flex justify-between items-center gap-2 md:gap-4 mt-8 md:mt-12 px-2 md:px-10">
              <img src="/images/SSSS/ISO_9001-2015-jbce6_20210920091101_20220203085121_20230819225005.jpg" alt="ISO" className="h-6 md:h-12" />
              <img src="/images/SSSS/download_20220928221937_20221025212704.png" alt="IAF" className="h-6 md:h-12" />
              <img src="/images/SSSS/swachh-bharat-abhiyan  jbce 5_20210920091019_20220203085200.png" alt="Swachh" className="h-8 md:h-14" />
              <img src="/images/SSSS/digital india_20231001222002.png" alt="Digital India" className="h-8 md:h-14" />
            </div>

            {/* Signatures Row */}
            <div className="flex justify-between items-end mt-8 md:mt-14 px-4 md:px-8 pb-4">
              <div className="text-center flex flex-col items-center">
                <img src="/images/sign/amit-tam-sig.png" alt="Sign 1" className="h-8 md:h-12 mix-blend-multiply" />
                <div className="w-24 md:w-40 border-t border-black mt-1"></div>
                <p className="text-[8px] md:text-[14px] font-bold mt-1 uppercase">Controller of Exam</p>
              </div>

              <div className="text-center flex flex-col items-center flex-1 px-2">
                <p className="text-[10px] md:text-[18px] font-black text-[#900000] mb-2 uppercase">ISSUE DATE: {issueDate}</p>
                <div className="bg-gray-100 rounded-full py-1 px-3 text-[6px] md:text-[10px] font-bold text-gray-600 shadow-sm leading-tight">
                  <div className="text-[#900000]">90% & Above 'A+' | 80% & Above 'A' | 70% & Above 'B'</div>
                  <div>60% & Above 'C' | 50% & Above 'D' | Below 40% 'Fail'</div>
                </div>
              </div>

              <div className="text-center flex flex-col items-center">
                <img src="/images/sign/dheeraj.png" alt="Sign 2" className="h-8 md:h-12 mix-blend-multiply" />
                <div className="w-24 md:w-40 border-t border-black mt-1"></div>
                <p className="text-[8px] md:text-[14px] font-bold mt-1 uppercase">Authorized Signatory</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[7px] md:text-[11px] font-bold text-gray-800 mt-2 border-t pt-2">
              <p>Head Office: {centerAddress}</p>
              <div className="flex justify-center gap-4 mt-1 text-[6px] md:text-[10px] text-[#900000]">
                <span>Visit On US : <span className="text-blue-700">https://sstci-student-panel-cms.vercel.app/</span></span>
                <span>Verify Tab in SSTCI Portal</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallCertificate;
