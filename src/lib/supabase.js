import { createClient } from "@supabase/supabase-js";
const supabaseURL = "https://ngelijsdhdlgmiliyyya.supabase.co"
const supabaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZWxpanNkaGRsZ21pbGl5eXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzE5MjYsImV4cCI6MjA4Mzk0NzkyNn0.5_94MO5NOKxOiApv6DTTFndsXSfdJFde342EuXTYODQ"


export const supabase = createClient(supabaseURL, supabaseKEY)