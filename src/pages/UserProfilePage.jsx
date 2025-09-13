import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';

function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In E2E, data diintercept oleh Cypress, jadi cukup fetch saja
    fetch(`/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!user) return <div className="container mx-auto px-4 py-8">User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8" data-testid="user-profile">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;


