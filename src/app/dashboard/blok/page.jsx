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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/get-blok/all')
        const json = await res.json()
        setBlokList(json.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const endpoint = editMode
      ? `/api/get-blok/update/${currentBlokId}`
      : '/api/get-blok/create'

    const method = editMode ? 'PATCH' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (res.ok) {
        alert(result.message)
        router.push('/dashboard/blok')
        // Update UI
        if (editMode) {
          setBlokList(blokList.map(b => b.id === currentBlokId ? { ...b, ...formData } : b))
        } else {
          setBlokList([...blokList, result.data])
        }

        // Reset form
        setFormData({ nama_blok: '' })
        setEditMode(false)
        setCurrentBlokId(null)
        document.getElementById('blok-modal').close()
      } else {
        alert(result.message || 'Gagal menyimpan data')
      }

    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  const handleEdit = (blok) => {
    setFormData({ nama_blok: blok.nama_blok })
    setEditMode(true)
    setCurrentBlokId(blok.id)
    document.getElementById('blok-modal').showModal()
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus blok ini?')) {
      try {
        const res = await fetch(`/api/get-blok/delete/${id}`, {
          method: 'DELETE'
        })
        const result = await res.json()

        if (res.ok) {
          setBlokList(blokList.filter(b => b.id !== id))
        }

        alert(result.message)
      } catch (error) {
        alert('Terjadi kesalahan')
      }
    }
  }

  const filteredBlokList = Array.isArray(blokList)
  ? blokList.filter(b =>
      b.nama_blok?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  if(!blokList) return <p>Loading...</p>

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Blok</h1>
          <p className="text-gray-600">Kelola data blok</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Cari nama blok..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <FiSearch />
            </div>
          </div>

          {/* Add Button */}
          <button
            className="btn btn-primary gap-2"
            onClick={() => {
              setEditMode(false)
              setFormData({ nama_blok: '' })
              document.getElementById('blok-modal').showModal()
            }}
          >
            <FiPlus /> Tambah Blok
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>No</th>
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
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById('blok-modal').close()}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                {editMode ? 'Simpan Perubahan' : 'Tambah Blok'}
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
