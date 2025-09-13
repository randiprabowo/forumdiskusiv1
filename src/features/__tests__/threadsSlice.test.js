import { describe, it, expect, beforeEach, vi } from 'vitest';
import threadsReducer, {
  filterThreadsByCategory,
  clearThreadsError,
  fetchThreads,
  voteThread,
} from '../threadsSlice';

// Mock threadService
vi.mock('../../services/threadService', () => ({
  default: {
    getAllThreads: vi.fn(),
    getThreadDetail: vi.fn(),
    createThread: vi.fn(),
    voteThread: vi.fn(),
  },
}));

describe('threadsSlice reducer', () => {
  // Skenario pengujian: Reducer threadsSlice dapat mengubah state dengan benar
  
  let initialState;

  beforeEach(() => {
    // Reset initialState sebelum setiap test
    initialState = {
      threads: [],
      currentThread: null,
      filteredThreads: [],
      activeCategory: null,
      loading: false,
      error: null,
    };
  });

  it('should handle initial state', () => {
    expect(threadsReducer(undefined, { type: 'unknown' })).toEqual({
      threads: [],
      currentThread: null,
      filteredThreads: [],
      activeCategory: null,
      loading: false,
      error: null,
    });
  });

  it('should handle filterThreadsByCategory with specific category', () => {
    const threads = [
      { id: '1', title: 'Thread 1', category: 'react' },
      { id: '2', title: 'Thread 2', category: 'redux' },
      { id: '3', title: 'Thread 3', category: 'react' },
    ];
    const stateWithThreads = {
      ...initialState,
      threads,
      filteredThreads: threads,
    };
    
    const category = 'react';
    const expectedFilteredThreads = threads.filter(thread => thread.category === category);
    
    expect(threadsReducer(stateWithThreads, filterThreadsByCategory(category))).toEqual({
      ...stateWithThreads,
      activeCategory: category,
      filteredThreads: expectedFilteredThreads,
    });
  });

  it('should handle filterThreadsByCategory with "all" category', () => {
    const threads = [
      { id: '1', title: 'Thread 1', category: 'react' },
      { id: '2', title: 'Thread 2', category: 'redux' },
    ];
    const stateWithThreads = {
      ...initialState,
      threads,
      filteredThreads: [],
      activeCategory: 'react',
    };
    
    expect(threadsReducer(stateWithThreads, filterThreadsByCategory('all'))).toEqual({
      ...stateWithThreads,
      activeCategory: 'all',
      filteredThreads: threads,
    });
  });

  it('should handle clearThreadsError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error message',
    };
    
    expect(threadsReducer(stateWithError, clearThreadsError())).toEqual({
      ...stateWithError,
      error: null,
    });
  });

  it('should handle fetchThreads.pending', () => {
    const action = { type: fetchThreads.pending.type };
    const state = threadsReducer(initialState, action);
    
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('should handle fetchThreads.fulfilled', () => {
    const threads = [
      { id: '1', title: 'Thread 1' },
      { id: '2', title: 'Thread 2' },
    ];
    const action = { type: fetchThreads.fulfilled.type, payload: threads };
    const state = threadsReducer(initialState, action);
    
    expect(state).toEqual({
      ...initialState,
      loading: false,
      threads,
      filteredThreads: threads,
    });
  });

  it('should handle fetchThreads.rejected', () => {
    const errorMessage = 'Failed to fetch threads';
    const action = { type: fetchThreads.rejected.type, payload: errorMessage };
    const state = threadsReducer(initialState, action);
    
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage,
    });
  });

  it('should handle voteThread.fulfilled with upvote', () => {
    // Setup initial state with a thread that has votes
    const currentThread = {
      id: 'thread-1',
      title: 'Thread Title',
      upVotesBy: ['user-1'],
      downVotesBy: [],
    };
    
    const stateWithThread = {
      ...initialState,
      currentThread,
    };
    
    // Simulate a successful upvote by another user
    const updatedThread = {
      ...currentThread,
      upVotesBy: [...currentThread.upVotesBy, 'user-2'],
    };
    
    const action = { type: voteThread.fulfilled.type, payload: updatedThread };
    const state = threadsReducer(stateWithThread, action);
    
    expect(state.currentThread).toEqual(updatedThread);
  });
});