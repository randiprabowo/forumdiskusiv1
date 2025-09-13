```jsx
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';

// Buat store untuk dokumentasi
const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

// Wrapper untuk komponen dalam dokumentasi
const NavbarWrapper = (props) => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="bg-gray-100 p-4 rounded-lg">
        <Navbar {...props} />
      </div>
    </BrowserRouter>
  </Provider>
);

// Contoh dengan user tidak login
<NavbarWrapper />

// Contoh dengan user login (perlu mengubah state Redux)
```

### Navbar

Komponen Navbar menampilkan navigasi utama aplikasi, termasuk logo, menu navigasi, dan tombol login/logout.

#### Fitur

- Menampilkan logo dan nama aplikasi
- Navigasi ke halaman utama (daftar thread)
- Navigasi ke halaman leaderboard
- Tombol login untuk pengguna yang belum login
- Tombol logout dan informasi pengguna untuk pengguna yang sudah login
- Responsif untuk berbagai ukuran layar

#### State

Komponen ini menggunakan Redux untuk mengelola state autentikasi:

- `auth.user` - Informasi pengguna yang sedang login
- `auth.token` - Token autentikasi

#### Actions

- `logoutUser()` - Action untuk logout pengguna