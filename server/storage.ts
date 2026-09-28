import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

export interface VisitRecord {
  id: string;
  path: string;
  visitorId: string;
  userAgent?: string;
  referrer?: string;
  timestamp: string;
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

export interface SessionRecord {
  token: string;
  email: string;
  created_at: string;
  expires_at: string;
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

export class StorageEngine {
  private dataDir: string;
  private visitsFile: string;
  private inquiriesFile: string;
  private contactsFile: string;
  private activityFile: string;
  private sessionsFile: string;

  constructor(dataDirectory = path.resolve(process.cwd(), 'data')) {
    this.dataDir = dataDirectory;
    this.visitsFile = path.join(this.dataDir, 'visits.json');
    this.inquiriesFile = path.join(this.dataDir, 'inquiries.json');
    this.contactsFile = path.join(this.dataDir, 'contacts.json');
    this.activityFile = path.join(this.dataDir, 'activity.json');
    this.sessionsFile = path.join(this.dataDir, 'sessions.json');
    this.init();
  }

  private init() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    const files = [
      { path: this.visitsFile, default: [] },
      { path: this.inquiriesFile, default: [] },
      { path: this.contactsFile, default: [] },
      { path: this.activityFile, default: [] },
      { path: this.sessionsFile, default: [] },
    ];
    for (const f of files) {
      if (!fs.existsSync(f.path)) {
        fs.writeFileSync(f.path, JSON.stringify(f.default, null, 2), 'utf-8');
      }
    }
  }

  private readFile<T>(filePath: string): T {
    try {
      if (!fs.existsSync(filePath)) return [] as unknown as T;
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content || '[]') as T;
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
      return [] as unknown as T;
    }
  }

