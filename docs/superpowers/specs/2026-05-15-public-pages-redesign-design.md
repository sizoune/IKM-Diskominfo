# Public Pages UI/UX Redesign — Design Spec

**Date:** 2026-05-15
**Status:** Draft — awaiting user approval
**Scope:** Public-facing pages (landing, hasil IKM, survey wizard) for IKM Diskominfo Tabalong

---

## 1. Background & Goals

Halaman public IKM Diskominfo Tabalong saat ini menggunakan palette indigo/violet/purple gradient dengan vibe generic SaaS. Tidak ada nuansa identitas Pemerintah Daerah / Kominfo, dan visual hierarchy terasa kurang otoritatif untuk konteks layanan publik resmi.

**Goal:** Redesign halaman public dengan:

- Identitas visual yang **selaras dengan logo Kominfo** (lama: globe ombak biru navy; baru: blok pixel biru/merah/kuning)
- Karakter **pemerintahan resmi** yang otoritatif tapi tetap accessible
- Sistem desain **konsisten lintas halaman** (landing, hasil, survey)
- Mengangkat **data IKM real-time** sebagai social proof, bukan sekadar dekoratif

**Non-goals (tidak in-scope di spec ini):**

- Halaman admin (`/admin/*`)
- Halaman login (`/login`)
- Backend / server function changes
- Database schema changes
- Performa / infrastruktur

---

## 2. Design Direction: D2 White Civic

Dipilih dari 4 arah desain (Editorial / Bento / Civic / Local Identity). Pilihan jatuh ke **Local Identity (D)** dengan light-dominant variant (D2) — palette diselaraskan dengan logo Kominfo.

**Karakter:**

- **Background dominan putih** → accessible, gampang dibaca semua umur
- **Navy `#0a1f44` untuk teks & elemen kuat** → otoritas pemda
- **Amber `#f59e0b` sebagai accent CTA & underline** → menonjolkan call-to-action tanpa "berisik"
- **Merah `#991b1b` sebagai aksen pemda Indonesia** (stripe atas, side-strip card)
- **Pixel blocks dekoratif** sebagai nod ke logo Kominfo baru

---

## 3. Color System

Tokens disimpan di CSS variables (`src/styles.css`). Tailwind dapat reference via theme extension.

| Token | Hex | Penggunaan |
|---|---|---|
| `--navy` | `#0a1f44` | Headline, primary button bg, nav crest, info-card bg |
| `--navy-2` | `#1e3a8a` | Gradient pair untuk info-card |
| `--blue` | `#2563eb` | Section kicker, accent text di heading, kode-pill text |
| `--sky` | `#60a5fa` | Pixel block accent, decorative |
| `--red` | `#991b1b` | Top stripe (60%), side-strip card "transparansi" |
| `--amber` | `#f59e0b` | CTA secondary, underline, badge dot, mutu B accent |
| `--amber-soft` | `#fef3c7` | Badge bg, kode-pill bg amber variant |
| `--white` | `#ffffff` | Background utama |
| `--gray-50` | `#f8fafc` | Section alt bg |
| `--gray-100` | `#f1f5f9` | Border subtle, mock placeholders |
| `--gray-200` | `#e2e8f0` | Border default |
| `--gray-500` | `#64748b` | Body text muted |
| `--gray-700` | `#334155` | Body text |
| `--green` | `#16a34a` | Success state (step 3 done) — semantik, bukan identitas |

**Catatan:** semua existing usage `indigo-*` / `violet-*` di halaman public **harus diganti** ke tokens di atas.

---

## 4. Shared Components (Updates Required)

### 4.1 `PublicNavbar` (`src/components/public-navbar.tsx`)

**Sekarang:** logo + IKM/Diskominfo text + nav links + Login button (indigo→violet gradient).

**Redesign:**

