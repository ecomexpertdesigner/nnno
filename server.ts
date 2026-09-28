import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { storage, InquiryStatus, ContactStatus } from './server/storage.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Parse JSON bodies
app.use(express.json());

// Secure environment credentials
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'waleedghangla@gmail.com').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'WGMediaAdmin2026!';

// In-memory rate limiting for login attempts (max 5 failed attempts per 15 minutes)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < 6;
}

function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else {
    record.count += 1;
  }
}

function clearFailedLogin(ip: string): void {
  loginAttempts.delete(ip);
}

// Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = storage.validateSession(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  (req as any).adminUser = session;
  next();
}

// ========================================================
// PUBLIC API ENDPOINTS
// ========================================================

// 1. Record Website Visit (real traffic logging)
app.post('/api/analytics/visit', (req: Request, res: Response) => {
  try {
    const { path: visitPath, visitorId, referrer } = req.body || {};
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Discard automated bot crawler probes or static assets if any
    if (visitPath && (visitPath.startsWith('/api') || visitPath.includes('.'))) {
      res.json({ recorded: false });
      return;
    }

    const visit = storage.recordVisit({
      path: visitPath || '/',
      visitorId: visitorId || ip,
      userAgent,
      referrer,
    });

    res.json({ recorded: true, id: visit.id });
  } catch (err: any) {
    console.error('Error logging visit:', err);
    res.status(500).json({ error: 'Could not record visit' });
  }
});

// 2. Submit Project Booking / Inquiry
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.phone) {
      res.status(400).json({ error: 'Client name and phone number are required' });
      return;
    }

    const created = storage.createInquiry(body);

    // Also attempt background sync to Supabase if configured
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cgqvcgpwejiouijuhwqe.supabase.co';
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_h_zkVMzHmdSifpW_pGgcZA_kHAZDLPM';
      if (supabaseUrl && supabaseKey) {
        fetch(`${supabaseUrl}/rest/v1/appointments`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            reference_id: created.reference_id,
            name: created.name,
            phone: created.phone,
            email: created.email || null,
            service: created.service,
            service_id: created.service_id || null,
            budget: created.budget || null,
            package: created.package || null,
            aspect_ratios: Array.isArray(created.aspect_ratios)
              ? created.aspect_ratios.join(', ')
              : created.aspect_ratios || null,
            addons: Array.isArray(created.addons)
              ? created.addons.join(', ')
              : created.addons || null,
            project_link: created.project_link || null,
            brief: created.brief || null,
            source: created.source || 'Appointment Booking Form',
            status: created.status || 'new',
            created_at: created.created_at,
          }),
        }).catch((e) => console.warn('Supabase async sync notice:', e.message));
      }
    } catch {
      // ignore
    }

    res.status(201).json({ success: true, inquiry: created });
  } catch (err: any) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ error: 'Could not save project inquiry' });
  }
});

// 3. Submit Contact Form Message
app.post('/api/contacts', (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    if (!body.name || (!body.email && !body.phone)) {
      res.status(400).json({ error: 'Name and contact info (email or phone) are required' });
      return;
    }

    const created = storage.createContact(body);

    // Sync to Supabase appointments table
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cgqvcgpwejiouijuhwqe.supabase.co';
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_h_zkVMzHmdSifpW_pGgcZA_kHAZDLPM';
      if (supabaseUrl && supabaseKey) {
        fetch(`${supabaseUrl}/rest/v1/appointments`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            reference_id: created.reference_id,
            name: created.name,
            phone: created.phone || 'N/A',
            email: created.email,
            service: created.service || 'General Inquiry',
            brief: created.message,
            source: 'Contact Form Submission',
            status: created.status || 'New',
            created_at: created.created_at,
          }),
        }).catch((e) => console.warn('Supabase contact async sync notice:', e.message));
      }
    } catch {
      // ignore
    }

    res.status(201).json({ success: true, contact: created });
  } catch (err: any) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: 'Could not save contact message' });
  }
});

