export type Role = "publik" | "admin" | "mekanik" | "pemilik" | "pelanggan"

export const ROLES: { id: Role; label: string; sub: string }[] = [
  { id: "publik", label: "Publik", sub: "Beranda & Katalog Alat" },
  { id: "admin", label: "Admin", sub: "Registrasi, BPKB, Kedatangan, Kasir" },
  { id: "mekanik", label: "Mekanik", sub: "Daftar WO & Diagnosa" },
  { id: "pemilik", label: "Pemilik", sub: "Dashboard & Laporan" },
  { id: "pelanggan", label: "Pelanggan", sub: "Pantau Servis & Persetujuan" },
]

export type PageId =
  | "beranda"
  | "katalog"
  | "antrean"
  | "registrasi"
  | "wo"
  | "wo-detail"
  | "stok"
  | "pembayaran"
  | "dashboard"
  | "kendaraan-saya"
  | "progres"

export const NAV: Record<Role, { id: PageId; label: string }[]> = {
  publik: [
    { id: "beranda", label: "Beranda" },
    { id: "katalog", label: "Katalog Alat" },
  ],
  admin: [
    { id: "antrean", label: "Antrean Kedatangan" },
    { id: "registrasi", label: "Registrasi & BPKB" },
    { id: "wo", label: "Daftar Work Order" },
    { id: "stok", label: "Stok & Peralatan" },
    { id: "pembayaran", label: "Pembayaran" },
  ],
  mekanik: [
    { id: "wo", label: "Daftar Work Order" },
    { id: "wo-detail", label: "Diagnosa & Servis" },
    { id: "katalog", label: "Katalog Alat" },
  ],
  pemilik: [
    { id: "dashboard", label: "Dashboard & Laporan" },
    { id: "stok", label: "Stok & Peralatan" },
    { id: "pembayaran", label: "Pembayaran" },
  ],
  pelanggan: [
    { id: "kendaraan-saya", label: "Kendaraan Saya" },
    { id: "progres", label: "Progres Servis" },
  ],
}

export const rupiah = (n: number) =>
  "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 })

/* ---------- Status kedatangan / WO ---------- */
export const STATUS_FLOW = [
  "Menunggu",
  "Diagnosa",
  "Dikerjakan",
  "Selesai",
  "Diambil",
] as const
export type Status = (typeof STATUS_FLOW)[number]

/* ---------- Antrean ---------- */
export type Antrean = {
  no: string
  nopol: string
  kendaraan: string
  keluhan: string
  jenis: "Servis Rutin" | "Servis Khusus"
  status: Status
}

export const ANTREAN_AWAL: Antrean[] = [
  { no: "A-001", nopol: "B 1234 XYZ", kendaraan: "Toyota Avanza 2018", keluhan: "Rem bunyi decit, pedal terasa dalam", jenis: "Servis Khusus", status: "Dikerjakan" },
  { no: "A-002", nopol: "DK 5678 AB", kendaraan: "Honda Vario 125 2020", keluhan: "Servis rutin 10.000 km", jenis: "Servis Rutin", status: "Selesai" },
  { no: "A-003", nopol: "D 4421 KL", kendaraan: "Daihatsu Xenia 2016", keluhan: "AC kurang dingin", jenis: "Servis Khusus", status: "Diagnosa" },
  { no: "A-004", nopol: "B 3310 TT", kendaraan: "Yamaha NMAX 2021", keluhan: "Ganti oli & cek CVT", jenis: "Servis Rutin", status: "Menunggu" },
  { no: "A-005", nopol: "F 9021 RR", kendaraan: "Suzuki Ertiga 2019", keluhan: "Servis berkala 40.000 km", jenis: "Servis Rutin", status: "Menunggu" },
  { no: "A-006", nopol: "AB 112 CD", kendaraan: "Honda Beat 2019", keluhan: "Sudah selesai, menunggu diambil", jenis: "Servis Rutin", status: "Diambil" },
]

