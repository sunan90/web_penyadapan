export default function PohonCard({ pohon, rekapId, onPenilaian }) {
  const sudahDinilai = pohon.tabel_penilaian?.some((p) => p.id_rekap_penilaian === rekapId);

  return (
    <div className="rounded-xl mt-10 border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow">
  <div className="p-4">
    <h2 className="text-lg font-semibold text-gray-800">{pohon.nama_pohon}</h2>
    {sudahDinilai ? (
      <p className="text-sm text-green-600 mt-2">✅ Sudah dinilai</p>
    ) : (
      <button
        className="mt-4 w-full rounded-lg bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition"
        onClick={() => onPenilaian(pohon)}
      >
        + Beri Penilaian
      </button>
    )}
  </div>
</div>

  );
}
