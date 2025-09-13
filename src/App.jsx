import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthInitializer from './components/AuthInitializer';

// Pages
import ThreadsPage from './pages/ThreadsPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import UserProfilePage from './pages/UserProfilePage';

function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<ThreadsPage />} />
        <Route path="threads/:id" element={<ThreadDetailPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="users/:id" element={<UserProfilePage />} />
        <Route path="login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="threads/new" element={<CreateThreadPage />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
