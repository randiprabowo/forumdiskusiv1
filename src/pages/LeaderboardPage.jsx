import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../features/leaderboardSlice';
import Avatar from '../components/Avatar';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { FaTrophy, FaMedal } from 'react-icons/fa';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboard, loading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center justify-center md:justify-start">
        <FaTrophy className="text-xl mr-2 text-yellow-500" />
        Papan Peringkat
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm" data-testid="leaderboard-error">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p>Gagal memuat data leaderboard</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Peringkat
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pengguna
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Skor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200" data-testid="leaderboard-body">
              {leaderboard.map((user, index) => (
                <tr key={user.user.id} className={index < 3 ? 'bg-gradient-to-r from-transparent to-yellow-50' : ''} data-testid="leaderboard-item">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <FaTrophy className="text-yellow-500 text-base mr-1" />
                        <span className="font-bold text-yellow-500">1</span>
                      </div>
                    ) : index === 1 ? (
                      <div className="flex items-center">
                        <FaMedal className="text-gray-400 text-base mr-1" />
                        <span className="font-bold text-gray-500">2</span>
                      </div>
                    ) : index === 2 ? (
                      <div className="flex items-center">
                        <FaMedal className="text-amber-700 text-base mr-1" />
                        <span className="font-bold text-amber-700">3</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar src={user.user.avatar} alt={user.user.name} size="sm" />
                        {index < 3 && (
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <Link to={`/users/${user.user.id}`} className="text-sm font-medium text-gray-900 hover:underline" data-testid="user-name">{user.user.name}</Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {user.score} poin
                    </span>
                  </td>
                </tr>
              ))}

              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500" data-testid="leaderboard-empty">
                      <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-base font-medium">Belum ada data leaderboard</p>
                      <p className="text-sm">Peringkat akan muncul saat pengguna mulai berpartisipasi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;