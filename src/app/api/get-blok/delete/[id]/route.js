import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function DELETE(request, { params }) {
  const { id } = params;

  // 1. Hapus penilaian yang merujuk ke pohon ini
  const { error: penilaianError } = await supabase
    .from('tabel_penilaian')
    .delete()
    .eq('id_pohon', id);

  if (penilaianError) {
    return NextResponse.json({ message: 'Gagal menghapus penilaian terkait', error: penilaianError }, { status: 500 });
  }
  const { error } = await supabase
    .from('tabel_blok')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({
      message: 'Gagal menghapus blok',
      error,
    }, { status: 500 });
  }

  return NextResponse.json({ message: 'Blok berhasil dihapus' }, { status: 200 });
}
