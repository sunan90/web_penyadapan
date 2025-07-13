import supabase from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from('tabel_rekap_penilaian')
    .select(`
      id,
      total_score,
      tanggal_penilaian,
      tabel_blok (
        id,
        nama_blok
      ),
      tabel_penyadap (
        id,
        nama_penyadap
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
