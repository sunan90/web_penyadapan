export default function RekapTable({ rekap, labelMap }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Rekap Penilaian</h2>
      
      {/* Container untuk scroll horizontal */}
      <div className="overflow-x-auto relative border border-gray-200 rounded-lg">
        {/* Table dengan lebar penuh */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">
                Nama Pohon
              </th>
              {Object.keys(labelMap).map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-center text-sm font-semibold text-gray-900 min-w-[150px] whitespace-nowrap"
                >
                  {labelMap[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rekap.tabel_blok.tabel_pohon.map((pohon) => {
              const penilaian = pohon.tabel_penilaian?.find(
                (p) => p.id_rekap_penilaian === rekap.id
              );

              return (
                <tr key={pohon.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 min-w-[200px]">
                    {pohon.nama_pohon}
                  </td>
                  {Object.keys(labelMap).map((field) => (
                    <td 
                      key={field} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center min-w-[150px]"
                    >
                      {penilaian ? penilaian[field] ?? "-" : "-"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}