'use client'

import { useEffect, useState } from 'react'

export default function RekapPage() {
  const [blokList, setBlokList] = useState([])
  const [penyadapList, setPenyadapList] = useState([])
  const [user, setUser] = useState([])
  const [rekap, setRekap] = useState([])

  const [selectedBlok, setSelectedBlok] = useState('')
  const [selectedPenyadap, setSelectedPenyadap] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    fetch('/api/get-blok/all')
      .then(res => res.json())
      .then(data => setBlokList(data.data || []))

    fetch('/api/auth/get-user')
      .then(res => res.json())
      .then(data => setUser(data.user || []))

    fetch('/api/get-rekap/all')
      .then(res => res.json())
      .then(data => setRekap(data.data || []))

    fetch('/api/get-penyadap/all')
      .then(res => res.json())
      .then(data => setPenyadapList(data.data || []))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      id_blok: selectedBlok,
      id_penyadap: selectedPenyadap,
      tanggal_penilaian: tanggal,
      total_score: parseInt(totalScore),
      id_penilai: user.id
    }

    const res = await fetch('/api/get-rekap/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    alert(result.message || 'Berhasil disimpan')
    document.getElementById('my_modal_1').close()
  }

  return (
    <div>
      <h1 className="text-5xl mb-4">Perekapan</h1>

      <button
        className="btn mb-4"
        onClick={() => document.getElementById('my_modal_1').showModal()}
      >
        Tambah Perekapan
      </button>

      {/* MODAL */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Rekap Penilaian</h3>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block mb-1">Blok</label>
              <select
                className="select select-bordered w-full"
                value={selectedBlok}
                onChange={(e) => setSelectedBlok(e.target.value)}
                required
              >
                <option value="">Pilih Blok</option>
                {blokList.map((blok) => (
                  <option key={blok.id} value={blok.id}>{blok.nama_blok}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Penyadap</label>
              <select
                className="select select-bordered w-full"
                value={selectedPenyadap}
                onChange={(e) => setSelectedPenyadap(e.target.value)}
                required
              >
                <option value="">Pilih Penyadap</option>
                {penyadapList.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_penyadap}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Tanggal Penilaian</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* TABEL */}
      <div className="overflow-x-auto">
        <table className="table   table-success w-full">
          <thead>
            <tr>
              <th >No</th>
              <th>Nama Blok</th>
              <th>Nama Penyadap</th>
              <th>Nama Penilai</th>
              <th>Tanggal Penilaian</th>
              <th>Total Score</th>
              <th>Detail Penilaian</th>
            </tr>
          </thead>  
          <tbody>
            {rekap.map((rek, index) => (
              <tr key={rek.id}>
                <td>{index + 1}</td>
                <td>{rek.tabel_blok?.nama_blok || '-'}</td>
                <td>{rek.tabel_penyadap?.nama_penyadap || '-'}</td>
                <td>{rek.penilai?.nama_penilai || '-'}</td>
                <td>{rek.tanggal_penilaian}</td>
                <td>{rek.total_score ?? '-'}</td>
                <td><a href={`/dashboard/penilaian/rekap/${rek.id}`} className='btn btn-success'>Lihat Nilai</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
