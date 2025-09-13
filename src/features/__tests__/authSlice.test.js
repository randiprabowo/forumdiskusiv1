import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  clearError,
  setUser,
  setToken,
  registerUser,
  loginUser,
  logoutUser,
} from '../authSlice';

describe('authSlice reducer', () => {
  // Skenario pengujian: Reducer authSlice dapat mengubah state dengan benar
  
  let initialState;

  beforeEach(() => {
    // Reset initialState sebelum setiap test
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  });

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('should handle clearError', () => {
    const state = {
      ...initialState,
      error: 'Some error message',
    };
    expect(authReducer(state, clearError())).toEqual({
      ...state,
      error: null,
    });
  });

  it('should handle setUser', () => {
    const user = { id: '1', name: 'Test User' };
    expect(authReducer(initialState, setUser(user))).toEqual({
      ...initialState,
      user,
      isAuthenticated: true,
    });
  });

  it('should handle setToken', () => {
    const token = 'test-token';
    expect(authReducer(initialState, setToken(token))).toEqual({
      ...initialState,
      token,
      isAuthenticated: true,
    });
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('should handle loginUser.fulfilled', () => {
    const payload = {
      user: { id: '1', name: 'Test User' },
      token: 'test-token',
    };
    const action = { type: loginUser.fulfilled.type, payload };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      isAuthenticated: true,
      user: payload.user,
      token: payload.token,
    });
  });

  it('should handle loginUser.rejected', () => {
    const errorMessage = 'Login failed';
    const action = {
      type: loginUser.rejected.type,
      payload: errorMessage,
    };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage,
    });
  });

  it('should handle logoutUser.fulfilled', () => {
    const loggedInState = {
      ...initialState,
      user: { id: '1', name: 'Test User' },
      token: 'test-token',
      isAuthenticated: true,
    };
    const action = { type: logoutUser.fulfilled.type };
    const state = authReducer(loggedInState, action);
    expect(state).toEqual({
      ...loggedInState,
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });
});