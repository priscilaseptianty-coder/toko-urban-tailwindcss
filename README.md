# Kila Wonderland — Modern E-Commerce Website (Tailwind CSS v4)

Website e-commerce katalog produk modern untuk **Kila Wonderland** — *"Teman nyaman untuk langkah sehari-hari."* Dirancang dengan estetika D2C (*Direct-to-Consumer*) masa kini bernuansa **Pink Muda Pastel & Putih**, dibangun menggunakan **HTML5 Semantik**, **Tailwind CSS v4 (CSS-First `@theme`)**, serta **Vanilla JavaScript** tanpa ketergantungan framework berat.

---

## 🌟 Fitur Unggulan Website

1. **Framework Modern: Tailwind CSS v4**:
   - Dikonfigurasi menggunakan standar **Tailwind CSS v4 CSS-First** dengan direktif `@theme` di [`style.css`](style.css) tanpa memerlukan file `tailwind.config.js`.
   - Menggunakan utilitas kelas modern untuk Flexbox, CSS Grid, transisi, dan warna dinamis.
   - Menggunakan file terkompilasi [`dist/output.css`](dist/output.css) untuk performa instan dan dukungan offline 100%.

2. **Tipografi Modern (*Plus Jakarta Sans*) & 100% Ikon Vektor SVG**:
   - Menggunakan Google Font kurasi *Plus Jakarta Sans* untuk tampilan tipografi yang bersih, elegan, dan profesional.
   - Seluruh simbol visual (bintang rating, lencana produk, tab ulasan, metode pembayaran, ekspedisi, keranjang belanja, dan keamanan footer) menggunakan **ikon vektor SVG inline murni**, bebas dari emoji sistem sehingga konsisten dan tajam di semua resolusi layar.

3. **Top Announcement Bar**:
   - Baris pengumuman promosi di atas navbar dengan kode voucher: `Flash Sale: Diskon s/d 25% + Bebas Ongkir se-Indonesia! Kode: KILAPINK`.

4. **Header Sticky & Keranjang Belanja Cepat**:
   - Logo Kila Wonderland dengan aksen kilau (*sparkle*).
   - Tombol pemicu **Keranjang Belanja (`🛒`)** lengkap dengan *badge counter* jumlah barang otomatis.
   - Menu hamburger interaktif untuk navigasi di layar ponsel.

5. **Split Hero Banner yang Hidup**:
   - **Kolom Kiri:** Badge koleksi 2026, Headline persuasif dengan efek gradien, tombol *Call-to-Action* (CTA) ganda (*Lihat Koleksi Pilihan* & *Tanya via WhatsApp*), serta *social proof pill* ("4.9 / 5.0 dari 1.500+ pelanggan").
   - **Kolom Kanan:** Kartu visual produk studio dengan badge *Hot Item* & stiker jaminan material original.

6. **Katalog Produk Standar Retail E-Commerce**:
   - Foto studio komersial beresolusi tinggi bernuansa pink pastel lembut.
   - **Badge Diskon & Status:** `-25% OFF`, `Best Seller`, `-22% OFF`, `New Arrival`.
   - **Harga Promo & Coret:**
     - Sepatu Kila: `~Rp399.000~` **Rp299.000** *(Hemat Rp100.000)*
     - Tas Ransel Kila: `~Rp449.000~` **Rp349.000** *(Hemat Rp100.000)*
   - Tombol ganda: **+ Keranjang** (menambah barang langsung) dan **Lihat Detail** (menuju halaman spesifikasi).

7. **Slide-In Cart Drawer & Checkout WhatsApp Otomatis**:
   - Keranjang belanja meluncur mulus dari sisi kanan layar (*slide-in drawer*).
   - Kontrol kuantitas produk instan (`−`, jumlah, `+`) dan tombol hapus produk.
   - Penghitungan subtotal dan total harga secara dinamis.
   - Form data pengiriman lengkap (Nama, WhatsApp, Alamat, Ekspedisi, Pembayaran) yang otomatis menghasilkan pesan pemesanan rapi ke WhatsApp CS.

