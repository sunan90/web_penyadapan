import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_pohon,id_blok } = body;
    // console.log(id_blok, id_penilai, id_penyadap, total_score, tanggal_penilaian)

    // Validasi awal (opsional tapi disarankan)
    if (!id_blok || !nama_pohon) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tabel_pohon')
      .insert({
        id_blok,
        nama_pohon,
        
      });



    if (error) {
      return NextResponse.json({ message: 'Gagal menyimpan', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Berhasil disimpan' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Terjadi kesalahan server', error: err.message }, { status: 500 });
  }
}