// 4. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!checkRateLimit(ip)) {
    res.status(429).json({
      error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
    });
    return;
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const normalizedInputEmail = String(email).trim().toLowerCase();
  const inputPassword = String(password);

  const isValidEmail = normalizedInputEmail === ADMIN_EMAIL;
  const isValidPassword = inputPassword === ADMIN_PASSWORD;

  if (!isValidEmail || !isValidPassword) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid admin email or password' });
    return;
  }

  clearFailedLogin(ip);
  const token = storage.createSession(ADMIN_EMAIL);

  res.json({
    success: true,
    token,
    user: {
      email: 'admin@example.com',
      role: 'admin',
      name: 'Admin',
    },
  });
});

// ========================================================
// PROTECTED ADMIN API ENDPOINTS (requireAdmin)
// ========================================================

// Admin Logout
app.post('/api/admin/logout', requireAdmin, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    storage.revokeSession(token);
  }
  res.json({ success: true });
});

// Admin Profile / Session Check
app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    user: {
      email: 'admin@example.com',
      role: 'admin',
      name: 'Admin',
    },
  });
});

// Helper to sync from Supabase appointments table
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cgqvcgpwejiouijuhwqe.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_h_zkVMzHmdSifpW_pGgcZA_kHAZDLPM';

async function syncRealSupabaseData(): Promise<void> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/appointments?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          const isContact = row.source && row.source.toLowerCase().includes('contact');
          if (isContact) {
            storage.upsertContactFromSupabase(row);
          } else {
            storage.upsertInquiryFromSupabase(row);
          }
        }
      }
    }
  } catch (err: any) {
    // Non-blocking sync notice
  }
}

// Admin Dashboard Overview Statistics
app.get('/api/admin/dashboard', requireAdmin, async (req: Request, res: Response) => {
  try {
    await syncRealSupabaseData();

    const visits = storage.getVisits();
    const now = new Date();

    const getVisitsSinceDays = (days: number) => {
      const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return visits.filter((v) => new Date(v.timestamp) >= since).length;
    };

    const inquiries = storage.getInquiries();
    const contacts = storage.getContacts();

    const activeInquiries = inquiries.filter(
      (i) => i.status === 'New' || i.status === 'In Discussion' || i.status === 'Contacted'
    ).length;

    const unreadContacts = contacts.filter((c) => c.status === 'New' || c.status === 'Unread').length;

    const stats = {
      totalVisits: visits.length,
      visits7d: getVisitsSinceDays(7),
      visits30d: getVisitsSinceDays(30),
      visits60d: getVisitsSinceDays(60),
      visits90d: getVisitsSinceDays(90),
      totalProjectInquiries: inquiries.length,
      totalContactSubmissions: contacts.length,
      totalProjectFormSubmissions: inquiries.length,
      activeUnreadLeads: activeInquiries + unreadContacts,
      serviceAnalytics: storage.getServiceAnalytics(),
      recentInquiries: inquiries.slice(0, 5),
      recentContacts: contacts.slice(0, 5),
      recentActivity: storage.getActivityLogs(8),
    };

    res.json(stats);
  } catch (err: any) {
    console.error('Error fetching admin dashboard:', err);
    res.status(500).json({ error: 'Could not load dashboard data' });
  }
});

// Admin Analytics (Visits graph & periods)
app.get('/api/admin/visits', requireAdmin, (req: Request, res: Response) => {
  try {
    const period = (req.query.period as '7d' | '30d' | '60d' | '90d') || '30d';
    const analytics = storage.getAnalytics(period);
    res.json(analytics);
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Could not fetch analytics' });
  }
});

// Admin Project Inquiries (List, Search, Filter)
app.get('/api/admin/inquiries', requireAdmin, async (req: Request, res: Response) => {
  try {
    await syncRealSupabaseData();

    const { search, status, service } = req.query as {
      search?: string;
      status?: string;
      service?: string;
    };
    const inquiries = storage.getInquiries({ search, status, service });
    res.json(inquiries);
  } catch (err: any) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Could not fetch inquiries' });
  }
});

// Admin Get Inquiry Details
app.get('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const item = storage.getInquiryById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }
  res.json(item);
});

