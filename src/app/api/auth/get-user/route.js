import supabaseServer from "@/app/lib/supabaseServer";
import { NextResponse } from "next/server";




export async function GET() {
  // Ambil semua blok beserta pohon-pohonnya (relasi 1:n)
const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return NextResponse.json({user})




}