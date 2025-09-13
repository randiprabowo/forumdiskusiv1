# Forum Diskusi v1

Aplikasi forum diskusi dengan fitur thread, komentar, voting, dan leaderboard.

## Fitur

- Autentikasi (login dan register)
- Melihat daftar thread
- Membuat thread baru
- Filter thread berdasarkan kategori
- Melihat detail thread dan komentar
- Menambahkan komentar pada thread
- Voting thread dan komentar (upvote dan downvote)
- Melihat leaderboard pengguna

## Teknologi

- React + Vite
- Redux Toolkit untuk state management
- React Router untuk navigasi
- Tailwind CSS untuk styling
- React Styleguidist untuk dokumentasi komponen
- Vitest dan React Testing Library untuk unit dan integration testing
- Cypress untuk end-to-end testing
- GitHub Actions untuk CI/CD pipeline

## Pengujian

Proyek ini dilengkapi dengan pengujian otomatis pada beberapa level:

### Unit dan Integration Testing

Menggunakan Vitest dan React Testing Library untuk menguji:
- Reducer (authSlice, threadsSlice)
- Thunk Function (loginUser, voteThread)
- React Components (ThreadCard, Navbar)

Untuk menjalankan unit dan integration test:

```bash
npm test
```

Untuk menjalankan test dengan mode watch:

```bash
npm run test:watch
```

Untuk melihat coverage report:

```bash
npm run test:coverage
```

### End-to-End Testing

Menggunakan Cypress untuk menguji alur pengguna secara menyeluruh:
- Login Flow: Pengujian proses login dan validasi
- Register Flow: Pengujian proses registrasi dan validasi
- Threads Flow: Pengujian tampilan dan pembuatan thread
- Thread Detail Flow: Pengujian interaksi dengan thread dan komentar
- Leaderboard Flow: Pengujian tampilan leaderboard

Untuk menjalankan Cypress dalam mode GUI:

```bash
npx cypress open
```

Untuk menjalankan Cypress dalam mode headless:

```bash
npx cypress run
```

## CI/CD Pipeline

Proyek ini menggunakan GitHub Actions untuk CI/CD pipeline dengan tahapan:

1. **Test**: Menjalankan linting, unit tests, dan end-to-end tests
2. **Build**: Membuat build production jika semua test berhasil
3. **Deploy**: Men-deploy aplikasi ke hosting (contoh konfigurasi untuk Netlify)

### Continuous Integration
- Menjalankan linting untuk memastikan kode sesuai standar
- Menjalankan unit dan integration test
- Menjalankan end-to-end test

### Continuous Deployment
- Build aplikasi dan dokumentasi komponen
- Deploy aplikasi ke GitHub Pages
- Deploy dokumentasi komponen ke GitHub Pages/styleguide

Pipeline akan berjalan otomatis setiap kali ada push ke branch main atau pull request ke branch main.

## Pengembangan Lokal

1. Clone repositori
2. Install dependencies
   ```bash
   npm install
   ```
3. Jalankan server development
   ```bash
   npm run dev
   ```
4. Buka http://localhost:5173 di browser

## Build untuk Production

```bash
npm run build
```

Hasil build akan tersedia di folder `dist`.

## Lisensi

MIT
