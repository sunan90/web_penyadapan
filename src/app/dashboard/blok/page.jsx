'use client'

import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function BlokPage() {
  const router = useRouter()
  const [blokList, setBlokList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ nama_blok: '' })
  const [editMode, setEditMode] = useState(false)
  const [currentBlokId, setCurrentBlokId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data with better error handling
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/get-blok/all')
        if (!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        setBlokList(data?.data || [])
      } catch (error) {
        console.error('Fetch error:', error)
        alert('Gagal memuat data blok')
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
        ? `/api/get-blok/update/${currentBlokId}`
        : '/api/get-blok/create'
      
      const method = editMode ? 'PATCH' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Gagal menyimpan data')
      }

      alert(result.message)
      
      // Refresh data after successful operation
      const refreshRes = await fetch('/api/get-blok/all')
      const refreshData = await refreshRes.json()
      setBlokList(refreshData?.data || [])

      // Reset form and close modal
      setFormData({ nama_blok: '' })
      setEditMode(false)
      setCurrentBlokId(null)
      document.getElementById('blok-modal')?.close()

    } catch (error) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (blok) => {
    if (!blok) return
    
    setFormData({ 
      nama_blok: blok.nama_blok || '' 
    })
    setEditMode(true)
    setCurrentBlokId(blok.id)
    document.getElementById('blok-modal')?.showModal()
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus blok ini?')) return
    
    try {
      const res = await fetch(`/api/get-blok/delete/${id}`, {
        method: 'DELETE'
      })
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Gagal menghapus data')
      }

      setBlokList(prev => prev.filter(b => b.id !== id))
      alert(result.message)
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan')
    }
  }

  const filteredBlokList = blokList.filter(blok => 
    (blok.nama_blok?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Blok</h1>
          <p className="text-gray-600">Kelola data blok</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Cari nama blok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Button */}
          <button
            className="btn btn-primary gap-2"
            onClick={() => {
              setEditMode(false)
              setFormData({ nama_blok: '' })
              document.getElementById('blok-modal')?.showModal()
            }}
            disabled={isLoading}
          >
            <FiPlus /> Tambah Blok
          </button>
        </div>
      </div>

      {/* Table Section */}
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
                  <th>Nama Blok</th>
                  <th className="w-40">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlokList.length > 0 ? (
                  filteredBlokList.map((blok, index) => (
                    <tr key={blok.id} className="hover:bg-gray-50">
                      <td>{index + 1}</td>
                      <td className="font-medium">{blok.nama_blok}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(blok)}
                            className="btn btn-sm btn-outline btn-warning"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(blok.id)}
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
                      {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Belum ada data blok'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <dialog id="blok-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {editMode ? 'Edit Blok' : 'Tambah Blok Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Blok</span>
              </label>
              <input
                type="text"
                name="nama_blok"
                className="input input-bordered w-full"
                value={formData.nama_blok}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById('blok-modal')?.close()}
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
                ) : editMode ? (
                  'Simpan Perubahan'
                ) : (
                  'Tambah Blok'
                )}
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