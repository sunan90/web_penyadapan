import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';
export async function POST(request) {
  try {
    const {
      id_rekap_penilaian,
      id_pohon,
      luka_kayu,
      kedalaman_sadap,
      pemakaian_kulit,
      teknik_ska,
      irisan_sadap,
      sudut_sadap,
      peralatan_tidak_lengkap,
      kebersihan_alat,
      pohon_tidak_disadap,
      hasil_tidak_dipungut,
      talang_sadap_mampet,
    } = await request.json();

    

    const { data, error } = await supabase
      .from('tabel_penilaian')
      .insert([
        {
          id_rekap_penilaian,
          id_pohon,
          luka_kayu,
          kedalaman_sadap,
          pemakaian_kulit,
          teknik_ska,
          irisan_sadap,
          sudut_sadap,
          peralatan_tidak_lengkap,
          kebersihan_alat,
          pohon_tidak_disadap,
          hasil_tidak_dipungut,
          talang_sadap_mampet,
        },
      ]);

    if (error) {
      console.error('Error inserting data:', error);
      return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
    }

    return NextResponse.json({data:'berhasil'});
  } catch (error) {
    console.error('Error in POST /api/penilaian:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}