- **Tambah top stripe** 4px tinggi: `linear-gradient(90deg, red 0% 60%, amber 60% 100%)`. Render sebagai elemen pertama di **dalam** `PublicNavbar` component (sebelum sticky header), supaya otomatis ikut di semua public pages yang sudah pakai `<PublicNavbar />`.
- Navbar bg: putih `bg-white/92` dengan `backdrop-blur-md`, border-bottom `gray-100`
- **Crest icon** 30×30: bg navy, rounded-md, huruf "T" putih bold. Sebagai placeholder; jika logo SVG/PNG tersedia gunakan logo asli dengan ratio square.
- **Crest text 2 baris:** L1 "DISKOMINFO TABALONG" (font-extrabold, navy, 11px, letter-spacing .3px), L2 "Indeks Kepuasan Masyarakat" (gray-500, 9px)
- **Link aktif:** font-bold navy + underline amber 2px (positioned via `::after` atau dengan `activeProps` ke styling)
- **Login button:** bg navy, text white, pill-shaped, kecil dan tidak dominan

### 4.2 `PublicFooter` (`src/components/public-footer.tsx`)

**Sekarang:** dark gradient indigo→violet, 3-column grid (brand, links, info).

**Redesign:**

- Background `#0a1429` (slightly darker than navy, supaya kontras dengan section navy di body)
- Crest icon di footer: **bg amber**, huruf navy (kebalikan dari navbar — variasi visual)
- Section headers (kuning sky): `text-sky-300` text-uppercase letter-spacing-wide
- Footer text muted: `text-slate-400` (dari struktur sekarang OK, hanya tone-down)
- Tetap 3-column, tetap dengan copyright line bottom border-top putih opacity rendah

### 4.3 New shared elements (utility classes / small components)

Karena dipakai di banyak section, ekstrak sebagai komponen kecil di `src/components/`:

- **`SectionHeader`** — kicker (line + uppercase text + line) → h2 → subtitle. Props: `kicker`, `title`, `titleAccent` (string yang di-blue), `subtitle`
- **`PixelBlocks`** — 3×3 grid kecil sebagai dekoratif, props `size` (default 14px) & `opacity`. Pattern: pos 1 = red, pos 9 = amber, pos 4 = sky, pos 2 & 6 = transparent, sisanya = blue.
- **`StatPill`** — angka besar + label kecil dengan side-strip accent. Props: `value`, `label`, `accent` ('navy' | 'amber' | 'red').

---

## 5. Page-Level Specs

### 5.1 Landing Page (`src/routes/index.tsx`)

Struktur section dari atas ke bawah:

1. **Hero** (white bg dengan `bg-gradient-to-b from-white to-gray-50`)
   - Grid 2-kolom (1.3fr : 1fr) di desktop, stack di mobile
   - **Kiri:** badge amber-soft ("Survei Resmi 2026 · Terbuka untuk warga") → headline 44px font-black dengan **underline amber pada "pelayanan"** dan **"kami." dalam biru** → lede 15px → btn row (Mulai Survey primary navy / Lihat Hasil secondary outline) → trust strip (5 menit · Anonim · Real-time)
   - **Kanan:** `LiveDataCard` — navy bg, label "INDEKS 2025", score amber 56px (`3.42`), mutu pill amber-soft, progress bar gradient amber→sky, foot row scale + LIVE dot animation
   - **Mini stats 2 kolom** di bawah live card: Responden (1.284) + Unsur Penilaian (9)
   - **PixelBlocks** dekoratif top-right corner

2. **Stats Banner** (full-width navy bg)
   - 4 kolom: `3.42/4.00 Indeks` | `1.284 Responden` | `9 unsur Aspek Penilaian` | `B Mutu Pelayanan`
   - Setiap cell punya left-border 2px amber + label sky-300 uppercase
   - Decorative concentric circles top-right

3. **Layanan** (white section)
   - SectionHeader: kicker "Layanan Kami" → h2 "Sistem penilaian yang transparan"
   - Grid 3 kolom (mobile 1 kolom): FeatureCard dengan side-strip accent
   - 3 cards: Survey Pelayanan (navy strip), Transparansi Data (red strip), Hasil Real-time (amber strip)
   - Icon 44×44 rounded-lg dengan bg sesuai accent

4. **Tentang IKM** (gray-50 alt section)
   - Grid 2 kolom (mobile stack)
   - **Kiri:** SectionHeader → paragraph deskripsi → 3-item checklist dengan amber check icon
   - **Kanan:** info-card navy gradient dengan pixel blocks bg (rotated -12deg), badge amber, judul + sub-label + 2-cell grid (9 Unsur / 4 Kategori Mutu) di mana angka pakai warna amber

5. **Cara Mengisi Survey** (white section)
   - SectionHeader: kicker "Panduan" → h2 "Tiga langkah mudah"
   - Grid 3 kolom: card dengan giant number watermark (`01` `02` `03` di gray-100 sebagai background-y huruf), step-tag biru uppercase, h4, p
   - Tidak ada card hover gradient — flat & static

6. **CTA Banner** (gray-50 section, inner card)
   - Inner card navy dengan amber radial glow di bottom-left
   - Grid 2 kolom (2fr : 1fr): teks "Siap berkontribusi..." dengan accent amber + tombol "ISI SURVEY SEKARANG →" bg amber text-navy

7. **Footer** (PublicFooter — dark navy)

### 5.2 Hasil IKM (`src/routes/guest/ikm.tsx`)

Layout dengan max-width container (4xl), padding 32px:

1. **Header row** (flex justify-between, stack mobile)
   - Kiri: kicker "DATA TERBUKA · LIVE" + h2 "Hasil IKM {year}" dengan accent biru + subtitle
   - Kanan: Year select pill — label "TAHUN" gray-500 + value bg amber-soft text-amber-700

2. **Overall Card** (conditional saat ada data)
   - Bg navy gradient + radial glow amber & sky
   - 3-kolom grid: grade box 110×110 amber dengan huruf besar (A/B/C/D) → info (label sky uppercase, label mutu, pill rentang) → IKM Score di kanan (number amber 36px)
   - **Catatan:** warna grade box mengikuti `getMutu().color` mapping ke palette baru (lihat 5.4)

3. **Stat Row** — 3 cards side-strip:
   - "Nilai IKM" (navy strip, icon chart, progress bar navy)
   - "Mutu Pelayanan" (amber strip, icon star, progress bar amber)
   - "Total Responden" (red strip, icon users, badge "{n} unsur pelayanan dinilai")

4. **Table Card** — Detail Per Unsur
   - Header: bg navy, h4 putih + amber pill "9 ASPEK"
   - Body: table dengan header bg gray-50 (uppercase, letter-spaced)
   - Row striping: even = bg gray-50, odd = white
   - Kolom Kode: pill biru (`bg-blue-100 text-blue-700 font-mono`)
   - Kolom Mutu: mutu-badge — `A` green, `B` blue, `C` amber, `D` red

5. **Bar Chart Card** — Grafik Nilai Per Unsur
   - Setiap row: meta-line atas (kode-pill + text di kiri, score mono + percentage pill di kanan)
   - Bar track 10px gray-100, fill warna mengikuti mutu (`getMutu().color` mapping)
   - Animation fade-in stagger 100ms per item

### 5.3 Survey Wizard (`src/routes/guest/survey.index.tsx`)

Layout max-width 2xl, padding 32px:

1. **Step Indicator** — di atas card
   - 3 bubble 36×36: done = navy bg + amber check icon, active = amber bg navy text + ring shadow, pending = gray-100 bg + border gray-200
   - Connector lines 2px: done = navy, pending = gray-200
   - Label di bawah bubble: done = navy, active = amber, pending = gray-500

2. **Survey Card** (per step)
   - Card border-top-4 **amber** (bukan indigo) — accent visual untuk wizard mode
   - **Header:**
     - Row: icon box 38×38 navy bg amber text → judul (16px font-extrabold navy) + sub-label (gray-500)
     - **Progress bar** (step 2 only): meta-line "X dari Y dijawab · NN% selesai" + track 6px gray-100 dengan fill gradient `from-navy to-blue`
   - **Body:**
     - **Step 1 (Data Diri):** form-group dengan label kicker biru → input dengan border gray-200, label navy bold 11px, required asterisk merah. Inputs: Select (status), Input (NIP/Nama), 2-col grid (JK/Umur, Pendidikan/Pekerjaan), Select (Layanan).
     - **Step 2 (Survey):** question-cards (border gray-200, padding 14px):
       - Header: q-num 24×24 bg amber-soft text-amber-800 → text 12px navy bold
       - Options grid 2-col: radio + label dalam border box; **selected** = border amber + bg amber-soft + text amber-700 + radio dot amber
     - **Saran textarea:** form-group bg gray-50 dengan label kicker biru
   - **Footer (button row):**
     - Step 1: full-width "Lanjut ke Survey →" navy
     - Step 2: 2-button row → "← Kembali" outline + "Kirim Survey →" navy

3. **Step 3 (Done)** — card terpisah, NOT wizard card
   - Card border-top-4 **green** (`#16a34a` — success semantik, bukan part identitas)
   - **Banner top:** bg gradient `from-green-50 via-emerald-50 to-teal-50`, check icon 80×80 bg green, h3 "Terima Kasih!" navy (bukan gradient text), subtitle
   - **Body:** paragraph + 2-button row "Lihat Hasil IKM" outline + "Kembali ke Beranda" navy

### 5.4 `getMutu()` Color Mapping

File: `src/lib/ikm.ts` (atau wherever `getMutu` defined). Mapping color string ke palette baru:

| Old color | Old class | New role | Token |
|---|---|---|---|
| `green` (A) | emerald | Sangat Baik | `--green` `#16a34a` (success) |
| `blue` (B) | indigo | Baik | `--blue` `#2563eb` (primary) |
| `yellow` (C) | amber | Kurang Baik | `--amber` `#f59e0b` (warning) |
| `red` (D) | red | Tidak Baik | `--red` `#991b1b` (negative) |

**`getBadgeColor()`** (di `ikm.tsx`):
- `green` → `bg-green-100 text-green-800 border-green-300`
- `blue` → `bg-blue-100 text-blue-800 border-blue-300`
- `yellow` → `bg-amber-100 text-amber-800 border-amber-300` (sudah cocok)
- `red` → `bg-red-100 text-red-800 border-red-300` (sudah cocok)

**`getBarColor()`**:
- `green` → `#16a34a` (sebelumnya `#10B981`)
- `blue` → `#2563eb` (sebelumnya `#6366F1`)
- `yellow` → `#F59E0B` (tetap)
- `red` → `#991b1b` (sebelumnya `#EF4444`)

**`getOverallBgColor()`** — gradient untuk overall card. Diganti single navy gradient untuk konsistensi:
- Semua color → `from-[#0a1f44] to-[#1e3a8a]` (navy gradient)
- Visual identifier mutu dipindah ke **grade box dalam card** (amber untuk B, green untuk A, dll)

---

## 6. Typography

Sistem font tetap pakai default `system-ui` (sudah cocok untuk pemda Indonesia & accessibility tinggi).

| Element | Weight | Size | Color |
|---|---|---|---|
| Hero h1 | 900 (black) | 44px desktop / 32px mobile, line-height 1.05, letter-spacing -1px | navy |
| Section h2 | 900 | 32px / 26px mobile | navy + accent biru utk word tertentu |
| Card title (h3/h4) | 800 (extrabold) | 16-18px | navy |
| Body lede | 500 | 15px | gray-700, line-height 1.6 |
| Body | 400/500 | 13-14px | gray-700 |
| Kicker (section) | 800 | 11px uppercase, letter-spacing 2px | blue |
| Stats number | 900 | 22-30px | navy atau amber sesuai context |
| Caption / meta | 700 | 10-11px uppercase, letter-spacing .5px | gray-500 atau sky-300 dalam dark card |

**Underline accent pattern** (hero "pelayanan"): `position: relative; ::after { content:''; left:0; right:0; bottom:-2px; height:4-6px; background: amber; opacity: .55; border-radius:3px; }` — di-encapsulate sebagai utility class `accent-underline` di `styles.css`.

---

## 7. Spacing & Layout

- Sections padding: 64px vertical desktop, 40px mobile
- Cards padding: 24px desktop, 18-20px mobile
- Grid gaps: 16-20px untuk cards row, 32-40px untuk hero/about split
- Border-radius: cards 12-14px, large feature 16-18px, pills 999px, buttons 8px (sharp-ish, less SaaS)
- Container max-width: landing 1100px, ikm 4xl (896px), survey 2xl (672px)

---

## 8. Responsive Behavior

Breakpoints Tailwind default (`md: 768px`). Spec berlaku ke kedua mode:

- Hero grid → stack di mobile, headline turun 44→32px
- Stats banner grid 4→2 kolom di mobile, sembunyikan circle decoration
- Feature cards / steps row 3→1 kolom mobile
- About split 2→1 kolom, info-card di atas paragraph
- CTA banner 2→1 kolom, button full-width
- Footer 3→1 kolom

---

## 9. Animations (Tasteful, Not Distracting)

- LIVE dot di live data card: `pulse 1.6s infinite`
- Bar chart fill: `transition-all duration-1000 ease-out` dengan stagger via `animationDelay` per item (sudah ada)
- Card hover: `transition-all duration-200` — translate-y(-2px) untuk feature & step cards
- Step indicator transitions: 300ms duration saat current step berubah

**Tidak ada:** parallax, scroll-triggered animations, decorative orbs floating (yang ada di hero sekarang dihapus, ganti dengan pixel blocks static).

---

## 10. Files to Modify

| File | Action |
|---|---|
| `src/styles.css` | Tambah CSS variables palette, utility classes (`.accent-underline`, `.top-stripe`) |
| `src/components/public-navbar.tsx` | Replace gradient → navy/amber sistem, crest baru, **prepend top-stripe** di paling atas |
| `src/components/public-footer.tsx` | Update bg darker, amber crest, slate-400 muted |
| `src/components/section-header.tsx` | **NEW** — komponen kicker + h2 + subtitle |
| `src/components/pixel-blocks.tsx` | **NEW** — komponen dekoratif 3×3 grid |
| `src/components/feature-card.tsx` | **NEW (atau inline refactor di index)** — side-strip variant |
| `src/components/live-data-card.tsx` | **NEW** — navy card untuk hero landing |
| `src/routes/index.tsx` | Full rewrite konten section sesuai 5.1 |
| `src/routes/guest/ikm.tsx` | Replace gradient → navy/amber, restructure overall card & stat row |
| `src/routes/guest/survey.index.tsx` | Replace gradient → navy/amber, step indicator update, card border-top amber |
| `src/lib/ikm.ts` | Update `getMutu` palette mapping (jika perlu) |

---

## 11. Testing Notes

- **Visual regression:** screenshot baseline diambil **sebelum** redesign — bandingkan setelah implementasi
- **Accessibility:** contrast check semua pasangan (navy on white ≥ 14.5:1 ✓, amber on navy ≥ 8:1 ✓, blue on white ≥ 5.7:1 ✓) — pakai axe DevTools
- **Responsive:** test di 375px, 768px, 1280px viewports
- **Real data:** test halaman IKM dengan year tanpa data (empty state) dan dengan multiple unsur
- **Wizard flow:** end-to-end test step 1 → 2 → submit → step 3, validasi error states

---

## 12. Out of Scope (For Follow-up Specs)

- Admin pages redesign
- Login page redesign
- Survey form by `formId` page (`/guest/survey/$formId`) — perlu cek apakah used; if active, harus disertakan di follow-up
- Sitemap, OG image redesign
- Dark mode (jika diperlukan, ini buat di spec terpisah)
- I18n (tetap Bahasa Indonesia)

---

## 13. Open Questions

- **Logo asli:** Apakah file SVG logo Kominfo baru (blok pixel) & lama (globe ombak) tersedia? Saat ini placeholder huruf "T" di crest icon. Sebaiknya diganti dengan logo asli.
- **Survey `$formId` page:** Apakah halaman ini aktif digunakan? Kalau ya, perlu spec lanjutan.
- **Admin pages:** Apakah perlu disertakan di redesign atau biarkan dulu? Spec ini fokus public-only.
