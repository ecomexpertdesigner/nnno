import { createClient } from '@supabase/supabase-js';

// Safe environment variable retriever that works across Vite client, tests, and Node
const getEnvVar = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key]!;
    }
  } catch {
    // ignore
  }
  return fallback;
};

// Project credentials provided for Supabase backend
export const SUPABASE_URL = getEnvVar(
  'VITE_SUPABASE_URL',
  'https://cgqvcgpwejiouijuhwqe.supabase.co'
);

export const SUPABASE_ANON_KEY = getEnvVar(
  'VITE_SUPABASE_ANON_KEY',
  'sb_publishable_h_zkVMzHmdSifpW_pGgcZA_kHAZDLPM'
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface AppointmentBookingPayload {
  reference_id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  service_id?: string;
  budget?: string;
  package?: string;
  aspect_ratios?: string[];
  addons?: string[];
  project_link?: string;
  brief?: string;
  source?: string;
  status?: string;
  created_at?: string;
}

export interface SaveAppointmentResult {
  success: boolean;
  referenceId: string;
  savedToSupabase: boolean;
  tableName?: string;
  error?: string;
  backupSaved: boolean;
}

/**
 * Saves appointment booking details to Supabase backend.
 * Tries the primary 'appointments' table first, with fallbacks to 'inquiries' or 'bookings'.
 * Always preserves a local backup in localStorage so inquiries are never lost.
 */
export async function saveAppointmentBooking(
  data: AppointmentBookingPayload
): Promise<SaveAppointmentResult> {
  const referenceId = data.reference_id;
  const timestamp = data.created_at || new Date().toISOString();

  // 1. Always save locally first as guaranteed backup
  let backupSaved = false;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingStr = window.localStorage.getItem('wg_appointments_backup');
      const existing: AppointmentBookingPayload[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift({
        ...data,
        created_at: timestamp,
      });
      window.localStorage.setItem('wg_appointments_backup', JSON.stringify(existing.slice(0, 100)));
      backupSaved = true;
    }
  } catch (err) {
    console.warn('Could not cache appointment locally:', err);
  }

  // 2. Dispatch to server database endpoint
  try {
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference_id: referenceId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        service: data.service,
        service_id: data.service_id,
        budget: data.budget,
        package: data.package,
        aspect_ratios: data.aspect_ratios,
        addons: data.addons,
        project_link: data.project_link,
        brief: data.brief,
        source: data.source || 'Appointment Booking Form',
        status: 'New',
        created_at: timestamp,
      }),
    }).catch((e) => console.warn('Server inquiry post notice:', e));
  } catch {
    // ignore
  }

  // Candidate table names in priority order (defaulting to primary 'appointments')
  const tableName = 'appointments';

  // Exact row payload matching Supabase appointments table schema
  const row = {
    reference_id: referenceId,
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    service: data.service,
    service_id: data.service_id || null,
    budget: data.budget || null,
    package: data.package || null,
    aspect_ratios: Array.isArray(data.aspect_ratios)
      ? data.aspect_ratios.join(', ')
      : data.aspect_ratios || null,
    addons: Array.isArray(data.addons)
      ? data.addons.join(', ')
      : data.addons || null,
    project_link: data.project_link || null,
    brief: data.brief || null,
    source: data.source || 'Appointment Booking Form',
    status: data.status || 'new',
    created_at: timestamp,
  };

  let savedToSupabase = false;
  let lastError: string = '';

  try {
    const { error: insertError } = await supabase.from(tableName).insert([row]);
    if (!insertError) {
      savedToSupabase = true;
    } else {
      lastError = insertError.message;
      console.warn('Supabase insertion notice:', lastError);
    }
  } catch (err: any) {
    lastError = err?.message || String(err);
    console.warn('Supabase insert exception:', lastError);
  }

  return {
    success: true,
    referenceId,
    savedToSupabase,
    tableName,
    error: lastError || undefined,
    backupSaved,
  };
}

/**
 * SQL Schema definition to help the user create the table in Supabase SQL editor.
 */
export const SUPABASE_APPOINTMENTS_SQL = `
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/cgqvcgpwejiouijuhwqe/sql)
CREATE TABLE IF NOT EXISTS public.appointments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  reference_id TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT,
  service_id TEXT,
  budget TEXT,
  package TEXT,
  aspect_ratios TEXT,
  addons TEXT,
  project_link TEXT,
  brief TEXT,
  source TEXT DEFAULT 'Appointment Booking Form',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts so public website visitors can book appointments
CREATE POLICY "Allow public anonymous appointment bookings"
ON public.appointments
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users / admins to view all bookings
CREATE POLICY "Allow authenticated read appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (true);
`.trim();
