import supabase from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

// Fungsi PATCH untuk update data blok
export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    const { nama_blok} = body;

    const { data, error } = await supabase
      .from('tabel_blok')
      .update({
        nama_blok,
        
       
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: 'Gagal memperbarui data blok', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data blok berhasil diperbarui', data });
  } catch (err) {
    return NextResponse.json({ message: 'Request tidak valid', error: err.message }, { status: 400 });
  }
}
