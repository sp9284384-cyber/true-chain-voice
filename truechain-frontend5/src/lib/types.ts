// Shared TypeScript interfaces matching backend Pydantic schemas

export interface SubmitReportRequest {
  content: string;
  category?: string;
}

export interface SubmitReportResponse {
  session_token: string;
  report_id: number;
  message: string;
}

export interface ReportStatus {
  session_token: string;
  status: string;
  category?: string;
  urgency?: string;
  created_at: string;
}

export interface EvidenceResponse {
  evidence_id: number;
  report_id: number;
  file_hash: string;
  metadata_removed: string; // backend returns a plain string log, not an array
  message: string;
}

export interface VerifyResponse {
  verified: boolean;
  total_records: number;
  broken_at_report_id: number | null;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface InvestigatorReport {
  id: number;
  category?: string;
  urgency?: string;
  status: string;
  created_at: string;
}

export interface EvidenceItem {
  id: number;
  file_hash: string;
  metadata_removed?: string;
  uploaded_at: string;
}

export interface InvestigatorReportDetail extends InvestigatorReport {
  content: string;
  report_hash: string;
  prev_hash: string;
  evidence_count: number;
  evidence_list?: EvidenceItem[];
}

export interface StatusUpdateRequest {
  new_status: string;
  updated_by?: string;
}

export interface StatusUpdateResponse {
  id: number;
  report_id: number;
  new_status: string;
  update_hash: string;
  created_at: string;
}

export type Urgency = 'low' | 'medium' | 'high';
export type Category = 'harassment' | 'corruption' | 'misconduct' | 'other';
export type ReportStatusType = 'submitted' | 'under_review' | 'investigating' | 'resolved' | 'dismissed';
