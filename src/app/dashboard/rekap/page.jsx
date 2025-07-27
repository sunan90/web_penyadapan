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
  const [editingId, setEditingId] = useState(null)

  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    fetch('/api/get-blok/all')
      .then(res => res.json())
      .then(data => setBlokList(data.data || []))

    fetch('/api/auth/get-user')
      .then(res => res.json())
      .then(data => setUser(data.user || []))

    fetchData()

    fetch('/api/get-penyadap/all')
      .then(res => res.json())
      .then(data => setPenyadapList(data.data || []))
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/get-rekap/all')
    const data = await res.json()
    setRekap(data.data || [])
  }

  const resetForm = () => {
    setSelectedBlok('')
    setSelectedPenyadap('')
    setTanggal('')
    setTotalScore(0)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      id_blok: selectedBlok,
      id_penyadap: selectedPenyadap,
      tanggal_penilaian: tanggal,
      total_score: parseInt(totalScore),
      id_penilai: user.id
    }

    const endpoint = editingId
      ? `/api/get-rekap/update/${editingId}`
      : '/api/get-rekap/create'

    const res = await fetch(endpoint, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    alert(result.message || 'Berhasil disimpan')
    document.getElementById('rekap_modal').close()
    fetchData()
    resetForm()
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus?')) return

    const res = await fetch(`/api/get-rekap/delete/${id}`, {
      method: 'DELETE',
    })

    const result = await res.json()
    alert(result.message || 'Berhasil dihapus')
    fetchData()
  }

  const handleEdit = (rek) => {
    setEditingId(rek.id)
    setSelectedBlok(rek.id_blok)
    setSelectedPenyadap(rek.id_penyadap)
    setTanggal(rek.tanggal_penilaian)
    setTotalScore(rek.total_score)
    document.getElementById('rekap_modal').showModal()
  }

  return (
    <div>
      <h1 className="text-5xl mb-4">Perekapan</h1>
      {console.log(user)}

      <button
        className="btn mb-4"
        onClick={() => {
          resetForm()
          document.getElementById('rekap_modal').showModal()
        }}
      >
        Tambah Perekapan
      </button>

      {/* MODAL */}
      <dialog id="rekap_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {editingId ? 'Edit Rekap Penilaian' : 'Tambah Rekap Penilaian'}
          </h3>
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

            <div>
              <label className="block mb-1">Total Score</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={totalScore}
                onChange={(e) => setTotalScore(e.target.value)}
                required
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" className="btn" onClick={() => {
                resetForm()
                document.getElementById('rekap_modal').close()
              }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* TABEL */}
      <div className="overflow-x-auto">
        <table className="table table-success w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Blok</th>
              <th>Nama Penyadap</th>
              <th>Nama Penilai</th>
              <th>Tanggal Penilaian</th>
              <th>Total Score</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rekap.map((rek, index) => (
              <tr key={rek.id}>
                <td>{index + 1}</td>
                <td>{rek.tabel_blok?.nama_blok || '-'}</td>
                <td>{rek.tabel_penyadap?.nama_penyadap || '-'}</td>
                <td>{rek.profiles?.nama_penilai || '-'}</td>
                <td>{rek.tanggal_penilaian}</td>
                <td>{rek.total_score ?? '-'}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(rek)}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rek.id)}
                    className="btn btn-error btn-sm"
                  >
                    Hapus
                  </button>
                  <a
                    href={`/dashboard/penilaian/rekap/${rek.id}`}
                    className="btn btn-success btn-sm"
                  >
                    Detail
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
