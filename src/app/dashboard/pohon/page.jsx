'use client'

import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function PohonPage() {

    const router = useRouter()
  // State management
  const [pohonList, setPohonList] = useState([])
  const [blokList, setBlokList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    nama_pohon: '',
    id_blok: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [currentPohonId, setCurrentPohonId] = useState(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pohonRes, blokRes] = await Promise.all([
          fetch('/api/pohon/all'),
          fetch('/api/get-blok/all')
        ])
        
        setPohonList((await pohonRes.json()).data || [])
        setBlokList((await blokRes.json()).data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const endpoint = editMode 
      ? `/api/pohon/update/${currentPohonId}`
      : '/api/pohon/create'
      
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
          router.push('/dashboard/pohon')
        // Update UI
        if (editMode) {
          setPohonList(pohonList.map(p => 
            p.id === currentPohonId ? { ...p, ...formData } : p
          ))
        } else {
          setPohonList([...pohonList, result.data])
        }


        // Reset form
        // setFormData({ nama_pohon: '', id_blok: '' })
        // setEditMode(false)
        // setCurrentPohonId(null)
        
      }

    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  const handleEdit = (pohon) => {
    setFormData({
      nama_pohon: pohon.nama_pohon,
      id_blok: pohon.id_blok
    })
    setEditMode(true)
    setCurrentPohonId(pohon.id)
    document.getElementById('pohon-modal').showModal()
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus pohon ini?')) {
      try {
        const res = await fetch(`/api/pohon/delete/${id}`, {
          method: 'DELETE'
        })
        const result = await res.json()

        if (res.ok) {
          setPohonList(pohonList.filter(p => p.id !== id))
        }

        alert(result.message)
      } catch (error) {
        alert('Terjadi kesalahan')
      }
    }
  }

  // Filter data
  const filteredPohon = pohonList.filter(pohon => 
    pohon.nama_pohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pohon.tabel_blok?.nama_blok || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pohon</h1>
          <p className="text-gray-600">Kelola data pohon</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
           
          </div>
          
          {/* Add Button */}
          <button
            className="btn btn-primary gap-2"
            onClick={() => {
              setEditMode(false)
              setFormData({ nama_pohon: '', id_blok: '' })
              document.getElementById('pohon-modal').showModal()
            }}
          >
            <FiPlus /> Tambah Pohon
          </button>
        </div>
      </div>

      {/* Table Section */}
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
                  <th className="w-12">No</th>
                  <th>Nama Pohon</th>
                  <th>Blok</th>
                  <th className="w-40">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pohonList.length > 0 ? (
                  pohonList.map((pohon, index) => (
                    <tr key={pohon.id} className="hover:bg-gray-50">
                      <td>{index + 1}</td>
                      <td className="font-medium">{pohon.nama_pohon}</td>
                      <td>{pohon.tabel_blok?.nama_blok || '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(pohon)}
                            className="btn btn-sm btn-outline btn-warning"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(pohon.id)}
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
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Tidak ditemukan hasil pencarian' : 'Belum ada data pohon'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <dialog id="pohon-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {editMode ? 'Edit Pohon' : 'Tambah Pohon Baru'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Pohon</span>
              </label>
              <input
                type="text"
                name="nama_pohon"
                className="input input-bordered w-full"
                value={formData.nama_pohon}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Blok</span>
              </label>
              <select
                name="id_blok"
                className="select select-bordered w-full"
                value={formData.id_blok}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Blok</option>
                {blokList.map(blok => (
                  <option key={blok.id} value={blok.id}>
                    {blok.nama_blok}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => document.getElementById('pohon-modal').close()}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                {editMode ? 'Simpan Perubahan' : 'Tambah Pohon'}
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