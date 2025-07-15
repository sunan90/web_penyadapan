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
      { label: "Tidak Ada (0 Poin)", value: 3 },
      { label: "Luka Kecil (3 Poin)", value: 3 },
      { label: "Luka Sedang (5 Poin)", value: 5 },
      { label: "Luka Besar (7 Poin)", value: 7 },
    ],
    kedalaman_sadap: [
      { label: "Dangkal (2 Poin)", value: 2 },
      { label: "Normatif (0 Poin)", value: 0 },
      { label: "Rapat (4 Poin)", value: 4 },
    ],
    pemakaian_kulit: [
      { label: "Boros (6 Poin)", value: 6 },
      { label: "Sangat Boros (10 Poin)", value: 10 },
      // { label: "Berlebihan (10 Poin)", value: 10 },
    ],
    teknik_ska: [
      { label: "Tidak Pakai Tangga (3 Poin)", value: 3 },
      { label: "Tidak Pakai Pacekung (5 Poin)", value: 5 },
      { label: "Sotokan (7 Poin)", value: 7 },
    ],
    irisan_sadap: [
      { label: "IMDB (2 Poin)", value: 2 },
      { label: "IMBB (2 Poin)", value: 2 },
      { label: "ITSBD (2 Poin)", value: 2 },
      { label: "ITSBB (2 Poin)", value: 2 },
      { label: "TAS (5 Poin)", value: 5 },
      { label: "TAP (5 Poin)", value: 5 },
      { label: "TEBAL TATAL (10 Poin)", value: 10 },
      // { label: "Benar (0 Poin)", value: 0 },
    ],
    sudut_sadap: [
      { label: ">45 Derajat (3 Poin)", value: 3 },
      { label: "<35 Derajat (3 Poin)", value:  3},
      { label: "Bergelombang (2 Poin)", value: 2 },
      // { label: "Benar (0 Poin)", value: 0 },
    ],
    pengambilan_scrap: [
      { label: "Diambil (5 Poin) (5 Poin)", value: 0 },
      { label: "Tidak diambil (2 Poin)", value: 2 },
    ],
    peralatan_tidak_lengkap: [
      { label: "Talang (2 Poin) ", value: 2 },
      { label: "Mangkok (3 Poin)", value: 3},
      { label: "Talang Pancing (1 Poin)", value: 1 },
    ],
    kebersihan_alat: [
      { label: "Talang (1 Poin)", value: 1 },
      { label: "Mangkok (1 Poin)", value: 1 },
      { label: "Ember kolotan (2 Poin)", value: 2 },
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
      { label: "Ya (1 Poin)", value: 1 },
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
      {console.log(rekap  )}
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
