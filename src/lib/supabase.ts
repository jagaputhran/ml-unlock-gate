import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CTFCompletion = {
  id?: string
  user_name: string
  email: string
  completed_at: string
  flags_collected: string[]
  completion_time_seconds: number
}