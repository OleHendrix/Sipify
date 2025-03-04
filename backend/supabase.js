
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qppdexustfqvwsrhmqih.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcGRleHVzdGZxdndzcmhtcWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTM2NDIsImV4cCI6MjA1NjU2OTY0Mn0.zaVM1uAGpOIfcQ2tmWmIhHj7rNgPV2zsIvvmDEod28E'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase