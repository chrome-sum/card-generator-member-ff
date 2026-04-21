# Card Generator Member FF

Generator kartu member berbasis vanilla JavaScript yang sudah dimigrasikan ke workflow modern dengan `Vite`.

## Stack

- Vite untuk dev server dan production build
- Tailwind CSS v4 via plugin Vite
- `html-to-image` untuk export PNG
- `jszip` dan `file-saver` untuk bulk ZIP
- `qrcode` untuk render QR WhatsApp

## Struktur Direktori

```text
.
├── public/
│   └── logo-abc.png
├── src/
│   ├── card/
│   ├── ui/
│   ├── utils/
│   ├── app.js
│   ├── config.js
│   ├── main.js
│   └── styles.css
├── index.html
├── eslint.config.js
├── vite.config.js
└── package.json
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
- `npm run format` merapikan file dengan Prettier

## Format Bulk

Gunakan satu baris per member:

```text
Nama, WhatsApp, Alamat
```

Contoh:

```text
HASBI, 628123456789, Ciamis
SINTA, 081234567890, Tasikmalaya
```
