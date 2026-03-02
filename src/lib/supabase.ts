import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://toqcfxmppbuciuapupct.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcWNmeG1wcGJ1Y2l1YXB1cGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTIzMzksImV4cCI6MjA4ODAyODMzOX0.CKgfTSDDy78B8jWPlvdktS_gh9GAgLwj8BJt7H3JGYg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface GuestRow {
  id: number;
  guestname: string;
  guestcode: string;
}
