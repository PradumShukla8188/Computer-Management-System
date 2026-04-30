/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

interface SubjectMark {
  title: string;
  totalMarks: number;
  obtainedMarks: number;
}

interface MarksheetProps {
  marksheetNo?: string;
  rollNo?: string;
  studentName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  courseName?: string;
  session?: string;
  centerCode?: string;
  centerName?: string;
  centerAddress?: string;
  issueDate?: string;
  studentPhotoUrl?: string;
  qrCodeUrl?: string;
  subjects?: SubjectMark[];
  totalObtained?: number;
  totalMaximum?: number;
  percentage?: string;
  grade?: string;
  result?: string;
}

export default function ModernMarksheet({
  marksheetNo = '',
  rollNo = '',
  studentName = '',
  fatherName = '',
  motherName = '',
  dob = '',
  courseName = '',
  session = '',
  centerCode = 'SSTCI/2262025',
  centerName = 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
  centerAddress = 'Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila,Hardoi, Uttar Pradesh 241203',
  issueDate = '',
  studentPhotoUrl = '',
  qrCodeUrl = '',
  subjects = [],
  totalObtained = 0,
  totalMaximum = 0,
  percentage = '',
  grade = '',
  result = 'PASSED',
}: MarksheetProps) {
  return (
    <div className="flex justify-center items-center p-4 bg-slate-200 min-h-screen font-serif">
      <div className="relative w-[900px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden rounded-sm"
        style={{
          background: 'linear-gradient(135deg, #fff 0%, #f8faff 100%)',
          border: '12px solid transparent',
          borderImage: 'linear-gradient(135deg, #d4af37 0%, #f1c40f 25%, #d4af37 50%, #f1c40f 75%, #d4af37 100%) 1'
        }}>

        {/* Main Border */}
        <div className="m-2 border-[4px] border-[#21418c] p-10 relative h-full">

          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#21418c]"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#21418c]"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#21418c]"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#21418c]"></div>

          {/* Watermark Logo */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
            <img src="/images/logo/SST-logo.png" alt="watermark" className="w-[500px] h-auto grayscale" />
          </div>

          <div className="relative z-10">
            {/* Top Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-24">
                <img src="/images/logo/SST-logo.png" alt="Logo" className="w-full h-auto" />
              </div>
              <div className="flex-1 text-center px-4">
                <h1 className="text-3xl font-[900] text-[#21418c] leading-tight uppercase mb-1 tracking-tight">
                  {centerName}
                </h1>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-2"></div>
                <p className="text-[12px] font-bold text-gray-700 uppercase">
                  Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila, Hardoi, U.P. 241203
                </p>
                <p className="text-[11px] font-semibold text-blue-800 mt-1">
                  ISO 9001:2026 Certified | Regd. Under MCA, Govt. of India
                </p>
              </div>
              <div className="w-24 h-32 border-2 border-blue-900 p-1 bg-white shadow-md">
                <img
                  src={studentPhotoUrl ? (studentPhotoUrl.startsWith('http') ? studentPhotoUrl : `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${studentPhotoUrl}`) : '/images/default-avatar.png'}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Title Section */}
            <div className="relative mb-10">
              <div className="bg-[#21418c] py-4 rounded-xl shadow-lg transform -skew-x-6 mx-12">
                <h2 className="text-2xl font-black text-white text-center tracking-[0.2em] skew-x-6">
                  STATEMENT OF MARKS
                </h2>
              </div>
              <div className="text-center mt-2 font-bold text-[#d4af37] text-sm italic">
                Official Statement of Academic Excellence
              </div>
            </div>

            {/* Student Details Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              {[
                { label: 'Student Name', value: studentName },
                { label: "Father's Name", value: fatherName },
                { label: "Mother's Name", value: motherName },
                { label: 'Roll Number', value: rollNo },
                { label: 'Course Name', value: courseName },
                { label: 'Date of Birth', value: dob },
                { label: 'Session', value: session },
                { label: 'Issue Date', value: issueDate },
              ].map((item, i) => (
                <div key={i} className="flex flex-col border-b border-blue-200 pb-1">
                  <span className="text-[10px] text-blue-700 uppercase font-black tracking-wider">{item.label}</span>
                  <span className="text-[15px] font-bold text-gray-900 truncate uppercase">{item.value || 'N/A'}</span>
                </div>
              ))}
            </div>

            {/* Marks Table */}
            <div className="mb-8 shadow-xl rounded-xl overflow-hidden border-2 border-[#21418c]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#21418c] text-white">
                    <th className="py-3 px-4 text-left font-black uppercase tracking-wider w-16">#</th>
                    <th className="py-3 px-4 text-left font-black uppercase tracking-wider">Subject Description</th>
                    <th className="py-3 px-4 text-center font-black uppercase tracking-wider w-32">Max</th>
                    <th className="py-3 px-4 text-center font-black uppercase tracking-wider w-32">Obtained</th>
                    <th className="py-3 px-4 text-center font-black uppercase tracking-wider w-32">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {subjects.length > 0 ? subjects.map((sub, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/10'}>
                      <td className="py-2 px-4 font-bold text-blue-900 border-r border-blue-50 text-center">{idx + 1}</td>
                      <td className="py-2 px-4 font-bold text-gray-800 border-r border-blue-50 uppercase text-xs">{sub.title}</td>
                      <td className="py-2 px-4 text-center font-black text-gray-900 border-r border-blue-50">{sub.totalMarks}</td>
                      <td className="py-2 px-4 text-center font-black text-blue-700 border-r border-blue-50">{sub.obtainedMarks}</td>
                      <td className="py-2 px-4 text-center font-black text-gray-700">
                        {grade || 'B'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-bold italic">No examination records found</td>
                    </tr>
                  )}
                  {/* Fillers to maintain height */}
                  {Array.from({ length: Math.max(0, 8 - subjects.length) }).map((_, i) => (
                    <tr key={i} className="h-8">
                      <td className="border-r border-blue-50"></td>
                      <td className="border-r border-blue-50"></td>
                      <td className="border-r border-blue-50"></td>
                      <td className="border-r border-blue-50"></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#1e3a8a] text-white font-black">
                    <td colSpan={2} className="py-3 px-6 text-left uppercase tracking-widest text-sm">Aggregate Total</td>
                    <td className="py-3 px-2 text-center border-l border-blue-800 text-lg">{totalMaximum}</td>
                    <td className="py-3 px-2 text-center border-l border-blue-800 text-lg text-[#ffde59]">{totalObtained}</td>
                    <td className="py-3 px-2 text-center border-l border-blue-800 text-lg">{percentage}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Summary & QR Section - Exactly like Image 2 */}
            <div className="flex gap-4 mb-8 h-24">
              {/* Result Card */}
              <div className="w-[30%] border-[3px] border-[#1e3a8a] rounded-xl p-3 bg-white flex flex-col items-center justify-center shadow-md">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1">Final Result</div>
                <div className={`text-3xl font-black ${(result === 'PASS' || result === 'PASSED') ? 'text-red-600' : 'text-red-800'}`}>
                  {result}
                </div>
              </div>

              {/* Grade & QR Combined Card */}
              <div className="flex-1 border-[3px] border-[#1e3a8a] rounded-xl bg-white flex shadow-md overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center border-r-2 border-gray-100">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1">Performance Grade</div>
                  <div className="text-4xl font-black text-gray-900">{grade || 'B'}</div>
                </div>
                <div className="w-48 p-2 flex items-center justify-between bg-white">
                  <div className="flex flex-col justify-center pl-2">
                    <div className="text-[8px] font-black text-gray-400 uppercase leading-tight">Verify</div>
                    <div className="text-[8px] font-black text-gray-400 uppercase leading-tight">Authenticity</div>
                  </div>
                  <div className="p-1 border border-gray-100 rounded-lg">
                    <QRCodeSVG value={`https://sstci.in/verify?roll=${rollNo}`} size={55} />
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="flex justify-between items-end mt-16 px-4">
              <div className="text-center group">
                <img src="/images/sign/amit-tam-sig.png" alt="sign" className="h-10 mb-2 mix-blend-multiply transition-transform group-hover:scale-110" />
                <div className="w-32 h-[2px] bg-gray-900 mb-1 mx-auto"></div>
                <div className="text-[10px] font-black text-gray-700 uppercase tracking-tighter">Exam Controller</div>
              </div>

              <div className="text-center mb-[-10px]">
                <div className="bg-[#1e3a8a] text-white px-8 py-2 rounded-full font-black text-xs shadow-lg uppercase tracking-widest">
                  Official Seal
                </div>
              </div>

              <div className="text-center group">
                <img src="/images/sign/dheeraj.png" alt="sign" className="h-10 mb-2 mix-blend-multiply transition-transform group-hover:scale-110" />
                <div className="w-32 h-[2px] bg-gray-900 mb-1 mx-auto"></div>
                <div className="text-[10px] font-black text-gray-700 uppercase tracking-tighter">Authorized Signatory</div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-10 text-center">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">
                Computer Generated Document - Secure Academic Record
              </p>
              <div className="bg-[#1e3a8a] text-[10px] text-white py-2 px-6 rounded-lg font-bold inline-block shadow-sm">
                Head Office: Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila, Hardoi, U.P. 241203 | Web: www.sstci.in
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


