import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/authSlice';

// Mock react-redux
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

// Mock authSlice
vi.mock('../../features/authSlice', () => ({
  logoutUser: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

const setupAuthenticatedState = () => {
  const dispatch = vi.fn();
  useDispatch.mockReturnValue(dispatch);
  useSelector.mockImplementation((selector) => {
    const state = {
      auth: {
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    };
    return selector(state);
  });
  return { dispatch };
};

const setupUnauthenticatedState = () => {
  const dispatch = vi.fn();
  useDispatch.mockReturnValue(dispatch);
  useSelector.mockImplementation((selector) => {
    const state = {
      auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    };
    return selector(state);
  });
  return { dispatch };
};

describe('Navbar Component', () => {
  it('should render navigation links', () => {
    setupUnauthenticatedState();
    render(<Navbar />);
    
    const homeLink = screen.getByText('ForumDiskusi');
    expect(homeLink).toBeInTheDocument();
    
    const leaderboardLinks = screen.getAllByText('Leaderboard');
    expect(leaderboardLinks.length).toBeGreaterThan(0);
  });

  it('should render user info when authenticated', () => {
    setupAuthenticatedState();
    render(<Navbar />);
    
    // Cari avatar dengan query yang lebih fleksibel
    const userAvatars = screen.getAllByRole('img');
    expect(userAvatars.length).toBeGreaterThan(0);
    
    // Cari nama pengguna; bisa muncul lebih dari satu (desktop & mobile)
    const userInfos = screen.getAllByText((content, element) => {
      return element.textContent.includes('John Doe');
    });
    expect(userInfos.length).toBeGreaterThan(0);
  });

  it('should render login and register links when not authenticated', () => {
    setupUnauthenticatedState();
    render(<Navbar />);
    
    const loginLinks = screen.getAllByText('Login');
    expect(loginLinks[0]).toBeInTheDocument();
    
    const registerLinks = screen.getAllByText('Register');
    expect(registerLinks[0]).toBeInTheDocument();
  });

  it('should call logoutUser when logout button is clicked', () => {
    const { dispatch } = setupAuthenticatedState();
    render(<Navbar />);
    
    // Find and click logout button (using getAllByText since there are multiple logout buttons - desktop and mobile)
    const logoutButtons = screen.getAllByText('Logout');
    fireEvent.click(logoutButtons[0]); // Click the first logout button (desktop view)
    
    // Check if logoutUser was dispatched
    expect(dispatch).toHaveBeenCalledWith(logoutUser());
  });
});