import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function DELETE(request, { params }) {
  const { id } = params;

  // 1. Hapus penilaian yang merujuk ke pohon ini
  const { error: penyadapError } = await supabase
    .from('tabel_penyadap')
    .delete()
    .eq('id', id);
  
  return NextResponse.json({ message: 'Penyadap berhasil dihapus' }, { status: 200 });
}
