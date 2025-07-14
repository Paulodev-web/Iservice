import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = 'https://jylrlwhfasktdzycjbcb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bHJsd2hmYXNrdGR6eWNqYmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTA3MDMsImV4cCI6MjA2Njk4NjcwM30.Xjl6gN1Ob91VPIlXmQadfPzupMKjeHiOvkonoizfWbA'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 