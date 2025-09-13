import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSignOutAlt, FaUser, FaTrophy, FaBars, FaTimes } from 'react-icons/fa';
import { logoutUser } from '../features/authSlice';
import Avatar from './Avatar';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg py-4 px-6 sticky top-0 z-10 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors duration-300">ForumDiskusi</Link>
        
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/leaderboard" className="flex items-center text-white hover:text-blue-200 transition-colors duration-300" data-testid="leaderboard-link">
            <FaTrophy className="mr-2 text-base" />
            <span>Leaderboard</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center bg-blue-800 bg-opacity-40 rounded-full px-3 py-1" data-testid="user-info">
                  <Avatar src={user?.avatar} alt={user?.name} size="sm" />
                  <span className="ml-2 font-medium text-white" data-testid="user-name">{user?.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-300 transition-colors duration-300"
                data-testid="logout-button"
              >
                <FaSignOutAlt className="mr-2 text-base" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="flex items-center text-white hover:text-blue-200 transition-colors duration-300"
              >
                <FaUser className="mr-2 text-base" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors duration-300 font-medium"
                data-testid="navbar-register-link"
              >
                Register
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <div className={`absolute top-full left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg p-4 md:hidden transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/leaderboard" 
              className="flex items-center text-white hover:text-blue-200 transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTrophy className="mr-2 text-base" />
              <span>Leaderboard</span>
            </Link>

            {isAuthenticated ? (
              <>
                {user && (
                  <div className="flex items-center bg-blue-800 bg-opacity-40 rounded-full px-3 py-2" data-testid="user-info">
                    <Avatar src={user?.avatar} alt={user?.name} size="sm" />
                    <span className="ml-2 font-medium text-white" data-testid="user-name">{user?.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-white hover:text-red-300 transition-colors duration-300 py-2"
                  data-testid="logout-button"
                >
                  <FaSignOutAlt className="mr-2 text-base" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-white hover:text-blue-200 transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-2 text-base" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors duration-300 font-medium text-center"
                  data-testid="navbar-register-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;