8. **Ulasan Pembeli Berbasis Tab Interaktif**:
   - Beralih dengan mudah antara ulasan **Sepatu Kila (148 Ulasan)** dan **Tas Ransel Kila (96 Ulasan)** tanpa me-reload halaman.
   - Kartu ulasan lengkap dengan avatar inisial, rating bintang emas, lencana *"Pembeli Terverifikasi"*, varian barang, dan waktu ulasan.

9. **Trust Signals (Metode Pembayaran & Logistik)**:
   - Deretan lencana resmi: **BCA, Mandiri, BRI, QRIS, GoPay, OVO, ShopeePay, Bayar di Tempat (COD)**.
   - Mitra ekspedisi terpercaya: **J&T Express, SiCepat, JNE, GoSend**.

10. **Halaman Detail Produk Lengkap**:
    - [detail-produk.html](detail-produk.html): Pilihan ukuran sepatu (39–42), spesifikasi insole & sol karet, serta integrasi keranjang.
    - [detail-tas.html](detail-tas.html): Pilihan kapasitas (18L, 22L, 26L), spesifikasi kompartemen laptop 15.6", dan tombol checkout.

11. **FAQ Accordion & Kontak Terintegrasi**:
    - Tanya jawab interaktif seputar ukuran, pengiriman bebas ongkir, dan garansi retur 7 hari.
    - 4 kartu kontak: Alamat Toko, WhatsApp CS langsung, Email, dan Jam Operasional.

---

## 📁 Struktur Berkas Proyek

```text
kila-wonderland-tailwindcss/
├── index.html                     # Halaman katalog utama Kila Wonderland
├── detail-produk.html             # Halaman detail produk Sepatu Kila Wonderland Pink Pastel
├── detail-tas.html                # Halaman detail produk Tas Ransel Kila Wonderland Pink Pastel
├── style.css                      # Konfigurasi Tailwind CSS v4 (@import "tailwindcss" & @theme)
├── script.js                      # Logika interaktif Vanilla JS (Cart State, WhatsApp Checkout, Drawer, Tabs)
├── package.json                   # Script build Tailwind CLI (dev & build)
├── vercel.json                    # Konfigurasi deployment hosting Vercel
├── dist/
│   └── output.css                 # File stylesheet produksi Tailwind CSS v4
├── images/
│   ├── sepatu-urban.jpg           # Foto produk studio komersial Sepatu Kila
│   └── tas-ransel.jpg             # Foto produk studio komersial Tas Ransel Kila
└── README.md                      # Dokumentasi lengkap proyek
```

---

## 🎨 Palet Warna & Desain Token (`@theme` Tailwind v4)

| Token Tailwind v4 | Hex Code | Peran / Penggunaan |
| :--- | :--- | :--- |
| `--color-brand-primary` | `#d85d85` | Aksen utama, logo, tombol CTA, badge diskon, harga aktif |
| `--color-brand-primary-hover` | `#be4b73` | State hover tombol primer |
| `--color-brand-primary-light` | `#fce7f3` | Latar pill, tombol aktif, selection |
| `--color-brand-primary-border` | `#fbcfe8` | Border kartu produk, tab, dan navbar |
| `--color-brand-primary-subtle` | `#fdf2f8` | Latar halus elemen interaktif |
| `--color-brand-text-main` | `#381423` | Judul teks utama, announcement bar, drawer header |
| `--color-brand-text-secondary` | `#6b535d` | Warna teks paragraf deskripsi dan teks sekunder |
| `--color-brand-text-muted` | `#8c6b79` | Warna teks subtitel dan harga coret |
| `--color-brand-bg-body` | `#fff5f7` | Latar belakang keseluruhan halaman (*body*) |
| `--color-brand-bg-card` | `#ffffff` | Latar kartu produk, cart drawer, modal |
| `--color-brand-bg-dark` | `#381423` | Latar belakang footer |

---

## 🚀 Cara Menjalankan Website

### Opsi 1: Pratinjau Langsung di Browser (Zero Build)
Cukup buka file `index.html` dengan cara klik dua kali (*double click*) di Finder / File Explorer untuk membukanya langsung di browser (Chrome, Safari, Firefox, Edge).

### Opsi 2: Menggunakan Tailwind CLI
Jika Anda ingin mengompilasi CSS secara mandiri:
```bash
# Mode development (watch mode)
npm run dev

# Mode produksi (minified)
npm run build
```
