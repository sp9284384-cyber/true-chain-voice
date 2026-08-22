import type {
  InvestigatorReportDetail,
  InvestigatorReportSummary,
  LoginPayload,
  LoginResponse,
  ReportStatus,
  ReportStatusResponse,
  SubmitReportPayload,
  SubmitReportResponse,
  VerifyResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(body || res.statusText, res.status);
  }

  // 204 No Content etc.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// --- Anonymous reporting ---------------------------------------------------

export function submitReport(payload: SubmitReportPayload) {
  return request<SubmitReportResponse>("/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function uploadEvidence(reportId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<{ file_id: string }>(`/reports/${reportId}/evidence`, {
    method: "POST",
    body: form,
  });
}

export function getReportStatus(token: string) {
  return request<ReportStatusResponse>(`/reports/${token}/status`);
}

// --- Public chain verification ---------------------------------------------

export function verifyChain() {
  return request<VerifyResponse>("/verify");
}

// --- Investigator ------------------------------------------------------------

export function login(payload: LoginPayload) {
  return request<LoginResponse>("/investigator/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getInvestigatorReports(token: string) {
  return request<InvestigatorReportSummary[]>("/investigator/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getReportDetail(id: string, token: string) {
  return request<InvestigatorReportDetail>(`/investigator/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateReportStatus(id: string, status: ReportStatus, token: string) {
  return request<{ ok: true }>(`/investigator/reports/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export { ApiError };
