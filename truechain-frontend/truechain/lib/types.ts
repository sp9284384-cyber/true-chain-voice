// Shared types mirroring the FastAPI backend's Pydantic response schemas.
// Keep this in sync with backend/schemas.py as the API evolves.

export type Category = "harassment" | "corruption" | "misconduct" | "other";
export type Urgency = "low" | "medium" | "high";
export type ReportStatus = "submitted" | "under_review" | "resolved";

export interface SubmitReportResponse {
  session_token: string;
  report_id: number;
  message: string;
}

export interface ReportStatusResponse {
  session_token: string;
  status: ReportStatus;
  category: Category | null;
  urgency: Urgency | null;
  created_at: string;
}

export interface EvidenceUploadResponse {
  evidence_id: number;
  report_id: number;
  file_hash: string;
  metadata_removed: string;
  message: string;
}

export interface VerifyResponse {
  verified: boolean;
  total_records: number;
  broken_at_report_id: number | null;
  message: string;
}

export interface InvestigatorLoginResponse {
  access_token: string;
  token_type: string;
}

export interface InvestigatorReportSummary {
  id: number;
  category: Category;
  urgency: Urgency;
  status: ReportStatus;
  created_at: string;
}

export interface InvestigatorReportDetail {
  id: number;
  content: string;
  category: Category;
  urgency: Urgency;
  status: ReportStatus;
  report_hash: string;
  prev_hash: string | null;
  created_at: string;
  evidence_count: number;
}

export interface StatusUpdateResponse {
  id: number;
  report_id: number;
  new_status: ReportStatus;
  update_hash: string;
  created_at: string;
}

// Normalized error shape used across the app so components never
// have to guess what shape a failed fetch returned.
export interface ApiError {
  status: number;
  message: string;
}
