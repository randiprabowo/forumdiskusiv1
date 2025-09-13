import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { fetchThreads } from '../features/threadsSlice';
import ThreadCard from '../components/ThreadCard';
import Loading from '../components/Loading';
import CategoryFilter from '../components/CategoryFilter';

function ThreadsPage() {
  const dispatch = useDispatch();
  const { filteredThreads, loading, error } = useSelector((state) => state.threads);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        await dispatch(fetchThreads()).unwrap();
      } catch (err) {
        // Error is handled in the slice
      } finally {
        setIsInitialized(true);
      }
    };

    loadThreads();
  }, [dispatch]);

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Diskusi Forum
        </h1>
        {isAuthenticated && (
          <Link
            to="/threads/new"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center w-full md:w-auto justify-center"
            data-testid="create-thread-button"
          >
            <FaPlus className="mr-2" />
            Buat Thread Baru
          </Link>
        )}
      </div>

      <div className="mb-8" data-testid="category-filter">
        <CategoryFilter />
      </div>

      {loading && <Loading />}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && filteredThreads.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">Belum ada thread yang ditemukan</p>
          <p className="text-gray-400 mt-2">Mulai diskusi baru atau ubah filter kategori</p>
        </div>
      )}

      <div className="space-y-6">
        {filteredThreads.map((thread) => (
          <div key={thread.id} data-testid="thread-item">
            <Link to={`/threads/${thread.id}`} className="block">
              <ThreadCard thread={thread} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThreadsPage;