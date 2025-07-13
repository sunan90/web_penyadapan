import supabaseServer from '../lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('nama_penilai')
    .eq('id', user.id)
    .single();

  return (
      
        <div className="text-2xl font-bold mb-4">Selamat datang, {profile?.nama_penilai || 'Penilai'}!</div>
       
        );
}
