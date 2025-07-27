import { NextResponse } from 'next/server'
import supabase from '@/app/lib/supabaseClient'
export async function POST(request) {
  const data = await request.json()

  const { error } = await supabase
    .from('tabel_penyadap') // sesuaikan nama tabel
    .insert(data)

  if (error) {
    return NextResponse.json({ message: 'Gagal import', error }, { status: 500 })
  }

  return NextResponse.json({ message: 'Berhasil tambah data!' })
}
