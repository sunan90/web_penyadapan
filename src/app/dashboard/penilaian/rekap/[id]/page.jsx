'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PohonCard from "@/app/components/PohonCard";
import PenilaianModal from "@/app/components/PenilaianModal";
import RekapTable from "@/app/components/RekapTable";

export default function Page() {
  const { id: rekapId } = useParams();
  const [rekap, setRekap] = useState(null);
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPohon, setSelectedPohon] = useState(null);
  const [showRekap, setShowRekap] = useState(false);

  const labelMap = {
    luka_kayu: "Luka Kayu",
    kedalaman_sadap: "Kedalaman Sadap",
    pemakaian_kulit: "Pemakaian Kulit",
    teknik_ska: "Teknik SKA",
    irisan_sadap: "Irisan Sadap",
    sudut_sadap: "Sudut Sadap",
    pengambilan_scrap: "Pengambilan Scrap",
    peralatan_tidak_lengkap: "Peralatan Tidak Lengkap",
    kebersihan_alat: "Kebersihan Alat",
    pohon_tidak_disadap: "Pohon Tidak Disadap",
    hasil_tidak_dipungut: "Hasil Tidak Dipungut",
    talang_sadap_mampet: "Talang Sadap Mampet",
  };
const pointOptions = {
    luka_kayu: [
      { label: "Luka Kecil (2 Poin)", value: 2 },
      { label: "Luka Sedang (5 Poin)", value: 5 },
      { label: "Luka Besar (10 Poin)", value: 10 },
    ],
    kedalaman_sadap: [
      { label: "Dangkal (2 Poin)", value: 2 },
      { label: "Cukup (5 Poin)", value: 5 },
      { label: "Dalam (10 Poin)", value: 10 },
    ],
    pemakaian_kulit: [
      { label: "Sedikit (2 Poin)", value: 2 },
      { label: "Normal (5 Poin)", value: 5 },
      { label: "Berlebihan (10 Poin)", value: 10 },
    ],
    teknik_ska: [
      { label: "Salah (5 Poin)", value: 5 },
      { label: "Benar (0 Poin)", value: 0 },
    ],
    irisan_sadap: [
      { label: "Salah (5 Poin)", value: 5 },
      { label: "Benar (0 Poin)", value: 0 },
    ],
    sudut_sadap: [
      { label: "Salah (5 Poin)", value: 5 },
      { label: "Benar (0 Poin)", value: 0 },
    ],
    pengambilan_scrap: [
      { label: "Salah (5 Poin)", value: 5 },
      { label: "Benar (0 Poin)", value: 0 },
    ],
    peralatan_tidak_lengkap: [
      { label: "Ya (5 Poin)", value: 5 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
    kebersihan_alat: [
      { label: "Kotor (5 Poin)", value: 5 },
      { label: "Bersih (0 Poin)", value: 0 },
    ],
    pohon_tidak_disadap: [
      { label: "Ya (10 Poin)", value: 10 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
    hasil_tidak_dipungut: [
      { label: "Ya (10 Poin)", value: 10 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
    talang_sadap_mampet: [
      { label: "Ya (5 Poin)", value: 5 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
  };

  useEffect(() => {
    async function fetchRekap() {
      try {
        const response = await fetch(`/api/get-rekap/${rekapId}`);
        const data = await response.json();
        setRekap(data);
      } catch (err) {
        console.error("Gagal fetch rekap:", err);
      }
    }

    if (rekapId) fetchRekap();
  }, [rekapId]);

  const handleOpenModal = (pohon) => {
    setSelectedPohon(pohon);
    setForm({});
    setShowModal(true);
  };

  const handleSelectChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ...form,
      id_rekap_penilaian: rekap.id,
      id_pohon: selectedPohon.id,
    };

    const response = await fetch("/api/penilaian/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      setShowModal(false);
      location.reload(); // pertimbangkan fetch ulang data daripada reload full page
    } else {
      alert("Gagal menyimpan penilaian.");
    }
  };

  if (!rekap) return <div className="text-center mt-10">Memuat data rekap...</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {rekap.tabel_blok.tabel_pohon.map((pohon) => (
          <PohonCard
            key={pohon.id}
            pohon={pohon}
            rekapId={rekap.id}
            onPenilaian={handleOpenModal}
          />
        ))}
      </div>

      <div className="mb-6">
        <button className="btn btn-success" onClick={() => setShowRekap(!showRekap)}>
          {showRekap ? "Tutup Rekap" : "Rekap Data"}
        </button>
      </div>

      {showRekap && <RekapTable rekap={rekap} labelMap={labelMap} />}

      {showModal && (
        <PenilaianModal
          labelMap={labelMap}
          pointOptions={pointOptions}
          form={form}
          selectedPohon={selectedPohon}
          onChange={handleSelectChange}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
