'use client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function RekapTable({ rekap, labelMap }) {
  // Fungsi utilitas
  const hitungTotal = (penilaian) => {
    return penilaian
      ? Object.keys(labelMap).reduce((sum, key) => sum + (parseFloat(penilaian[key]) || 0), 0)
      : 0;
  };

  const tentukanKelas = (nilai) => {
    if (nilai < 15) return 'A';
    if (nilai <= 25) return 'B';
    return 'C';
  };

  // Fungsi ekspor
 const exportToPDF = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  // Margin dan ukuran
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableWidth = pageWidth - 2 * margin;

  // Header dokumen
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('REKAP PENILAIAN POHON', margin, margin);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nama Penilai: ${rekap.profiles?.nama_penilai || '-'}`, margin, margin + 20);
  doc.text(`Nama Penyadap: ${rekap.tabel_penyadap?.nama_penyadap || '-'}`, margin, margin + 40);
  doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, margin, margin + 60);

  // Persiapan data tabel
  const head = [["No", "Nama Pohon", ...Object.values(labelMap), "Total", "Kelas"]];
  const body = rekap.tabel_blok.tabel_pohon.map((pohon, index) => {
    const penilaian = pohon.tabel_penilaian?.find(p => p.id_rekap_penilaian === rekap.id);
    const nilaiList = Object.keys(labelMap).map(key => penilaian?.[key] ?? "-");
    const total = hitungTotal(penilaian);
    const kelas = total === 0 ? "-" : tentukanKelas(total);
    return [(index + 1).toString(), pohon.nama_pohon, ...nilaiList, total.toString(), kelas];
  });

  // Hitung lebar kolom dinamis
  const colWidths = [];
  const minColWidth = 60; // Lebar minimum kolom
  const maxColWidth = 150; // Lebar maksimum kolom
  
  // Hitung lebar maksimum untuk setiap kolom
  head[0].forEach((_, colIndex) => {
    let maxWidth = 0;
    
    // Cari teks terpanjang di header
    const headerText = head[0][colIndex];
    const headerWidth = doc.getStringUnitWidth(headerText) * 8; // Approximate width
    
    // Cari teks terpanjang di body
    let bodyWidth = 0;
    body.forEach(row => {
      const cellText = row[colIndex] || '';
      const width = doc.getStringUnitWidth(cellText.toString()) * 7; // Approximate width
      if (width > bodyWidth) bodyWidth = width;
    });
    
    // Tentukan lebar kolom
    const calculatedWidth = Math.max(headerWidth, bodyWidth) + 10; // Tambah padding
    const finalWidth = Math.min(maxColWidth, Math.max(minColWidth, calculatedWidth));
    
    colWidths.push(finalWidth);
  });

  // Sesuaikan total lebar dengan lebar halaman
  const totalWidth = colWidths.reduce((sum, width) => sum + width, 0);
  const scaleFactor = tableWidth / totalWidth;
  
  if (scaleFactor < 1) {
    // Jika terlalu lebar, scale down semua kolom
    colWidths.forEach((width, i) => {
      colWidths[i] = width * scaleFactor;
    });
  }

  // Generate tabel
  autoTable(doc, {
    startY: margin + 80,
    head,
    body,
    theme: 'grid',
    headStyles: {
      fillColor: [34, 197, 94], // green-500
      textColor: 255,
      fontSize: 8,
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: colWidths[0], halign: 'center' }, // Kolom No
      1: { cellWidth: colWidths[1], halign: 'left' },   // Kolom Nama
      // Kolom lainnya akan diatur otomatis
    },
    margin: { left: margin, right: margin },
    tableWidth: 'auto',
    styles: {
      cellWidth: 'auto',
      valign: 'middle'
    },
    didDrawPage: (data) => {
      // Footer halaman
      doc.setFontSize(8);
      doc.text(
        `Halaman ${data.pageNumber}`,
        pageWidth - margin,
        pageHeight - 20,
        { align: 'right' }
      );
    },
    willDrawCell: (data) => {
      // Alternating row colors
      if (data.section === 'body' && data.row.index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(
          data.cell.x,
          data.cell.y,
          data.cell.width,
          data.cell.height,
          'F'
        );
      }
    }
  });

  doc.save(`rekap-penilaian-${new Date().toISOString().slice(0,10)}.pdf`);
};
  const exportToExcel = () => {
    const wsData = [
      ['REKAP PENILAIAN POHON'],
      [`Nama Penilai: ${rekap.profiles?.nama_penilai || '-'}`],
      [`Nama Penyadap: ${rekap.tabel_penyadap?.nama_penyadap || '-'}`],
      [`Tanggal: ${new Date().toLocaleDateString()}`],
      [],
      ["No", "Nama Pohon", ...Object.values(labelMap), "Total", "Kelas"]
    ];

    rekap.tabel_blok.tabel_pohon.forEach((pohon, index) => {
      const penilaian = pohon.tabel_penilaian?.find(p => p.id_rekap_penilaian === rekap.id);
      const nilaiList = Object.keys(labelMap).map(key => penilaian?.[key] ?? "-");
      const total = hitungTotal(penilaian);
      const kelas = total === 0 ? "-" : tentukanKelas(total);
      wsData.push([index + 1, pohon.nama_pohon, ...nilaiList, total, kelas]);
    });

    // Tambah rata-rata
    const avg = calculateAverage();
    wsData.push([
      'Rata-rata', '', ...Array(Object.keys(labelMap).length).fill(''), 
      { v: avg, t: 'n' }, 
      tentukanKelas(Number(avg))
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Merge cells untuk header
    ws['!merges'] = [
      XLSX.utils.decode_range("A1:F1"),
      XLSX.utils.decode_range("A2:F2"),
      XLSX.utils.decode_range("A3:F3"),
      XLSX.utils.decode_range("A4:F4")
    ];
    
    // Styling Excel
    const lastRow = wsData.length;
    const lastCol = wsData[5].length; // Baris header kolom
    
    // Format header
    for (let i = 0; i < lastCol; i++) {
      const cell = XLSX.utils.encode_cell({ r: 5, c: i });
      ws[cell].s = {
        fill: { fgColor: { rgb: "FF4CAF50" } }, // Hijau
        font: { bold: true, color: { rgb: "FFFFFFFF" } },
        alignment: { horizontal: "center" }
      };
    }
    
    // Format footer rata-rata
    const avgRow = lastRow - 1;
    for (let i = 0; i < lastCol; i++) {
      const cell = XLSX.utils.encode_cell({ r: avgRow, c: i });
      if (!ws[cell]) continue;
      ws[cell].s = {
        fill: { fgColor: { rgb: "FF2196F3" } }, // Biru
        font: { bold: true, color: { rgb: "FFFFFFFF" } }
      };
    }

    XLSX.utils.book_append_sheet(wb, ws, "Rekap");
    XLSX.writeFile(wb, `rekap-penilaian-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const calculateAverage = () => {
    const scores = rekap.tabel_blok.tabel_pohon
      .map(p => hitungTotal(p.tabel_penilaian?.find(pn => pn.id_rekap_penilaian === rekap.id)))
      .filter(score => score > 0);

    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : "0";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 mt-6">
      {/* Header Section */}
      <div className="mb-6 space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">📊 Rekap Penilaian Pohon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Nama Penilai</p>
            <p className="font-medium">{rekap.profiles?.nama_penilai || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Nama Penyadap</p>
            <p className="font-medium">{rekap.tabel_penyadap?.nama_penyadap || '-'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button 
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10 min-w-[120px]">
                No
              </th>
              <th className="sticky left-[50px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10 min-w-[200px]">
                Nama Pohon
              </th>
              {Object.keys(labelMap).map(key => (
                <th 
                  key={key} 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  {labelMap[key]}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                Kelas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rekap.tabel_blok.tabel_pohon.map((pohon, index) => {
              const penilaian = pohon.tabel_penilaian?.find(p => p.id_rekap_penilaian === rekap.id);
              const total = hitungTotal(penilaian);
              const kelas = total === 0 ? "-" : tentukanKelas(total);

              return (
                <tr key={pohon.id} className="hover:bg-gray-50 group">
                  <td className="sticky left-0 px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-white z-10">
                    {index + 1}
                  </td>
                  <td className="sticky left-[50px] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-white z-10 group-hover:bg-gray-50">
                    {pohon.nama_pohon}
                  </td>
                  {Object.keys(labelMap).map((field) => (
                    <td 
                      key={field} 
                      className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      {penilaian?.[field] ?? "-"}
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-center text-gray-900">
                    {total}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      kelas === 'A' ? 'bg-green-100 text-green-800' :
                      kelas === 'B' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {kelas}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td 
                colSpan={Object.keys(labelMap).length + 2} 
                className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase"
              >
                Rata-rata Skor:
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                {calculateAverage()}
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tentukanKelas(Number(calculateAverage())) === 'A' ? 'bg-green-100 text-green-800' :
                  tentukanKelas(Number(calculateAverage())) === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tentukanKelas(Number(calculateAverage()))}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}