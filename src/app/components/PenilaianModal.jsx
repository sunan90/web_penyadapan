export default function PenilaianModal({ labelMap, pointOptions, form, onChange, onClose, onSubmit, selectedPohon }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto z-50">
      <div className="min-h-screen flex justify-center items-start py-10">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Penilaian: {selectedPohon?.nama_pohon}</h2>
          {Object.entries(pointOptions).map(([field, options]) => (
            <div key={field} className="mb-3">
              <label className="block font-semibold mb-1">{labelMap[field]}</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => onChange(field, parseInt(e.target.value))}
                value={form[field] || ""}
              >
                <option value="" disabled>Pilih {labelMap[field]}</option>
                {options.map((opt) => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn" onClick={onClose}>Batal</button>
            <button className="btn btn-primary" onClick={onSubmit}>Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
