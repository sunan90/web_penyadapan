import supabase from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

// Fungsi PATCH untuk update data blok
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    const { id_blok, id_penilai, id_penyadap, total_score, tanggal_penilaian} = body;

    const { data, error } = await supabase
      .from('tabel_rekap_penilaian')
      .update({
       id_blok, id_penilai, id_penyadap, total_score, tanggal_penilaian 
       
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: 'Gagal memperbarui data rekap', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data rekap berhasil diperbarui', data });
  } catch (err) {
    return NextResponse.json({ message: 'Request tidak valid', error: err.message }, { status: 400 });
  }
}
