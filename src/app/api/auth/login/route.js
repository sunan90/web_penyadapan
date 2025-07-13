import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import supabase from '@/app/lib/supabaseClient';

const SECRET_KEY = 'penyadap'; // sebaiknya simpan di .env


export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

    const {data,error}= await supabase.from('tabel_penilai')
  const user = users.find(u => u.username === username);
  if (!user) {
    return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ message: 'Password salah' }, { status: 401 });
  }

  // Buat token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h',
  });

  return NextResponse.json({ token });
}
