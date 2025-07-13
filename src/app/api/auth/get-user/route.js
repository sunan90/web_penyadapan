import supabaseServer from "@/app/lib/supabaseServer";
import { NextResponse } from "next/server";




export async function GET() {
  // Ambil semua blok beserta pohon-pohonnya (relasi 1:n)
const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('nama_penilai')
    .eq('id', user.id)
    .single();

  return NextResponse.json({user,profile})




}