/* ---------- Work Order ---------- */
export type Approval = "none" | "menunggu" | "disetujui" | "ditolak"
export type WO = {
  id: string
  nopol: string
  kendaraan: string
  pelanggan: string
  jenis: "Servis Rutin" | "Servis Khusus"
  mekanik: string
  status: Status
  keluhan: string
  biayaJasa: number
  parts: { sparepartId: string; qty: number }[]
  approval: Approval
  temuan: string[]
  estimasi: { item: string; biaya: number }[]
  durasi: string
}

export const WO_AWAL: WO[] = [
  {
    id: "WO-0042",
    nopol: "B 1234 XYZ",
    kendaraan: "Toyota Avanza 2018",
    pelanggan: "Budi Santoso",
    jenis: "Servis Khusus",
    mekanik: "Agus",
    status: "Diagnosa",
    keluhan: "Rem bunyi decit, pedal terasa dalam",
    biayaJasa: 250000,
    parts: [{ sparepartId: "SP-102", qty: 1 }],
    approval: "menunggu",
    temuan: [
      "Kampas rem depan aus tinggal 1 mm",
      "Cakram rem depan bergelombang ringan",
      "Minyak rem kotor, perlu penggantian",
    ],
    estimasi: [
      { item: "Kampas rem depan (set)", biaya: 450000 },
      { item: "Bubut cakram rem depan", biaya: 150000 },
      { item: "Minyak rem + jasa kuras", biaya: 120000 },
    ],
    durasi: "1 hari kerja",
  },
  {
    id: "WO-0041",
    nopol: "DK 5678 AB",
    kendaraan: "Honda Vario 125 2020",
    pelanggan: "Budi Santoso",
    jenis: "Servis Rutin",
    mekanik: "Rian",
    status: "Selesai",
    keluhan: "Servis rutin 10.000 km",
    biayaJasa: 60000,
    parts: [
      { sparepartId: "SP-001", qty: 1 },
      { sparepartId: "SP-003", qty: 1 },
    ],
    approval: "none",
    temuan: ["Filter udara kotor, sudah diganti", "Kampas rem belakang masih 60%"],
    estimasi: [],
    durasi: "3 jam",
  },
  {
    id: "WO-0043",
    nopol: "D 4421 KL",
    kendaraan: "Daihatsu Xenia 2016",
    pelanggan: "Siti Aminah",
    jenis: "Servis Khusus",
    mekanik: "Agus",
    status: "Diagnosa",
    keluhan: "AC kurang dingin",
    biayaJasa: 0,
    parts: [],
    approval: "none",
    temuan: [],
    estimasi: [],
    durasi: "",
  },
  {
    id: "WO-0044",
    nopol: "B 3310 TT",
    kendaraan: "Yamaha NMAX 2021",
    pelanggan: "Rudi Hartono",
    jenis: "Servis Rutin",
    mekanik: "Rian",
    status: "Menunggu",
    keluhan: "Ganti oli & cek CVT",
    biayaJasa: 0,
    parts: [],
    approval: "none",
    temuan: [],
    estimasi: [],
    durasi: "",
  },
  {
    id: "WO-0045",
    nopol: "F 9021 RR",
    kendaraan: "Suzuki Ertiga 2019",
    pelanggan: "Dewi Lestari",
    jenis: "Servis Rutin",
    mekanik: "Agus",
    status: "Menunggu",
    keluhan: "Servis berkala 40.000 km",
    biayaJasa: 0,
    parts: [],
    approval: "none",
    temuan: [],
    estimasi: [],
    durasi: "",
  },
]

/* ---------- Sparepart ---------- */
export type Sparepart = {
  id: string
  nama: string
  kendaraan: "Motor" | "Mobil"
  stok: number
  min: number
  satuan: string
  harga: number
}

