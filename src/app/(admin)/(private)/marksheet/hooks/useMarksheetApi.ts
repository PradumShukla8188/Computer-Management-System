"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { axiosInstance } from "@/lib/axiosApi/axiosInstance";
import { message } from "antd";

// Fetch students eligible for marksheet (those who have published marks)
export const useEligibleMarksheetStudents = () => {
  return useQuery({
    queryKey: ["eligible-marksheet-students"],
    queryFn: async () => {
      // If the specific endpoint doesn't exist, we fallback to all marks and filter unique students
      try {
        const res = await ApiHitter("GET", "GET_ELIGIBLE_MARKSHEET_STUDENTS", {}, "");
        return res.data || [];
      } catch (e) {
        // Fallback: Get all marks and group by student
        const res = await ApiHitter("GET", "GET_ALL_STUDENT_MARKS", {}, "");
        const marks = res.data || [];
        
        const studentMap = new Map();
        marks.forEach((m: any) => {
          if (m.isPublished && m.studentId) {
            const sid = m.studentId._id;
            if (!studentMap.has(sid)) {
              studentMap.set(sid, {
                ...m.studentId,
                courseId: m.courseId,
                marks: []
              });
            }
            studentMap.get(sid).marks.push(m);
          }
        });
        return Array.from(studentMap.values());
      }
    },
  });
};

// Issue/Record a marksheet
export const useIssueMarksheet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { studentId: string; examName: string; data: any }) => {
      return await ApiHitter(
        "POST",
        "ISSUE_MARKSHEET",
        data,
        "",
        { showSuccess: true, successMessage: "Marksheet issued successfully!" }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issued-marksheets"] });
    },
  });
};

// Fetch all issued marksheets
export const useIssuedMarksheets = () => {
  return useQuery({
    queryKey: ["issued-marksheets"],
    queryFn: async () => {
      try {
        const res = await ApiHitter("GET", "GET_ISSUED_MARKSHEETS", {}, "");
        return res.data || [];
      } catch (e) {
        return [];
      }
    },
  });
};

export const downloadIssuedMarksheetPdf = async (studentId: string, examName: string, fileName?: string) => {
  try {
    const res = await axiosInstance.get(`public/marksheet/download`, {
      params: { studentId, examName },
      responseType: "blob",
    });

    if (!res.data || res.data.size === 0) {
        throw new Error("Received empty or invalid PDF data");
    }

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || `marksheet-${studentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
    }, 2000);
  } catch (error) {
    console.error("Download Error:", error);
    message.error("Download failed. Please ensure marks are published.");
    throw error;
  }
};
