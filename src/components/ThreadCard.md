```jsx
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import threadsReducer from '../features/threadsSlice';
import votesReducer from '../features/votesSlice';

// Buat store untuk dokumentasi
const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    votes: votesReducer
  }
});

// Contoh thread untuk dokumentasi
const exampleThread = {
  id: 'thread-1',
  title: 'Pengalaman Belajar React',
  body: 'React membuat pengembangan UI menjadi lebih mudah dengan pendekatan component-based.',
  category: 'react',
  createdAt: '2023-05-29T07:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 2,
  owner: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
  }
};

// Wrapper untuk komponen dalam dokumentasi
const ThreadCardWrapper = (props) => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="p-4 bg-gray-100 rounded-lg">
        <ThreadCard {...props} />
      </div>
    </BrowserRouter>
  </Provider>
);

<ThreadCardWrapper 
  {...exampleThread} 
/>
```

### ThreadCard

Komponen ThreadCard menampilkan informasi thread dalam bentuk kartu, termasuk judul, isi, kategori, waktu pembuatan, jumlah komentar, dan tombol voting.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| id | string | ID unik thread |
| title | string | Judul thread |
| body | string | Isi thread |
| category | string | Kategori thread |
| createdAt | string | Waktu pembuatan thread (ISO string) |
| ownerId | string | ID pemilik thread |
| upVotesBy | array | Array berisi ID user yang melakukan upvote |
| downVotesBy | array | Array berisi ID user yang melakukan downvote |
| totalComments | number | Jumlah komentar pada thread |
| owner | object | Informasi pemilik thread (id, name, avatar) |

#### Fitur

- Menampilkan informasi thread (judul, isi, kategori, waktu pembuatan)
- Menampilkan informasi pemilik thread (nama dan avatar)
- Menampilkan jumlah komentar
- Tombol upvote dan downvote dengan indikasi visual status voting
- Optimistic update saat melakukan voting
- Link ke halaman detail thread