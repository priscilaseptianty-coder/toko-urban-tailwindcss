# Prompt & Panduan Migrasi: Toko Urban ke Tailwind CSS v4

Gunakan prompt di bawah ini untuk AI Agent Anda agar melakukan konversi dari HTML/CSS kustom ke Tailwind CSS v4 secara otomatis, aman, dan presisi.

---

```markdown
Anda adalah Senior Frontend Engineer dan spesialis Tailwind CSS v4. Tugas Anda adalah mengonversi seluruh kode HTML & CSS pada repositori "Toko Urban" menjadi **Tailwind CSS v4** dengan mempertahankan 100% fungsionalitas, tampilan visual estetik (Pastel Pink & Clean White), serta interaktivitas JavaScript yang ada.

## 1. Konteks Repositori & File Proyek
Proyek ini adalah website e-commerce modern retail "Toko Urban" tanpa framework JavaScript eksternal (vanilla JS).
File-file utama yang terlibat:
- `index.html`: Landing page utama (Announcement bar, Sticky header, Split Hero, Keunggulan, Katalog Produk, Tab Ulasan/Testimoni, FAQ accordion, Footer, dan Cart drawer modal).
- `detail-produk.html`: Halaman detail sepatu kasual (galeri, pemilih ukuran 39-42, tombol add-to-cart, spesifikasi).
- `detail-tas.html`: Halaman detail tas ransel (galeri, pemilih varian kapasitas 18L-26L, spesifikasi laptop kompartemen).
- `style.css`: File stylesheet asli (~2000 baris) yang akan digantikan/disederhanakan menggunakan Tailwind v4.
- `script.js`: State management keranjang belanja (LocalStorage), slide-in drawer cart, auto-generator format pesan WhatsApp checkout, tab switcher, size selector, dan hamburger menu.
- `images/`: Folder aset gambar produk lokal.

---

## 2. Aturan & Konfigurasi Tailwind CSS v4 (CSS-First)
Tailwind CSS v4 tidak lagi menggunakan file `tailwind.config.js`. Konfigurasi dilakukan langsung di file CSS utama menggunakan `@theme`:

1. Buat file input CSS (misal `src/input.css` atau perbarui `style.css`) dengan struktur berikut:
```css
@import "tailwindcss";

@theme {
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Palet Warna Toko Urban */
  --color-brand-primary: #d85d85;
  --color-brand-primary-hover: #be4b73;
  --color-brand-primary-light: #fce7f3;
  --color-brand-primary-border: #fbcfe8;
  --color-brand-primary-subtle: #fdf2f8;

  --color-brand-text-main: #381423;
  --color-brand-text-secondary: #6b535d;
  --color-brand-text-muted: #8c6b79;

  --color-brand-bg-body: #fff5f7;
  --color-brand-bg-card: #ffffff;
  --color-brand-bg-dark: #381423;

  --color-brand-success: #10b981;
  --color-brand-warning: #f59e0b;

  /* Radius & Shadows */
  --radius-custom-sm: 8px;
  --radius-custom-md: 12px;
  --radius-custom-lg: 16px;

  --shadow-subtle: 0 2px 6px rgba(56, 20, 35, 0.04);
  --shadow-card: 0 10px 25px -5px rgba(216, 93, 133, 0.1), 0 8px 10px -6px rgba(56, 20, 35, 0.04);
  --shadow-hover: 0 20px 30px -10px rgba(216, 93, 133, 0.2);
}

/* Utilitas kustom untuk animasi drawer jika diperlukan */
@utility cart-drawer-open {
  transform: translateX(0);
}
```

2. Hubungkan Tailwind v4 ke file HTML:
   - Opsi Produksi (CLI): `<link rel="stylesheet" href="dist/output.css">`
   - Opsi Preview / Development: `<script src="https://unpkg.com/@tailwindcss/browser@4"></script>` disertai tag style `@theme`.

---

## 3. Peringatan Kritis: Jangan Rusak Interaktivitas JavaScript (`script.js`)!
Perhatikan elemen dan class yang digunakan oleh `script.js`:
1. **Cart Drawer**:
   - Selector ID: `#cartOverlay`, `#cartTriggerBtn`, `#cartCloseBtn`.
   - Toggle class: Saat terbuka, JS menambahkan `.open` ke `#cartOverlay`.
   - Pastikan drawer bergeser masuk mulus (slide-in) saat class `.open` aktif.
2. **Template String Keranjang Dinamis (`updateCartUI()`)**:
   - Di `script.js`, elemen item keranjang di-generate dengan class `.cart-item`, `.cart-item-img`, `.qty-control`, `.qty-btn`, `.remove-item-btn`.
   - Perbarui template string HTML di `script.js` agar menyertakan class Tailwind atau pertahankan class hook tersebut.
3. **Tab Ulasan & Pemilih Ukuran**:
   - Menggunakan event listener yang memeriksa class `.active` (misal `.tab-btn.active`, `.tab-panel.active`, `.size-btn.active`).
   - Jangan hilangkan penanda class `.active` saat mengubah class styling.
4. **Mobile Navigation**:
   - Menggunakan `#menuToggle` dan `#navbarMenu`. JS melakukan toggle class `.open` dan `.active`.

---

## 4. Langkah Pelaksanaan Refactoring
Lakukan pekerjaan secara berurutan:
1. **Langkah 1: Setup File CSS Tailwind v4**
   Siapkan file CSS baru dengan direktif `@import "tailwindcss";` dan blok `@theme`.
2. **Langkah 2: Konversi `index.html`**
   - Ganti class CSS kustom menjadi utility classes Tailwind v4 (Flexbox, Grid, Typography, Colors, Spacing, Transitions).
   - Pastikan inline SVG menggunakan utilitas seperti `w-5 h-5 shrink-0 stroke-current`.
3. **Langkah 3: Konversi `detail-produk.html` & `detail-tas.html`**
   - Terapkan utilitas Tailwind v4 pada layout 2 kolom (gambar produk & detail pembelian).
   - Rapikan styling tombol ukuran, rincian garansi, spesifikasi teknis, dan feedback pembelian.
4. **Langkah 4: Sinkronisasi `script.js`**
   - Sesuaikan HTML string yang dihasilkan secara dinamis agar serasi dengan desain baru.
5. **Langkah 5: Verifikasi Akhir (Self-Check)**
   - Periksa bahwa cart drawer bisa dibuka/ditutup (klik tombol, klik luar overlay, atau tombol ESC).
   - Pastikan kuantitas belanja (`+`, `-`) dan tombol hapus berfungsi normal.
   - Pastikan tombol WhatsApp Checkout menghasilkan query URL yang valid beserta rincian pesanan.
   - Uji tab ulasan dan pemilihan ukuran produk.
   - Uji tampilan pada breakpoint mobile (`sm`), tablet (`md`), dan desktop (`lg`).
```

---

## 5. Cara Menjalankan Build Tailwind CSS v4 Secara Mandiri

Jika ingin menjalankan Tailwind v4 via Terminal/CLI:

```bash
# 1. Inisialisasi package.json (jika belum ada)
npm init -y

# 2. Install Tailwind CSS v4 CLI
npm install -D @tailwindcss/cli

# 3. Jalankan build dengan fitur watch
npx @tailwindcss/cli -i style.css -o dist/output.css --watch
```

