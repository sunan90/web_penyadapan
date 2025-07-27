import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function DELETE(request, { params }) {
  const { id } = params;

  // 1. Hapus penilaian yang merujuk ke penilaian ini
  const { error: rekappenilaianError } = await supabase
    .from('tabel_rekap_penilaian')
    .delete()
    .eq('id', id);
  
  return NextResponse.json({ message: 'Rekap Penilaian berhasil dihapus' }, { status: 200 });
}
