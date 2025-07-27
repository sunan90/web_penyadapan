'use client';
import { useRef, useState } from 'react';

export default function ImportExcelModal() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!file) return alert('Silakan pilih file terlebih dahulu');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/get-penyadap/create/import/excel', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    // Menutup modal pakai checkbox
    document.getElementById('import_excel_modal').checked = false;
    setFile(null);

    if (!res.ok) {
      alert(data.message || 'Gagal import');
    } else {
      alert('Import berhasil!');
    }
  };

  return (
    <>
      {/* Tombol buka modal */}
      <label htmlFor="import_excel_modal" className="btn btn-primary">
        Import Excel
      </label>

      {/* Modal DaisyUI */}
      <input type="checkbox" id="import_excel_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Import Data Penyadap</h3>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
          />

          <div className="modal-action">
            {/* Tombol batal */}
            <label htmlFor="import_excel_modal" className="btn">
              Batal
            </label>

            {/* Tombol submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-success"
            >
              {loading ? 'Mengimpor...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
