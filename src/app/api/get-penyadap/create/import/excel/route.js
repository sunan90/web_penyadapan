import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import supabase from '@/app/lib/supabaseClient';
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'File tidak ditemukan' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Pastikan ada kolom "nama_penyadap"
    const cleanedData = jsonData.map(row => ({
      nama_penyadap: row.nama_penyadap || row.Nama || row.nama || '',
    })).filter(item => item.nama_penyadap !== '');

    if (cleanedData.length === 0) {
      return NextResponse.json({ message: 'Tidak ada data valid yang ditemukan' }, { status: 400 });
    }

    const { error } = await supabase.from('tabel_penyadap').insert(cleanedData);

    if (error) {
      return NextResponse.json({ message: 'Gagal mengimpor data', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Berhasil mengimpor data', data: cleanedData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Terjadi kesalahan', error: err.message }, { status: 500 });
  }
}
