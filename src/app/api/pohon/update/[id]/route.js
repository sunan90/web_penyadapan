import supabase from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

// Fungsi PATCH untuk update data pohon
export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    const { nama_pohon, id_blok} = body;

    const { data, error } = await supabase
      .from('tabel_pohon')
      .update({
        nama_pohon,
        id_blok,
       
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: 'Gagal memperbarui data pohon', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data pohon berhasil diperbarui', data });
  } catch (err) {
    return NextResponse.json({ message: 'Request tidak valid', error: err.message }, { status: 400 });
  }
}