export const SPAREPART_AWAL: Sparepart[] = [
  { id: "SP-001", nama: "Oli Mesin Motor 0.8L", kendaraan: "Motor", stok: 24, min: 10, satuan: "botol", harga: 55000 },
  { id: "SP-002", nama: "Kampas Rem Depan Motor", kendaraan: "Motor", stok: 4, min: 8, satuan: "set", harga: 45000 },
  { id: "SP-003", nama: "Filter Udara Motor", kendaraan: "Motor", stok: 12, min: 5, satuan: "pcs", harga: 35000 },
  { id: "SP-004", nama: "Busi Motor Iridium", kendaraan: "Motor", stok: 3, min: 6, satuan: "pcs", harga: 85000 },
  { id: "SP-101", nama: "Oli Mesin Mobil 4L", kendaraan: "Mobil", stok: 15, min: 6, satuan: "galon", harga: 320000 },
  { id: "SP-102", nama: "Kampas Rem Depan Mobil", kendaraan: "Mobil", stok: 6, min: 4, satuan: "set", harga: 450000 },
  { id: "SP-103", nama: "Filter Oli Mobil", kendaraan: "Mobil", stok: 2, min: 8, satuan: "pcs", harga: 65000 },
  { id: "SP-104", nama: "Aki Mobil 45Ah", kendaraan: "Mobil", stok: 5, min: 3, satuan: "unit", harga: 850000 },
  { id: "SP-105", nama: "Minyak Rem DOT 3", kendaraan: "Mobil", stok: 18, min: 6, satuan: "botol", harga: 40000 },
]

/* ---------- Alat bengkel ---------- */
export type Kondisi = "Baik" | "Perlu Servis" | "Rusak"
export type Alat = {
  id: string
  nama: string
  kategori: "Alat Tangan" | "Alat Angkat" | "Diagnostik" | "Pneumatik" | "Roda & Ban"
  kondisi: Kondisi
  fungsi: string
  langkah: string[]
  lokasi: string
  jumlah: number
}

