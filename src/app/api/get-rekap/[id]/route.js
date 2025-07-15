import supabase from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;

  const { data: rekap, error } = await supabase
    .from('tabel_rekap_penilaian')
    .select(`
      *,
      profiles(nama_penilai),
      tabel_penyadap(*),
      tabel_blok(
        *,
        tabel_pohon(
          *,
          tabel_penilaian(*)
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !rekap) {
    console.error("Gagal ambil rekap:", error);
    return NextResponse.json({ error: 'Rekap tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(rekap);
}
