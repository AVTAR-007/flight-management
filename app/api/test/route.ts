import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('flights')
    .select('flight_no, origin, destination, departs_at')
    .limit(5)

  return NextResponse.json({ data, error, url: process.env.NEXT_PUBLIC_SUPABASE_URL })
}