export const ALAT: Alat[] = [
  {
    id: "AL-01",
    nama: "Kunci Pas Set",
    kategori: "Alat Tangan",
    kondisi: "Baik",
    fungsi: "Mengencangkan dan melepas baut/mur berbagai ukuran pada motor dan mobil.",
    langkah: [
      "Pilih ukuran kunci yang pas dengan kepala baut.",
      "Pasang kunci sampai rapat, jangan miring.",
      "Tarik searah (bukan didorong) agar tangan aman.",
      "Kembalikan ke rak sesuai urutan ukuran.",
    ],
    lokasi: "Rak A1",
    jumlah: 6,
  },
  {
    id: "AL-02",
    nama: "Dongkrak Hidrolik 2 Ton",
    kategori: "Alat Angkat",
    kondisi: "Baik",
    fungsi: "Mengangkat bagian bawah mobil untuk pengecekan ban, rem, dan kolong.",
    langkah: [
      "Parkir di lantai rata, tarik rem tangan, ganjal ban lain.",
      "Letakkan dongkrak di titik angkat sesuai buku manual.",
      "Pompa perlahan sampai roda terangkat.",
      "Pasang jack stand sebelum bekerja di bawah mobil.",
      "Turunkan dengan membuka katup pelan-pelan.",
    ],
    lokasi: "Area Mobil 1",
    jumlah: 3,
  },
  {
    id: "AL-03",
    nama: "Scanner OBD-II",
    kategori: "Diagnostik",
    kondisi: "Baik",
    fungsi: "Membaca kode kerusakan (DTC) dan data sensor dari ECU kendaraan.",
    langkah: [
      "Matikan mesin, cari port OBD di bawah dashboard.",
      "Colokkan konektor scanner, nyalakan kontak (ON).",
      "Pilih menu Baca Kode dan catat kode yang muncul.",
      "Cocokkan dengan tabel kode, lalu hapus kode setelah perbaikan.",
    ],
    lokasi: "Lemari Diagnostik",
    jumlah: 2,
  },
  {
    id: "AL-04",
    nama: "Kompresor Udara 50L",
    kategori: "Pneumatik",
    kondisi: "Perlu Servis",
    fungsi: "Menyuplai udara bertekanan untuk pompa ban, air gun, dan kunci impact.",
    langkah: [
      "Cek oli kompresor dan buang air dari tangki.",
      "Sambungkan selang, nyalakan, tunggu tekanan penuh.",
      "Atur regulator sesuai kebutuhan alat.",
      "Setelah selesai, matikan dan buang sisa tekanan.",
    ],
    lokasi: "Sudut Belakang",
    jumlah: 1,
  },
  {
    id: "AL-05",
    nama: "Alat Balancing Roda",
    kategori: "Roda & Ban",
    kondisi: "Baik",
    fungsi: "Menyeimbangkan roda agar kendaraan tidak bergetar di kecepatan tinggi.",
    langkah: [
      "Lepas roda, bersihkan kotoran dan timah lama.",
      "Pasang roda pada as mesin balancing, kunci rapat.",
      "Masukkan ukuran velg, lalu putar mesin.",
      "Tempel timah pemberat di titik yang ditunjukkan layar.",
    ],
    lokasi: "Area Ban",
    jumlah: 1,
  },
  {
    id: "AL-06",
    nama: "Kunci Torsi (Torque Wrench)",
    kategori: "Alat Tangan",
    kondisi: "Baik",
    fungsi: "Mengencangkan baut dengan torsi tepat sesuai spesifikasi pabrikan.",
    langkah: [
      "Cari nilai torsi pada buku manual.",
      "Atur skala kunci torsi ke nilai tersebut.",
      "Kencangkan sampai terdengar bunyi klik, lalu berhenti.",
      "Kembalikan skala ke nilai terendah saat disimpan.",
    ],
    lokasi: "Rak A2",
    jumlah: 2,
  },
  {
    id: "AL-07",
    nama: "Multimeter Digital",
    kategori: "Diagnostik",
    kondisi: "Rusak",
    fungsi: "Mengukur tegangan, arus, dan hambatan pada sistem kelistrikan.",
    langkah: [
      "Pilih mode ukur (V, A, atau Ω) sesuai kebutuhan.",
      "Hubungkan probe merah ke positif, hitam ke negatif.",
      "Baca nilai di layar dan bandingkan dengan standar.",
    ],
    lokasi: "Lemari Diagnostik",
    jumlah: 1,
  },
  {
    id: "AL-08",
    nama: "Kunci Impact Pneumatik",
    kategori: "Pneumatik",
    kondisi: "Baik",
    fungsi: "Melepas baut roda dan baut keras dengan cepat menggunakan tenaga udara.",
    langkah: [
      "Sambungkan ke kompresor, atur tekanan 90 psi.",
      "Pasang socket impact yang sesuai.",
      "Tekan pelatuk, lepas baut secara bertahap.",
      "Gunakan kunci torsi untuk pengencangan akhir.",
    ],
    lokasi: "Rak B1",
    jumlah: 2,
  },
]

export const KATEGORI_ALAT = [
  "Semua",
  "Alat Tangan",
  "Alat Angkat",
  "Diagnostik",
  "Pneumatik",
  "Roda & Ban",
] as const

export const BARANG_HABIS = [
  { nama: "Lap Majun", stok: 40, min: 20, satuan: "pcs" },
  { nama: "Sarung Tangan Bengkel", stok: 6, min: 10, satuan: "pasang" },
  { nama: "Cairan Pembersih Rem", stok: 9, min: 6, satuan: "kaleng" },
  { nama: "Grease / Gemuk", stok: 3, min: 4, satuan: "kaleng" },
  { nama: "Cable Ties", stok: 120, min: 50, satuan: "pcs" },
]

/* ---------- Paket servis rutin ---------- */
export type Paket = {
  id: string
  kendaraan: "Motor" | "Mobil"
  nama: string
  harga: number
  intervalKm: number
  checklist: string[]
}

