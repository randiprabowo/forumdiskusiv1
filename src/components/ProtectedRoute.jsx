import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken, getUser } from '../utils/localStorage';

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const hasPersistedAuth = Boolean(getToken() && getUser());

  if (!isAuthenticated && !hasPersistedAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}

export default ProtectedRoute;