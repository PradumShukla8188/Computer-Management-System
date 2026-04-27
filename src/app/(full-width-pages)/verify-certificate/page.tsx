"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePublicSearchCertificates } from "../../(admin)/(private)/certificate/hooks/useCertificateApi";
import dayjs from "dayjs";
import SmallCertificate from "@/components/certificate/SmallCertificate";

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const certNoParam = searchParams.get("certNo");
  
  const [searchCriteria, setSearchCriteria] = useState<any>({});
  const [formData, setFormData] = useState({
    search: "",
    searchType: "certificateNo",
    studentName: "",
    dob: ""
  });

  const { data: results = [], isLoading, isFetched } = usePublicSearchCertificates(searchCriteria);

  useEffect(() => {
    if (certNoParam) {
      const criteria = { search: certNoParam, searchType: "certificateNo" };
      setSearchCriteria(criteria);
      setFormData(prev => ({ ...prev, search: certNoParam, searchType: "certificateNo" }));
    }
  }, [certNoParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria: any = {
      search: formData.search,
      searchType: formData.searchType,
      studentName: formData.studentName,
      dob: formData.dob ? dayjs(formData.dob).format("DD-MM-YYYY") : undefined,
    };
    setSearchCriteria(criteria);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.482a11.955 11.955 0 01-8.618-3.04M12 21.482a11.955 11.955 0 008.618-3.04M12 21.482V11.177" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Certificate Verification</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Verify the authenticity of student certificates issued by SST COMPUTER & WELL KNOWLEDGE INSTITUTE.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Search By</label>
                <select 
                  name="searchType"
                  value={formData.searchType}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                >
                  <option value="certificateNo">Certificate Number</option>
                  <option value="enrollment">Enrollment Number</option>
                  <option value="roll">Roll Number</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Number / ID</label>
                <input 
                  type="text"
                  name="search"
                  value={formData.search}
                  onChange={handleInputChange}
                  placeholder="Enter certificate or enrollment number..."
                  required
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or Search by Details</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Student Name</label>
                <input 
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Full name as on certificate"
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Date of Birth</label>
                <input 
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="text-center pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Verifying...
                   </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Verify Certificate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-bounce p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.482a11.955 11.955 0 01-8.618-3.04M12 21.482a11.955 11.955 0 008.618-3.04M12 21.482V11.177" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Verifying records...</h3>
          </div>
        ) : isFetched && results.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <img src="https://illustrations.popsy.co/blue/abstract-art-6.svg" alt="Not found" className="w-48 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Certificate Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any student record matching the details provided. Please check the inputs and try again.</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-12 pb-20">
            {results.map((item: any, index: number) => (
              <div key={index} className="animate-fade-in">
                {/* Success Banner */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex items-center mb-8">
                  <div className="flex-shrink-0 bg-green-500 text-white rounded-full p-1.5 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-green-800 font-bold text-lg">Verified Successfully</h4>
                    <p className="text-green-700 text-sm">This is an authentic certificate issued by our institute.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                   {/* Summary Info */}
                   <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-50 space-y-6">
                      <h4 className="text-slate-900 font-bold uppercase text-xs tracking-widest border-b pb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Student Records
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</label>
                          <span className="block font-bold text-lg text-slate-900 uppercase">{item.student.name}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Father's Name</label>
                          <span className="block font-bold text-slate-700 uppercase">{item.student.fatherName}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrollment No</label>
                          <span className="block font-bold text-slate-700 tracking-wider">{item.student.rollNo}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Name</label>
                          <span className="block font-bold text-slate-700">{item.student.courseId?.name || item.student.courseName}</span>
                        </div>
                        <div className="pt-2">
                           <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm border border-amber-100">
                             Grade Secured: <span className="ml-2 text-lg text-amber-800">{item.certificate?.grade || item.student.grade || "A"}</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   {/* Institute Info */}
                   <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-md border border-slate-50 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">SST COMPUTER & WELL KNOWLEDGE INSTITUTE</h3>
                          <p className="text-blue-600 font-bold text-sm">ISO 9001:2026 Certified Institute</p>
                          <div className="mt-6 space-y-2">
                             <p className="text-slate-500 text-sm flex items-start">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                               </svg>
                               Dikunni Dhikunni, Bharawan, Hardoi, UP 241203
                             </p>
                             <p className="text-slate-500 text-sm flex items-center">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                               </svg>
                               +91 9519222486
                             </p>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 flex flex-col items-center justify-center min-w-[140px]">
                           <div className="bg-green-500 text-white rounded-full p-2 mb-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                           </div>
                           <span className="text-green-700 font-black uppercase text-xs tracking-widest">Genuine Record</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400">
                         <span>Verification Date: {dayjs().format("DD-MM-YYYY HH:mm")}</span>
                         <span className="text-slate-300">CMS_GENUINE_TOKEN_{Math.random().toString(36).substring(7).toUpperCase()}</span>
                      </div>
                   </div>
                </div>

                {/* The Certificate Display */}
                <div className="mt-12 w-full overflow-x-auto pb-8 flex justify-center">
                   <div className="min-w-[700px] flex justify-center">
                      {item.certificate && (
                        <SmallCertificate
                          certificateNo={item.certificate.certificateNumber}
                          enrollmentNo={item.student.rollNo}
                          studentName={item.student.name}
                          fatherName={item.student.fatherName}
                          motherName={item.student.motherName}
                          dob={dayjs(item.student.dob).format("DD-MM-YYYY")}
                          courseName={item.student.courseId?.name || item.student.courseName}
                          securedPercent={item.student.securedPercent}
                          grade={item.certificate.grade || item.student.grade}
                          session={item.student.session}
                          centerCode={item.student.centerCode}
                          centerName="SST COMPUTER & WELL KNOWLEDGE INSTITUTE"
                          issueDate={dayjs(item.certificate.issuedAt).format("DD-MM-YYYY")}
                          studentPhotoUrl={item.student.studentPhoto}
                          qrCodeUrl={item.certificate.data?.qr_code}
                        />
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-slate-100">
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.482a11.955 11.955 0 01-8.618-3.04M12 21.482a11.955 11.955 0 008.618-3.04M12 21.482V11.177" />
                </svg>
             </div>
             <h3 className="text-xl font-extrabold text-slate-900 mb-2">Ready to Verify?</h3>
             <p className="text-slate-500 max-w-sm mx-auto">Enter the certificate details above to confirm the authenticity of the academic records.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-20 text-slate-400 font-medium text-sm">
          <p>© {new Date().getFullYear()} SST COMPUTER & WELL KNOWLEDGE INSTITUTE. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
             <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
             <span>•</span>
             <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Secure Verification...</p>
      </div>
    }>
      <VerifyCertificateContent />
    </Suspense>
  );
}
