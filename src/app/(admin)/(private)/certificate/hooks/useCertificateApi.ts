"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";

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

// Fetch student list (reused from student modules but placed here for convenience if not available elsewhere)
export const useStudentList = () => {
  return useQuery({
    queryKey: ["students-short-list"],
    queryFn: async () => {
      const res = await ApiHitter("GET", "GET_STUDENT_LIST", {}, "");
      return res.data || [];
    },
  });
};
