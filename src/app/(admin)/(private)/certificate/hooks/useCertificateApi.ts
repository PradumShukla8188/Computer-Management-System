"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { axiosInstance } from "@/lib/axiosApi/axiosInstance";

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
    mutationFn: async (data: { studentId: string; templateId: string; data: any }) => {
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
  const res = await axiosInstance.get(`/certificate/issued/${certificateId}/pdf`, {
    responseType: "blob",
  });

  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || `certificate-${certificateId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