  private writeFile<T>(filePath: string, data: T): void {
    try {
      const tempPath = `${filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, filePath);
    } catch (err) {
      console.error(`Error writing to ${filePath}:`, err);
    }
  }

  // ===================== REAL VISITS =====================
  public recordVisit(data: {
    path: string;
    visitorId: string;
    userAgent?: string;
    referrer?: string;
  }): VisitRecord {
    const visits = this.readFile<VisitRecord[]>(this.visitsFile);
    const newVisit: VisitRecord = {
      id: crypto.randomUUID(),
      path: data.path || '/',
      visitorId: data.visitorId || 'anonymous',
      userAgent: data.userAgent || '',
      referrer: data.referrer || '',
      timestamp: new Date().toISOString(),
    };
    visits.unshift(newVisit);
    // Keep reasonable cap on raw visit logs (e.g. last 10,000)
    if (visits.length > 10000) {
      visits.length = 10000;
    }
    this.writeFile(this.visitsFile, visits);
    return newVisit;
  }

  public getVisits(): VisitRecord[] {
    return this.readFile<VisitRecord[]>(this.visitsFile);
  }

  public getAnalytics(period: '7d' | '30d' | '60d' | '90d' = '30d') {
    const visits = this.readFile<VisitRecord[]>(this.visitsFile);
    const totalVisits = visits.length;

    if (totalVisits === 0) {
      return {
        totalVisits: 0,
        visits7d: 0,
        visits30d: 0,
        visits60d: 0,
        visits90d: 0,
        periodVisits: 0,
        uniqueVisitors: 0,
        periodDays: period === '7d' ? 7 : period === '30d' ? 30 : period === '60d' ? 60 : 90,
        dailySeries: [] as { date: string; count: number; uniqueCount: number }[],
        trendPercent: 0,
        hasData: false,
      };
    }

    const daysCount = period === '7d' ? 7 : period === '30d' ? 30 : period === '60d' ? 60 : 90;
    const now = new Date();
    const periodStart = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
    const prevPeriodStart = new Date(now.getTime() - daysCount * 2 * 24 * 60 * 60 * 1000);

    const getVisitsSinceDays = (days: number) => {
      const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return visits.filter((v) => new Date(v.timestamp) >= since).length;
    };

    const periodVisitsList = visits.filter((v) => new Date(v.timestamp) >= periodStart);
    const prevPeriodVisitsList = visits.filter(
      (v) => new Date(v.timestamp) >= prevPeriodStart && new Date(v.timestamp) < periodStart
    );

    const uniqueVisitorSet = new Set(periodVisitsList.map((v) => v.visitorId));

    // Construct daily timeline buckets
    const dailyMap = new Map<string, { count: number; visitors: Set<string> }>();
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      dailyMap.set(dateKey, { count: 0, visitors: new Set<string>() });
    }

    for (const visit of periodVisitsList) {
      const dateKey = visit.timestamp.split('T')[0];
      const entry = dailyMap.get(dateKey);
      if (entry) {
        entry.count += 1;
        entry.visitors.add(visit.visitorId);
      }
    }

    const dailySeries = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      uniqueCount: data.visitors.size,
    }));

    // Calculate trend %
    let trendPercent = 0;
    if (prevPeriodVisitsList.length > 0) {
      trendPercent = Math.round(
        ((periodVisitsList.length - prevPeriodVisitsList.length) / prevPeriodVisitsList.length) * 100
      );
    } else if (periodVisitsList.length > 0) {
      trendPercent = 100;
    }

    return {
      totalVisits,
      visits7d: getVisitsSinceDays(7),
      visits30d: getVisitsSinceDays(30),
      visits60d: getVisitsSinceDays(60),
      visits90d: getVisitsSinceDays(90),
      periodVisits: periodVisitsList.length,
      uniqueVisitors: uniqueVisitorSet.size,
      periodDays: daysCount,
      dailySeries,
      trendPercent,
      hasData: true,
    };
  }

  // ===================== REAL INQUIRIES =====================
  public getInquiries(filters?: {
    search?: string;
    status?: string;
    service?: string;
  }): InquiryRecord[] {
    let items = this.readFile<InquiryRecord[]>(this.inquiriesFile);

    if (filters?.status && filters.status !== 'All') {
      items = items.filter(
        (i) => i.status.toLowerCase() === (filters.status || '').toLowerCase()
      );
    }

    if (filters?.service && filters.service !== 'All') {
      items = items.filter(
        (i) => i.service.toLowerCase().includes((filters.service || '').toLowerCase())
      );
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q) ||
          i.reference_id.toLowerCase().includes(q) ||
          i.service.toLowerCase().includes(q) ||
          (i.brief && i.brief.toLowerCase().includes(q))
      );
    }

    return items;
  }

  public getInquiryById(id: string): InquiryRecord | undefined {
    const items = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    return items.find((i) => i.id === id || i.reference_id === id);
  }

  public createInquiry(payload: Partial<InquiryRecord>): InquiryRecord {
    const items = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    const now = new Date().toISOString();
    const id = payload.id || crypto.randomUUID();
    const reference_id =
      payload.reference_id || `WG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInquiry: InquiryRecord = {
      id,
      reference_id,
      name: payload.name || 'Anonymous Client',
      email: payload.email || '',
      phone: payload.phone || '',
      service: payload.service || 'Video Editing',
      service_id: payload.service_id || '',
      budget: payload.budget || '',
      package: payload.package || '',
      aspect_ratios: payload.aspect_ratios || [],
      addons: payload.addons || [],
      project_link: payload.project_link || '',
      brief: payload.brief || '',
      source: payload.source || 'Appointment Booking Form',
      status: payload.status || 'New',
      notes: payload.notes || '',
      created_at: payload.created_at || now,
      updated_at: now,
    };

    items.unshift(newInquiry);
    this.writeFile(this.inquiriesFile, items);

    // Log genuine activity
    this.logActivity({
      type: 'inquiry_created',
      title: `New Project Inquiry: ${newInquiry.service}`,
      description: `${newInquiry.name} submitted project booking (${reference_id})`,
      referenceId: reference_id,
      actor: 'Visitor',
    });

    return newInquiry;
  }

  public updateInquiry(
    id: string,
    updates: { status?: InquiryStatus; notes?: string }
  ): InquiryRecord | null {
    const items = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    const index = items.findIndex((i) => i.id === id || i.reference_id === id);
    if (index === -1) return null;

    const old = items[index];
    const updated: InquiryRecord = {
      ...old,
      status: updates.status || old.status,
      notes: updates.notes !== undefined ? updates.notes : old.notes,
      updated_at: new Date().toISOString(),
    };

    items[index] = updated;
    this.writeFile(this.inquiriesFile, items);

    if (updates.status && updates.status !== old.status) {
      this.logActivity({
        type: 'inquiry_status_updated',
        title: `Status Changed to ${updates.status}`,
        description: `Inquiry ${old.reference_id} status changed from ${old.status} to ${updates.status}`,
        referenceId: old.reference_id,
        actor: 'Admin',
      });
    }

    if (updates.notes && updates.notes !== old.notes) {
      this.logActivity({
        type: 'inquiry_note_added',
        title: `Admin Note Added`,
        description: `Note added to inquiry ${old.reference_id}`,
        referenceId: old.reference_id,
        actor: 'Admin',
      });
    }

    return updated;
  }

  public deleteInquiry(id: string): InquiryRecord | null {
    const items = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    const index = items.findIndex((i) => i.id === id || i.reference_id === id);
    if (index === -1) return null;

    const [removed] = items.splice(index, 1);
    this.writeFile(this.inquiriesFile, items);

    this.logActivity({
      type: 'inquiry_deleted',
      title: 'Project Inquiry Deleted',
      description: `Inquiry ${removed.reference_id} (${removed.name}) permanently deleted`,
      referenceId: removed.reference_id,
      actor: 'Admin',
    });

    return removed;
  }

  public upsertInquiryFromSupabase(row: any): InquiryRecord {
    const items = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    const existingIndex = items.findIndex(
      (i) =>
        i.reference_id === row.reference_id ||
        (row.id && (i.id === String(row.id) || i.reference_id === `WG-2026-${row.id}`))
    );

    const now = new Date().toISOString();
    const formatted: InquiryRecord = {
      id: String(row.id || crypto.randomUUID()),
      reference_id:
        row.reference_id ||
        `WG-2026-${row.id || Math.floor(1000 + Math.random() * 9000)}`,
      name: row.name || 'Client',
      email: row.email || '',
      phone: row.phone || '',
      service: row.service || 'Video Editing',
      service_id: row.service_id || '',
      budget: row.budget || '',
      package: row.package || '',
      aspect_ratios: Array.isArray(row.aspect_ratios)
        ? row.aspect_ratios
        : typeof row.aspect_ratios === 'string' && row.aspect_ratios
        ? row.aspect_ratios.split(', ')
        : [],
      addons: Array.isArray(row.addons)
        ? row.addons
        : typeof row.addons === 'string' && row.addons
        ? row.addons.split(', ')
        : [],
      project_link: row.project_link || '',
      brief: row.brief || '',
      source: row.source || 'Appointment Booking Form',
      status: row.status || 'New',
      notes: existingIndex >= 0 ? items[existingIndex].notes : '',
      created_at: row.created_at || now,
      updated_at: existingIndex >= 0 ? items[existingIndex].updated_at : now,
    };

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...formatted,
        notes: items[existingIndex].notes,
      };
    } else {
      items.unshift(formatted);
    }

