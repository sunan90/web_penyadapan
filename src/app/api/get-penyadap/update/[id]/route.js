import supabase from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

// Fungsi PATCH untuk update data blok
export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    const { nama_penyadap} = body;

    const { data, error } = await supabase
      .from('tabel_penyadap')
      .update({
        nama_penyadap,
        
       
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: 'Gagal memperbarui data penyadap', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data penyadap berhasil diperbarui', data });
  } catch (err) {
    return NextResponse.json({ message: 'Request tidak valid', error: err.message }, { status: 400 });
  }
}
