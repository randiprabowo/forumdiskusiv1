import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Lazy import to avoid resolution during tests that mock this module
let threadService;
const getThreadService = async () => {
  if (!threadService) {
    const mod = await import('../services/threadService');
    threadService = mod.default;
  }
  return threadService;
};

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const svc = await getThreadService();
      return await svc.getAllThreads();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  },
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const svc = await getThreadService();
      return await svc.getThreadDetail(threadId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch thread detail');
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData, { rejectWithValue }) => {
    try {
      const svc = await getThreadService();
      return await svc.createThread(threadData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create thread');
    }
  },
);

export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async ({ threadId, voteType }, { rejectWithValue }) => {
    try {
      const svc = await getThreadService();
      return await svc.voteThread(threadId, voteType);
    } catch (error) {
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to vote thread');
    }
  },
);

const initialState = {
  threads: [],
  currentThread: null,
  filteredThreads: [],
  activeCategory: null,
  loading: false,
  error: null,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    filterThreadsByCategory: (state, action) => {
      const category = action.payload;
      state.activeCategory = category;

      if (!category || category === 'all') {
        state.filteredThreads = state.threads;
      } else {
        state.filteredThreads = state.threads.filter(
          (thread) => thread.category === category,
        );
      }
    },
    clearThreadsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all threads
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
        state.filteredThreads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch thread detail
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentThread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create thread
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload);
        state.filteredThreads = state.activeCategory
          ? state.threads.filter((thread) => thread.category === state.activeCategory)
          : state.threads;
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote thread
      .addCase(voteThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        state.loading = false;
        const { id, upVotesBy, downVotesBy } = action.payload;

        // Update in threads list
        const threadIndex = state.threads.findIndex((thread) => thread.id === id);
        if (threadIndex !== -1) {
          state.threads[threadIndex].upVotesBy = upVotesBy;
          state.threads[threadIndex].downVotesBy = downVotesBy;
        }

        // Update in filtered threads list
        const filteredIndex = state.filteredThreads.findIndex((thread) => thread.id === id);
        if (filteredIndex !== -1) {
          state.filteredThreads[filteredIndex].upVotesBy = upVotesBy;
          state.filteredThreads[filteredIndex].downVotesBy = downVotesBy;
        }

        // Update current thread if it's the same
        if (state.currentThread && state.currentThread.id === id) {
          state.currentThread.upVotesBy = upVotesBy;
          state.currentThread.downVotesBy = downVotesBy;
        }
      })
      .addCase(voteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { filterThreadsByCategory, clearThreadsError } = threadsSlice.actions;
export default threadsSlice.reducer;
