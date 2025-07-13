import supabase from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";



export async function GET() {
  // Ambil semua blok beserta pohon-pohonnya (relasi 1:n)
  const { data, error } = await supabase
    .from('tabel_penyadap')
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}