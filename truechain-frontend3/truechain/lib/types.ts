export type Category = "harassment" | "corruption" | "misconduct" | "other";
export type Urgency = "low" | "medium" | "high";
export type ReportStatus = "submitted" | "under_review" | "resolved";

// --- POST /reports -----------------------------------------------------

export interface SubmitReportPayload {
  content: string;
  category?: Category;
}

export interface SubmitReportResponse {
  session_token: string;
  report_id: string;
  message: string;
}

// --- GET /reports/{token}/status ----------------------------------------

export interface ReportStatusResponse {
  session_token: string;
  status: ReportStatus;
  category: Category;
  urgency: Urgency;
  created_at: string; // ISO date string
}

// --- POST /reports/{id}/evidence ----------------------------------------

export interface UploadEvidenceResponse {
  evidence_id: string;
  report_id: string;
  file_hash: string;
  metadata_removed: string[] | string;
  message: string;
}

// --- GET /verify, GET /verify/{report_id} --------------------------------

export interface VerifyResponse {
  verified: boolean;
  total_records: number;
  broken_at_report_id: string | number | null;
  message: string;
}

// --- POST /investigator/login --------------------------------------------

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// --- GET /investigator/reports --------------------------------------------

export interface InvestigatorReportSummary {
  id: string;
  category: Category;
  urgency: Urgency;
  status: ReportStatus;
  created_at: string;
}

// --- GET /investigator/reports/{id} ----------------------------------------

export interface InvestigatorReportDetail {
  id: string;
  content: string; // decrypted, server-side only
  category: Category;
  urgency: Urgency;
  status: ReportStatus;
  report_hash: string;
  prev_hash: string | null;
  created_at: string;
  evidence_count: number;
}

// --- PATCH /investigator/reports/{id}/status --------------------------------

export interface UpdateStatusPayload {
  new_status: ReportStatus;
  updated_by?: string;
}

export interface UpdateStatusResponse {
  id: string;
  report_id: string;
  new_status: ReportStatus;
  update_hash: string;
  created_at: string;
}
