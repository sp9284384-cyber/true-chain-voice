import type {
  SubmitReportRequest,
  SubmitReportResponse,
  ReportStatus,
  EvidenceResponse,
  VerifyResponse,
  LoginRequest,
  LoginResponse,
  InvestigatorReport,
  InvestigatorReportDetail,
  StatusUpdateRequest,
  StatusUpdateResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error');
    let message = 'Something went wrong. Please try again.';
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.detail || parsed.message || message;
    } catch {
      if (res.status === 404) message = 'The requested resource was not found.';
      else if (res.status === 401) message = 'Authentication required.';
      else if (res.status === 422) message = 'Invalid request. Please check your input.';
    }
    throw new Error(message);
  }

  return res.json();
}

export async function submitReport(data: SubmitReportRequest): Promise<SubmitReportResponse> {
  return apiFetch<SubmitReportResponse>('/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function uploadEvidence(reportId: number, file: File): Promise<EvidenceResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<EvidenceResponse>(`/reports/${reportId}/evidence`, {
    method: 'POST',
    body: formData,
  });
}

export async function getReportStatus(token: string): Promise<ReportStatus> {
  return apiFetch<ReportStatus>(`/reports/${token}/status`);
}

export async function verifyChain(): Promise<VerifyResponse> {
  return apiFetch<VerifyResponse>('/verify');
}

export async function verifyChainUpTo(reportId: number): Promise<VerifyResponse> {
  return apiFetch<VerifyResponse>(`/verify/${reportId}`);
}

export async function investigatorLogin(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/investigator/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getInvestigatorReports(token: string): Promise<InvestigatorReport[]> {
  return apiFetch<InvestigatorReport[]>('/investigator/reports', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getInvestigatorReportDetail(
  token: string,
  id: number
): Promise<InvestigatorReportDetail> {
  return apiFetch<InvestigatorReportDetail>(`/investigator/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateReportStatus(
  token: string,
  id: number,
  data: StatusUpdateRequest
): Promise<StatusUpdateResponse> {
  return apiFetch<StatusUpdateResponse>(`/investigator/reports/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function downloadEvidenceFile(
  token: string,
  reportId: number,
  evidenceId: number
): Promise<Blob> {
  const url = `${API_BASE}/investigator/reports/${reportId}/evidence/${evidenceId}/download`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to download evidence file.');
  }
  return res.blob();
}
