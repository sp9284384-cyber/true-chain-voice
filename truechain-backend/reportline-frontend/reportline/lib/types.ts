export type Category = "harassment" | "corruption" | "misconduct" | "other";
export type Urgency = "low" | "medium" | "high";
export type ReportStatus = "submitted" | "under_review" | "resolved";

export interface SubmitReportPayload {
  description: string;
  category?: Category;
}

export interface SubmitReportResponse {
  report_id: string;
  session_token: string;
}

export interface ReportStatusResponse {
  status: ReportStatus;
  category: Category;
  urgency: Urgency;
  created_at: string; // ISO date string
}

export interface InvestigatorReportSummary {
  id: string;
  category: Category;
  urgency: Urgency;
  status: ReportStatus;
  created_at: string;
}

export interface InvestigatorReportDetail extends InvestigatorReportSummary {
  content: string; // decrypted, server-side only
  report_hash: string;
  prev_hash: string | null;
  evidence_count: number;
}

export interface VerifyResponse {
  verified: boolean;
  record_count: number;
  broken_at: number | null; // report # where the chain breaks, if any
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}
