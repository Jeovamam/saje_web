import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cgsjxxjastwhpkoeabon.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnc2p4eGphc3R3aHBrb2VhYm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzMxNTIsImV4cCI6MjA4NzQ0OTE1Mn0.6IreIBp0Wg9vi_bXP88Wy309O8y8UCps0ObtgjG5qC4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)