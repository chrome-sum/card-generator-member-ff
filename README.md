# Card Generator Member FF

Generator kartu member frozen food berbasis vanilla JavaScript dengan workflow modern menggunakan `Vite`. Proyek ini mendukung preview kartu, export PNG single, dan generate ZIP bulk dari data yang dipaste langsung dari Excel atau Google Sheets.

## Fitur Utama

- Preview kartu member real-time
- Export single card ke PNG
- Bulk generate ZIP dari paste spreadsheet
- Opsi QR code terpisah untuk mode single dan bulk
- Auto-detect header spreadsheet seperti `Nama`, `WhatsApp`, `WA`, `No HP`, dan `Alamat`
- Preview hasil parse bulk sebelum export
- Validasi baris invalid dengan alasan yang jelas
- Unit test untuk parser bulk dan formatter nomor

## Stack

- `Vite` untuk dev server dan production build
- `Tailwind CSS v4` via plugin Vite
- `html-to-image` untuk export PNG
- `jszip` dan `file-saver` untuk bulk ZIP
- `qrcode` untuk render QR WhatsApp
- `Vitest` untuk unit test
- `ESLint` dan `Prettier` untuk kualitas kode

## Struktur Direktori

```text
.
|-- public/
|   `-- logo-abc.png
|-- src/
|   |-- card/
|   |-- ui/
|   |-- utils/
|   |-- app.js
|   |-- config.js
|   |-- main.js
|   `-- styles.css
|-- index.html
|-- eslint.config.js
|-- vite.config.js
`-- package.json
```

## Menjalankan Proyek

```bash
npm install
npm run dev
```

## Script

- `npm run dev` menjalankan development server
- `npm run build` membuat build production
- `npm run preview` melihat hasil build
- `npm run lint` menjalankan ESLint
- `npm run test` menjalankan unit test dengan Vitest
- `npm run test:watch` menjalankan test mode watch
- `npm run format` merapikan file dengan Prettier

## Alur Bulk Paste

Mode bulk sekarang tidak lagi memakai format teks berbasis koma. User cukup copy tabel dari Excel atau Google Sheets lalu paste ke `textarea`.

Urutan kolom yang dipakai:

```text
Nama | WhatsApp | Alamat
```

Contoh hasil paste:

```text
Nama	WhatsApp	Alamat
Hasbi	628123456789	Ciamis
Sinta		Tasikmalaya
```

Aturan parsing:

- Header pada baris pertama akan diabaikan jika dikenali
- `Nama` dan `Alamat` wajib diisi
- `WhatsApp` boleh kosong
- Baris kosong di tengah input akan diabaikan
- Tombol bulk hanya aktif jika ada minimal satu baris valid

## Perilaku QR Code

- Single mode memiliki toggle `Gunakan QR Code`
- Bulk mode memiliki toggle global `Sertakan QR Code di semua kartu`
- Default QR untuk single dan bulk adalah `off`
- Jika QR dimatikan, blok QR tidak ditampilkan
- Jika QR diaktifkan tetapi nomor WhatsApp kosong, blok QR tetap disembunyikan

## Validasi Bulk

Sebelum ZIP dibuat, panel bulk akan menampilkan:

- jumlah baris terbaca
- jumlah data valid
- jumlah data invalid
- apakah header otomatis dilewati
- preview beberapa data valid
- preview baris invalid beserta alasannya, misalnya `nama kosong` atau `alamat kosong`

## Testing

Unit test saat ini mencakup:

- parsing spreadsheet tanpa header
- parsing spreadsheet dengan header yang dikenali
- alias header seperti `WA` dan `No HP`
- baris valid dengan WhatsApp kosong
- validasi nama/alamat kosong
- normalisasi nomor WhatsApp
- formatting nomor untuk tampilan kartu

Jalankan semua test dengan:

```bash
npm run test
```

## Catatan

- Sumber input bulk saat ini adalah paste langsung dari spreadsheet, bukan upload file `.csv` atau `.xlsx`
- Desain visual kartu dipertahankan; perubahan berfokus pada struktur proyek, UX input, dan maintainability
