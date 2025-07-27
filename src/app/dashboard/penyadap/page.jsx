'use client'

import { useEffect, useState } from 'react'
import ImportExcelModal from '@/app/components/ImportExcelModal'
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi'

export default function PenyadapPage() {
  const [penyadapList, setPenyadapList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ nama_penyadap: '' })
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data penyadap
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/get-penyadap/all')
        if (!res.ok) throw new Error('Gagal mengambil data')
        const data = await res.json()
        setPenyadapList(data?.data || [])
      } catch (err) {
        console.error(err)
        alert('Gagal memuat data penyadap')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const endpoint = editMode
        ? `/api/get-penyadap/update/${currentId}`
        : '/api/get-penyadap/create'

      const method = editMode ? 'PATCH' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      alert(result.message)

      // Refresh data
      const refresh = await fetch('/api/get-penyadap/all')
      const refreshData = await refresh.json()
      setPenyadapList(refreshData?.data || [])

      // Reset form
      setFormData({ nama_penyadap: '' })
      setEditMode(false)
      setCurrentId(null)
      document.getElementById('penyadap-modal')?.close()

    } catch (err) {
      alert(err.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (penyadap) => {
    setFormData({ nama_penyadap: penyadap.nama_penyadap || '' })
    setEditMode(true)
    setCurrentId(penyadap.id)
    document.getElementById('penyadap-modal')?.showModal()
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus penyadap ini?')) return
    try {
      const res = await fetch(`/api/get-penyadap/delete/${id}`, {
        method: 'DELETE'
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      setPenyadapList(prev => prev.filter(p => p.id !== id))
      alert(result.message)
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menghapus')
    }
  }

  const filteredList = penyadapList.filter(p =>
    (p.nama_penyadap?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Penyadap</h1>
          <p className="text-gray-600">Kelola data penyadap</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Cari nama penyadap..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary gap-2"
            onClick={() => {
              setEditMode(false)
              setFormData({ nama_penyadap: '' })
              document.getElementById('penyadap-modal')?.showModal()
            }}
            disabled={isLoading}
          >
            <FiPlus /> Tambah
          </button>
            <ImportExcelModal/>
          
          
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-2 text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-12">No</th>
                  <th>Nama Penyadap</th>
                  <th className="w-40">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((p, index) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td>{index + 1}</td>
                      <td className="font-medium">{p.nama_penyadap}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="btn btn-sm btn-outline btn-warning"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="btn btn-sm btn-outline btn-error"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Belum ada data penyadap'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <dialog id="penyadap-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {editMode ? 'Edit Penyadap' : 'Tambah Penyadap'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Penyadap</span>
              </label>
              <input
                type="text"
                name="nama_penyadap"
                className="input input-bordered w-full"
                value={formData.nama_penyadap}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById('penyadap-modal')?.close()}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : editMode ? 'Simpan Perubahan' : 'Tambah Penyadap'}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}