export const PAKET: Paket[] = [
  { id: "PM-1", kendaraan: "Motor", nama: "Servis Ringan Motor", harga: 60000, intervalKm: 2000, checklist: ["Ganti oli mesin", "Cek rem depan & belakang", "Cek rantai/CVT", "Cek tekanan ban", "Cek kelistrikan & lampu"] },
  { id: "PM-2", kendaraan: "Motor", nama: "Servis Lengkap Motor", harga: 150000, intervalKm: 6000, checklist: ["Ganti oli mesin", "Ganti filter udara", "Bersihkan karburator/injektor", "Setel klep", "Cek rem & suspensi", "Ganti busi"] },
  { id: "PC-1", kendaraan: "Mobil", nama: "Servis Berkala 10.000 km", harga: 450000, intervalKm: 10000, checklist: ["Ganti oli mesin", "Ganti filter oli", "Cek rem & minyak rem", "Cek aki & kelistrikan", "Cek tekanan & kondisi ban", "Cek AC & filter kabin"] },
  { id: "PC-2", kendaraan: "Mobil", nama: "Servis Besar 40.000 km", harga: 1250000, intervalKm: 40000, checklist: ["Ganti oli mesin & filter", "Ganti oli transmisi", "Ganti busi", "Kuras minyak rem", "Kuras radiator coolant", "Cek suspensi & kaki-kaki", "Spooring & balancing"] },
]

/* ---------- Pelanggan ---------- */
export const KENDARAAN_SAYA = [
  {
    id: "KV-1",
    nopol: "B 1234 XYZ",
    nama: "Toyota Avanza 1.3 G 2018",
    jenis: "Mobil",
    km: 78450,
    bpkbNama: "Hendra Santoso",
    bpkbNo: "R-1234567-AB",
    woId: "WO-0042",
    riwayat: [
      { tgl: "22 Nov 2026", ket: "Kedatangan — Keluhan rem bunyi (WO-0042)" },
      { tgl: "10 Mei 2026", ket: "Servis Berkala 70.000 km" },
      { tgl: "02 Des 2025", ket: "Ganti aki" },
    ],
  },
  {
    id: "KV-2",
    nopol: "DK 5678 AB",
    nama: "Honda Vario 125 2020",
    jenis: "Motor",
    km: 12300,
    bpkbNama: "Budi Santoso",
    bpkbNo: "M-7654321-CD",
    woId: "WO-0041",
    riwayat: [
      { tgl: "20 Nov 2026", ket: "Servis Rutin 10.000 km (WO-0041)" },
      { tgl: "15 Mar 2026", ket: "Servis Ringan" },
    ],
  },
]

/* ---------- Laporan ---------- */
export const PENDAPATAN_BULANAN = [
  { bulan: "Jun", nilai: 38 },
  { bulan: "Jul", nilai: 42 },
  { bulan: "Agu", nilai: 35 },
  { bulan: "Sep", nilai: 47 },
  { bulan: "Okt", nilai: 51 },
  { bulan: "Nov", nilai: 56 },
]

export const LAPORAN_SERVIS = [
  { tgl: "22 Nov", wo: "WO-0042", nopol: "B 1234 XYZ", jenis: "Servis Khusus", mekanik: "Agus", status: "Diagnosa" },
  { tgl: "20 Nov", wo: "WO-0041", nopol: "DK 5678 AB", jenis: "Servis Rutin", mekanik: "Rian", status: "Selesai" },
  { tgl: "20 Nov", wo: "WO-0040", nopol: "AB 112 CD", jenis: "Servis Rutin", mekanik: "Rian", status: "Diambil" },
  { tgl: "19 Nov", wo: "WO-0039", nopol: "L 8877 QW", jenis: "Servis Khusus", mekanik: "Agus", status: "Diambil" },
  { tgl: "18 Nov", wo: "WO-0038", nopol: "N 2010 PL", jenis: "Servis Rutin", mekanik: "Agus", status: "Diambil" },
]

export const LAPORAN_PENDAPATAN = [
  { tgl: "22 Nov", jasa: 1250000, sparepart: 2400000, metode: "Tunai" },
  { tgl: "21 Nov", jasa: 980000, sparepart: 1850000, metode: "QRIS" },
  { tgl: "20 Nov", jasa: 1520000, sparepart: 3100000, metode: "Transfer" },
  { tgl: "19 Nov", jasa: 760000, sparepart: 1240000, metode: "QRIS" },
  { tgl: "18 Nov", jasa: 1100000, sparepart: 2050000, metode: "Tunai" },
]