    this.writeFile(this.inquiriesFile, items);
    return formatted;
  }

  // ===================== REAL CONTACTS =====================
  public getContacts(filters?: { search?: string; status?: string }): ContactRecord[] {
    let items = this.readFile<ContactRecord[]>(this.contactsFile);

    if (filters?.status && filters.status !== 'All') {
      items = items.filter(
        (c) => c.status.toLowerCase() === (filters.status || '').toLowerCase()
      );
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          c.reference_id.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q)
      );
    }

    return items;
  }

  public getContactById(id: string): ContactRecord | undefined {
    const items = this.readFile<ContactRecord[]>(this.contactsFile);
    return items.find((c) => c.id === id || c.reference_id === id);
  }

  public createContact(payload: Partial<ContactRecord>): ContactRecord {
    const items = this.readFile<ContactRecord[]>(this.contactsFile);
    const now = new Date().toISOString();
    const id = payload.id || crypto.randomUUID();
    const reference_id =
      payload.reference_id || `WG-CONTACT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newContact: ContactRecord = {
      id,
      reference_id,
      name: payload.name || 'Anonymous Contact',
      email: payload.email || '',
      phone: payload.phone || '',
      service: payload.service || 'General Inquiry',
      subject: payload.subject || payload.service || 'Website Contact Form',
      message: payload.message || '',
      status: payload.status || 'New',
      notes: payload.notes || '',
      created_at: payload.created_at || now,
      updated_at: now,
    };

    items.unshift(newContact);
    this.writeFile(this.contactsFile, items);

    this.logActivity({
      type: 'contact_created',
      title: `New Contact Form Submission`,
      description: `${newContact.name} sent a message regarding ${newContact.service}`,
      referenceId: reference_id,
      actor: 'Visitor',
    });

    return newContact;
  }

  public updateContact(
    id: string,
    updates: { status?: ContactStatus; notes?: string }
  ): ContactRecord | null {
    const items = this.readFile<ContactRecord[]>(this.contactsFile);
    const index = items.findIndex((c) => c.id === id || c.reference_id === id);
    if (index === -1) return null;

    const old = items[index];
    const updated: ContactRecord = {
      ...old,
      status: updates.status || old.status,
      notes: updates.notes !== undefined ? updates.notes : old.notes,
      updated_at: new Date().toISOString(),
    };

    items[index] = updated;
    this.writeFile(this.contactsFile, items);

    if (updates.status && updates.status !== old.status) {
      this.logActivity({
        type: 'contact_status_updated',
        title: `Contact Status Updated`,
        description: `Contact ${old.reference_id} marked as ${updates.status}`,
        referenceId: old.reference_id,
        actor: 'Admin',
      });
    }

    return updated;
  }

  public deleteContact(id: string): ContactRecord | null {
    const items = this.readFile<ContactRecord[]>(this.contactsFile);
    const index = items.findIndex((c) => c.id === id || c.reference_id === id);
    if (index === -1) return null;

    const [removed] = items.splice(index, 1);
    this.writeFile(this.contactsFile, items);

    this.logActivity({
      type: 'contact_deleted',
      title: 'Contact Submission Deleted',
      description: `Contact message ${removed.reference_id} (${removed.name}) permanently deleted`,
      referenceId: removed.reference_id,
      actor: 'Admin',
    });

    return removed;
  }

  public upsertContactFromSupabase(row: any): ContactRecord {
    const items = this.readFile<ContactRecord[]>(this.contactsFile);
    const existingIndex = items.findIndex(
      (c) =>
        c.reference_id === row.reference_id ||
        (row.id && (c.id === String(row.id) || c.reference_id === `WG-CONTACT-${row.id}`))
    );

    const now = new Date().toISOString();
    const formatted: ContactRecord = {
      id: String(row.id || crypto.randomUUID()),
      reference_id:
        row.reference_id ||
        `WG-CONTACT-${row.id || Math.floor(1000 + Math.random() * 9000)}`,
      name: row.name || 'Contact',
      email: row.email || '',
      phone: row.phone || '',
      service: row.service || 'General Inquiry',
      subject: row.service || 'Website Contact Form',
      message: row.brief || row.message || '',
      status: row.status || 'New',
      notes: existingIndex >= 0 ? items[existingIndex].notes : '',
      created_at: row.created_at || now,
      updated_at: existingIndex >= 0 ? items[existingIndex].updated_at : now,
    };

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...formatted,
        notes: items[existingIndex].notes,
      };
    } else {
      items.unshift(formatted);
    }

    this.writeFile(this.contactsFile, items);
    return formatted;
  }

  // ===================== REAL CLIENTS (CRM) =====================
  public getClients(): ClientProfile[] {
    const inquiries = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    const contacts = this.readFile<ContactRecord[]>(this.contactsFile);

    // If both empty, return empty array (NO fake clients!)
    if (inquiries.length === 0 && contacts.length === 0) {
      return [];
    }

    const clientMap = new Map<string, ClientProfile>();

    // Process inquiries
    for (const inq of inquiries) {
      const key = (inq.email || inq.phone || inq.name).trim().toLowerCase();
      if (!key) continue;

      let profile = clientMap.get(key);
      if (!profile) {
        profile = {
          id: key,
          name: inq.name,
          email: inq.email || 'Not provided',
          phone: inq.phone || 'Not provided',
          services: [],
          totalInquiries: 0,
          totalContacts: 0,
          budgets: [],
          latestStatus: inq.status,
          notes: inq.notes ? [inq.notes] : [],
          firstContactDate: inq.created_at,
          latestActivity: inq.created_at,
          inquiries: [],
          contacts: [],
        };
        clientMap.set(key, profile);
      }

      profile.totalInquiries += 1;
      profile.inquiries.push(inq);
      if (inq.service && !profile.services.includes(inq.service)) {
        profile.services.push(inq.service);
      }
      if (inq.budget && !profile.budgets.includes(inq.budget)) {
        profile.budgets.push(inq.budget);
      }
      if (inq.notes && !profile.notes.includes(inq.notes)) {
        profile.notes.push(inq.notes);
      }
      if (new Date(inq.created_at) < new Date(profile.firstContactDate)) {
        profile.firstContactDate = inq.created_at;
      }
      if (new Date(inq.created_at) > new Date(profile.latestActivity)) {
        profile.latestActivity = inq.created_at;
        profile.latestStatus = inq.status;
      }
    }

    // Process contacts
    for (const c of contacts) {
      const key = (c.email || c.phone || c.name).trim().toLowerCase();
      if (!key) continue;

      let profile = clientMap.get(key);
      if (!profile) {
        profile = {
          id: key,
          name: c.name,
          email: c.email || 'Not provided',
          phone: c.phone || 'Not provided',
          services: [],
          totalInquiries: 0,
          totalContacts: 0,
          budgets: [],
          latestStatus: c.status,
          notes: c.notes ? [c.notes] : [],
          firstContactDate: c.created_at,
          latestActivity: c.created_at,
          inquiries: [],
          contacts: [],
        };
        clientMap.set(key, profile);
      }

      profile.totalContacts += 1;
      profile.contacts.push(c);
      if (c.service && !profile.services.includes(c.service)) {
        profile.services.push(c.service);
      }
      if (c.notes && !profile.notes.includes(c.notes)) {
        profile.notes.push(c.notes);
      }
      if (new Date(c.created_at) < new Date(profile.firstContactDate)) {
        profile.firstContactDate = c.created_at;
      }
      if (new Date(c.created_at) > new Date(profile.latestActivity)) {
        profile.latestActivity = c.created_at;
      }
    }

    // Sort by latest activity descending
    return Array.from(clientMap.values()).sort(
      (a, b) => new Date(b.latestActivity).getTime() - new Date(a.latestActivity).getTime()
    );
  }

  // ===================== REAL SERVICE ANALYTICS =====================
  public getServiceAnalytics() {
    const inquiries = this.readFile<InquiryRecord[]>(this.inquiriesFile);
    const contacts = this.readFile<ContactRecord[]>(this.contactsFile);

    const totalSubmissions = inquiries.length + contacts.length;
    if (totalSubmissions === 0) {
      return {
        totalSubmissions: 0,
        services: [] as { name: string; count: number; percentage: number }[],
        mostRequested: null,
        hasData: false,
      };
    }

    const counts: Record<string, number> = {};

    for (const inq of inquiries) {
      const s = inq.service || 'Other';
      counts[s] = (counts[s] || 0) + 1;
    }
    for (const c of contacts) {
      const s = c.service || 'Other';
      counts[s] = (counts[s] || 0) + 1;
    }

    const services = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalSubmissions) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSubmissions,
      services,
      mostRequested: services[0] ? services[0].name : null,
      hasData: true,
    };
  }

  // ===================== REAL AUDIT LOG / ACTIVITY =====================
  public logActivity(activity: Omit<ActivityRecord, 'id' | 'timestamp'>): ActivityRecord {
    const list = this.readFile<ActivityRecord[]>(this.activityFile);
    const record: ActivityRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...activity,
    };
    list.unshift(record);
    if (list.length > 500) {
      list.length = 500;
    }
    this.writeFile(this.activityFile, list);
    return record;
  }

  public getActivityLogs(limit = 50): ActivityRecord[] {
    const list = this.readFile<ActivityRecord[]>(this.activityFile);
    return list.slice(0, limit);
  }

  // ===================== AUTH SESSIONS =====================
  public createSession(email: string): string {
    const sessions = this.readFile<SessionRecord[]>(this.sessionsFile);
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    sessions.push({
      token,
      email,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    // Clean expired
    const active = sessions.filter((s) => new Date(s.expires_at) > now);
    this.writeFile(this.sessionsFile, active);
    return token;
  }

  public validateSession(token: string): { email: string } | null {
    if (!token) return null;
    const sessions = this.readFile<SessionRecord[]>(this.sessionsFile);
    const now = new Date();
    const found = sessions.find((s) => s.token === token && new Date(s.expires_at) > now);
    if (!found) return null;
    return { email: found.email };
  }

  public revokeSession(token: string): void {
    const sessions = this.readFile<SessionRecord[]>(this.sessionsFile);
    const remaining = sessions.filter((s) => s.token !== token);
    this.writeFile(this.sessionsFile, remaining);
  }
}

export const storage = new StorageEngine();
