export type InquiryStatus =
  | 'New'
  | 'Contacted'
  | 'In Discussion'
  | 'Quoted'
  | 'Approved'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface InquiryRecord {
  id: string;
  reference_id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  service_id?: string;
  budget?: string;
  package?: string;
  aspect_ratios?: string[];
  addons?: string[];
  project_link?: string;
  brief?: string;
  source: string;
  status: InquiryStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type ContactStatus = 'New' | 'Read' | 'Unread' | 'Contacted' | 'Archived';

export interface ContactRecord {
  id: string;
  reference_id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityRecord {
  id: string;
  type:
    | 'inquiry_created'
    | 'contact_created'
    | 'inquiry_status_updated'
    | 'contact_status_updated'
    | 'inquiry_note_added'
    | 'contact_note_added'
    | 'inquiry_deleted'
    | 'contact_deleted';
  title: string;
  description: string;
  referenceId?: string;
  actor: 'Visitor' | 'Admin';
  timestamp: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  totalInquiries: number;
  totalContacts: number;
  budgets: string[];
  latestStatus: string;
  notes: string[];
  firstContactDate: string;
  latestActivity: string;
  inquiries: InquiryRecord[];
  contacts: ContactRecord[];
}

export interface DashboardStats {
  totalVisits: number;
  visits7d: number;
  visits30d: number;
  visits60d: number;
  visits90d: number;
  totalProjectInquiries: number;
  totalContactSubmissions: number;
  totalProjectFormSubmissions: number;
  activeUnreadLeads: number;
  serviceAnalytics: {
    totalSubmissions: number;
    services: { name: string; count: number; percentage: number }[];
    mostRequested: string | null;
    hasData: boolean;
  };
  recentInquiries: InquiryRecord[];
  recentContacts: ContactRecord[];
  recentActivity: ActivityRecord[];
}

export interface AnalyticsData {
  totalVisits: number;
  visits7d: number;
  visits30d: number;
  visits60d: number;
  visits90d: number;
  periodVisits: number;
  uniqueVisitors: number;
  periodDays: number;
  dailySeries: { date: string; count: number; uniqueCount: number }[];
  trendPercent: number;
  hasData: boolean;
}

export interface AdminUser {
  email: string;
  role: 'admin';
  name: string;
}
