import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser, logoutUser } from '../authSlice';
import authService from '../../services/authService';
import * as localStorage from '../../utils/localStorage';

// Mock dependencies
vi.mock('../../services/authService');
vi.mock('../../utils/localStorage');

describe('Auth Thunks', () => {
  // Skenario pengujian: Thunk function loginUser dapat melakukan login dan menyimpan data user
  
  let dispatch;
  let getState;
  let mockUser;
  let mockToken;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Setup mock data and functions
    dispatch = vi.fn();
    getState = vi.fn();
    mockUser = { id: 'user-1', name: 'Test User' };
    mockToken = 'test-token';
  });

  describe('loginUser thunk', () => {
    it('should call authService.login and save user data on successful login', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'password123' };
      const loginResponse = { user: mockUser, token: mockToken };
      
      // Mock the API response
      authService.login.mockResolvedValue(loginResponse);
      
      // Act
      const result = await loginUser(userData)(dispatch, getState);
      
      // Assert
      expect(authService.login).toHaveBeenCalledWith(userData);
      expect(localStorage.saveToken).toHaveBeenCalledWith(mockToken);
      expect(localStorage.saveUser).toHaveBeenCalledWith(mockUser);
      expect(result.payload).toEqual(loginResponse);
    });

    it('should handle login failure and return error message', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'wrong-password' };
      const errorMessage = 'Invalid credentials';
      
      // Mock the API error
      authService.login.mockRejectedValue(new Error(errorMessage));
      
      // Act
      const result = await loginUser(userData)(dispatch, getState);
      
      // Assert
      expect(result.payload).toEqual(errorMessage);
    });

    it('should use default error message when API response is missing error details', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'wrong-password' };
      
      // Mock the API error without detailed message
      authService.login.mockRejectedValue(new Error());
      
      // Act
      const result = await loginUser(userData)(dispatch, getState);
      
      // Assert
      expect(result.payload).toEqual('Failed to login');
    });
  });

  describe('logoutUser thunk', () => {
    it('should remove token and user data from localStorage', async () => {
      // Act
      await logoutUser()(dispatch, getState);
      
      // Assert
      expect(localStorage.removeToken).toHaveBeenCalled();
      expect(localStorage.removeUser).toHaveBeenCalled();
    });
  });
});