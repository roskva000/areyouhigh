import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bozsdalydawvgeoyrxhh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvenNkYWx5ZGF3dmdlb3lyeGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3MzYsImV4cCI6MjA4NzE3NTczNn0.3Qs6xz4I391auGxwOffw9Vhh0pdgfQyW7YFWxQoDALM'

export const supabase = createClient(supabaseUrl, supabaseKey)
