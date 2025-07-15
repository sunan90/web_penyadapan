// /app/api/pohon/[id]/route.js
import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabaseClient";

// Fungsi DELETE berdasarkan ID
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

  // 2. Hapus pohon setelah penilaiannya dihapus
  const { error: pohonError } = await supabase
    .from('tabel_pohon')
    .delete()
    .eq('id', id);

  if (pohonError) {
    return NextResponse.json({ message: 'Gagal menghapus pohon', error: pohonError }, { status: 500 });
  }

  return NextResponse.json({ message: 'Pohon dan penilaian terkait berhasil dihapus' });
}