// Admin Update Inquiry Status & Notes
app.patch('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body || {};
    const updated = storage.updateInquiry(req.params.id, {
      status: status as InquiryStatus,
      notes,
    });
    if (!updated) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    // Also update Supabase in background
    try {
      fetch(`${SUPABASE_URL}/rest/v1/appointments?reference_id=eq.${encodeURIComponent(updated.reference_id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: updated.status,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    res.json({ success: true, inquiry: updated });
  } catch (err: any) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ error: 'Could not update inquiry' });
  }
});

// Admin Delete Project Inquiry (Removes permanently from Supabase & Storage)
app.delete('/api/admin/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const inquiryId = req.params.id;
    const existing = storage.getInquiryById(inquiryId);
    if (!existing) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    // 1. Delete from Supabase appointments table
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/appointments?reference_id=eq.${encodeURIComponent(existing.reference_id)}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        if (existing.id && !isNaN(Number(existing.id))) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/appointments?id=eq.${encodeURIComponent(existing.id)}`,
            {
              method: 'DELETE',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
              },
            }
          );
        }
      }
    } catch (err: any) {
      console.warn('Supabase delete error:', err.message);
    }

    // 2. Delete from server storage
    const deleted = storage.deleteInquiry(inquiryId);

    res.json({ success: true, deletedRecord: deleted });
  } catch (err: any) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({ error: 'Could not delete inquiry' });
  }
});

// Admin Contact Submissions (List, Search, Filter)
app.get('/api/admin/contacts', requireAdmin, async (req: Request, res: Response) => {
  try {
    await syncRealSupabaseData();

    const { search, status } = req.query as { search?: string; status?: string };
    const contacts = storage.getContacts({ search, status });
    res.json(contacts);
  } catch (err: any) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Could not fetch contact submissions' });
  }
});

// Admin Update Contact Status & Notes
app.patch('/api/admin/contacts/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body || {};
    const updated = storage.updateContact(req.params.id, {
      status: status as ContactStatus,
      notes,
    });
    if (!updated) {
      res.status(404).json({ error: 'Contact submission not found' });
      return;
    }

    // Also update Supabase in background
    try {
      fetch(`${SUPABASE_URL}/rest/v1/appointments?reference_id=eq.${encodeURIComponent(updated.reference_id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: updated.status,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    res.json({ success: true, contact: updated });
  } catch (err: any) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Could not update contact submission' });
  }
});

// Admin Delete Contact Submission (Removes permanently from Supabase & Storage)
app.delete('/api/admin/contacts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const contactId = req.params.id;
    const existing = storage.getContactById(contactId);
    if (!existing) {
      res.status(404).json({ error: 'Contact submission not found' });
      return;
    }

    // 1. Delete from Supabase appointments table
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/appointments?reference_id=eq.${encodeURIComponent(existing.reference_id)}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        if (existing.id && !isNaN(Number(existing.id))) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/appointments?id=eq.${encodeURIComponent(existing.id)}`,
            {
              method: 'DELETE',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
              },
            }
          );
        }
      }
    } catch (err: any) {
      console.warn('Supabase contact delete error:', err.message);
    }

    // 2. Delete from server storage
    const deleted = storage.deleteContact(contactId);

    res.json({ success: true, deletedRecord: deleted });
  } catch (err: any) {
    console.error('Error deleting contact submission:', err);
    res.status(500).json({ error: 'Could not delete contact submission' });
  }
});

// Admin Client CRM List
app.get('/api/admin/clients', requireAdmin, async (req: Request, res: Response) => {
  try {
    await syncRealSupabaseData();

    const clients = storage.getClients();
    res.json(clients);
  } catch (err: any) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Could not fetch clients' });
  }
});

// Admin Service Analytics
app.get('/api/admin/services-analytics', requireAdmin, async (req: Request, res: Response) => {
  try {
    await syncRealSupabaseData();

    const data = storage.getServiceAnalytics();
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching service analytics:', err);
    res.status(500).json({ error: 'Could not fetch service analytics' });
  }
});

// Admin Recent Activity
app.get('/api/admin/activity', requireAdmin, (req: Request, res: Response) => {
  try {
    const logs = storage.getActivityLogs(50);
    res.json(logs);
  } catch (err: any) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ error: 'Could not fetch activity logs' });
  }
});

// Admin System Settings / Status
app.get('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  res.json({
    adminEmail: 'admin@example.com',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    supabaseConnected: Boolean(process.env.VITE_SUPABASE_URL),
    supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://cgqvcgpwejiouijuhwqe.supabase.co',
    storageDirectory: path.resolve(process.cwd(), 'data'),
  });
});

// ========================================================
// VITE / STATIC SERVING
// ========================================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log('Admin authentication module ready');
  });
}

startServer();
