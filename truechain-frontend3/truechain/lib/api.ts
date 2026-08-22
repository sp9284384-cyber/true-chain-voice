import type {
  InvestigatorReportDetail,
  InvestigatorReportSummary,
  LoginPayload,
  LoginResponse,
  ReportStatusResponse,
  SubmitReportPayload,
  SubmitReportResponse,
  UpdateStatusPayload,
  UpdateStatusResponse,
  UploadEvidenceResponse,
  VerifyResponse,
} from "./types";

// Base URL for every API call. Set NEXT_PUBLIC_API_URL in .env.local —
// defaults to the backend's local dev address per the project spec.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("network_error", 0);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(body || res.statusText, res.status);
  }

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
  return request<UploadEvidenceResponse>(`/reports/${reportId}/evidence`, {
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

export function verifyChainUpTo(reportId: string) {
  return request<VerifyResponse>(`/verify/${reportId}`);
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

export function updateReportStatus(id: string, payload: UpdateStatusPayload, token: string) {
  return request<UpdateStatusResponse>(`/investigator/reports/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export { ApiError };
