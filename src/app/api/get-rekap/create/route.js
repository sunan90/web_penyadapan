import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id_blok, id_penilai, id_penyadap, total_score, tanggal_penilaian } = body;
    console.log(id_blok, id_penilai, id_penyadap, total_score, tanggal_penilaian)

    // Validasi awal (opsional tapi disarankan)
    if (!id_blok || !id_penilai || !id_penyadap || !tanggal_penilaian) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tabel_rekap_penilaian')
      .insert({
        id_blok,
        id_penilai,
        id_penyadap,
        total_score: total_score === '' ? null : total_score, // handle jika kosong
        tanggal_penilaian,
      });



    if (error) {
      return NextResponse.json({ message: 'Gagal menyimpan', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Berhasil disimpan' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Terjadi kesalahan server', error: err.message }, { status: 500 });
  }
}
