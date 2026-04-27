"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { axiosInstance } from "@/lib/axiosApi/axiosInstance";
import { message } from "antd";

// Fetch all certificate templates
export const useCertificateTemplates = () => {
  return useQuery({
    queryKey: ["certificate-templates"],
    queryFn: async () => {
      const res = await ApiHitter("GET", "GET_CERTIFICATE_TEMPLATES", {}, "");
      return res.data || [];
    },
  });
};

// Add a new certificate template
export const useAddCertificateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; design: any; dimensions: any }) => {
      return await ApiHitter(
        "POST",
        "ADD_CERTIFICATE_TEMPLATE",
        data,
        "",
        { showSuccess: true, successMessage: "Template saved successfully!" }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate-templates"] });
    },
  });
};

// Issue a certificate
export const useIssueCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { studentId: string; templateId: string; grade?: string; securedPercent?: string; data: any }) => {
      return await ApiHitter(
        "POST",
        "ISSUE_CERTIFICATE",
        data,
        "",
        { showSuccess: true, successMessage: "Certificate issued successfully!" }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issued-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["eligible-certificate-students"] });
    },
  });
};

// Fetch all issued certificates
export const useIssuedCertificates = () => {
  return useQuery({
    queryKey: ["issued-certificates"],
    queryFn: async () => {
      const res = await ApiHitter("GET", "GET_ISSUED_CERTIFICATES", {}, "");
      return res.data || [];
    },
  });
};

export const useEligibleCertificateStudents = () => {
  return useQuery({
    queryKey: ["eligible-certificate-students"],
    queryFn: async () => {
      const res = await ApiHitter("GET", "GET_ELIGIBLE_CERTIFICATE_STUDENTS", {}, "");
      return res.data || [];
    },
  });
};

export const downloadIssuedCertificatePdf = async (certificateId: string, fileName?: string) => {
  if (!certificateId) {
    message.error("No certificate ID provided");
    return;
  }

  try {
    const res = await axiosInstance.get(`certificate/issued/${certificateId}/pdf`, {
      responseType: "blob",
    });

    // Safer blob check
    if (!res.data || res.data.size === 0) {
        throw new Error("Received empty or invalid PDF data");
    }

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || `certificate-${certificateId}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
    }, 2000);
  } catch (error) {
    console.error("Download Error:", error);
    message.error("Download failed. Please ensure you are logged in.");
    throw error;
  }
};

export const printIssuedCertificatePdf = async (certificateId: string) => {
    if (!certificateId) {
        message.error("No certificate ID provided");
        return;
    }

    try {
        const res = await axiosInstance.get(`certificate/issued/${certificateId}/pdf`, {
            responseType: "blob",
        });

        if (!res.data || res.data.size === 0) {
            throw new Error("Received empty or invalid PDF data");
        }

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = () => {
            setTimeout(() => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error("Print execution failed", e);
                }
            }, 1000);
        };
        
        setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
            window.URL.revokeObjectURL(url);
        }, 10000);

    } catch (error) {
        console.error("Print Error:", error);
        message.error("Failed to trigger print. Try downloading the PDF instead.");
    }
};
export const usePublicSearchCertificates = (params: { search?: string; studentName?: string; dob?: string; searchType?: string }) => {
  return useQuery({
    queryKey: ["public-certificate-search", params],
    queryFn: async () => {
      if (!params.search && !params.studentName && !params.dob) return [];
      const res = await axiosInstance.get("public/certificate/search", { params });
      return res.data?.data || [];
    },
    enabled: !!(params.search || params.studentName || params.dob),
  });
};
