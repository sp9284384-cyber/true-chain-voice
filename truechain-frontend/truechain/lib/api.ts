import type {
  SubmitReportResponse,
  ReportStatusResponse,
  EvidenceUploadResponse,
  VerifyResponse,
  InvestigatorLoginResponse,
  InvestigatorReportSummary,
  InvestigatorReportDetail,
  StatusUpdateResponse,
  Category,
  ReportStatus,
  ApiError,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Every fetch call to the FastAPI backend flows through here. Centralizing
 * this means: one place to point at a different backend URL, one place to
 * normalize errors, and components stay free of fetch/try-catch boilerplate.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    const err: ApiError = {
      status: 0,
      message:
        "Can't reach the server. Check your connection and try again.",
    };
    throw err;
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.detail ?? body.message ?? message;
    } catch {
      // response wasn't JSON — fall back to the generic message
    }
    const err: ApiError = { status: res.status, message };
    throw err;
  }

  // 204 No Content etc.
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Reports ----------------------------------------------------------

export function submitReport(payload: {
  content: string;
  category?: Category;
}): Promise<SubmitReportResponse> {
  return request<SubmitReportResponse>("/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getReportStatus(
  token: string
): Promise<ReportStatusResponse> {
  return request<ReportStatusResponse>(
    `/reports/${encodeURIComponent(token)}/status`
  );
}

export function uploadEvidence(
  reportId: number,
  file: File
): Promise<EvidenceUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return request<EvidenceUploadResponse>(`/reports/${reportId}/evidence`, {
    method: "POST",
    body: form,
  });
}

// ---- Chain verification ------------------------------------------------

export function verifyChain(reportId?: number): Promise<VerifyResponse> {
  const path = reportId ? `/verify/${reportId}` : "/verify";
  return request<VerifyResponse>(path);
}

// ---- Investigator --------------------------------------------------------

export function login(
  username: string,
  password: string
): Promise<InvestigatorLoginResponse> {
  return request<InvestigatorLoginResponse>("/investigator/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getReports(
  token: string
): Promise<InvestigatorReportSummary[]> {
  return request<InvestigatorReportSummary[]>("/investigator/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getReportDetail(
  token: string,
  id: number | string
): Promise<InvestigatorReportDetail> {
  return request<InvestigatorReportDetail>(`/investigator/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateStatus(
  token: string,
  id: number | string,
  newStatus: ReportStatus,
  updatedBy?: string
): Promise<StatusUpdateResponse> {
  return request<StatusUpdateResponse>(
    `/investigator/reports/${id}/status`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ new_status: newStatus, updated_by: updatedBy }),
    }
  );
}
